-- ==========================================================
-- 🛡️ SCRIPT DE RÉPARATION FINALE : TOUTES PERMISSIONS & STRUCTURE
-- À exécuter une seule fois pour tout corriger d'un coup.
-- ==========================================================

-- 1. SYNCHRONISATION DE LA STRUCTURE (Dossiers)
-- Renomme les colonnes pour correspondre au Front-end et à l'espace Citoyen.
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='dossiers' AND column_name='id') THEN
        ALTER TABLE public.dossiers RENAME COLUMN id TO code;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='dossiers' AND column_name='user_name') THEN
        ALTER TABLE public.dossiers RENAME COLUMN user_name TO citoyen_nom;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='dossiers' AND column_name='service_type') THEN
        ALTER TABLE public.dossiers RENAME COLUMN service_type TO type;
    END IF;
END $$;

-- Ajout de created_at si manquant
ALTER TABLE public.dossiers ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 2. RÉINITIALISATION DE LA SÉCURITÉ (RLS)
-- On active le RLS sur toutes les tables
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' ENABLE ROW LEVEL SECURITY;';
    END LOOP;
END $$;

-- 3. LECTURE PUBLIQUE (ACCÈS CITOYEN & VISITEUR)
-- Autorise toute personne (même non-connectée) à lire les informations.
DROP POLICY IF EXISTS "Public Read" ON public.news;
DROP POLICY IF EXISTS "Public Read" ON public.services_tarifs;
DROP POLICY IF EXISTS "Public Read" ON public.reports;
DROP POLICY IF EXISTS "Public Read" ON public.agenda_events;
DROP POLICY IF EXISTS "Public Read" ON public.appointments;
DROP POLICY IF EXISTS "Public Read" ON public.opportunites;
DROP POLICY IF EXISTS "Public Read" ON public.arrondissements;
DROP POLICY IF EXISTS "Public Read" ON public.site_config;
DROP POLICY IF EXISTS "Public Read" ON public.tax_settings;
DROP POLICY IF EXISTS "Public Read" ON public.formulaires;
DROP POLICY IF EXISTS "Public Read" ON public.locations;
DROP POLICY IF EXISTS "Public Read" ON public.council;
DROP POLICY IF EXISTS "Public Read" ON public.council_roles;
DROP POLICY IF EXISTS "Public Read" ON public.artisans;
DROP POLICY IF EXISTS "Public Read" ON public.sondages;
DROP POLICY IF EXISTS "Public Read" ON public.dossiers;

CREATE POLICY "Public Read" ON public.news FOR SELECT USING (true);
CREATE POLICY "Public Read" ON public.services_tarifs FOR SELECT USING (true);
CREATE POLICY "Public Read" ON public.reports FOR SELECT USING (true);
CREATE POLICY "Public Read" ON public.agenda_events FOR SELECT USING (true);
CREATE POLICY "Public Read" ON public.appointments FOR SELECT USING (true);
CREATE POLICY "Public Read" ON public.opportunites FOR SELECT USING (true);
CREATE POLICY "Public Read" ON public.arrondissements FOR SELECT USING (true);
CREATE POLICY "Public Read" ON public.site_config FOR SELECT USING (true);
CREATE POLICY "Public Read" ON public.tax_settings FOR SELECT USING (true);
CREATE POLICY "Public Read" ON public.formulaires FOR SELECT USING (true);
CREATE POLICY "Public Read" ON public.locations FOR SELECT USING (true);
CREATE POLICY "Public Read" ON public.council FOR SELECT USING (true);
CREATE POLICY "Public Read" ON public.council_roles FOR SELECT USING (true);
CREATE POLICY "Public Read" ON public.artisans FOR SELECT USING (true);
CREATE POLICY "Public Read" ON public.sondages FOR SELECT USING (true);
CREATE POLICY "Public Read" ON public.dossiers FOR SELECT USING (true);

-- 4. ACTIONS CITOYENNES (INSERTION)
DROP POLICY IF EXISTS "Citizen Insert" ON public.audiences;
DROP POLICY IF EXISTS "Citizen Insert" ON public.reservations_stade;
DROP POLICY IF EXISTS "Citizen Insert" ON public.user_subscriptions;
CREATE POLICY "Citizen Insert" ON public.audiences FOR INSERT WITH CHECK (true);
CREATE POLICY "Citizen Insert" ON public.reservations_stade FOR INSERT WITH CHECK (true);
CREATE POLICY "Citizen Insert" ON public.user_subscriptions FOR INSERT WITH CHECK (true);

-- Spécial Notifications (Check + Upsert)
DROP POLICY IF EXISTS "Public Read Subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Public Update Subscriptions" ON public.user_subscriptions;
CREATE POLICY "Public Read Subscriptions" ON public.user_subscriptions FOR SELECT USING (true);
CREATE POLICY "Public Update Subscriptions" ON public.user_subscriptions FOR UPDATE USING (true);

-- 5. ACCÈS PERSONNEL (PROFIL)
DROP POLICY IF EXISTS "Self View" ON public.user_profiles;
DROP POLICY IF EXISTS "Self Update" ON public.user_profiles;
CREATE POLICY "Self View" ON public.user_profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Self Update" ON public.user_profiles FOR UPDATE USING (id = auth.uid());

-- 6. DROITS AGENTS APPROUVÉS & ADMINS (ÉCRITURE MODIFICATION)
-- On s'assure que check_is_approved et check_is_admin sont utilisés partout.

-- News, Tarifs, Rapports, etc.
DROP POLICY IF EXISTS "Approved Agent Write" ON public.news;
DROP POLICY IF EXISTS "Approved Agent Write" ON public.services_tarifs;
DROP POLICY IF EXISTS "Approved Agent Write" ON public.reports;
DROP POLICY IF EXISTS "Approved Agent Write" ON public.agenda_events;
DROP POLICY IF EXISTS "Approved Agent Write" ON public.appointments;
DROP POLICY IF EXISTS "Approved Agent Write" ON public.opportunites;
DROP POLICY IF EXISTS "Approved Agent Write" ON public.arrondissements;
DROP POLICY IF EXISTS "Approved Agent Write" ON public.formulaires;
DROP POLICY IF EXISTS "Approved Agent Write" ON public.locations;

CREATE POLICY "Approved Agent Write" ON public.news FOR ALL TO authenticated USING (public.check_is_approved(auth.uid()));
CREATE POLICY "Approved Agent Write" ON public.services_tarifs FOR ALL TO authenticated USING (public.check_is_approved(auth.uid()));
CREATE POLICY "Approved Agent Write" ON public.reports FOR ALL TO authenticated USING (public.check_is_approved(auth.uid()));
CREATE POLICY "Approved Agent Write" ON public.agenda_events FOR ALL TO authenticated USING (public.check_is_approved(auth.uid()));
CREATE POLICY "Approved Agent Write" ON public.appointments FOR ALL TO authenticated USING (public.check_is_approved(auth.uid()));
CREATE POLICY "Approved Agent Write" ON public.opportunites FOR ALL TO authenticated USING (public.check_is_approved(auth.uid()));
CREATE POLICY "Approved Agent Write" ON public.arrondissements FOR ALL TO authenticated USING (public.check_is_approved(auth.uid()));
CREATE POLICY "Approved Agent Write" ON public.formulaires FOR ALL TO authenticated USING (public.check_is_approved(auth.uid()));
CREATE POLICY "Approved Agent Write" ON public.locations FOR ALL TO authenticated USING (public.check_is_approved(auth.uid()));

-- Dossiers & Artisans
DROP POLICY IF EXISTS "Approved Agent Write Artisans" ON public.artisans;
DROP POLICY IF EXISTS "Approved Agent Write Dossiers" ON public.dossiers;
CREATE POLICY "Approved Agent Write Artisans" ON public.artisans FOR ALL TO authenticated USING (public.check_is_approved(auth.uid()) OR public.check_is_admin(auth.uid()));
CREATE POLICY "Approved Agent Write Dossiers" ON public.dossiers FOR ALL TO authenticated USING (public.check_is_approved(auth.uid()) OR public.check_is_admin(auth.uid()));

-- 7. DROITS EXCLUSIFS ADMIN (Validation & Audit)
DROP POLICY IF EXISTS "Admin View Profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admin Delete Profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admin Update Profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admin Manage Config" ON public.site_config;
DROP POLICY IF EXISTS "Admin Manage Taxes" ON public.tax_settings;
DROP POLICY IF EXISTS "Admin View Logs" ON public.audit_logs;

CREATE POLICY "Admin View Profiles" ON public.user_profiles FOR SELECT USING (public.check_is_admin(auth.uid()));
CREATE POLICY "Admin Delete Profiles" ON public.user_profiles FOR DELETE USING (public.check_is_admin(auth.uid()));
CREATE POLICY "Admin Update Profiles" ON public.user_profiles FOR UPDATE USING (public.check_is_admin(auth.uid())) WITH CHECK (public.check_is_admin(auth.uid()));
CREATE POLICY "Admin Manage Config" ON public.site_config FOR ALL TO authenticated USING (public.check_is_admin(auth.uid()));
CREATE POLICY "Admin Manage Taxes" ON public.tax_settings FOR ALL TO authenticated USING (public.check_is_admin(auth.uid()));
CREATE POLICY "Admin View Logs" ON public.audit_logs FOR SELECT USING (public.check_is_admin(auth.uid()));

-- ==========================================================
-- ✅ RÉPARATION TERMINÉE
-- ==========================================================

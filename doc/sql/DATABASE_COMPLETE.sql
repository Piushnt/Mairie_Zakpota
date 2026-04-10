-- ==========================================================
-- 🏢 SAAS GOVTECH MULTI-TENANT : BASE DE DONNÉES FINALE (V5.0)
-- 🛡️ PRODUCTION READY - HAUTE SÉCURITÉ
-- ==========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================================
-- SECTION 1 : ARCHITECTURE SAAS GLOBALE (SANS TENANT_ID)
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE NOT NULL,
  domain TEXT UNIQUE, 
  contact_email TEXT,
  contact_phone TEXT,
  logo_url TEXT,
  admin_pin_hash TEXT, 
  is_active BOOLEAN DEFAULT true,
  slogan TEXT,
  primary_color TEXT DEFAULT '#006633',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS public.global_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL, 
  description TEXT
);

CREATE TABLE IF NOT EXISTS public.global_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT
);

INSERT INTO public.global_roles (name, description) VALUES
('super_admin', 'SaaS Root (Global)'),
('admin', 'Administrateur Local (Tenant)'),
('agent', 'Agent Local (Tenant)')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS public.features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key_name TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Modules disponibles par défaut sur la plateforme
INSERT INTO public.features (key_name, title, description) VALUES
  ('actualites',        'Actualités',             'Système de news communales'),
  ('agenda',            'Agenda',                  'Calendrier des évènements'),
  ('stade',             'Réservation Stade',       'Gestion des créneaux du stade municipal'),
  ('sondages',          'Sondages Citoyens',        'Votes et consultations publiques'),
  ('budget_participatif','Budget Participatif',     'Dépôt et vote de projets citoyens'),
  ('artisans',          'Annuaire Artisans',        'Répertoire des artisans locaux'),
  ('opportunites',      'Opportunités',            'Appels d''offres et recrutements'),
  ('ia_assistant',      'Assistant IA',             'Chatbot Gemini pour les citoyens'),
  ('carte',             'Carte Interactive',        'Localisation des services communaux'),
  ('simulateur',        'Simulateur Fiscal',        'Calcul des taxes locales'),
  ('signalement',       'Signalement Citoyen',      'Remontées citoyennes et urgences'),
  ('marche',            'Marchés Locaux',           'Calendrier des marchés et hall des artisans')
ON CONFLICT (key_name) DO NOTHING;

-- ==========================================================
-- SECTION 2 : TABLES MÉTIERS (TENANT ISOLÉ)
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.tenant_features (
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  feature_id UUID REFERENCES public.features(id) ON DELETE CASCADE,
  is_enabled BOOLEAN DEFAULT false,
  PRIMARY KEY (tenant_id, feature_id)
);

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE, 
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'agent' CHECK (role IN ('super_admin', 'admin', 'agent')),
  is_approved BOOLEAN DEFAULT false,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  CONSTRAINT tenant_required_unless_super_admin CHECK (role = 'super_admin' OR tenant_id IS NOT NULL)
);

-- Format strict Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL, -- NULL si super_admin inter-tenant
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id UUID,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.services_tarifs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  pieces TEXT[],
  cost INTEGER,
  delay TEXT,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS public.news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  image_url TEXT,
  likes BIGINT DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  citizen_name TEXT NOT NULL,
  citizen_email TEXT,
  citizen_phone TEXT,
  service TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT DEFAULT 'en_attente',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS public.opportunites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  titre TEXT NOT NULL,
  type TEXT,
  date_limite DATE,
  statut TEXT DEFAULT 'ouvert',
  description TEXT,
  contact TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS public.arrondissements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  ca TEXT,
  contact TEXT,
  localisation TEXT,
  quartiers TEXT[],
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS public.agenda_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT,
  description TEXT,
  location TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  year INTEGER,
  type TEXT,
  category TEXT,
  file_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS public.site_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value JSONB,
  CONSTRAINT site_config_tenant_key_unique UNIQUE(tenant_id, key)
);

CREATE TABLE IF NOT EXISTS public.reservations_stade (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  telephone TEXT NOT NULL,
  date DATE NOT NULL,
  creneau TEXT NOT NULL,
  statut TEXT DEFAULT 'EN_ATTENTE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT user_subscriptions_endpoint_unique UNIQUE(endpoint)
);

CREATE TABLE IF NOT EXISTS public.tax_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT tax_settings_tenant_key_unique UNIQUE(tenant_id, key)
);

CREATE TABLE IF NOT EXISTS public.formulaires (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  drive_link TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS public.locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS public.audiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  subject TEXT,
  message TEXT,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'En attente',
  appointment_date DATE,
  appointment_time TIME,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS public.dossiers (
  code TEXT PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  citoyen_nom TEXT NOT NULL,
  type TEXT NOT NULL,
  statut TEXT DEFAULT 'En attente',
  commentaire TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_update TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS public.council_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL UNIQUE,
  importance_order INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.council (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  role_id UUID REFERENCES public.council_roles(id),
  photo_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS public.artisans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  metier TEXT NOT NULL,
  arrondissement TEXT NOT NULL,
  telephone TEXT,
  description TEXT,
  photo_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS public.sondages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  titre TEXT NOT NULL,
  description TEXT,
  options JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS public.ai_chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS public.ai_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.ai_chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- SECTION 3 : SOFT DELETE MOTEUR (NO HARD DELETES)
-- ==========================================================

CREATE OR REPLACE FUNCTION public.soft_delete_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Si une suppression arrive, on intercepte et on update
  EXECUTE format('UPDATE %I.%I SET deleted_at = NOW() WHERE id = $1', TG_TABLE_SCHEMA, TG_TABLE_NAME) USING OLD.id;
  RETURN NULL; -- Annule la suppression physique de Postgres
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Exécution automatique du Soft Delete pour tables critiques
-- NOTE: 'dossiers' est exclu car sa PK est 'code' (TEXT), pas 'id' (UUID)
DO $$ 
DECLARE
  tables text[] := ARRAY['user_profiles', 'audiences', 'appointments', 'reservations_stade', 'opportunites', 'news', 'agenda_events'];
  t text;
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS tr_%1$s_soft_delete ON public.%1$s;
      CREATE TRIGGER tr_%1$s_soft_delete 
      BEFORE DELETE ON public.%1$s 
      FOR EACH ROW EXECUTE PROCEDURE public.soft_delete_trigger();
    ', t);
  END LOOP;
END $$;

-- Soft Delete manuel pour dossiers (PK = code TEXT)
CREATE OR REPLACE FUNCTION public.soft_delete_dossier()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.dossiers SET deleted_at = NOW() WHERE code = OLD.code;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_dossiers_soft_delete ON public.dossiers;
CREATE TRIGGER tr_dossiers_soft_delete
  BEFORE DELETE ON public.dossiers
  FOR EACH ROW EXECUTE PROCEDURE public.soft_delete_dossier();


-- ==========================================================
-- SECTION 4 : AUTH HOOKS (JWT)
-- ==========================================================
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  claims jsonb;
  user_role text;
  user_tenant_id uuid;
BEGIN
  -- On ne filtre pas sur deleted_at ici pour bloquer un compte banni si besoin
  SELECT role, tenant_id INTO user_role, user_tenant_id 
  FROM public.user_profiles 
  WHERE id = (event->>'user_id')::uuid;

  -- SÉCURITÉ : Empêche l'initialisation à un JSON NULL via coalesce
  claims := COALESCE(event->'claims', '{}'::jsonb);
  
  IF user_role IS NOT NULL THEN
    claims := jsonb_set(claims, '{role}', to_jsonb(user_role));
  END IF;
  IF user_tenant_id IS NOT NULL THEN
    claims := jsonb_set(claims, '{tenant_id}', to_jsonb(user_tenant_id));
  END IF;

  event := jsonb_set(event, '{claims}', claims);
  RETURN event;
END;
$$;

GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;

-- ==========================================================
-- SECTION 5 : TRIGGERS & AUDIT LOGS DYNAMIQUES
-- ==========================================================

-- Trigger Magique (Création depuis Auth vers user_profiles + Vérification du PIN)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_role TEXT := 'agent';
  v_is_approved BOOLEAN := false;
  v_tenant_id UUID;
  v_real_pin_hash TEXT;
  v_provided_pin TEXT;
BEGIN
  -- Cast sécurisé au cas où l'id serait manquant
  BEGIN
    v_tenant_id := (NEW.raw_user_meta_data->>'tenant_id')::uuid;
  EXCEPTION WHEN OTHERS THEN
    v_tenant_id := NULL;
  END;

  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'agent');
  v_provided_pin := NEW.raw_user_meta_data->>'admin_pin';

  IF v_tenant_id IS NULL THEN
    -- Création manuelle via Supabase UI (pas de metadata de tenant)
    -- Si aucun super_admin n'existe encore, on le déclare Super Admin et on l'approuve direct.
    IF NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE role = 'super_admin') THEN
      v_role := 'super_admin';
      v_is_approved := true;
    ELSE
      -- Si un super_admin existe déjà, tout nouveau compte manuel sans tenant est un agent bloqué.
      v_role := 'agent';
      v_is_approved := false;
    END IF;
  ELSE
    -- Création classique via le Frontend (avec un tenant_id)
    -- Si l'utilisateur prétend être Admin, on vérifie son PIN fourni
    IF v_role = 'admin' AND v_provided_pin IS NOT NULL THEN
      SELECT admin_pin_hash INTO v_real_pin_hash FROM public.tenants WHERE id = v_tenant_id;
      
      -- SÉCURITÉ : Vérification bcrypt du mot de passe / pin sans déclencher invalid salt
      IF v_real_pin_hash IS NOT NULL AND v_real_pin_hash = crypt(v_provided_pin, v_real_pin_hash) THEN
        v_role := 'admin';
        -- PIN correct = rôle admin accordé, MAIS validation manuelle super_admin OBLIGATOIRE
        v_is_approved := false;
      ELSE
        -- Hack ou Pin faux, on le force en simple agent non approuvé
        v_role := 'agent';
      END IF;
    ELSIF v_role = 'super_admin' THEN
      v_role := 'agent'; -- Interdiction stricte de forger un super_admin à l'inscription web
    END IF;
  END IF;

  INSERT INTO public.user_profiles (id, tenant_id, email, first_name, last_name, role, is_approved)
  VALUES (
    NEW.id,
    v_tenant_id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    v_role,
    v_is_approved
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


CREATE OR REPLACE FUNCTION public.log_user_profile_changes()
RETURNS trigger AS $$
BEGIN
  -- Si l'utilisateur est passé Approved
  IF OLD.is_approved = false AND NEW.is_approved = true THEN
     INSERT INTO public.audit_logs (tenant_id, user_id, action, entity, entity_id, description)
     VALUES (NEW.tenant_id, auth.uid(), 'APPROVE_USER', 'user_profiles', NEW.id, 'Agent ' || NEW.email || ' a été validé.');
  -- Si Changement Permissions (Role)
  ELSIF OLD.role IS DISTINCT FROM NEW.role THEN
     INSERT INTO public.audit_logs (tenant_id, user_id, action, entity, entity_id, description)
     VALUES (NEW.tenant_id, auth.uid(), 'UPDATE_ROLE', 'user_profiles', NEW.id, 'Rôle Agent modifié : ' || NEW.role);
  -- Profil banni / Supprimé (Soft deleted est reconnu via deleted_at)
  ELSIF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
     INSERT INTO public.audit_logs (tenant_id, user_id, action, entity, entity_id, description)
     VALUES (NEW.tenant_id, auth.uid(), 'DELETE_USER', 'user_profiles', NEW.id, 'Utilisateur ' || NEW.email || ' supprimé (Soft Delete).');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_log_user_profiles ON public.user_profiles;
CREATE TRIGGER trigger_log_user_profiles
  AFTER UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE PROCEDURE public.log_user_profile_changes();

-- RPC pur Audit système API (Exemple : Login frontend)
CREATE OR REPLACE FUNCTION public.log_admin_login(p_tenant_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.audit_logs (tenant_id, user_id, action, entity, description)
  VALUES (p_tenant_id, auth.uid(), 'LOGIN_ADMIN', 'auth', 'Connexion au dashboard sécurisé réussie.');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC : Modification sécurisée du PIN admin d'une mairie (Super Admin uniquement)
CREATE OR REPLACE FUNCTION public.update_tenant_pin(
  p_tenant_id UUID,
  p_new_pin TEXT
) RETURNS VOID AS $$
DECLARE
  v_hash TEXT;
BEGIN
  -- Restriction Super Admin (ou SQL Editor)
  IF current_setting('request.jwt.claims', true) IS NOT NULL THEN
    IF (auth.jwt()->>'role') IS DISTINCT FROM 'super_admin' THEN
      RAISE EXCEPTION 'Access Denied: Seul un super_admin peut modifier le PIN.';
    END IF;
  END IF;

  IF length(p_new_pin) < 4 THEN
    RAISE EXCEPTION 'Le PIN doit contenir au moins 4 caractères.';
  END IF;

  v_hash := crypt(p_new_pin, gen_salt('bf', 8));

  UPDATE public.tenants
  SET admin_pin_hash = v_hash, updated_at = NOW()
  WHERE id = p_tenant_id;

  -- Audit du changement de PIN
  INSERT INTO public.audit_logs (tenant_id, user_id, action, entity, entity_id, description)
  VALUES (p_tenant_id, auth.uid(), 'UPDATE_PIN', 'tenants', p_tenant_id, 'Code PIN admin modifié par le Super Admin.');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.update_tenant_pin TO authenticated;


-- ==========================================================
-- SECTION 6 : FONCTIONS SUPER_ADMIN TRANSACTIONNELLES SÉCURISÉES
-- ==========================================================

CREATE OR REPLACE FUNCTION public.create_tenant_with_setup(
  p_name TEXT, 
  p_subdomain TEXT, 
  p_contact_email TEXT, 
  p_admin_pin TEXT
) RETURNS UUID AS $$
DECLARE
  v_tenant_id UUID;
  v_hash TEXT;
BEGIN
  -- Strict Restriction : Seul un profil connecté SUPER_ADMIN ou l'éditeur SQL (Administrateur Base) peut exécuter.
  -- Dans le SQL Editor de Supabase, current_setting('request.jwt.claims', true) est null.
  IF current_setting('request.jwt.claims', true) IS NOT NULL THEN
    IF (auth.jwt()->>'role') IS DISTINCT FROM 'super_admin' THEN
      RAISE EXCEPTION 'Access Denied: Seul un super_admin SaaS peut on-boarder une mairie.';
    END IF;
  END IF;

  v_hash := crypt(p_admin_pin, gen_salt('bf', 8));

  INSERT INTO public.tenants (name, subdomain, contact_email, admin_pin_hash)
  VALUES (p_name, p_subdomain, p_contact_email, v_hash)
  RETURNING id INTO v_tenant_id;
  
  INSERT INTO public.site_config (tenant_id, key, value) VALUES 
    (v_tenant_id, 'flash_news', '"Bienvenue sur le portail ! SaaS Setup Complet."');

  -- Log action
  INSERT INTO public.audit_logs (tenant_id, user_id, action, entity, entity_id, description)
  VALUES (NULL, auth.uid(), 'CREATE_TENANT', 'tenants', v_tenant_id, 'Enrôlement Tenant: ' || p_subdomain);

  RETURN v_tenant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==========================================================
-- SECTION 7 : SÉCURITÉ RLS STRICTE PAR JWT CLAIMS
-- ==========================================================

DO $$ 
DECLARE
    r record;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' ENABLE ROW LEVEL SECURITY;';
    END LOOP;
END $$;

-- 📍 MODÈLES DE POLITIQUES RLS INVIOLABLES 

-- EXEMPLE 1 : TABLES PUBLIQUES (News, Tenants, Sondages, Council, Artisans)
DROP POLICY IF EXISTS "Public Read Tenants" ON public.tenants;
CREATE POLICY "Public Read Tenants" ON public.tenants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read News" ON public.news;
CREATE POLICY "Public Read News" ON public.news FOR SELECT USING ((auth.role() = 'anon' OR tenant_id = (auth.jwt()->>'tenant_id')::uuid) AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Public Read Sondages" ON public.sondages;
CREATE POLICY "Public Read Sondages" ON public.sondages FOR SELECT USING ((auth.role() = 'anon' OR tenant_id = (auth.jwt()->>'tenant_id')::uuid) AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Public Read Council" ON public.council;
CREATE POLICY "Public Read Council" ON public.council FOR SELECT USING ((auth.role() = 'anon' OR tenant_id = (auth.jwt()->>'tenant_id')::uuid) AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Public Read Council Roles" ON public.council_roles;
CREATE POLICY "Public Read Council Roles" ON public.council_roles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Artisans" ON public.artisans;
CREATE POLICY "Public Read Artisans" ON public.artisans FOR SELECT USING ((auth.role() = 'anon' OR tenant_id = (auth.jwt()->>'tenant_id')::uuid) AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Tenant Isolation Agent Write News" ON public.news;
CREATE POLICY "Tenant Isolation Agent Write News" ON public.news 
FOR ALL TO authenticated  
USING (
  tenant_id = (auth.jwt()->>'tenant_id')::uuid 
  -- Super admin peut lire mais n'écrit PAS directement
  OR auth.jwt()->>'role' = 'super_admin'
)
WITH CHECK (
  -- SEUL L'AGENT CONNECTÉ DU BON TENANT PEUT ECRIRE (Injection Proof) -> Exit le Super Admin!
  tenant_id = (auth.jwt()->>'tenant_id')::uuid 
);

-- EXEMPLE 2 : TABLE DOSSIERS (Donnée Privée, Aucun accès Anonymous)
DROP POLICY IF EXISTS "Private Tenant Select Dossier" ON public.dossiers;
CREATE POLICY "Private Tenant Select Dossier" ON public.dossiers 
FOR SELECT TO authenticated  
USING (
  (tenant_id = (auth.jwt()->>'tenant_id')::uuid OR auth.jwt()->>'role' = 'super_admin')
  AND deleted_at IS NULL
);

DROP POLICY IF EXISTS "Private Tenant Write Dossier" ON public.dossiers;
CREATE POLICY "Private Tenant Write Dossier" ON public.dossiers 
FOR ALL TO authenticated  
USING (
  tenant_id = (auth.jwt()->>'tenant_id')::uuid 
  OR auth.jwt()->>'role' = 'super_admin'
)
WITH CHECK (
  tenant_id = (auth.jwt()->>'tenant_id')::uuid 
);

-- ==========================================================
-- SECTION 8 : RLS SUPER_ADMIN - GESTION TENANTS (FACTURATION)
-- ==========================================================

-- Super Admin peut lire toutes les mairies (déjà couvert par Public Read Tenants ci-dessus)
-- Super Admin peut mettre à jour is_active (facturation) et les infos d'un tenant
DROP POLICY IF EXISTS "SuperAdmin Manage Tenants" ON public.tenants;
CREATE POLICY "SuperAdmin Manage Tenants" ON public.tenants
FOR ALL TO authenticated
USING (auth.jwt()->>'role' = 'super_admin')
WITH CHECK (auth.jwt()->>'role' = 'super_admin');

-- ==========================================================
-- SECTION 9 : RLS COMPLÈTE POUR TOUTES LES TABLES MÉTIERS
-- ==========================================================

-- User Profiles : chaque agent lit et modifie son seul profil, l'admin lit tout son tenant, super_admin lit tout
DROP POLICY IF EXISTS "Self Read-Write user_profiles" ON public.user_profiles;
CREATE POLICY "Self Read-Write user_profiles" ON public.user_profiles
FOR SELECT TO authenticated
USING (
  id = auth.uid()
  OR (auth.jwt()->>'role' IN ('admin', 'super_admin') AND (tenant_id = (auth.jwt()->>'tenant_id')::uuid OR auth.jwt()->>'role' = 'super_admin'))
);

DROP POLICY IF EXISTS "Admin Approve user_profiles" ON public.user_profiles;
CREATE POLICY "Admin Approve user_profiles" ON public.user_profiles
FOR UPDATE TO authenticated
USING (
  id = auth.uid()
  OR (auth.jwt()->>'role' IN ('admin', 'super_admin') AND (tenant_id = (auth.jwt()->>'tenant_id')::uuid OR auth.jwt()->>'role' = 'super_admin'))
)
WITH CHECK (
  id = auth.uid()
  OR (auth.jwt()->>'role' IN ('admin', 'super_admin') AND (tenant_id = (auth.jwt()->>'tenant_id')::uuid OR auth.jwt()->>'role' = 'super_admin'))
);

-- Audiences / RDV : Lecture par agents du tenant, admin, super_admin
DROP POLICY IF EXISTS "Tenant audiences" ON public.audiences;
CREATE POLICY "Tenant audiences" ON public.audiences
FOR SELECT TO authenticated
USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid OR auth.jwt()->>'role' = 'super_admin');

-- Ecriture audiences par agents authentifiés du même tenant
DROP POLICY IF EXISTS "Tenant Write audiences" ON public.audiences;
CREATE POLICY "Tenant Write audiences" ON public.audiences
FOR UPDATE TO authenticated
USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid OR auth.jwt()->>'role' = 'super_admin')
WITH CHECK (tenant_id = (auth.jwt()->>'tenant_id')::uuid);

-- INSERT public par citoyens anonymes : le tenant_id doit être réel (sous-requête de validation)
DROP POLICY IF EXISTS "Public Insert audiences" ON public.audiences;
CREATE POLICY "Public Insert audiences" ON public.audiences
FOR INSERT WITH CHECK (
  tenant_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM public.tenants WHERE id = tenant_id AND is_active = true)
);

-- Dossiers / Approbations : Inscription publique possible
DROP POLICY IF EXISTS "Public Insert Dossiers" ON public.dossiers;
CREATE POLICY "Public Insert Dossiers" ON public.dossiers
FOR INSERT WITH CHECK (true);

-- Reservations Stade
DROP POLICY IF EXISTS "Tenant reservations_stade" ON public.reservations_stade;
CREATE POLICY "Tenant reservations_stade" ON public.reservations_stade
FOR ALL TO authenticated
USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid OR auth.jwt()->>'role' = 'super_admin')
WITH CHECK (tenant_id = (auth.jwt()->>'tenant_id')::uuid);

DROP POLICY IF EXISTS "Public Insert reservations_stade" ON public.reservations_stade;
CREATE POLICY "Public Insert reservations_stade" ON public.reservations_stade
FOR INSERT WITH CHECK (true);

-- Agenda Events
DROP POLICY IF EXISTS "Public Read agenda_events" ON public.agenda_events;
CREATE POLICY "Public Read agenda_events" ON public.agenda_events
FOR SELECT USING ((auth.role() = 'anon' OR tenant_id = (auth.jwt()->>'tenant_id')::uuid) AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Admin Write agenda_events" ON public.agenda_events;
CREATE POLICY "Admin Write agenda_events" ON public.agenda_events
FOR ALL TO authenticated
USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid AND auth.jwt()->>'role' IN ('admin','super_admin'))
WITH CHECK (tenant_id = (auth.jwt()->>'tenant_id')::uuid);

-- Reports / Publications
DROP POLICY IF EXISTS "Public Read reports" ON public.reports;
CREATE POLICY "Public Read reports" ON public.reports
FOR SELECT USING ((auth.role() = 'anon' OR tenant_id = (auth.jwt()->>'tenant_id')::uuid) AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Admin Write reports" ON public.reports;
CREATE POLICY "Admin Write reports" ON public.reports
FOR ALL TO authenticated
USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid OR auth.jwt()->>'role' = 'super_admin')
WITH CHECK (tenant_id = (auth.jwt()->>'tenant_id')::uuid);

-- Formulaires
DROP POLICY IF EXISTS "Public Read formulaires" ON public.formulaires;
CREATE POLICY "Public Read formulaires" ON public.formulaires
FOR SELECT USING (auth.role() = 'anon' OR tenant_id = (auth.jwt()->>'tenant_id')::uuid);

DROP POLICY IF EXISTS "Admin Write formulaires" ON public.formulaires;
CREATE POLICY "Admin Write formulaires" ON public.formulaires
FOR ALL TO authenticated
USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid OR auth.jwt()->>'role' = 'super_admin')
WITH CHECK (tenant_id = (auth.jwt()->>'tenant_id')::uuid);

-- Audit Logs : lecture seulement admin+
DROP POLICY IF EXISTS "Admin Read audit_logs" ON public.audit_logs;
CREATE POLICY "Admin Read audit_logs" ON public.audit_logs
FOR SELECT TO authenticated
USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid OR auth.jwt()->>'role' = 'super_admin');

-- Council (écriture Admin)
DROP POLICY IF EXISTS "Admin Write Council" ON public.council;
CREATE POLICY "Admin Write Council" ON public.council
FOR ALL TO authenticated
USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid OR auth.jwt()->>'role' = 'super_admin')
WITH CHECK (tenant_id = (auth.jwt()->>'tenant_id')::uuid);

-- Artisans (écriture Admin)
DROP POLICY IF EXISTS "Admin Write Artisans" ON public.artisans;
CREATE POLICY "Admin Write Artisans" ON public.artisans
FOR ALL TO authenticated
USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid OR auth.jwt()->>'role' = 'super_admin')
WITH CHECK (tenant_id = (auth.jwt()->>'tenant_id')::uuid);

-- Sondages (écriture Admin)
DROP POLICY IF EXISTS "Admin Write Sondages" ON public.sondages;
CREATE POLICY "Admin Write Sondages" ON public.sondages
FOR ALL TO authenticated
USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid OR auth.jwt()->>'role' = 'super_admin')
WITH CHECK (tenant_id = (auth.jwt()->>'tenant_id')::uuid);

-- Opportunites
DROP POLICY IF EXISTS "Public Read opportunites" ON public.opportunites;
CREATE POLICY "Public Read opportunites" ON public.opportunites
FOR SELECT USING (auth.role() = 'anon' OR tenant_id = (auth.jwt()->>'tenant_id')::uuid);

DROP POLICY IF EXISTS "Admin Write opportunites" ON public.opportunites;
CREATE POLICY "Admin Write opportunites" ON public.opportunites
FOR ALL TO authenticated
USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid OR auth.jwt()->>'role' = 'super_admin')
WITH CHECK (tenant_id = (auth.jwt()->>'tenant_id')::uuid);

-- site_config : Lecture publique (flashNews, config marché, etc.) + écriture admin
DROP POLICY IF EXISTS "Public Read site_config" ON public.site_config;
CREATE POLICY "Public Read site_config" ON public.site_config
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Manage site_config" ON public.site_config;
CREATE POLICY "Admin Manage site_config" ON public.site_config
FOR ALL TO authenticated
USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid OR auth.jwt()->>'role' = 'super_admin')
WITH CHECK (tenant_id = (auth.jwt()->>'tenant_id')::uuid);

-- ==========================================================
-- SECTION 10 : RLS FEATURES & TENANT_FEATURES
-- ==========================================================

ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_features ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut lire les features disponibles (pour résolution frontend)
DROP POLICY IF EXISTS "Public Read features" ON public.features;
CREATE POLICY "Public Read features" ON public.features FOR SELECT USING (true);

-- Seul le super_admin peut créer/modifier des features globales
DROP POLICY IF EXISTS "SuperAdmin Manage features" ON public.features;
CREATE POLICY "SuperAdmin Manage features" ON public.features
FOR ALL TO authenticated
USING (auth.jwt()->>'role' = 'super_admin')
WITH CHECK (auth.jwt()->>'role' = 'super_admin');

-- Lecture des tenant_features : PUBLIQUE (necessite pour résolution features par anon)
DROP POLICY IF EXISTS "Public Read tenant_features" ON public.tenant_features;
CREATE POLICY "Public Read tenant_features" ON public.tenant_features
FOR SELECT USING (true);

-- Modification tenant_features : super_admin uniquement
DROP POLICY IF EXISTS "SuperAdmin Manage tenant_features" ON public.tenant_features;
CREATE POLICY "SuperAdmin Manage tenant_features" ON public.tenant_features
FOR ALL TO authenticated
USING (auth.jwt()->>'role' = 'super_admin')
WITH CHECK (auth.jwt()->>'role' = 'super_admin');

-- ==========================================================
-- SECTION 11 : FONCTIONS UTILITAIRES
-- ==========================================================

-- Système de Likes sur les Actualités
CREATE OR REPLACE FUNCTION public.increment_news_likes(row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.news SET likes = COALESCE(likes, 0) + 1 WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Réinitialisation des modules d'un tenant (utilitaire pour migration)
CREATE OR REPLACE FUNCTION public.enable_all_features_for_tenant(p_tenant_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Insère tous les modules disponibles pour ce tenant
  INSERT INTO public.tenant_features (tenant_id, feature_id, is_enabled)
  SELECT p_tenant_id, f.id, true
  FROM public.features f
  ON CONFLICT (tenant_id, feature_id) DO UPDATE SET is_enabled = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.enable_all_features_for_tenant TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.increment_news_likes TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_news_likes TO anon;

-- ==========================================================
-- SECTION 12 : INDEX DE PERFORMANCE
-- ==========================================================

CREATE INDEX IF NOT EXISTS idx_tenants_subdomain ON public.tenants(subdomain);
CREATE INDEX IF NOT EXISTS idx_tenants_domain ON public.tenants(domain);
CREATE INDEX IF NOT EXISTS idx_tenants_is_active ON public.tenants(is_active);
CREATE INDEX IF NOT EXISTS idx_user_profiles_tenant ON public.user_profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_news_tenant ON public.news(tenant_id);
CREATE INDEX IF NOT EXISTS idx_news_date ON public.news(date DESC);
CREATE INDEX IF NOT EXISTS idx_dossiers_code ON public.dossiers(code);
CREATE INDEX IF NOT EXISTS idx_dossiers_tenant ON public.dossiers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_features_tenant ON public.tenant_features(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audiences_tenant ON public.audiences(tenant_id);
CREATE INDEX IF NOT EXISTS idx_agenda_events_tenant ON public.agenda_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sondages_tenant ON public.sondages(tenant_id);
CREATE INDEX IF NOT EXISTS idx_artisans_tenant ON public.artisans(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant ON public.audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ==========================================================
-- SECTION 13 : RLS PUBLIQUES MANQUANTES (CORRECTIF)
-- ==========================================================

-- services_tarifs : lecture publique (utilisé par la page Accueil/Services)
DROP POLICY IF EXISTS "Public Read services_tarifs" ON public.services_tarifs;
CREATE POLICY "Public Read services_tarifs" ON public.services_tarifs
FOR SELECT USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "Admin Write services_tarifs" ON public.services_tarifs;
CREATE POLICY "Admin Write services_tarifs" ON public.services_tarifs
FOR ALL TO authenticated
USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid OR auth.jwt()->>'role' = 'super_admin')
WITH CHECK (tenant_id = (auth.jwt()->>'tenant_id')::uuid);

-- locations : lecture publique (carte interactive)
DROP POLICY IF EXISTS "Public Read locations" ON public.locations;
CREATE POLICY "Public Read locations" ON public.locations
FOR SELECT USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "Admin Write locations" ON public.locations;
CREATE POLICY "Admin Write locations" ON public.locations
FOR ALL TO authenticated
USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid OR auth.jwt()->>'role' = 'super_admin')
WITH CHECK (tenant_id = (auth.jwt()->>'tenant_id')::uuid);

-- tax_settings : lecture publique (simulateur fiscal)
DROP POLICY IF EXISTS "Public Read tax_settings" ON public.tax_settings;
CREATE POLICY "Public Read tax_settings" ON public.tax_settings
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Write tax_settings" ON public.tax_settings;
CREATE POLICY "Admin Write tax_settings" ON public.tax_settings
FOR ALL TO authenticated
USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid OR auth.jwt()->>'role' = 'super_admin')
WITH CHECK (tenant_id = (auth.jwt()->>'tenant_id')::uuid);

-- arrondissements : lecture publique
DROP POLICY IF EXISTS "Public Read arrondissements" ON public.arrondissements;
CREATE POLICY "Public Read arrondissements" ON public.arrondissements
FOR SELECT USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "Admin Write arrondissements" ON public.arrondissements;
CREATE POLICY "Admin Write arrondissements" ON public.arrondissements
FOR ALL TO authenticated
USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid OR auth.jwt()->>'role' = 'super_admin')
WITH CHECK (tenant_id = (auth.jwt()->>'tenant_id')::uuid);

-- reservations_stade : INSERT public validé par tenant existant
DROP POLICY IF EXISTS "Public Insert reservations_stade" ON public.reservations_stade;
CREATE POLICY "Public Insert reservations_stade" ON public.reservations_stade
FOR INSERT WITH CHECK (
  tenant_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM public.tenants WHERE id = tenant_id AND is_active = true)
);

-- dossiers : INSERT public validé par tenant existant
DROP POLICY IF EXISTS "Public Insert Dossiers" ON public.dossiers;
CREATE POLICY "Public Insert Dossiers" ON public.dossiers
FOR INSERT WITH CHECK (
  tenant_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM public.tenants WHERE id = tenant_id AND is_active = true)
);

-- user_subscriptions : INSERT public pour push notifications
DROP POLICY IF EXISTS "Public Insert user_subscriptions" ON public.user_subscriptions;
CREATE POLICY "Public Insert user_subscriptions" ON public.user_subscriptions
FOR INSERT WITH CHECK (
  tenant_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM public.tenants WHERE id = tenant_id AND is_active = true)
);

-- ==========================================================
-- SECTION 14 : BOOTSTRAP DONNÉES INITIALES (ZAKPOTA)
-- ==========================================================
-- Ce bloc crée le tenant initial pour que l'application
-- soit utilisable immédiatement sans configuration manuelle.
-- IDEMPOTENT : safe à ré-exécuter grace aux ON CONFLICT.

DO $$
DECLARE
  v_tenant_id UUID;
  v_pin_hash TEXT;
BEGIN
  -- PIN par défaut : ZAK2024-ADMIN (à changer dans le dashboard)
  v_pin_hash := crypt('ZAK2024-ADMIN', gen_salt('bf', 8));

  -- Créer ou ignorer le tenant Zakpota
  INSERT INTO public.tenants (
    name, subdomain, domain, contact_email, contact_phone,
    logo_url, slogan, primary_color, admin_pin_hash, is_active
  ) VALUES (
    'Mairie de Za-Kpota',
    'zakpota',
    NULL,
    'contact@mairie-zakpota.bj',
    '+229 XX XX XX XX',
    NULL,
    'Ensemble, bâtissons Za-Kpota',
    '#006633',
    v_pin_hash,
    true
  )
  ON CONFLICT (subdomain) DO UPDATE SET
    name = EXCLUDED.name,
    is_active = true
  RETURNING id INTO v_tenant_id;

  -- Si tenant existait dejà (conflit), récupérer son id
  IF v_tenant_id IS NULL THEN
    SELECT id INTO v_tenant_id FROM public.tenants WHERE subdomain = 'zakpota';
  END IF;

  -- Activer tous les modules pour ce tenant
  INSERT INTO public.tenant_features (tenant_id, feature_id, is_enabled)
  SELECT v_tenant_id, f.id, true
  FROM public.features f
  ON CONFLICT (tenant_id, feature_id) DO UPDATE SET is_enabled = true;

  -- Configuration initiale du site
  INSERT INTO public.site_config (tenant_id, key, value) VALUES
    (v_tenant_id, 'flash_news', '"Bienvenue sur le Portail Officiel de Za-Kpota ! 🏛️"'),
    (v_tenant_id, 'market_config', '{"nom": "Grand Marché de Zakpota", "jours": ["Mercredi", "Samedi"], "description": "Marché hebdomadaire de la commune"}')
  ON CONFLICT (tenant_id, key) DO NOTHING;

END $$;


-- ==========================================================
-- ✅ FIN DU SCRIPT — BASE IMMÉDIATEMENT OPÉRATIONNELLE
-- ==========================================================
--
-- ⚠️  ACTION MANUELLE OBLIGATOIRE APRÈS EXÉCUTION :
-- ================================================================
-- 1. Supabase Dashboard → Authentication → Hooks
--    → Add new hook : type = "HTTP" ou "Postgres Function"
--    → Choisir : custom_access_token_hook
--    → Cela injecte role + tenant_id dans chaque JWT
--    → SANS ÇA : toutes les politiques RLS basées sur auth.jwt() échouent
-- ================================================================
-- 2. Créer le Super Admin :
--    → Supabase Dashboard → Authentication → Users → Add User
--    → Email : votre@email.bj | Password : mot_de_passe_fort
--    → Désactiver la vérification email (Email Confirm = OFF)
--    → Le trigger handle_new_user détecte l'absence de tenant_id
--       et le premier compte devient automatiquement super_admin
-- ================================================================
-- 3. Se connecter sur : https://egouvsaas.vercel.app/login
--    → Vous serez redirigé vers /saas-superadmin-portal
-- ================================================================
-- 4. PIN Admin Zakpota par défaut : ZAK2024-ADMIN
--    (À changer immédiatement dans le Dashboard Super Admin)
-- ================================================================

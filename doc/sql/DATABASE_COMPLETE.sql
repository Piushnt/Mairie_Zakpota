-- ==========================================================
-- 🏢 MAIRIE CONNECT : BASE DE DONNÉES COMPLÈTE (V2.0)
-- 🌍 Projet : Za-Kpota (Adaptable SaaS)
-- 🛠️ Fichier consolidé (Scripts 1 à 13 corrigés)
-- ==========================================================
-- 💡 INSTRUCTIONS DE CONFIGURATION (A LIRE AVANT EXECUTION) :
-- 1. EXTENSIONS : Ce script active "uuid-ossp" et "pgcrypto". 
--    Assurez-vous qu'elles sont supportées par votre instance.
-- 2. AUTHENTIFICATION (Supabase Dashboard) : 
--    * Go to Authentication > Providers > Email.
--    * DÉSACTIVEZ "Confirm email" pour une inscription fluide.
-- 3. CODE PIN ADMINISTRATEUR : Le code par défaut est 'AD22510537'.
--    Il permet de devenir Admin (S.E) instantanément à l'inscription.
-- 4. UTILISATION : Copiez tout ce fichier et lancez-le dans le 
--    SQL Editor de Supabase pour une base 100% fonctionnelle.
-- ==========================================================

-- ----------------------------------------------------
-- 0. EXTENSIONS & PRÉPRATION
-- ----------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------
-- 1. TABLES DE SÉCURITÉ & RBAC (ESSENTIAL)
-- ----------------------------------------------------

-- Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'employee' CHECK (role IN ('admin', 'employee')),
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Journal d'Audit
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  user_name TEXT,
  action_type TEXT NOT NULL,
  module_name TEXT NOT NULL,
  description TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------
-- 2. TABLES MÉTIERS (SERVICES & ENCADREMENT)
-- ----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.services_tarifs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  pieces TEXT[],
  cost INTEGER,
  delay TEXT,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  image_url TEXT,
  likes BIGINT DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  citizen_name TEXT NOT NULL,
  citizen_email TEXT,
  citizen_phone TEXT,
  service TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT DEFAULT 'en_attente' CHECK (status IN ('en_attente', 'valide', 'annule')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.opportunites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  type TEXT,
  date_limite DATE,
  statut TEXT DEFAULT 'ouvert',
  description TEXT,
  contact TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.arrondissements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  ca TEXT,
  contact TEXT,
  localisation TEXT,
  quartiers TEXT[],
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.agenda_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT,
  description TEXT,
  location TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  year INTEGER,
  type TEXT,
  category TEXT,
  file_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_config (
  key TEXT PRIMARY KEY,
  value JSONB
);

CREATE TABLE IF NOT EXISTS public.reservations_stade (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  telephone TEXT NOT NULL,
  date DATE NOT NULL,
  creneau TEXT NOT NULL,
  statut TEXT DEFAULT 'EN_ATTENTE' CHECK (statut IN ('EN_ATTENTE', 'VALIDE', 'REFUSE'))
);

CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tax_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.formulaires (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  drive_link TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Administration', 'Santé', 'Éducation', 'Sport', 'Tourisme', 'Autre')),
  description TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  subject TEXT,
  message TEXT,
  type TEXT NOT NULL CHECK (type IN ('contact', 'rdv')),
  status TEXT DEFAULT 'En attente',
  appointment_date DATE,
  appointment_time TIME,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.council_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL UNIQUE,
  importance_order INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.council (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  role_id UUID REFERENCES public.council_roles(id),
  photo_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.artisans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  metier TEXT NOT NULL,
  arrondissement TEXT NOT NULL,
  telephone TEXT,
  description TEXT,
  photo_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.dossiers (
  id TEXT PRIMARY KEY,
  user_name TEXT NOT NULL,
  service_type TEXT NOT NULL,
  statut TEXT DEFAULT 'En attente',
  commentaire TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_update TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sondages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  description TEXT,
  options JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.ai_chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------
-- 3. FONCTIONS UTILITAIRES (SÉCURITÉ & MÉTIER)
-- ----------------------------------------------------

-- Anti-Récursion RLS : Vérifie si l'utilisateur est Admin sans loop
CREATE OR REPLACE FUNCTION public.check_is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Anti-Récursion RLS : Vérifie si l'utilisateur est un agent approuvé
CREATE OR REPLACE FUNCTION public.check_is_approved(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = user_id AND is_approved = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger d'Auth : Création automatique du profil avec PIN de sécurité
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  final_role TEXT := 'employee';
  final_approved BOOLEAN := false;
BEGIN
  -- Si le PIN est correct à l'inscription -> Admin approuvé direct
  IF (new.raw_user_meta_data->>'admin_pin' = 'AD22510537') THEN
    final_role := 'admin';
    final_approved := true;
  END IF;

  INSERT INTO public.user_profiles (id, email, first_name, last_name, role, is_approved)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'first_name', 
    new.raw_user_meta_data->>'last_name',
    final_role, 
    final_approved
  ) ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Likage atomique des news
CREATE OR REPLACE FUNCTION increment_news_likes(row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE news SET likes = COALESCE(likes, 0) + 1 WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_news_likes(row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE news SET likes = GREATEST(COALESCE(likes, 0) - 1, 0) WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------
-- 4. TRIGGERS SYSTÈME
-- ----------------------------------------------------

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ----------------------------------------------------
-- 5. DONNÉES DE BASE (SEED DATA)
-- ----------------------------------------------------

INSERT INTO site_config (key, value) VALUES 
('flash_news', '"Bienvenue sur le portail officiel de la Mairie de Za-Kpota. Suivez toute l''actualité de votre commune en temps réel."'),
('market_config', '{"referenceDate": "2026-03-15", "cycleDays": 5}'),
('stade_config', '{"image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200", "equipements": ["Pelouse synthétique FIFA", "Éclairage nocturne", "Vestiaires modernes", "Tribune de 5 000 places", "Piste d''athlétisme"]}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO tax_settings (key, value, description) VALUES 
('tfu_rates', '{"taux_bati": 6, "taux_non_bati": 5}', 'Taux globaux de la Taxe Foncière Unique (%)'),
('patente_rates', '{"droit_fixe_base": 10000, "droit_proportionnel": 10}', 'Valeurs de base pour la Contribution des Patentes')
ON CONFLICT (key) DO NOTHING;

INSERT INTO council_roles (title, importance_order) VALUES 
('Maire', 1),
('Secrétaire Exécutif', 2),
('Premier Adjoint au Maire', 3),
('Deuxième Adjoint au Maire', 4),
('Conseiller Municipal', 10)
ON CONFLICT (title) DO NOTHING;

INSERT INTO locations (name, category, description, lat, lng)
VALUES ('Hôtel de Ville de Za-Kpota', 'Administration', 'Siège central de l''administration municipale.', 7.1915, 2.2635)
ON CONFLICT DO NOTHING;

-- ----------------------------------------------------
-- 6. SÉCURITÉ RLS (POLITIQUES UNIFIÉES)
-- ----------------------------------------------------

-- Activation Globale
DO $$ 
DECLARE
    r record;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' ENABLE ROW LEVEL SECURITY;';
    END LOOP;
END $$;

-- 1. Lecture Publique (Toutes tables infos sauf profil/audit)
DROP POLICY IF EXISTS "Public Read" ON public.news;
CREATE POLICY "Public Read" ON public.news FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read" ON public.services_tarifs;
CREATE POLICY "Public Read" ON public.services_tarifs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read" ON public.reports;
CREATE POLICY "Public Read" ON public.reports FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read" ON public.agenda_events;
CREATE POLICY "Public Read" ON public.agenda_events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read" ON public.appointments;
CREATE POLICY "Public Read" ON public.appointments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read" ON public.opportunites;
CREATE POLICY "Public Read" ON public.opportunites FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read" ON public.arrondissements;
CREATE POLICY "Public Read" ON public.arrondissements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read" ON public.site_config;
CREATE POLICY "Public Read" ON public.site_config FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read" ON public.tax_settings;
CREATE POLICY "Public Read" ON public.tax_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read" ON public.formulaires;
CREATE POLICY "Public Read" ON public.formulaires FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read" ON public.locations;
CREATE POLICY "Public Read" ON public.locations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read" ON public.council;
CREATE POLICY "Public Read" ON public.council FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read" ON public.council_roles;
CREATE POLICY "Public Read" ON public.council_roles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read" ON public.artisans;
CREATE POLICY "Public Read" ON public.artisans FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read" ON public.sondages;
CREATE POLICY "Public Read" ON public.sondages FOR SELECT USING (true);

-- 2. Insertion Publique (Citoyens)
DROP POLICY IF EXISTS "Citizen Insert" ON public.audiences;
CREATE POLICY "Citizen Insert" ON public.audiences FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Citizen Insert" ON public.reservations_stade;
CREATE POLICY "Citizen Insert" ON public.reservations_stade FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Citizen Insert" ON public.user_subscriptions;
CREATE POLICY "Citizen Insert" ON public.user_subscriptions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Subscriptions" ON public.user_subscriptions;
CREATE POLICY "Public Read Subscriptions" ON public.user_subscriptions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Update Subscriptions" ON public.user_subscriptions;
CREATE POLICY "Public Update Subscriptions" ON public.user_subscriptions FOR UPDATE USING (true);

-- 3. Accès Personnel
DROP POLICY IF EXISTS "Self View" ON public.user_profiles;
CREATE POLICY "Self View" ON public.user_profiles FOR SELECT USING (id = auth.uid());

DROP POLICY IF EXISTS "Self Update" ON public.user_profiles;
CREATE POLICY "Self Update" ON public.user_profiles FOR UPDATE USING (id = auth.uid());

DROP POLICY IF EXISTS "Self Manage" ON public.ai_chat_sessions;
CREATE POLICY "Self Manage" ON public.ai_chat_sessions FOR ALL TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Self Manage" ON public.ai_messages;
CREATE POLICY "Self Manage" ON public.ai_messages FOR ALL TO authenticated USING (session_id IN (SELECT id FROM ai_chat_sessions WHERE user_id = auth.uid()));

-- 4. Accès Agents Approuvés (Modification)
DROP POLICY IF EXISTS "Approved Agent Write" ON public.news;
CREATE POLICY "Approved Agent Write" ON public.news FOR ALL TO authenticated USING (public.check_is_approved(auth.uid()));

DROP POLICY IF EXISTS "Approved Agent Write" ON public.services_tarifs;
CREATE POLICY "Approved Agent Write" ON public.services_tarifs FOR ALL TO authenticated USING (public.check_is_approved(auth.uid()));

DROP POLICY IF EXISTS "Approved Agent Write" ON public.reports;
CREATE POLICY "Approved Agent Write" ON public.reports FOR ALL TO authenticated USING (public.check_is_approved(auth.uid()));

DROP POLICY IF EXISTS "Approved Agent Write" ON public.agenda_events;
CREATE POLICY "Approved Agent Write" ON public.agenda_events FOR ALL TO authenticated USING (public.check_is_approved(auth.uid()));

DROP POLICY IF EXISTS "Approved Agent Write" ON public.appointments;
CREATE POLICY "Approved Agent Write" ON public.appointments FOR ALL TO authenticated USING (public.check_is_approved(auth.uid()));

DROP POLICY IF EXISTS "Approved Agent Write" ON public.opportunites;
CREATE POLICY "Approved Agent Write" ON public.opportunites FOR ALL TO authenticated USING (public.check_is_approved(auth.uid()));

DROP POLICY IF EXISTS "Approved Agent Write" ON public.arrondissements;
CREATE POLICY "Approved Agent Write" ON public.arrondissements FOR ALL TO authenticated USING (public.check_is_approved(auth.uid()));

DROP POLICY IF EXISTS "Approved Agent Select" ON public.audiences;
CREATE POLICY "Approved Agent Select" ON public.audiences FOR SELECT TO authenticated USING (public.check_is_approved(auth.uid()));

DROP POLICY IF EXISTS "Approved Agent Select" ON public.reservations_stade;
CREATE POLICY "Approved Agent Select" ON public.reservations_stade FOR SELECT TO authenticated USING (public.check_is_approved(auth.uid()));

DROP POLICY IF EXISTS "Approved Agent Write" ON public.formulaires;
CREATE POLICY "Approved Agent Write" ON public.formulaires FOR ALL TO authenticated USING (public.check_is_approved(auth.uid()));

DROP POLICY IF EXISTS "Approved Agent Write" ON public.locations;
CREATE POLICY "Approved Agent Write" ON public.locations FOR ALL TO authenticated USING (public.check_is_approved(auth.uid()));

DROP POLICY IF EXISTS "Approved Agent Write Artisans" ON public.artisans;
CREATE POLICY "Approved Agent Write Artisans" ON public.artisans FOR ALL TO authenticated USING (public.check_is_approved(auth.uid()) OR public.check_is_admin(auth.uid()));

DROP POLICY IF EXISTS "Approved Agent Read Dossiers" ON public.dossiers;
CREATE POLICY "Approved Agent Read Dossiers" ON public.dossiers FOR SELECT TO authenticated USING (public.check_is_approved(auth.uid()) OR public.check_is_admin(auth.uid()));

DROP POLICY IF EXISTS "Approved Agent Write Dossiers" ON public.dossiers;
CREATE POLICY "Approved Agent Write Dossiers" ON public.dossiers FOR ALL TO authenticated USING (public.check_is_approved(auth.uid()) OR public.check_is_admin(auth.uid()));

DROP POLICY IF EXISTS "Approved Agent Log" ON public.audit_logs;
CREATE POLICY "Approved Agent Log" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- 5. Accès S.E / Admin (Contrôle Total)
DROP POLICY IF EXISTS "Admin View Profiles" ON public.user_profiles;
CREATE POLICY "Admin View Profiles" ON public.user_profiles FOR SELECT USING (public.check_is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admin Delete Profiles" ON public.user_profiles;
CREATE POLICY "Admin Delete Profiles" ON public.user_profiles FOR DELETE USING (public.check_is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admin Update Profiles" ON public.user_profiles;
CREATE POLICY "Admin Update Profiles" ON public.user_profiles FOR UPDATE USING (public.check_is_admin(auth.uid())) WITH CHECK (public.check_is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admin Manage Config" ON public.site_config;
CREATE POLICY "Admin Manage Config" ON public.site_config FOR ALL TO authenticated USING (public.check_is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admin Manage Taxes" ON public.tax_settings;
CREATE POLICY "Admin Manage Taxes" ON public.tax_settings FOR ALL TO authenticated USING (public.check_is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admin View Logs" ON public.audit_logs;
CREATE POLICY "Admin View Logs" ON public.audit_logs FOR SELECT USING (public.check_is_admin(auth.uid()));

-- ==========================================================
-- FIN DU SCRIPT COMPLET
-- ==========================================================

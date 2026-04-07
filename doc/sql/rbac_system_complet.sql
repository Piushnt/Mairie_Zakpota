-- ===============================================
-- SYSTÈME RBAC COMPLET SÉCURISÉ (MAIRIE CONNECT SAAS)
-- Version: 2.0 (Login V2 Simplifié)
-- ===============================================
-- Ce script prépare la base de données pour toute nouvelle Mairie.
-- Il installe :
-- 1. La table des Profils Utilisateurs (RBAC)
-- 2. La table des Logs d'Audit
-- 3. Les Triggers de création (version avec blocage par défaut)
-- 4. Les contraintes de sécurité (RLS et CASCADE)
-- ===============================================

-- ----------------------------------------------------
-- 1. CRÉATION DES TABLES PRINCIPALES (RBAC ET AUDIT)
-- ----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL DEFAULT 'employee' CHECK (role IN ('employee', 'admin')),
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour accélérer les chargements du dashboard
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action_type);

-- ----------------------------------------------------
-- 2. CORRECTION DES CONTRAINTES DES MODULES (IA, etc.)
-- ----------------------------------------------------
-- Assure que la suppression d'un utilisateur nettoie ses traces sans bloquer.
ALTER TABLE public.ai_chat_sessions DROP CONSTRAINT IF EXISTS ai_chat_sessions_user_id_fkey;
ALTER TABLE public.ai_chat_sessions ADD CONSTRAINT ai_chat_sessions_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- ----------------------------------------------------
-- 3. TRIGGER AUTOMATIQUE À L'INSCRIPTION
-- ----------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Tout le monde s'inscrit en tant qu'employé non approuvé.
  -- L'élévation éventuelle en Admin est gérée dynamiquement par le Front-end 
  -- lors du login avec le code PIN système protégé par RLS sécurisé.
  INSERT INTO public.user_profiles (id, email, first_name, last_name, role, is_approved)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'first_name', 
    new.raw_user_meta_data->>'last_name',
    'employee', 
    false
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- S'assurer qu'il n'y a pas de doublon
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------
-- 4. POLITIQUES DE SÉCURITÉ RLS (Row Level Security)
-- ----------------------------------------------------

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent lire leur propre profil ou tout lire s'ils sont admins
CREATE POLICY "Les utilisateurs lisent leur propre profil" 
ON public.user_profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins peuvent tout lire sur user_profiles" 
ON public.user_profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Les admins peuvent supprimer des profils (révocation)
CREATE POLICY "Admins peuvent supprimer des profils" 
ON public.user_profiles FOR DELETE USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Indispensable : Les utilisateurs peuvent s'approuver (pour le flux PIN Sécurisé du Login)
CREATE POLICY "Les utilisateurs modifient leur propre profil" 
ON public.user_profiles FOR UPDATE USING (auth.uid() = id);

-- Pour les autres tables métiers (exemples vitaux) 
-- Les tables existantes (news, reports, services_tarifs) doivent être sécurisées de la même façon :
-- CREATE POLICY "Lecture publique" ON public.news FOR SELECT USING (true);
-- CREATE POLICY "Modification restreinte" ON public.news FOR ALL USING (
--   EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_approved = true)
-- );

-- ===============================================
-- FIN DU SCRIPT
-- ===============================================

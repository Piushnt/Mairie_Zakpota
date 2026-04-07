-- ==========================================
-- SCRIPT DE MISE EN PLACE DU RBAC & AUDIT
-- Mairie de Za-Kpota (SaaS v2.0)
-- ==========================================

-- 1. Table des profils utilisateurs liés à l'authentification
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'employee' CHECK (role IN ('admin', 'employee')),
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger pour la création automatique du profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, first_name, last_name, role, is_approved)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'first_name', 
    new.raw_user_meta_data->>'last_name',
    COALESCE(new.raw_user_meta_data->>'role', 'employee'), 
    false -- L'admin validera manuellement !
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Table pour le Journal d'Audit (Logs d'activités)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  user_name TEXT,
  action_type TEXT NOT NULL CHECK (action_type IN ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'APPROVE', 'REVOKE')),
  module_name TEXT NOT NULL,
  description TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Activer la RLS sur les nouvelles tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Politiques user_profiles
DROP POLICY IF EXISTS "Les utilisateurs lisent leur propre profil" ON user_profiles;
CREATE POLICY "Les utilisateurs lisent leur propre profil" 
ON user_profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Les utilisateurs modifient leur propre profil" ON user_profiles;
CREATE POLICY "Les utilisateurs modifient leur propre profil" 
ON user_profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins peuvent tout lire sur user_profiles" ON user_profiles;
CREATE POLICY "Admins peuvent tout lire sur user_profiles" 
ON user_profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Admins peuvent tout modifier sur user_profiles" ON user_profiles;
CREATE POLICY "Admins peuvent tout modifier sur user_profiles" 
ON user_profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Politiques audit_logs (Tout utilisateur authentifié peut écrire ses propres logs)
DROP POLICY IF EXISTS "Écriture dans audit_logs" ON audit_logs;
CREATE POLICY "Écriture dans audit_logs" 
ON audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- Seul les admins peuvent lire les logs d'audit
DROP POLICY IF EXISTS "Admins lisent audit_logs" ON audit_logs;
CREATE POLICY "Admins lisent audit_logs" 
ON audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ==========================================
-- Mettre à jour les anciennes Politiques RLS
-- ==========================================

-- Pour sécuriser activement votre BDD, on applique les nouvelles règles restrictives :
-- Seuls les utilisateurs APPROUVÉS peuvent écrire dans les tables partagées :

DROP POLICY IF EXISTS "Write Services" ON services_tarifs;
CREATE POLICY "Write Services" ON services_tarifs FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_approved = true)
);

-- Seuls les ADMINS (is_approved=true ET role=admin) peuvent écrire dans les tables stratégiques :

DROP POLICY IF EXISTS "Admin Write News" ON news;
CREATE POLICY "Admin Write News" ON news FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin' AND is_approved = true)
);

DROP POLICY IF EXISTS "Admin Write Reports" ON reports;
CREATE POLICY "Admin Write Reports" ON reports FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin' AND is_approved = true)
);

DROP POLICY IF EXISTS "Admin Write Appointments" ON appointments;
CREATE POLICY "Admin Write Appointments" ON appointments FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin' AND is_approved = true)
);

DROP POLICY IF EXISTS "Admin Write Opportunites" ON opportunites;
CREATE POLICY "Admin Write Opportunites" ON opportunites FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin' AND is_approved = true)
);

DROP POLICY IF EXISTS "Admin Write Arrondissements" ON arrondissements;
CREATE POLICY "Admin Write Arrondissements" ON arrondissements FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin' AND is_approved = true)
);

DROP POLICY IF EXISTS "Admin Write Agenda" ON agenda_events;
CREATE POLICY "Admin Write Agenda" ON agenda_events FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin' AND is_approved = true)
);

DROP POLICY IF EXISTS "Admin Write Config" ON site_config;
CREATE POLICY "Admin Write Config" ON site_config FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin' AND is_approved = true)
);

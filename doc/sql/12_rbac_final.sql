-- ==========================================================
-- 12. MISE EN PLACE DU RBAC & SECURISATION SYSTEME (SaaS)
-- ==========================================================

-- 1. Table des profils utilisateurs
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

-- 2. Journal d'Audit (Logs d'activités)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  user_name TEXT,
  action_type TEXT NOT NULL CHECK (action_type IN ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'APPROVE', 'REVOKE')),
  module_name TEXT NOT NULL,
  description TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Index d'optimisation
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);

-- 3. Trigger d'Inscription Automatique SÉCURISÉ (Vérification PIN)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  requested_role TEXT;
  provided_pin TEXT;
  final_role TEXT := 'employee';
  final_approved BOOLEAN := false;
BEGIN
  -- Extraire les champs demandés à l'inscription
  requested_role := new.raw_user_meta_data->>'role';
  provided_pin := new.raw_user_meta_data->>'admin_pin';

  -- Si on demande à être Admin, le code serveur décide si c'est valide ou non.
  IF requested_role = 'admin' AND provided_pin = 'AD22510537' THEN
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
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================================
-- SÉCURITÉ RLS (Pour les tables système RBAC)
-- ==========================================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les utilisateurs lisent leur propre profil" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins peuvent tout lire sur user_profiles" ON user_profiles FOR SELECT USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins peuvent supprimer des profils" ON user_profiles FOR DELETE USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Écriture dans audit_logs" ON audit_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins lisent audit_logs" ON audit_logs FOR SELECT USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- ==========================================================
-- SÉCURITÉ DES 11 TABLES DE BASE (Bloquer les faux agents)
-- ==========================================================
-- Par defaut (1.sql), "TO authenticated USING (true)" autorise TOUT le monde.
-- Nous restreignons la modification uniquement aux utilisateurs validés (is_approved = true)
-- Cela garde l'harmonie avec 1.sql sans corrompre la BDD.

DROP POLICY IF EXISTS "Admin All Services" ON services_tarifs;
DROP POLICY IF EXISTS "Admin All News" ON news;
DROP POLICY IF EXISTS "Admin All Appointments" ON appointments;
DROP POLICY IF EXISTS "Admin All Opportunites" ON opportunites;
DROP POLICY IF EXISTS "Admin All Arrondissements" ON arrondissements;
DROP POLICY IF EXISTS "Admin All Agenda" ON agenda_events;
DROP POLICY IF EXISTS "Admin All Reports" ON reports;
DROP POLICY IF EXISTS "Admin All Config" ON site_config;

-- Nouvelle sécurisation unifiée pour les tables vitales :
CREATE POLICY "Edition Modérée" ON services_tarifs FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_approved = true));
CREATE POLICY "Edition Modérée" ON news FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_approved = true));
CREATE POLICY "Edition Modérée" ON appointments FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_approved = true));
CREATE POLICY "Edition Modérée" ON opportunites FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_approved = true));
CREATE POLICY "Edition Modérée" ON arrondissements FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_approved = true));
CREATE POLICY "Edition Modérée" ON agenda_events FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_approved = true));
CREATE POLICY "Edition Modérée" ON reports FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_approved = true));
CREATE POLICY "Edition S.E." ON site_config FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- ----------------------------------------------------
-- ASSURER L'INTÉGRITÉ FONCTIONNELLE DU CASCADE SUR IA
-- ----------------------------------------------------
ALTER TABLE public.ai_chat_sessions DROP CONSTRAINT IF EXISTS ai_chat_sessions_user_id_fkey;
ALTER TABLE public.ai_chat_sessions ADD CONSTRAINT ai_chat_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

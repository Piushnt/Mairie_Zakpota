-- ==========================================================
-- 13. REPARATION : FIX RECURSION RLS & ERREURS 500
-- ==========================================================

-- 1. On commence par supprimer les anciennes fonctions et politiques récursives
DROP POLICY IF EXISTS "Les utilisateurs lisent leur propre profil" ON user_profiles;
DROP POLICY IF EXISTS "Admins peuvent tout lire sur user_profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins peuvent supprimer des profils" ON user_profiles;
DROP POLICY IF EXISTS "Les utilisateurs modifient leur propre profil" ON user_profiles;

-- 2. Création d'une fonction d'aide pour éviter la récursion infinie
-- Cette fonction utilise 'SECURITY DEFINER' pour lire dans user_profiles sans déclencher RLS.
CREATE OR REPLACE FUNCTION public.check_is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.check_is_approved(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = user_id AND is_approved = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Nouvelles politiques de sécurité simples et efficaces sur user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Lecture de son propre profil (Condition simple)
CREATE POLICY "lecture_personnelle" ON user_profiles 
FOR SELECT USING (auth.uid() = id);

-- Lecture globale pour les Admins (Utilise la fonction d'aide)
CREATE POLICY "lecture_admin_globale" ON user_profiles 
FOR SELECT USING (public.check_is_admin(auth.uid()));

-- Modification personnelle
CREATE POLICY "modification_personnelle" ON user_profiles 
FOR UPDATE USING (auth.uid() = id);

-- Suppression Admins
CREATE POLICY "suppression_admin" ON user_profiles 
FOR DELETE USING (public.check_is_admin(auth.uid()));

-- 4. Sécurisation propre des tables métiers (News, Tarifs, etc.)
-- On RESTAURE la lecture publique (pour que le site web fonctionne pour tout le monde)
CREATE POLICY "lecture_publique_news" ON news FOR SELECT USING (true);
CREATE POLICY "lecture_publique_tarifs" ON services_tarifs FOR SELECT USING (true);
CREATE POLICY "lecture_publique_reports" ON reports FOR SELECT USING (true);
CREATE POLICY "lecture_publique_agenda" ON agenda_events FOR SELECT USING (true);
CREATE POLICY "lecture_publique_appointments" ON appointments FOR SELECT USING (true);
CREATE POLICY "lecture_publique_opportunites" ON opportunites FOR SELECT USING (true);
CREATE POLICY "lecture_publique_arrondissements" ON arrondissements FOR SELECT USING (true);
CREATE POLICY "lecture_publique_config" ON site_config FOR SELECT USING (true);

-- On RESTREINT la modification aux agents APPROUVÉS
DROP POLICY IF EXISTS "Edition Modérée" ON news;
DROP POLICY IF EXISTS "Edition Modérée" ON services_tarifs;
DROP POLICY IF EXISTS "Edition Modérée" ON reports;
DROP POLICY IF EXISTS "Edition Modérée" ON agenda_events;
DROP POLICY IF EXISTS "Edition Modérée" ON appointments;
DROP POLICY IF EXISTS "Edition Modérée" ON opportunites;
DROP POLICY IF EXISTS "Edition Modérée" ON arrondissements;
DROP POLICY IF EXISTS "Edition S.E." ON site_config;

-- Edition
CREATE POLICY "edition_agents_approuves" ON news FOR ALL TO authenticated USING (public.check_is_approved(auth.uid()));
CREATE POLICY "edition_agents_approuves" ON services_tarifs FOR ALL TO authenticated USING (public.check_is_approved(auth.uid()));
CREATE POLICY "edition_agents_approuves" ON reports FOR ALL TO authenticated USING (public.check_is_approved(auth.uid()));
CREATE POLICY "edition_agents_approuves" ON agenda_events FOR ALL TO authenticated USING (public.check_is_approved(auth.uid()));
CREATE POLICY "edition_agents_approuves" ON appointments FOR ALL TO authenticated USING (public.check_is_approved(auth.uid()));
CREATE POLICY "edition_agents_approuves" ON opportunites FOR ALL TO authenticated USING (public.check_is_approved(auth.uid()));
CREATE POLICY "edition_agents_approuves" ON arrondissements FOR ALL TO authenticated USING (public.check_is_approved(auth.uid()));

-- Config uniquement pour l'Admin
CREATE POLICY "edition_admin_seulement" ON site_config FOR ALL TO authenticated USING (public.check_is_admin(auth.uid()));

-- ==========================================================
-- FIN DE LA REPARATION
-- ==========================================================

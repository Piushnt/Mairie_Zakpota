-- ==========================================================
-- CORRECTIF V3 : RÉPARATION DOSSIERS & VALIDATION ADMIN
-- À exécuter si vous avez déjà lancé DATABASE_COMPLETE.sql
-- ==========================================================

-- 1. Réparation de l'erreur 400 (Dossiers)
-- Ajout de la colonne manquante 'created_at' dont le dashboard a besoin pour trier.
ALTER TABLE public.dossiers 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Réparation de la Validation de compte (Permissions)
-- Autorise l'administrateur (S.E.) à modifier le statut 'is_approved'.
DROP POLICY IF EXISTS "Admin Update Profiles" ON public.user_profiles;
CREATE POLICY "Admin Update Profiles" ON public.user_profiles 
FOR UPDATE 
USING (public.check_is_admin(auth.uid())) 
WITH CHECK (public.check_is_admin(auth.uid()));

-- 3. Mise à jour de la Politique de sélection pour les dossiers (Lecture Agent/Admin)
-- Assure que les agents approuvés peuvent lire les dossiers.
DROP POLICY IF EXISTS "Approved Agent Read Dossiers" ON public.dossiers;
CREATE POLICY "Approved Agent Read Dossiers" ON public.dossiers 
FOR SELECT 
TO authenticated 
USING (public.check_is_approved(auth.uid()) OR public.check_is_admin(auth.uid()));

-- ==========================================================
-- FIN DU CORRECTIF V3
-- ==========================================================

-- ==========================================================
-- CORRECTIF V4 : DROITS D'ÉCRITURE ARTISANS & DOSSIERS
-- À exécuter si vous avez déjà lancé DATABASE_COMPLETE.sql
-- ==========================================================

-- 1. Autoriser l'ajout d'artisans pour les agents et admins
DROP POLICY IF EXISTS "Approved Agent Write Artisans" ON public.artisans;
CREATE POLICY "Approved Agent Write Artisans" ON public.artisans 
FOR ALL TO authenticated 
USING (public.check_is_approved(auth.uid()) OR public.check_is_admin(auth.uid()));

-- 2. Assurer que la lecture n'est pas bloquée pour les nouveaux artisans
DROP POLICY IF EXISTS "Public Read Artisans" ON public.artisans;
CREATE POLICY "Public Read Artisans" ON public.artisans FOR SELECT USING (true);

-- 3. Confirmer les droits complets sur les dossiers (Lecture + Ecriture)
DROP POLICY IF EXISTS "Approved Agent Read Dossiers" ON public.dossiers;
CREATE POLICY "Approved Agent Read Dossiers" ON public.dossiers 
FOR SELECT TO authenticated 
USING (public.check_is_approved(auth.uid()) OR public.check_is_admin(auth.uid()));

DROP POLICY IF EXISTS "Approved Agent Write Dossiers" ON public.dossiers;
CREATE POLICY "Approved Agent Write Dossiers" ON public.dossiers 
FOR ALL TO authenticated 
USING (public.check_is_approved(auth.uid()) OR public.check_is_admin(auth.uid()));

-- ==========================================================
-- FIN DU CORRECTIF V4
-- ==========================================================

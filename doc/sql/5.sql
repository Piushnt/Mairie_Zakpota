-- Autoriser la modification (Insert, Update, Delete) des formulaires via l'Admin Dashboard
CREATE POLICY "Activer la modification des formulaires"
ON public.formulaires FOR ALL TO public USING (true) WITH CHECK (true);

-- Autoriser la modification (Insert, Update, Delete) des paramètres fiscaux (Taxes)
CREATE POLICY "Activer la modification des taxes"
ON public.tax_settings FOR ALL TO public USING (true) WITH CHECK (true);

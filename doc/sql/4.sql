-- ==========================================
-- SCRIPT DE CREATION : SIMULATEUR FISCAL ET GUICHET NUMERIQUE
-- A exécuter dans l'éditeur SQL de Supabase
-- ==========================================

-- 1. Configuration des Taxes (TFU & Patente)
CREATE TABLE IF NOT EXISTS public.tax_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insertion des valeurs par défaut pour le Simulateur
INSERT INTO public.tax_settings (key, value, description)
VALUES 
  ('tfu_rates', '{"taux_bati": 6, "taux_non_bati": 5}', 'Taux globaux de la Taxe Foncière Unique (%)'),
  ('patente_rates', '{"droit_fixe_base": 10000, "droit_proportionnel": 10}', 'Valeurs de base pour la Contribution des Patentes')
ON CONFLICT (key) DO NOTHING;

-- 2. Guichet Numérique des Formulaires
CREATE TABLE IF NOT EXISTS public.formulaires (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    drive_link TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insertion d'exemples de formulaires
INSERT INTO public.formulaires (title, category, drive_link, description)
VALUES 
  ('Demande d''Acte de Naissance Souche', 'État-civil', '#', 'Formulaire à remplir pour l''obtention d''une souche.'),
  ('Formulaire de Permis de Construire', 'Urbanisme', '#', 'Dossier officiel de demande d''autorisation de bâtir.')
ON CONFLICT DO NOTHING;

-- Autoriser la lecture publique
ALTER TABLE public.tax_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formulaires ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Activer la lecture publique des formulaires"
ON public.formulaires FOR SELECT TO public USING (true);

CREATE POLICY "Activer la lecture publique des taxes"
ON public.tax_settings FOR SELECT TO public USING (true);


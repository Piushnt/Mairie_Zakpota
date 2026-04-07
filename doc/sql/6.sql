-- =============================================
-- SCRIPT DE CREATION : CARTOGRAPHIE COMMUNALE
-- =============================================

-- 1. Table des Lieux (Infrastructures)
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Administration', 'Santé', 'Éducation', 'Sport', 'Tourisme', 'Autre')),
    description TEXT,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Insertion de la Mairie par défaut
INSERT INTO public.locations (name, category, description, lat, lng)
VALUES (
    'Hôtel de Ville de Za-Kpota', 
    'Administration', 
    'Siège central de l''administration municipale. Ouvert de 08h à 17h.', 
    7.1915, 
    2.2635
) ON CONFLICT DO NOTHING;

-- 3. Politiques de Sécurité (RLS)
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Lecture publique
CREATE POLICY "Lecture publique des lieux"
ON public.locations FOR SELECT TO public USING (true);

-- Modification Admin (Tout faire pour public pendant le dev si l'auth n'est pas stricte sur cette table)
CREATE POLICY "Modification des lieux par tous"
ON public.locations FOR ALL TO public USING (true) WITH CHECK (true);

-- Création de la table pour les réservations du stade
CREATE TABLE IF NOT EXISTS public.reservations_stade (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    telephone TEXT NOT NULL,
    date DATE NOT NULL,
    creneau TEXT NOT NULL,
    statut TEXT DEFAULT 'EN_ATTENTE' CHECK (statut IN ('EN_ATTENTE', 'VALIDE', 'REFUSE'))
);

-- Activation de RLS (Row Level Security)
ALTER TABLE public.reservations_stade ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité
CREATE POLICY "Tout le monde peut insérer une réservation" 
ON public.reservations_stade FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Seuls les admins peuvent voir et modifier les réservations" 
ON public.reservations_stade FOR ALL 
USING (auth.role() = 'authenticated');


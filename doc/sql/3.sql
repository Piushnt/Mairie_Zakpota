-- ==========================================
-- SCRIPT DE CREATION POUR SYSTEME PUSH
-- A exécuter dans l'éditeur SQL de Supabase
-- ==========================================

-- Création de la table pour stocker les abonnements Web Push
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    endpoint TEXT NOT NULL UNIQUE,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Activation du RLS pour des raisons de sécurité de base
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs d'insérer leur propre abonnement
CREATE POLICY "Activer l'insertion anonyme d'abonnements"
ON public.user_subscriptions
FOR INSERT
TO public
WITH CHECK (true);

-- Politique pour permettre la consultation (Optionnel, utile pour le dashboard ou serverless admin)
CREATE POLICY "Activer la lecture publique"
ON public.user_subscriptions
FOR SELECT
TO public
USING (true);

-- (Optionnel) Index sur l'endpoint pour accélerer les recherches
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_endpoint ON public.user_subscriptions(endpoint);


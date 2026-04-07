-- 1. Ajout de la colonne likes à la table news
ALTER TABLE news ADD COLUMN IF NOT EXISTS likes BIGINT DEFAULT 0;

-- 2. Fonction RPC pour incrémenter les likes de manière atomique
-- Cela évite que deux likes simultanés n'en comptent qu'un seul.
-- Utilisation : supabase.rpc('increment_news_likes', { row_id: '...' })
CREATE OR REPLACE FUNCTION increment_news_likes(row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE news
  SET likes = COALESCE(likes, 0) + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Fonction RPC pour décrémenter les likes (si l'utilisateur retire son like)
CREATE OR REPLACE FUNCTION decrement_news_likes(row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE news
  SET likes = GREATEST(COALESCE(likes, 0) - 1, 0)
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

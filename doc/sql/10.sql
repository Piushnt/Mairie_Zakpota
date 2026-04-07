-- 1. Table des Sessions de Chat
CREATE TABLE ai_chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table des Messages
CREATE TABLE ai_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user', 'model'
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Sécurité RLS
ALTER TABLE ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

-- Politiques : Les utilisateurs voient uniquement leurs sessions
CREATE POLICY "Users can manage their own sessions" ON ai_chat_sessions
  FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own messages" ON ai_messages
  FOR ALL TO authenticated USING (
    session_id IN (SELECT id FROM ai_chat_sessions WHERE user_id = auth.uid())
  );

-- Politique d'accès Admin (si nécessaire, via role ou email spécifique)
-- Ici on simplifie pour le dashboard admin
CREATE POLICY "Admins can see all sessions" ON ai_chat_sessions
  FOR SELECT TO authenticated USING (true); -- À restreindre en prod réelle

CREATE POLICY "Admins can see all messages" ON ai_messages
  FOR SELECT TO authenticated USING (true);


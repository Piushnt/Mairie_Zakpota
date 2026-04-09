import { supabase } from '../lib/supabase';

/**
 * Converts a file to a base64 string for Gemini API
 */
export async function fileToGenerativePart(file: File): Promise<{ inlineData: { data: string, mimeType: string } }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).toString().split(',')[1];
      const part = {
        inlineData: {
          data: base64Data,
          mimeType: file.type
        },
      };
      resolve(part);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Saves a chat message to the database
 * tenant_id est requis (NOT NULL dans le schéma)
 */
export async function saveAIMessage(sessionId: string, role: string, content: string, tenantId: string, metadata: any = {}) {
  if (!sessionId || sessionId.length < 10) return;

  try {
    const { error } = await supabase
      .from('ai_messages')
      .insert([{ 
        session_id: sessionId, 
        tenant_id: tenantId,
        role, 
        content, 
        metadata 
      }]);
    
    if (error) console.error("Error saving AI message:", error.message);
  } catch (e) {
    console.error("DB Error:", e);
  }
}

/**
 * Creates or gets a chat session
 * tenant_id est NOT NULL dans le schéma — obligatoire
 */
export async function getOrCreateAISession(tenantId: string, title: string = "Nouvelle conversation") {
  const cacheKey = `ai_session_${tenantId}`;
  const existingId = sessionStorage.getItem(cacheKey);
  if (existingId) return existingId;

  if (!tenantId) {
    // Si pas de tenant (visiteur non résolu), on utilise un ID temporaire local
    const fallbackId = crypto.randomUUID();
    return fallbackId; // Pas de stockage DB
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('ai_chat_sessions')
      .insert([{ 
        title, 
        tenant_id: tenantId,
        user_id: user?.id || null 
      }])
      .select()
      .single();

    if (error || !data) {
      console.warn("AI session fallback (DB non dispo):", error?.message);
      return crypto.randomUUID();
    }

    sessionStorage.setItem(cacheKey, data.id);
    return data.id;
  } catch (e) {
    return crypto.randomUUID();
  }
}

/**
 * Fetches the history for a given session
 */
export async function fetchAISessionHistory(sessionId: string) {
  if (!sessionId || sessionId.length < 10) return [];

  try {
    const { data, error } = await supabase
      .from('ai_messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error fetching AI history:", error.message);
      return [];
    }

    return data.map(m => ({
      role: m.role === 'model' ? 'bot' : 'user',
      text: m.content
    }));
  } catch (e) {
    return [];
  }
}

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
 */
export async function saveAIMessage(sessionId: string, role: string, content: string, metadata: any = {}) {
  // Use session_id if available, otherwise just log to console for now
  if (!sessionId || sessionId.length < 10) return;

  try {
    const { error } = await supabase
      .from('ai_messages')
      .insert([{ session_id: sessionId, role, content, metadata }]);
    
    if (error) console.error("Error saving AI message:", error);
  } catch (e) {
    console.error("DB Error:", e);
  }
}

/**
 * Creates or gets a chat session
 */
export async function getOrCreateAISession(title: string = "Nouvelle conversation") {
  // Check if session exists in sessionStorage
  const existingId = sessionStorage.getItem('za_kpota_ai_session');
  if (existingId) return existingId;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('ai_chat_sessions')
      .insert([{ title, user_id: user?.id }])
      .select()
      .single();

    if (error || !data) {
      const fallbackId = crypto.randomUUID();
      sessionStorage.setItem('za_kpota_ai_session', fallbackId);
      return fallbackId;
    }

    sessionStorage.setItem('za_kpota_ai_session', data.id);
    return data.id;
  } catch (e) {
    const fallbackId = crypto.randomUUID();
    sessionStorage.setItem('za_kpota_ai_session', fallbackId);
    return fallbackId;
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
      console.error("Error fetching AI history:", error);
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

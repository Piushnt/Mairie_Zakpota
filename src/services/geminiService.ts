import { GoogleGenerativeAI, Part } from "@google/generative-ai";

/**
 * Mairie_Zakpota - Gemini AI Resilience Engine
 * Role: Architecte Cloud & IA Expert
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "");

// Stratégie de Résilience : Modèles par ordre de priorité
const MODELS_FALLBACK = [
  "gemini-1.5-pro",   // Tentative 1 : Précision maximale
  "gemini-1.5-flash", // Tentative 2 : Rapidité et fiabilité
  "gemini-pro"        // Tentative 3 : Ancienne version stable
];

const SYSTEM_INSTRUCTIONS = `
Vous êtes l'Assistant Numérique Officiel de la Mairie de Zakpota (Bénin).
Votre mission est d'informer les citoyens sur :
1. L'état civil (actes de naissance, mariages, décès, attestations).
2. Les formalités administratives (légalisation, certificats divers).
3. Les taxes locales (TFU - Taxe Foncière Unique, taxes de marché).
4. La vie communale (arrondissements, marchés, stade).

DIRECTIVES DE RÉPONSE :
- Soyez courtois, professionnel et précis.
- Utilisez un ton institutionnel mais accessible.
- Si vous ne connaissez pas une réponse spécifique, orientez vers le secrétariat de la mairie (+229 97 00 00 00).
- Répondez en français clair.
- Rappelez que vous êtes un assistant automatique.
`;

const DISCLAIMER = "\n\n---\n*Ceci est une assistance automatique, veuillez consulter les services de la mairie pour les actes officiels.*";

/**
 * Nettoyage des entrées utilisateur pour éviter les injections de prompt
 */
const sanitizeInput = (input: string): string => {
  return input
    .replace(/<[^>]*>?/gm, '') // Supprime le HTML
    .replace(/[{}()]/g, '')    // Supprime les accolades et parenthèses suspectes
    .trim()
    .substring(0, 1000);       // Limite la taille
};

export interface ChatMessage {
  role: "user" | "bot";
  text: string;
}

/**
 * Moteur de génération avec boucle de fallback indestructible
 */
export const generateMunicipalResponse = async (
  prompt: string, 
  history: ChatMessage[] = []
): Promise<string> => {
  if (!API_KEY) {
    return "Configuration de l'IA manquante (Clé API). Veuillez contacter l'administrateur." + DISCLAIMER;
  }

  const cleanPrompt = sanitizeInput(prompt);
  
  // Conversion de l'historique au format Gemini
  const chatHistory = history.map(msg => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.text }] as Part[],
  }));

  let lastError: any = null;

  // Boucle de test des modèles (Algorithme de Résilience)
  for (const modelName of MODELS_FALLBACK) {
    try {
      console.log(`[Gemini Engine] Tentative avec le modèle : ${modelName}`);
      
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        systemInstruction: SYSTEM_INSTRUCTIONS 
      });

      const chat = model.startChat({
        history: chatHistory,
      });

      const result = await chat.sendMessage(cleanPrompt);
      const response = await result.response;
      const text = response.text();

      if (text) {
        return text + DISCLAIMER;
      }
    } catch (error: any) {
      lastError = error;
      const status = error?.status || error?.response?.status;
      
      console.warn(`[Gemini Engine] Échec du modèle ${modelName} (Statut: ${status}).`);
      
      // Si c'est une erreur de quota (429) ou une erreur serveur (500), on continue la boucle
      if (status === 429 || status === 500 || status === 503) {
        continue;
      }
      
      // Pour les autres erreurs, on tente quand même le modèle suivant par sécurité
      continue;
    }
  }

  // Si TOUS les modèles échouent
  console.error("[Gemini Engine] Échec critique de tous les modèles.", lastError);
  return "Je suis navré, mon système de réponse rencontre actuellement une surcharge technique. Veuillez réessayer dans quelques instants ou contacter directement les services de la mairie pour vos démarches urgentes." + DISCLAIMER;
};

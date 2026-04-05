import { GoogleGenerativeAI, Tool, GenerateContentRequest, SchemaType } from "@google/generative-ai";
import { supabase } from "./supabase";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const SYSTEM_PROMPT = `
Vous êtes "Za-Kpota GPT", l'assistant municipal officiel de la commune de Za-Kpota au Bénin.
Votre mission est d'aider les citoyens avec des informations précises, courtoises et utiles sur les services de la mairie.

CONTEXTE DE ZA-KPOTA :
- Maire : Poste stratégique pour le développement local.
- Arrondissements : Allahé, Assalin, Houngomey, Kpota, Kpakpamè, Kpozoun, Za-Hla, Za-Kpota (Chef-lieu).
- Services : État civil (naissance, mariage, décès), urbanisme (permis de construire), taxes locales (TFU).
DIRECTIVES DE SÉCURITÉ :
1. Soyez toujours professionnel et chaleureux.
2. Utilisez les outils à votre disposition pour donner des informations RÉELLES (prix, dates, actualités). Ne jamais inventer de prix.
3. Si une information manque, invitez l'usager à contacter le secrétariat au +229 97 00 00 00.
4. PROTECTION : Ne fournissez jamais de conseils financiers complexes, d'avis médicaux ou de recommandations politiques partisanes. Votre rôle est purement administratif.
5. CONFIDENTIALITÉ : Ne demandez jamais de mot de passe ou de données de carte bancaire.
`;

// --- TOOLS DEFINITION ---

const tools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "get_municipal_news",
        description: "Récupère les 5 dernières actualités de la commune de Za-Kpota",
      },
      {
        name: "get_service_details",
        description: "Récupère les tarifs et pièces à fournir pour un service municipal particulier (acte de naissance, mariage, etc.)",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            service_name: {
              type: SchemaType.STRING,
              description: "Le nom du service recherché (ex: 'naissance', 'mariage', 'construction')"
            }
          }
        }
      },
      {
        name: "get_upcoming_events",
        description: "Récupère les événements à venir dans l'agenda municipal (stade, réunions publiques, etc.)",
      }
    ]
  }
];

// --- TOOL IMPLEMENTATIONS ---

async function get_municipal_news() {
  const { data } = await supabase.from('news').select('*').order('date', { ascending: false }).limit(5);
  return JSON.stringify(data);
}

async function get_service_details(args: { service_name: string }) {
  const { data } = await supabase
    .from('services_tarifs')
    .select('*')
    .ilike('name', `%${args.service_name}%`)
    .limit(3);
  return JSON.stringify(data);
}

async function get_upcoming_events() {
  const { data } = await supabase
    .from('agenda_events')
    .select('*')
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
    .limit(5);
  return JSON.stringify(data);
}

const functions: Record<string, Function> = {
  get_municipal_news,
  get_service_details,
  get_upcoming_events
};

// --- MAIN SERVICE ---

export async function askMunicipalAI(prompt: string, history: { role: string, text: string }[] = []) {
  if (!GEMINI_API_KEY) {
    return simulateMunicipalResponse(prompt);
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT,
      tools
    });

    // Gemini requires the first message in history to be from the 'user' role.
    // We skip any initial 'bot' (model) messages (like the welcome greeting) to avoid crashing.
    const mappedHistory = history.map(h => ({
      role: (h.role === 'bot' || h.role === 'model') ? 'model' : 'user',
      parts: [{ text: h.text }]
    }));

    const firstUserIndex = mappedHistory.findIndex(h => h.role === 'user');
    const finalHistory = firstUserIndex === -1 ? [] : mappedHistory.slice(firstUserIndex);

    const chat = model.startChat({
      history: finalHistory
    });

    // Add a AbortController or a simple timeout for safety
    const aiPromise = chat.sendMessage(prompt);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("AI_TIMEOUT")), 15000)
    );

    const result = await Promise.race([aiPromise, timeoutPromise]) as any;
    let response = result.response;
    
    // Handle function calls
    const calls = response.candidates?.[0]?.content?.parts.filter(p => p.functionCall);
    
    if (calls && calls.length > 0) {
      const toolResults = [];
      for (const call of calls) {
        if (call.functionCall) {
          const functionName = call.functionCall.name;
          const args = call.functionCall.args;
          const functionResponse = await functions[functionName](args);
          
          toolResults.push({
            functionResponse: {
              name: functionName,
              response: { result: functionResponse }
            }
          });
        }
      }
      
      const secondResult = await chat.sendMessage(toolResults);
      return secondResult.response.text();
    }

    return response.text();
  } catch (err) {
    console.error("Gemini AI Error:", err);
    return simulateMunicipalResponse(prompt);
  }
}

/**
 * Fallback simulation for offline/missing key
 */
function simulateMunicipalResponse(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  if (lowerPrompt.includes('naissance')) return "Pour un acte de naissance, prévoyez 500 FCFA et la fiche de déclaration de l'hôpital.";
  if (lowerPrompt.includes('marché')) return "Le marché de Za-Kpota a lieu tous les 5 jours.";
  return "Je suis désolé, je rencontre une difficulté technique. Veuillez contacter la mairie au +229 97 00 00 00.";
}

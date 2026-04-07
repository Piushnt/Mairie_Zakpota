import { GoogleGenerativeAI, Tool, GenerateContentRequest, SchemaType } from "@google/generative-ai";
import { supabase } from "./supabase";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const SYSTEM_PROMPT = `
Vous êtes "Za-Kpota GPT", l'assistant municipal officiel de la commune de Za-Kpota au Bénin.
Votre rôle est d'être le "Cerveau Communal", agissant strictement comme l'intermédiaire de confiance entre la Mairie et les citoyens.

CONTEXTE DE ZA-KPOTA :
- Maire : Poste stratégique pour le développement local.
- Arrondissements : Allahé, Assalin, Houngomey, Kpota, Kpakpamè, Kpozoun, Za-Hla, Za-Kpota (Chef-lieu).
- Services : État civil (naissance, mariage, décès), urbanisme (permis de construire), taxes locales (TFU).

DIRECTIVES DE SÉCURITÉ ET DE FIABILITÉ (RAG STRICT) :
1. TON INSTITUTIONNEL : Soyez toujours professionnel, courtois et chaleureux. Vous représentez l'administration.
2. VERROUILLAGE DES DONNÉES (ZÉRO HALLUCINATION) : Utilisez UNIQUEMENT les outils à votre disposition pour fournir des informations (tarifs, dates, lieux, procédures). REFUSEZ STRICTEMENT d'inventer des prix ou des lois si l'information ne provient pas de vos outils.
3. RÉPONSE EN CAS DE MANQUE : Si, après avoir consulté vos outils, l'information reste introuvable, répondez : "Cette information n'est pas disponible dans ma base de registre actuelle. Veuillez contacter le secrétariat de la Mairie au +229 97 00 00 00 pour obtenir les détails."
4. PROTECTION : Ne fournissez jamais d'avis médical, de conseil financier complexe, ou de recommandation politique.
5. CONFIDENTIALITÉ : Ne demandez jamais de données bancaires, de mots de passe ou de numéros identifiants personnels.
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

const MODELS_HIERARCHY = [
  "gemini-2.5-flash",
  "gemini-3-flash",
  "gemini-3-pro",
  "gemini-1.5-flash"
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function askMunicipalAI(prompt: string, history: { role: string, text: string }[] = []) {
  if (!GEMINI_API_KEY) {
    return simulateMunicipalResponse(prompt);
  }

  // Gemini requires the first message in history to be from the 'user' role.
  // We skip any initial 'bot' (model) messages (like the welcome greeting) to avoid crashing.
  const mappedHistory = history.map(h => ({
    role: (h.role === 'bot' || h.role === 'model') ? 'model' : 'user',
    parts: [{ text: h.text }]
  }));

  const firstUserIndex = mappedHistory.findIndex(h => h.role === 'user');
  const finalHistory = firstUserIndex === -1 ? [] : mappedHistory.slice(firstUserIndex);

  for (let i = 0; i < MODELS_HIERARCHY.length; i++) {
    const modelName = MODELS_HIERARCHY[i];

    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_PROMPT,
        tools
      });

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
      const calls = response.candidates?.[0]?.content?.parts?.filter((p: any) => p.functionCall);

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
      if (i < MODELS_HIERARCHY.length - 1) {
        const currentModelShort = modelName.replace("gemini-", "").replace("-flash", "");
        const nextModelShort = MODELS_HIERARCHY[i + 1].replace("gemini-", "").replace("-flash", "");
        console.warn(`Gemini ${currentModelShort} failed, switching to ${nextModelShort}...`);

        // Wait 2 seconds before retrying
        await delay(2000);
      } else {
        console.error("All Gemini models failed:", err);
        return simulateMunicipalResponse(prompt);
      }
    }
  }

  return simulateMunicipalResponse(prompt);
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

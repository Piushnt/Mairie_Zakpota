/**
 * Za-Kpota GPT - Gemini AI Integration Service
 * This service handles communication with the Google Gemini API.
 * It includes a system prompt tailored to the municipal context of Za-Kpota.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_MODEL = "gemini-1.5-flash";

const SYSTEM_PROMPT = `
Vous êtes "Za-Kpota GPT", l'assistant municipal officiel de la commune de Za-Kpota au Bénin.
Votre mission est d'aider les citoyens avec des informations précises, courtoises et utiles sur les services de la mairie.

CONTEXTE DE ZA-KPOTA :
- Maire : Poste stratégique pour le développement local.
- Arrondissements : Allahé, Assalin, Houngomey, Kpota, Kpakpamè, Kpozoun, Za-Hla, Za-Kpota (Chef-lieu).
- Services : État civil (naissance, mariage, décès), urbanisme (permis de construire), taxes locales (TFU).
- Économie : Cycle de marché de 5 jours, agriculture, artisanat dynamique.
- Infrastructures : Stade municipal, écoles, centres de santé.

DIRECTIVES :
1. Soyez toujours professionnel et chaleureux.
2. Si vous ne connaissez pas une information spécifique, invitez l'usager à contacter le secrétariat au +229 97 00 00 00.
3. Encouragez l'utilisation des services en ligne du portail (suivi de dossier, simulateur fiscal).
4. Répondez en français clair.
`;

export async function askMunicipalAI(prompt: string, history: { role: string, text: string }[] = []) {
  if (!GEMINI_API_KEY) {
    console.warn("Gemini API Key missing. Using municipal simulation mode.");
    return simulateMunicipalResponse(prompt);
  }

  try {
    const contents = [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      ...history.map(h => ({
        role: h.role === 'bot' ? 'model' : 'user',
        parts: [{ text: h.text }]
      })),
      { role: "user", parts: [{ text: prompt }] }
    ];

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    const data = await response.json();
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    throw new Error("Invalid response from Gemini");
  } catch (err) {
    console.error("Gemini API Error:", err);
    return simulateMunicipalResponse(prompt);
  }
}

/**
 * Fallback simulation based on local knowledge for when API is unavailable or key is missing.
 */
function simulateMunicipalResponse(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('naissance')) {
    return "Pour un acte de naissance à Za-Kpota, vous devez fournir la fiche de déclaration de l'hôpital et les pièces d'identité des parents. Le coût est de 500 FCFA. Vous pouvez suivre l'état de votre demande dans l'onglet 'Services'.";
  }
  if (lowerPrompt.includes('marché') || lowerPrompt.includes('cycle')) {
    return "Le grand marché de Za-Kpota suit un cycle tournant de 5 jours. Pour connaître la date du prochain marché, consultez notre page 'Économie' qui affiche le calendrier en temps réel.";
  }
  if (lowerPrompt.includes('maire')) {
    return "Le conseil municipal de Za-Kpota travaille activement sur des projets d'électrification et d'assainissement. Pour un rendez-vous officiel, veuillez utiliser le formulaire de contact ou appeler le secrétariat.";
  }
  if (lowerPrompt.includes('stade')) {
    return "Le stade municipal est disponible pour les compétitions et entraînements. Les réservations se font directement en ligne sur ce portail via la page dédiée au Stade.";
  }
  if (lowerPrompt.includes('artisan')) {
    return "La Mairie dispose d'un annuaire des artisans certifiés. Vous pouvez trouver un menuisier, maçon ou électricien dans la section 'Économie' de notre site.";
  }

  return "Je suis navré, je n'ai pas pu trouver l'information précise sur ce sujet. Je vous suggère de vous rapprocher de la Mairie Centrale de Za-Kpota ou d'appeler le +229 97 00 00 00.";
}

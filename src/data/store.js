
export const initialStoreData = {
  services: {
    "etat-civil": [
      {
        "id": "naissance",
        "name": "Acte de Naissance (Sécurisé)",
        "description": "Demande d'acte de naissance sécurisé via l'ANIP.",
        "pieces": ["Numéro Personnel d'Identification (NPI)", "Copie de l'ancien acte de naissance"],
        "cost": 1000,
        "delay": "48h",
        "link": "https://eservices.anip.bj/"
      },
      {
        "id": "mariage",
        "name": "Célébration de Mariage",
        "description": "Formalités pour la célébration de mariage civil à la mairie.",
        "pieces": ["Actes de naissance des futurs époux", "Certificats de résidence", "Pièces d'identité des témoins"],
        "cost": 50000,
        "delay": "21 jours (publication des bans)",
        "link": null
      },
      {
        "id": "deces",
        "name": "Acte de Décès",
        "description": "Déclaration et établissement d'acte de décès.",
        "pieces": ["Certificat de constatation de décès", "Pièce d'identité du défunt", "Pièce d'identité du déclarant"],
        "cost": 2000,
        "delay": "24h",
        "link": null
      }
    ],
    "urbanisme": [
      {
        "id": "permis-construire",
        "name": "Permis de Construire",
        "description": "Autorisation nécessaire pour toute construction nouvelle ou modification.",
        "pieces": ["Titre de propriété", "Plans architecturaux visés", "Levé topographique"],
        "cost": 150000,
        "delay": "45 jours",
        "link": null
      }
    ]
  },
  agenda: [
    {
      "id": 1,
      "title": "Tournoi de l'Indépendance - Stade Municipal",
      "date": "2026-08-01",
      "type": "Sport",
      "description": "Grande finale du tournoi inter-arrondissements réunissant les meilleurs talents de la commune.",
      "location": "Stade Municipal de Za-Kpota",
      "img": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800"
    },
    {
      "id": 2,
      "title": "Fête de la Gnon-Nan",
      "date": "2026-12-20",
      "type": "Culture",
      "description": "Célébration annuelle des traditions locales avec danses, chants et foire artisanale.",
      "location": "Place Publique de Za-Tanta",
      "img": "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800"
    }
  ],
  stade: {
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200",
    equipements: [
      "Pelouse synthétique FIFA",
      "Éclairage nocturne",
      "Vestiaires modernes",
      "Tribune de 5 000 places",
      "Piste d'athlétisme"
    ]
  },
  flashNews: "Bienvenue sur le portail officiel de la Mairie de Za-Kpota. Suivez toute l'actualité de votre commune en temps réel.",
  reports: [
    {
      id: 1,
      title: "Rapport de Session Communale - Mars 2026",
      date: "2026-03-15",
      type: "Session Communale",
      category: "Sessions",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      year: "2026"
    },
    {
      id: 2,
      title: "Budget Primitif 2026",
      date: "2026-01-10",
      type: "Rapport d'Activité",
      category: "Finances",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      year: "2026"
    }
  ],
  notifications: [
    { id: 1, title: "Nouveau service", message: "Le simulateur fiscal est désormais disponible.", date: new Date().toISOString(), read: false }
  ],
  arrondissements: [
    { id: "1", nom: "Allahé", ca: "M. SOSSOU", contact: "+229 97 00 01 01", localisation: "Zone Nord", quartiers: ["Quartier A", "Quartier B", "Quartier C"], image: "https://images.unsplash.com/photo-1523805081446-ed9a96a2b5d3?auto=format&fit=crop&q=80&w=800" },
    { id: "2", nom: "Assalin", ca: "Mme. HOUNKPONOU", contact: "+229 97 00 01 02", localisation: "Zone Est", quartiers: ["Quartier D", "Quartier E"], image: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&q=80&w=800" },
    { id: "3", nom: "Houngomey", ca: "M. ADJOVI", contact: "+229 97 00 01 03", localisation: "Zone Ouest", quartiers: ["Quartier F", "Quartier G", "Quartier H"], image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=800" },
    { id: "4", nom: "Kpoidon", ca: "M. GBEGNON", contact: "+229 97 00 01 04", localisation: "Zone Sud", quartiers: ["Quartier I", "Quartier J"], image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=800" },
    { id: "5", nom: "Za-Kpota", ca: "M. DANWOUIGNAN", contact: "+229 97 00 01 05", localisation: "Centre-Ville", quartiers: ["Quartier K", "Quartier L", "Quartier M"], image: "https://images.unsplash.com/photo-1523213139764-4152559d3be3?auto=format&fit=crop&q=80&w=800" },
    { id: "6", nom: "Za-Tanta", ca: "M. KOFFI", contact: "+229 97 00 01 06", localisation: "Zone Sud-Est", quartiers: ["Quartier N", "Quartier O"], image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=800" },
    { id: "7", nom: "Zèko", ca: "M. VODOUHE", contact: "+229 97 00 01 07", localisation: "Zone Nord-Ouest", quartiers: ["Quartier P", "Quartier Q"], image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800" },
    { id: "8", nom: "Lemè", ca: "M. TOHOUE", contact: "+229 97 00 01 08", localisation: "Zone Nord-Est", quartiers: ["Quartier R", "Quartier S"], image: "https://images.unsplash.com/photo-1520116468816-95b69f847357?auto=format&fit=crop&q=80&w=800" }
  ],
  opportunites: [
    { id: "1", titre: "Appel d'offres : Réhabilitation pistes", type: "appel_offre", dateLimite: "2026-03-20", statut: "ouvert", description: "Travaux de réhabilitation des pistes rurales.", contact: "Direction des Services Techniques" },
    { id: "2", titre: "Recrutement : Agents de salubrité", type: "recrutement", dateLimite: "2026-03-25", statut: "urgent", description: "La mairie recrute 10 agents pour la brigade verte.", contact: "DRH Mairie" },
    { id: "3", titre: "Foire Agricole de Za-Kpota", type: "foire", dateLimite: "2026-04-05", statut: "ouvert", description: "Exposition-vente des produits locaux.", contact: "Service Économique" }
  ],
  news: [],
  rendezvous: [],
  reservationsStade: [],
  configMarche: {
    referenceDate: "2026-03-15", // Date d'un jour de marché connu
    cycleDays: 5,
    reminderDays: 1
  },
  formulaires: [],
  tax_settings: {},
  locations: [],
  audiences: [],
  council: [],
  council_roles: []
};

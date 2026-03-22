export const servicesData = {
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
    },
    {
      "id": "certificat-vie",
      "name": "Certificat de Vie & Entretien",
      "description": "Attestation prouvant qu'une personne est en vie.",
      "pieces": ["Pièce d'identité", "Présence physique de l'intéressé"],
      "cost": 500,
      "delay": "Immédiat",
      "link": null
    },
    {
      "id": "legalisation",
      "name": "Légalisation de Signature",
      "description": "Certification de l'authenticité d'une signature sur un document.",
      "pieces": ["Document à légaliser", "Pièce d'identité originale"],
      "cost": 500,
      "delay": "Immédiat",
      "link": null
    },
    {
      "id": "copie-conforme",
      "name": "Certification de Copie Conforme",
      "description": "Attestation de la conformité d'une copie par rapport à l'original.",
      "pieces": ["Original du document", "Photocopie à certifier"],
      "cost": 200,
      "delay": "Immédiat",
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
    },
    {
      "id": "recasement",
      "name": "Attestation de Recasement",
      "description": "Document confirmant l'attribution d'une parcelle dans une zone lotie.",
      "pieces": ["Convention de vente", "Fiche de recensement", "Pièce d'identité"],
      "cost": 25000,
      "delay": "30 jours",
      "link": null
    },
    {
      "id": "certificat-urbanisme",
      "name": "Certificat d'Urbanisme",
      "description": "Document informant sur les règles d'urbanisme applicables à un terrain.",
      "pieces": ["Plan de situation", "Extrait de levé topographique"],
      "cost": 10000,
      "delay": "15 jours",
      "link": null
    }
  ]
};

export const agendaData = {
  "events": [
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
  "stade": {
    "image": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=1200",
    "nextMatches": [
      { "teams": "AS Za-Kpota vs Dekpo FC", "time": "16:00", "date": "Dimanche prochain" },
      { "teams": "Allahé Stars vs Tanta United", "time": "15:30", "date": "Samedi prochain" }
    ],
    "results": [
      { "teams": "Za-Kpota vs Allahé", "score": "2 - 1", "status": "Terminé" }
    ],
    "equipements": [
      "Pelouse synthétique aux normes FIFA",
      "Piste d'athlétisme 400m",
      "Vestiaires modernes avec douches",
      "Éclairage nocturne haute performance",
      "Tribune de 5 000 places",
      "Parking sécurisé"
    ]
  }
};

export const tourismData = {
  "eat": [
    { "name": "Maquis Le Relais", "specialty": "Pâte rouge & Poulet bicyclette", "location": "Centre-ville" },
    { "name": "Resto La Paix", "specialty": "Riz gras & Poisson frit", "location": "Près du marché" }
  ],
  "sleep": [
    { "name": "Auberge de la Vallée", "price": "15.000 FCFA / nuit", "contact": "+229 97 00 00 01" },
    { "name": "Hôtel Le Municipal", "price": "25.000 FCFA / nuit", "contact": "+229 97 00 00 02" }
  ],
  "patrimoine": {
    "history": "Za-Kpota, située dans le département du Zou, est une commune riche en histoire. Elle est composée de plusieurs arrondissements dont Allahé, Za-Tanta, Dekpo, et Za-Kpota centre. Son nom évoque la résilience et l'attachement aux terres ancestrales.",
    "districts": ["Allahé", "Assalin", "Houngomey", "Kpakpamè", "Koundokpo", "Za-Kpota", "Za-Tanta", "Zèko"]
  }
};

export const galleryData = [
  { "url": "https://images.unsplash.com/photo-1523800503107-5bc3ba2a6f81", "caption": "Paysage verdoyant de Za-Kpota" },
  { "url": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4", "caption": "Architecture traditionnelle locale" },
  { "url": "https://images.unsplash.com/photo-1533900298318-6b8da08a523e", "caption": "Le marché animé de Za-Kpota" },
  { "url": "https://images.unsplash.com/photo-1541675154750-0444c7d51e8e", "caption": "Événement culturel communautaire" }
];

export const maireData = {
  name: "Félicien DANWOUIGNAN",
  photo: "/img/membres/maire.jpg",
  biography: "Né à Za-Kpota, Félicien DANWOUIGNAN est un fervent défenseur du développement local. Diplômé en Gestion des Collectivités Locales, il a consacré sa carrière à l'amélioration des conditions de vie de ses concitoyens. Élu Maire en 2020, il porte une vision de modernisation et de transparence pour la commune.",
  mot: "Chers concitoyens, notre engagement est de faire de Za-Kpota une commune moderne, où chaque citoyen a accès à des services de qualité. La digitalisation est au cœur de notre action pour plus de transparence et d'efficacité. Bâtissons ensemble le Za-Kpota de demain.",
  vision: [
    "Modernisation de l'administration communale",
    "Développement des infrastructures routières et hydrauliques",
    "Promotion de l'éducation et de la santé pour tous",
    "Valorisation du patrimoine culturel et touristique"
  ]
};

export const conseilMunicipal = [
  { name: "Félicien DANWOUIGNAN", role: "Maire", photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200" },
  { name: "Marc TOSSOU", role: "1er Adjoint au Maire", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200" },
  { name: "Sophie AGOSSOU", role: "2ème Adjointe au Maire", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200" },
  { name: "Jean-Baptiste KPANOU", role: "Secrétaire Exécutif", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200" }
];

export const arrondissementsData = [
  { 
    name: "Allahé", 
    population: "12,500", 
    chef: "M. SOSSOU", 
    description: "Arrondissement agricole réputé pour sa production de maïs et de manioc.",
    img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
    coords: [7.2833, 2.2500]
  },
  { 
    name: "Assalin", 
    population: "8,200", 
    chef: "Mme. HOUNKPONOU", 
    description: "Zone calme et paisible, Assalin est le berceau de nombreuses traditions orales.",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    coords: [7.2167, 2.1833]
  },
  { 
    name: "Houngomey", 
    population: "10,100", 
    chef: "M. ADJOVI", 
    description: "Carrefour commercial important reliant les villages environnants.",
    img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800",
    coords: [7.2500, 2.2333]
  },
  { 
    name: "Kpakpamè", 
    population: "15,400", 
    chef: "M. GBEGNON", 
    description: "Arrondissement dynamique avec une forte activité artisanale.",
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800",
    coords: [7.2000, 2.2667]
  },
  { 
    name: "Koundokpo", 
    population: "9,800", 
    chef: "M. TOHOUE", 
    description: "Réputé pour ses paysages vallonnés et ses sources d'eau naturelle.",
    img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800",
    coords: [7.1833, 2.2167]
  },
  { 
    name: "Za-Kpota", 
    population: "25,600", 
    chef: "M. DANWOUIGNAN (Maire)", 
    description: "Le centre administratif et économique de la commune, abritant l'Hôtel de Ville.",
    img: "https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&q=80&w=800",
    coords: [7.2333, 2.2167]
  },
  { 
    name: "Za-Tanta", 
    population: "14,200", 
    chef: "M. KOFFI", 
    description: "Pôle culturel majeur accueillant les grandes festivités annuelles.",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800",
    coords: [7.2667, 2.2000]
  },
  { 
    name: "Zèko", 
    population: "11,300", 
    chef: "M. VODOUHE", 
    description: "Zone en pleine expansion urbaine avec de nouveaux projets d'infrastructure.",
    img: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=800",
    coords: [7.2167, 2.2833]
  }
];

export const histoireData = {
  origine: `Histoire résumée de ZA-KPOTA
Bienvenue à Za-Kpota ! 
Bienvenue dans la ville natale de la virtuose Sessimè!

Bienvenue sur la terre de kpolihamou encore connu sous le nom de Aitchi,le fondateur de Za-Kpota. 
Maître féticheur et menuisier du roi Ghézo, Aïtchi était la deuxième personne à rejoindre son ami Dagba qui avait déjà offert l'hospitalité à Daka, un autre ami à lui, sur les paisibles terres qui lui servaient de refuge face aux guerres qui faisaient rage à l'époque. La région où ils s'étaient tous trois établis, était propice à la culture du blé et du maïs, en plus d'avoir de grands atouts pour la chasse. Avant l'arrivée de chacun de ses deux amis, Dagba s'était établi avec sa famille sur les bords du petit cours d'eau qui traversait sa zone de refuge. Cet endroit avait été surnommé Za-Kékéré par des voyageurs Yorubas qui étaient parvenus à cette appellation en raison de la petitesse du cours d'eau, « kékéré » signifiant  « petit » en Yoruba. En refusant de s'installer à côté de Dagba à Za-Kékéré, Daka choisit un lieu qu'il désigna par  « Minnawa » qui signifie en fon «Des gens viendront ». Ce lieu fut appelé plus tard «Za Zounmê ». A son arrivée sur ces mêmes terres, Aïtchi dont le fétiche avait les cris de singes pour interdits, éprouva la nécessité de s'éloigner des terres bondées de singes où vivaient ses deux amis. Ses amis lui suggérèrent alors de s'installer à un endroit plus en hauteur dans la zone. Aïtchi fit alors cela et l'on désigna par « Za-Kpota », l'endroit où il s'était installé , « kpota » signifiant en langue Fon "lieu situé en hauteur". De la notoriété que connut Aïtchi dans cette région située en hauteur, découla la célébrité de Za-Kpota qui évolua par la suite pour désigner toute la zone qu'habitaient les trois amis.`,
  culture: `C'est donc à la découverte de cette commune qui tire son nom des vertus d'amitié, d'hospitalité et de fraternité que le Président Patrice TALON et sa délégation nous amènent à travers la troisième étape de la quatorzième journée de sa tournée de reddition de compte au souverain peuple béninois. 
D'une superficie de 409 km², Za-Kpota est l'une des neuf communes du département du Zou. Limitée au Nord-Ouest par la commune de Djidja, au Nord-est par la commune de Zagnanando, au Sud- ouest par la commune de Bohicon, à l’Est par la commune de Covè et au Sud-est par la commune de Zogbodomey, Za-Kpota est composée de 56 villages et quartiers de ville répartis entre les huit arrondissements que sont : Allahé, Assalin, Houngomey, Kpakpamè, Kpozoun, Tanta, Za-Kpota et Zèko. Elle est principalement habitée par les Mahi, les Yoruba et les Dendi. Les religions endogènes sont pratiquées par environ 75, 4% de sa population, contre 7,7% pour le catholicisme, 1,1% pour le protestantisme, 0,5% pour l'islam et 15,3% pour le reste des religions. 

Commune aux innombrables atouts pour l'agriculture, le maïs, le niébé, la tomate, le manioc, le sorgho, l'igname, le taro, les cultures maraîchères, l'orange et l'anacarde y sont abondamment produits au même titre que le coton et l'arachide qui en sont les produits de rente. Mais l'économie de la commune de Zakpota repose aussi sur l'élevage, la chasse, l'artisanat, la pêche et l'exploitation des gisements de sable, de latérite, de gravillon et de granite.

Za-Kpota, c'est aussi l'immense patrimoine culturel du plateau d'Abomey avec ses chants, ses danses, ses rites, son art culinaire, sa tradition, ses nombreuses divinités et surtout les glorieuses histoires de chacun des rois du Danxomè, de Houégbadja à Agoli-Agbo. Au nombre des cadres et personnalités qui en ont porté haut l'étendard sur la scène politique et administrative du Bénin figurent Georges Guedou, Juste Guedou, Boniface Yèhouétomè, le Préfet Firmin Kouton.

À l'instar des autres communes du Bénin, Za-Kpota es bien au cœur du développement harmonieux du Bénin à travers la mise en œuvre du Programme  « Le Bénin Révélé».  La construction de la route Covè - Banamè et Koguédé - Za-Kpota, longue de 74, 200 km est l'un des nombreux projets novateurs dont bénéficient les populations de cette commune sans compter les bienfaits des pertinentes réalisations intervenues sur fond de réformes dans les domaines de l'agriculture, de l'élevage, de la pêche et de la modernisation de l'administration publique.`,
  sites: [
    { 
      name: "Le berceau d'Aïtchi", 
      description: "Situé sur les hauteurs de la commune, ce site historique marque l'emplacement originel choisi par Aïtchi pour fuir les cris de singes de la vallée. C'est le cœur identitaire de Za-Kpota, symbole d'hospitalité et de fraternité.",
      img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
    },
    { 
      name: "Za-Kékéré", 
      description: "Le site originel sur les bords du petit cours d'eau où Dagba offrit l'hospitalité à ses amis, marquant le début de l'histoire de cette région propice à la culture du maïs et du blé.",
      img: "https://images.unsplash.com/photo-1523800503107-5bc3ba2a6f81?auto=format&fit=crop&q=80&w=800"
    }
  ]
};

export const partnersData = [
  { name: "Gouvernement du Bénin", logo: "/img/partenaire/gouvernement.png" },
  { name: "ANIP Bénin", logo: "/img/partenaire/anip_benin.jpg" },
  { name: "Union Européenne", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/1200px-Flag_of_Europe.svg.png" },
  { name: "Banque Mondiale", logo: "/img/partenaire/banque_mondiale.png" },
  { name: "PNUD Bénin", logo: "/img/partenaire/PNUD_benin.jpg" },
  { name: "AFD", logo: "/img/partenaire/afd.jpg" }
];

export const newsData = [
  {
    id: 1,
    title: "Installation du nouveau Conseil Municipal",
    date: "15 Mars 2026",
    cat: "Gouvernance",
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    desc: "Le nouveau conseil municipal a été officiellement installé ce lundi lors d'une cérémonie solennelle présidée par le Préfet du Zou."
  },
  {
    id: 2,
    title: "Lancement du projet de bitumage des axes principaux",
    date: "12 Mars 2026",
    cat: "Infrastructure",
    img: "https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?auto=format&fit=crop&q=80&w=800",
    desc: "Les travaux de bitumage de la route principale reliant Za-Kpota à Allahé ont débuté, marquant une nouvelle ère pour la mobilité locale."
  },
  {
    id: 3,
    title: "Campagne de vaccination gratuite dans les arrondissements",
    date: "10 Mars 2026",
    cat: "Santé",
    img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
    desc: "Une vaste campagne de vaccination contre les maladies infantiles est organisée dans tous les centres de santé de la commune."
  },
  {
    id: 4,
    title: "Inauguration du nouveau marché de Za-Tanta",
    date: "05 Mars 2026",
    cat: "Économie",
    img: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&q=80&w=800",
    desc: "Le Maire a inauguré le nouveau hangar du marché de Za-Tanta, offrant de meilleures conditions aux commerçants et usagers."
  },
  {
    id: 5,
    title: "Forum sur l'entrepreneuriat des jeunes à Za-Kpota",
    date: "01 Mars 2026",
    cat: "Jeunesse",
    img: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800",
    desc: "Plus de 200 jeunes ont participé au premier forum communal sur l'entrepreneuriat agricole et numérique."
  },
  {
    id: 6,
    title: "Don de kits scolaires aux meilleurs élèves",
    date: "25 Février 2026",
    cat: "Éducation",
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800",
    desc: "La mairie a récompensé les meilleurs élèves de la commune par des kits scolaires complets pour encourager l'excellence."
  },
  {
    id: 7,
    title: "Réhabilitation des points d'eau à Houngomey",
    date: "20 Février 2026",
    cat: "Social",
    img: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=800",
    desc: "Trois nouveaux forages ont été réhabilités dans l'arrondissement de Houngomey pour assurer l'accès à l'eau potable."
  },
  {
    id: 8,
    title: "Sensibilisation sur la protection de l'environnement",
    date: "15 Février 2026",
    cat: "Environnement",
    img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
    desc: "Une journée de salubrité et de sensibilisation a été organisée pour lutter contre la pollution plastique."
  }
];

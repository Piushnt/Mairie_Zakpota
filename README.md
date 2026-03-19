## Run Locally

**Prerequisites:**# Mairie de Za-Kpota - Portail Officiel 🇧🇯

Portail professionnel et citoyen de la commune de Za-Kpota, Bénin.

## Structure & Fonctionnalités

### 📱 Responsive Design (Mobile-First)
L'application est optimisée pour une expérience fluide sur mobile (360x740px) :
- **Drawer Navigation** : Menu latéral intuitif sur mobile.
- **Grilles Dynamiques** : Adaptation automatique des services du format GRID au format LISTED sur petits écrans.
- **Accessibilité** : Zones de clic minimales de 44px pour une navigation tactile sans erreur.

### 🏛️ Dashboard Secrétaire Exécutif (SE)
Un portail d'administration dédié permet la gestion dynamique de la commune :
- **Tarifs des Actes** : Mise à jour instantanée des coûts des services (État Civil, Urbanisme).
- **Arrondissements** : Gestion des contacts des Chefs d'Arrondissement (CA).
- **Planning du Stade** : Calendrier des événements sportifs et réservations du stade municipal.
- **Bandeau d'Alerte** : Diffusion de Flash News en temps réel avec notifications.

## Technologies
- **React 19** + **Vite**
- **Tailwind CSS v4** (Branding Gouv.bj)
- **Framer Motion** (Animations Drawer & Transitions)
- **Lucide React** (Iconographie)
Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

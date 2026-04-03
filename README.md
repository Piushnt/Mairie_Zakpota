# Mairie de Za-Kpota - Portail Za-Kpota 2.0 (E-Administration) 🇧🇯

Portail professionnel, transactionnel et citoyen de la commune de Za-Kpota, Bénin. Transformé en plateforme d'e-administration complète en 2026.

## 🚀 Fonctionnalités Clés (v2.0)

### 📂 E-Administration & Suivi de Dossiers
- **Suivi en temps réel** : Les citoyens peuvent suivre l'état d'avancement de leurs actes (naissance, permis de construire) via un code unique.
- **Paiements Mobiles** : Intégration de simulations de paiement (Kkiapay) pour les frais de dossier.
- **Participation Citoyenne** : Système de sondages interactifs et budget participatif.

### 🤖 Za-Kpota GPT (IA Municipale)
- **Assistant Dédié** : Intégration de l'IA Google Gemini pour répondre aux questions des usagers sur les démarches administratives, le cycle des marchés et l'histoire locale.
- **Mobile-First** : Experience optimisée pour smartphones avec suggestions de questions.

### 🛠️ Dashboard SE (Secrétaire Exécutif)
- **Gestion Dynamique** : CRUD complet pour les dossiers, les artisans locaux et les sondages.
- **Analytics Temps Réel** : Visualisation des statistiques de la commune (nombre de dossiers, artisans, taux de satisfaction).
- **Mode Sombre Natif** : Design premium par défaut pour un confort de travail accru.

## 🛠️ Stack Technique
- **Frontend** : React 19 + Vite + TypeScript.
- **Styling** : Tailwind CSS v4 + Framer Motion.
- **Backend** : Supabase (Database & Auth).
- **IA** : Google Gemini API (1.5 Flash).

## 🎛️ Configuration & Déploiement

### 1. Variables d'Environnement
Créez un fichier `.env` à la racine :
```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon
VITE_GEMINI_API_KEY=votre_cle_gemini
```

### 2. Installation Locales
```bash
npm install
npm run dev
```

### 3. Production (Vercel)
L'application est configurée pour un déploiement fluide sur Vercel. Assurez-vous de renseigner les variables d'environnement dans le tableau de bord Vercel.

---
*© 2026 Mairie de Za-Kpota - Direction du Numérique.*

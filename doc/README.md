# Mairie Connect - Plateforme Municipale SaaS (v2.0) 🏛️🇧🇯

Portail professionnel et citoyen de nouvelle génération, initialement conçu pour la **Mairie de Za-Kpota**, Bénin. Cette application transforme la communication municipale en une plateforme d'e-administration interactive et intelligente.

## 🚀 Fonctionnalités Avancées (Sprint Social & IA)

### 📢 Actualités & Engagement Citoyen
- **News Rich Media** : Actualités enrichies avec images haute définition, catégories dynamiques.
- **Système de Likes Réels** : Engagement authentique des citoyens via Supabase.
- **Partage Social Multi-Canal** : WhatsApp, Telegram et API native Navigator Share.

### 🤖 Assistant IA Municipal (Gemini)
- **Assistant Dédié** : Intégration de **Google Gemini 1.5 Flash** pour répondre aux questions sur les procédures, l'histoire et l'économie locale.
- **Interface Flottante** : Accessible sur toutes les pages pour un support instantané.

### 🔔 Notifications Push Rich Media
- **Alertes Visuelles** : Notifications natives avec logos et images d'illustration des articles.
- **Deep Linking** : Ouverture directe de l'article sur clic depuis la notification mobile.

### 🛠️ Dashboard Admin & IA
- **Pilotage de Contenu** : CRUD complet pour les news, rapports et opportunités économiques.
- **Assistant IA Admin** : Aide à la rédaction et à l'analyse des rapports officiels.

## 🛠️ Stack Technique
- **Frontend** : React 19 + Vite + TypeScript.
- **Styling** : Tailwind CSS v4 + Framer Motion.
- **Backend & Temps Réel** : Supabase (Database, Auth, RPC).
- **IA Engine** : Google Gemini API.
- **PWA** : Service Worker personnalisé pour le Push et le mode hors-ligne.

## 💾 Installation & Configuration

### 1. Variables d'Environnement
```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon
VITE_GEMINI_API_KEY=votre_cle_gemini
VITE_VAPID_PUBLIC_KEY=votre_cle_vapid_publique
```

### 2. Démarrage Rapide
```bash
npm install
npm run dev
```

### 3. Backend (Likes & Social)
Exécutez le script SQL `setup_news_likes.sql` dans votre instance Supabase pour activer les compteurs de likes réels.

---
*© 2026 Mairie Connect - Écosystème Numérique Communal.*

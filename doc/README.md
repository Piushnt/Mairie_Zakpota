# Mairie Connect - Plateforme Municipale SaaS (v2.0) 🏛️🇧🇯

Portail professionnel et citoyen de nouvelle génération, initialement conçu pour la **Mairie de Za-Kpota**, Bénin. Cette application transforme la communication municipale en une plateforme d'e-administration interactive et intelligente.

## 🚀 Fonctionnalités Avancées (Sprint Social & IA)

### 📢 Actualités & Engagement Citoyen
- **News Rich Media** : Actualités enrichies avec images haute définition, catégories dynamiques.
- **Système de Likes Réels** : Engagement authentique des citoyens via Supabase.
- **Partage Social Multi-Canal** : WhatsApp, Telegram et API native Navigator Share.

### 🤖 Assistant IA Municipal (Cerveau Communal)
- **Chaîne "Incassable" (Fallback)** : Bascule automatique transparente entre `gemini-3-flash`, `gemini-3-pro`, `gemini-2.5-flash` et `gemini-1.5-flash` en cas de saturation ou panne.
- **Zéro Hallucination (RAG)** : IA officiellement verrouillée sur les procédures de la mairie. Refuse d'inventer des prix ou des lois non confirmés par la base de données.
- **Interface Flottante** : Accessible sur toutes les pages pour un support instantané.

### 🔔 Notifications Push Rich Media
- **Alertes Visuelles** : Notifications natives avec logos et images d'illustration des articles.
- **Deep Linking** : Ouverture directe de l'article sur clic depuis la notification mobile.

### 🛠️ Dashboard Admin & IA (Sécurisé RBAC)
- **Contrôle d'Accès (RBAC)** : Architecture à deux niveaux (Admin SE/DSI vs Employés) avec Approbation Manuelle obligatoire.
- **Journal d'Audit (Souveraineté)** : Historique complet et inaltérable de toutes les actions administratives.
- **Pilotage de Contenu** : CRUD complet pour les news, rapports et opportunités économiques.
- **IA de Gestion** : Assistant IA dédié aux administrateurs pour l'analyse des rapports et l'aide à la rédaction.

## 🛠️ Stack Technique
- **Frontend** : React 19 + Vite + TypeScript.
- **Styling** : Tailwind CSS v4 + Framer Motion.
- **Base de Données** : Intégration complète avec Supabase (Politiques RLS strictes).
- **Sécurité RAG & RBAC** : Initialisation via `setup_rbac_audit.sql` pour la traçabilité des actions.
- **IA Engine** : Google Gemini API avecFallback ultra-résiliente.
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

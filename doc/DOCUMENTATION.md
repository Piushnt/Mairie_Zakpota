# Documentation Détaillée - Plateforme Mairie Connect (SaaS)

## 1. Présentation
Ce projet est une application web de nouvelle génération pour les administrations communales, initialement déployée pour la **Mairie de Za-Kpota**. L'architecture 2.0 est conçue pour être scalable, performante (PWA) et centrée sur l'expérience citoyenne.

## 2. Fonctionnalités & Innovations

### 2.1 Services Citoyens & E-Administration (Prêt)
- **Portails Thématiques** : État Civil, Urbanisme, Économie, et Social avec fiches de procédures (pièces, coûts, délais).
- **Simulateur Fiscal** : Calculateur dynamique pour les taxes locales (ABEP, etc.).
- **Signalement Citoyen** : Système de feedback géolocalisé avec photos.
- **Prise de Rendez-vous** : Calendrier intelligent pour consulter les services municipaux.

### 2.2 Communication & Engagement (Nouveau - Connecté)
- **Actualités Rich Media** : Système de news avec support des **Likes réels** (via Supabase) et partage social avancé.
- **Notifications Push Rich Media** : Alertes avec images d'illustration et logos (Service Worker PWA).
- **Intelligence Artificielle (Gemini)** : Assistant Municipal capable de répondre aux questions sur les procédures et l'histoire de la ville.
- **Recherche Globale** : Modal de recherche instantanée sur tout le contenu du site.

### 2.3 Administration & Pilotage (Connecté)
- **Dashboard Admin 2.0** : Interface unifiée pour gérer les news, les rapports, les offres d'emploi et les sondages.
- **IA de Gestion** : Assistant IA dédié aux administrateurs pour l'analyse des rapports et l'aide à la rédaction.
- **Gestion des Opportunités** : Publication d'appels d'offres et d'offres de recrutement avec interface de consultation optimisée (Scroll Lock, Modals responsive).

### 2.4 Infrastructure SaaS & Backend
- **Base de Données** : Intégration complète avec **Supabase** (PostgreSQL).
- **IA Engine** : Basé sur le SDK Google Generative AI (`gemini-1.5-flash`).
- **PWA (Progressive Web App)** : Installation sur mobile, mode hors-ligne partiel et notifications natives.

## 3. Architecture Technique
- **Framework** : React 19 + Vite.
- **Styling** : Tailwind CSS v4 (Design System basé sur des variables CSS sémantiques).
- **Animations** : Framer Motion pour des transitions fluides.
- **Déploiement** : Optimisé pour **Vercel** (Serverless Functions pour le Push).

## 4. Guide de Configuration (Backend real-time)
Pour activer les fonctionnalités sociales (Likes, etc.), importez le script SQL suivant dans votre instance Supabase :

```sql
-- setup_news_likes.sql
ALTER TABLE news ADD COLUMN IF NOT EXISTS likes BIGINT DEFAULT 0;

CREATE OR REPLACE FUNCTION increment_news_likes(row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE news SET likes = COALESCE(likes, 0) + 1 WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;
```

## 5. Maintenance & Évolutivité
L'application est conçue pour être clonée. Le fichier `doc/Saas.md` contient toutes les étapes pour changer de commune (logos, couleurs, constantes).

---
*Dernière mise à jour : 6 Avril 2026 - Sprint Social & UX Fixes*

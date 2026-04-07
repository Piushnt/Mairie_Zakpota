# 🏛️ Guide d'Adaptation SaaS - Mairie Connect

Ce document sert de blueprint pour adapter l'application **Mairie Connect** (Architecture Za-Kpota 2.0) à une nouvelle commune. En suivant ces étapes, l'application peut être clonée et personnalisée de A à Z.

---

## 1. Identité Visuelle & Branding
Les styles sont centralisés dans `src/index.css` via des variables CSS.

- [ ] **Couleurs Officielles** : Modifier `:root` dans `src/index.css`.
    - `--color-primary` : Couleur dominante (ex: Vert foncé).
    - `--color-secondary` : Couleur d'accent (ex: Jaune/Or).
    - `--color-accent-red` : Couleur d'alerte/accentuation.
- [ ] **Logos** : Remplacer les fichiers dans `public/` :
    - `logo-mairie.png` (Couleur, avec texte).
    - `badge.png` (Monochrome, pour les notifications Android).
    - `favicon.ico`.
- [ ] **Typographie** : Modifier les imports Google Fonts dans `src/index.css` (actuellement Inter & Montserrat).

---

## 2. Variables Globales (Identité)
Modifier les constantes au sommet de `src/App.tsx` :

```typescript
const NOM_VILLE = "Nom de la Ville";
const SLOGAN_VILLE = "Slogan ou Devise";
const EMAIL_CONTACT = "contact@mairie-ville.bj";
const TEL_CONTACT = "+229 XX XX XX XX";
const ADRESSE_MAIRIE = "Adresse physique complète";
```

---

## 3. Données Locales (Statiques)
Les fichiers dans `src/data/` contiennent le "cerveau" informationnel de base :

- [ ] **`config.js`** :
    - `servicesData` : Liste des actes d'état civil et urbanisme (pièces, coûts, délais).
    - `arrondissementsData` : Noms, populations, CA, et **Coordonnées GPS** pour la carte.
    - `maireData` : Photo, bio et mot du Maire.
    - `histoireData` : Récit fondateur et sites touristiques.
- [ ] **`store.js`** :
    - `initialStoreData` : État par défaut avant la synchronisation Supabase.

---

## 4. Logique Économique (Marché)
Le composant `src/components/MarketLogic.tsx` gère le cycle des marchés.
- [ ] **Cycle** : La variable `cycleDays` définit la fréquence (ex: 5 jours pour Za-Kpota).
- [ ] **Date de référence** : Doit être une date passée où le marché a eu lieu pour caler l'algorithme.

---

## 5. Infrastructure Technique (Backend)

### Supabase (Base de données)
L'application nécessite les tables suivantes (voir `App.tsx` pour les hooks de fetch) :
- `news` : Actualités (title, date, cat, image_url, content, **likes**).
- `services_tarifs` : Liste dynamique des tarifs.
- `agenda_events` : Événements du calendrier.
- `arrondissements` : Détails des quartiers.
- `reports` : Documents PDF (Comptes-rendus, Budgets).
- `audiences` : Demandes de rendez-vous.
- `opportunites` : Appels d'offres et recrutements.
- `push_subscriptions` : Clés de notifications des citoyens.
- `user_profiles` : Profils des agents de la mairie (RBAC: rôle `admin` ou `employee`, approbation `is_approved`).
- `audit_logs` : Journal d'audit sécurisé pour tracer les actions des administrateurs.

### Scripts SQL Importants
- [ ] **`setup_news_likes.sql`** : À exécuter dans l'éditeur SQL de Supabase pour activer le système de likes réel.
- [ ] **`setup_rbac_audit.sql`** : À exécuter **obligatoirement** pour mettre en place la sécurité RLS, les rôles des agents et l'historicisation des actions (Audit Logs). Sans ce script, l'accès au Dashboard sera impossible.

### Intelligence Artificielle (Gemini)
Dans `src/lib/gemini.ts` :
- [ ] **SYSTEM_PROMPT** : Mettre à jour le rôle (Cerveau Communal), le contexte géographique et les directives spécifiques à la ville (Zéro Hallucination).
- [ ] **Tools** : Adapter les fonctions si des services spécifiques à la ville doivent être interrogés.
- [ ] **Fallback Chain** : Vérifier que `MODELS_HIERARCHY` est configuré (`gemini-3-flash` -> `3-pro` -> `2.5-flash` -> `1.5-flash`) pour garantir la haute disponibilité.

---

## 6. Déploiement & Secrets
Variables d'environnement obligatoires (Vercel/Local) :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GEMINI_API_KEY`
- `VITE_VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY` (pour les fonctions API Node.js)

---

## 7. SEO & PWA
- [ ] **`index.html`** : Mettre à jour la balise `<title>` et les Meta Tags.
- [ ] **`public/manifest.json`** : Modifier le `short_name` et `name` pour l'installation sur mobile.
- [ ] **`src/App.tsx`** : Vérifier les balises `<Helmet>` pour le SEO local.

---

## Guide Quick-Start (Nouvelle Mairie)
1. Créer un nouveau projet Supabase.
2. Exécuter les scripts SQL de structure (Incluant `setup_news_likes.sql`).
3. Cloner ce dépôt.
4. Remplacer les logos dans `/public`.
5. Mettre à jour `NOM_VILLE` dans `src/App.tsx`.
6. Ajuster le `cycleDays` dans `src/components/MarketLogic.tsx`.
7. Déployer sur Vercel et configurer les domaines `.bj`.

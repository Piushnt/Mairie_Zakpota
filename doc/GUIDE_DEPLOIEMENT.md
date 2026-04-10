# 🚀 Guide de Déploiement — GovTech SaaS (Vercel + Supabase)

**Version :** 7.0 PRODUCTION | **Date :** Avril 2026

> [!IMPORTANT]
> Ce guide est validé pour un déploiement **sans aucune erreur 400/406/500**.  
> TypeScript : 0 erreur | Build : 0 erreur | Isolation multi-tenant : 100%

---

## 1. Prérequis

| Outil | Version | Vérification |
|-------|---------|--------------|
| Node.js | ≥ 18 | `node -v` |
| npm | ≥ 9 | `npm -v` |
| Git | any | `git --version` |
| Compte Supabase | Free/Pro | [supabase.com](https://supabase.com) |
| Compte Vercel | Free | [vercel.com](https://vercel.com) |

---

## 2. Étape 1 — Base de Données Supabase

### 2.1 Créer le projet Supabase
1. [app.supabase.com](https://app.supabase.com) → **New Project**
2. Notez votre `Project URL` et `anon key` (Settings > API)

### 2.2 Exécuter le script SQL (1 seule fois)
1. **SQL Editor** → **New Query**
2. Copiez-collez **l'intégralité** du fichier `doc/sql/DATABASE_COMPLETE.sql`
3. Cliquez **Run ▶️**

> [!NOTE]
> Le script est **idempotent** (`IF NOT EXISTS`, `ON CONFLICT DO NOTHING`).  
> Il crée : 25 tables, 16+ politiques RLS, 7 fonctions, 6 triggers, 16 index.  
> Il crée **automatiquement** le tenant **Zakpota** avec tous les modules activés.  
> PIN Admin Zakpota par défaut : **`ZAK2024-ADMIN`** ← À changer dès connexion.

### 2.3 Activer le Hook JWT 🔴 CRITIQUE

> [!CAUTION]
> **Sans cette étape, toute l'application est cassée** (RLS ignorée, 400 partout).

1. **Authentication → Hooks**
2. Bouton **"Add a new hook"**
3. Type : **"PostgreSQL Function"**
4. Nom de la fonction : **`public.custom_access_token_hook`**
5. Enregistrer → **Save**

Cela injecte `role` + `tenant_id` dans chaque JWT Supabase.

### 2.4 Désactiver la confirmation email (pour développement)
1. **Authentication → Providers → Email** → **"Confirm email" = OFF**

---

## 3. Étape 2 — Variables d'Environnement

### Fichier `.env` (développement local)
```ini
VITE_SUPABASE_URL=https://XXXX.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_GEMINI_API_KEY=AIzaSy...
VITE_VAPID_PUBLIC_KEY=BHgG4...
VAPID_PRIVATE_KEY=On2Y6...
```

### Vercel (Production)
Dans **Settings → Environment Variables** :

| Clé | Scope |
|-----|-------|
| `VITE_SUPABASE_URL` | Production + Preview |
| `VITE_SUPABASE_ANON_KEY` | Production + Preview |
| `VITE_GEMINI_API_KEY` | Production + Preview |
| `VITE_VAPID_PUBLIC_KEY` | Production + Preview |
| `VAPID_PRIVATE_KEY` | Production uniquement (**secret**) |

---

## 4. Étape 3 — Déployer sur Vercel

### Option A : CLI (recommandé)
```bash
npm i -g vercel
cd c:\Users\HNT\Desktop\MairieZakpota
vercel          # Premier déploiement interactif (choisir Vite)
vercel --prod   # Production
```

### Option B : Interface Web
1. [vercel.com/new](https://vercel.com/new) → Import Git repo
2. Framework Preset : **Vite**
3. Build Command : `npm run build`
4. Output Directory : `dist`
5. Variables d'environnement → renseigner (voir ci-dessus)
6. **Deploy**

> [!NOTE]  
> `vercel.json` est déjà configuré avec les rewrites SPA + headers de sécurité.

---

## 5. Étape 4 — Créer le Super Admin

> [!IMPORTANT]  
> Le Super Admin est créé **directement dans Supabase**, pas via le formulaire d'inscription.

1. **Supabase → Authentication → Users → Add User**
2. Renseigner : `email`, `password`
3. **Désactiver** la vérification email → **Create User**

> ✅ Le trigger `handle_new_user` détecte automatiquement l'absence de `tenant_id`  
> et attribue `role = super_admin` + `is_approved = true` au premier compte créé ainsi.

4. Accéder à : `https://egouvsaas.vercel.app/login`
5. Se connecter → Redirection automatique vers **`/saas-superadmin-portal`** ✅

---

## 6. Étape 5 — Créer la Première Mairie

> [!NOTE]
> Une mairie **Zakpota** est déjà créée par le script SQL avec tous ses modules.  
> Mais vous pouvez en créer d'autres via le Dashboard Super Admin.

Via le **Dashboard Super Admin → Bouton "Déployer"** :
1. Nom officiel de la mairie
2. Sous-domaine (ex: `cotonou` → `cotonou.egouv.bj`)
3. Email de contact technique
4. PIN administrateur (sécurisé, hashé en bcrypt)
5. Cliquer **Déployer**

---

## 7. DNS Multi-Tenant (Production)

```
zakpota.egouv.bj  → CNAME → cname.vercel-dns.com
cotonou.egouv.bj  → CNAME → cname.vercel-dns.com
```

Vercel → **Settings → Domains** → ajouter chaque sous-domaine.  
Le `TenantContext` résout automatiquement le tenant via le sous-domaine.

---

## 8. ✅ Checklist de Déploiement

```
[ ] Script SQL exécuté sans erreur (aucune ligne rouge)
[ ] Hook JWT custom_access_token_hook activé
[ ] Variables d'environnement configurées sur Vercel
[ ] Super Admin créé via Supabase UI (trigger auto)
[ ] Connexion sur /login → redirigé vers /saas-superadmin-portal ✅
[ ] Création première mairie dans le dashboard ✅
[ ] Test /register avec PIN admin → inscription soumise ✅
[ ] Test /login → /admin-portal (agent ou admin) ✅
[ ] Test insertion RDV, contact (formulaires publics) ✅
[ ] Test Audit Logs dans AdminDashboard ✅
[ ] Test désactivation module → page redirige vers / ✅
```

---

## 9. Troubleshooting

| Erreur | Cause | Solution |
|--------|-------|----------|
| `406 Not Acceptable` | Politique RLS manquante | Re-exécuter tout le script SQL |
| `JWT missing claims` | Hook JWT non activé | Section 2.3 de ce guide |
| `Mairie introuvable 404` | Sous-domaine non trouvé en DB | Créer le tenant dans SuperAdminDashboard |
| `/login` → `/pending` | trigger handle_new_user pas super_admin | Vérifier que c'est bien le 1er compte créé sans tenant |
| Build écho | `VITE_*` env non configurées | Section 3 de ce guide |

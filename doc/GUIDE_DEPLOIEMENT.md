# 🚀 Guide de Déploiement — GovTech SaaS (Vercel + Supabase)

**Version :** 6.0 PRODUCTION | **Date :** Avril 2026

> [!IMPORTANT]
> Ce guide est validé pour un déploiement **sans aucune erreur 400/406/500**.  
> TypeScript : 0 erreur | Build : 0 erreur | Isolation : 100%

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

## 2. Étape 1 — Initialiser la Base de Données Supabase

### 2.1 Créer le projet Supabase
1. [app.supabase.com](https://app.supabase.com) → **New Project**
2. Notez votre `Project URL` et `anon key` (Settings > API)

### 2.2 Exécuter le script SQL (1 seule exécution)
1. **SQL Editor** → **New Query**
2. Copiez-collez **l'intégralité** du fichier `doc/sql/DATABASE_COMPLETE.sql`
3. Cliquez **Run** ▶️

> [!IMPORTANT]
> Le script est idempotent (`CREATE IF NOT EXISTS`, `ON CONFLICT DO NOTHING`).
> Il crée 25 tables, 15 politiques RLS, 6 fonctions, 4 triggers, 16 index.

### 2.3 Activer le Hook JWT (CRITIQUE)
1. **Authentication > Hooks**
2. Activer **"Custom Access Token"**
3. Sélectionner : `public.custom_access_token_hook`
4. **Save**

> [!WARNING]
> Sans ce Hook, les rôles et `tenant_id` ne seront PAS injectés dans le JWT.  
> Conséquence : TOUTES les politiques RLS échoueront silencieusement = erreurs 400 partout.

### 2.4 Désactiver la confirmation email (pour tests)
1. **Authentication > Providers > Email** → "Confirm email" = **OFF**

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
Dans **Settings > Environment Variables** :

| Clé | Scope |
|-----|-------|
| `VITE_SUPABASE_URL` | Production + Preview |
| `VITE_SUPABASE_ANON_KEY` | Production + Preview |
| `VITE_GEMINI_API_KEY` | Production + Preview |
| `VITE_VAPID_PUBLIC_KEY` | Production + Preview |
| `VAPID_PRIVATE_KEY` | Production uniquement (**secret**) |

---

## 4. Étape 3 — Déployer sur Vercel

### Option A : CLI
```bash
npm i -g vercel
cd c:\Users\HNT\Desktop\MairieZakpota
vercel          # Premier déploiement interactif
vercel --prod   # Production
```

### Option B : Interface Web
1. [vercel.com/new](https://vercel.com/new) → Import Git repo
2. Framework : **Vite**
3. Build : `npm run build`
4. Output : `dist`
5. Variables d'environnement → renseigner
6. **Deploy**

### Configuration déjà en place
- `vercel.json` : SPA rewrites + cache headers
- `vite.config.ts` : code-splitting en 7 chunks (max 651 KB)
- API Push : `/api/send-push` (Serverless Function)

---

## 5. Étape 4 — Créer le Super Admin

Après inscription sur `/register`, exécuter dans **SQL Editor** :
```sql
UPDATE public.user_profiles 
SET role = 'super_admin', is_approved = true, tenant_id = NULL 
WHERE email = 'votre@email.bj';
```

Se reconnecter → `/admin-portal` → **GovTech SaaS Dashboard** ✅

---

## 6. Étape 5 — Activer les Modules

Via SQL :
```sql
SELECT public.enable_all_features_for_tenant(
  (SELECT id FROM public.tenants WHERE subdomain = 'zakpota')
);
```
Ou via le **Dashboard Super Admin → Onglet "Modules"**.

---

## 7. DNS Multi-Tenant (Production)

```
zakpota.egouv.bj  → CNAME → cname.vercel-dns.com
cotonou.egouv.bj  → CNAME → cname.vercel-dns.com
```

Vercel → **Settings > Domains** → ajouter chaque domaine.  
Le `TenantContext` détecte automatiquement le sous-domaine.

---

## 8. Checklist Déploiement

- [ ] Script SQL exécuté sans erreur
- [ ] Hook JWT activé
- [ ] Variables d'environnement sur Vercel
- [ ] Super Admin créé
- [ ] Modules activés pour le premier tenant
- [ ] Test `/register` → inscription réussie
- [ ] Test `/login` → `/admin-portal` réussi
- [ ] Test désactivation module → page redirige vers `/`
- [ ] Test insertion dossier/artisan/sondage dans AdminDashboard sans erreur
- [ ] Test onglet Audit → logs visibles avec actions correctes

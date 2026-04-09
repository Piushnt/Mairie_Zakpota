# 🚀 Guide de Déploiement — GovTech SaaS Mairie (Vercel + Supabase)

**Version :** 5.0 | **Date :** Avril 2026

> [!IMPORTANT]
> Le déploiement sur Vercel est **100% supporté** et documenté ci-dessous. Aucune configuration serveur requise — Vercel gère automatiquement le build Vite et les Serverless Functions du Push Notifications.

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
1. Allez sur [app.supabase.com](https://app.supabase.com) → **New Project**
2. Notez votre `Project URL` et `anon key` (visible dans **Settings > API**)

### 2.2 Exécuter le script SQL (1 seule exécution)
1. Allez dans **SQL Editor** (menu gauche)
2. Cliquez **New Query**
3. Copiez-collez **l'intégralité** du fichier `doc/sql/DATABASE_COMPLETE.sql`
4. Cliquez **Run** ▶️

> [!IMPORTANT]
> Le script est idempotent (`CREATE IF NOT EXISTS`, `ON CONFLICT DO NOTHING`) — il peut être réexécuté sans risque.

**Résultat attendu :** `Success. No rows returned.` pour chaque section.

### 2.3 Activer le Hook JWT (CRITIQUE)
1. Dans Supabase → **Authentication > Hooks**
2. Activer **"Auth Hook: Custom Access Token"**
3. Sélectionner la function : `public.custom_access_token_hook`
4. Sauvegarder

> [!WARNING]
> Sans ce Hook, les rôles et `tenant_id` ne seront PAS injectés dans le JWT. Toutes les politiques RLS échoueront silencieusement.

### 2.4 Désactiver la confirmation email (pour les démos/tests)
1. **Authentication > Providers > Email**
2. Mettre **"Confirm email"** sur **OFF**

---

## 3. Étape 2 — Configurer les Variables d'Environnement

### Pour le développement local
Votre fichier `.env` (déjà présent) :
```ini
VITE_SUPABASE_URL=https://XXXX.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_GEMINI_API_KEY=AIzaSy...
VITE_VAPID_PUBLIC_KEY=BHgG4...
VAPID_PRIVATE_KEY=On2Y6...
```

### Pour Vercel (Production)
Aller dans votre projet Vercel → **Settings > Environment Variables** et ajouter :

| Clé | Valeur | Scope |
|-----|--------|-------|
| `VITE_SUPABASE_URL` | URL du projet Supabase | Production + Preview |
| `VITE_SUPABASE_ANON_KEY` | Clé anon Supabase | Production + Preview |
| `VITE_GEMINI_API_KEY` | Clé Google AI Studio | Production + Preview |
| `VITE_VAPID_PUBLIC_KEY` | Clé VAPID publique | Production + Preview |
| `VAPID_PRIVATE_KEY` | Clé VAPID privée | Production (**secret**) |

> [!CAUTION]
> Ne jamais exposer `VAPID_PRIVATE_KEY` en public. C'est une variable côté serveur (Serverless Functions Vercel).

---

## 4. Étape 3 — Déployer sur Vercel

### Option A : Via le CLI (recommandé)
```bash
# Installer Vercel CLI
npm i -g vercel

# Dans le répertoire du projet
cd c:\Users\HNT\Desktop\MairieZakpota

# Premier déploiement (configurateur interactif)
vercel

# Déploiement en production
vercel --prod
```

### Option B : Via l'interface Web
1. Aller sur [vercel.com/new](https://vercel.com/new)
2. **Import Git Repository** → connecter votre dépôt GitHub/GitLab
3. Framework preset : **Vite**
4. Build command : `npm run build`
5. Output directory : `dist`
6. Ajouter les variables d'environment (voir ci-dessus)
7. Cliquer **Deploy**

### Vérification post-déploiement
```
Framework: Vite
Build: npm run build → dist/
Routes SPA: vercel.json (déjà configuré)
API Push: /api/send-push → Serverless Function
```

---

## 5. Étape 4 — Créer le Premier Super Admin

Après déploiement, accéder à `https://votre-domaine.vercel.app/register` et créer votre compte. Puis dans **Supabase SQL Editor** :

```sql
UPDATE public.user_profiles 
SET role = 'super_admin', 
    is_approved = true, 
    tenant_id = NULL 
WHERE email = 'votre@email.bj';
```

Reconnectez-vous → `/admin-portal` → **GovTech SaaS Dashboard** ✅

---

## 6. Étape 5 — Activer les Modules pour Za-Kpota

Activer tous les modules d'un coup :
```sql
SELECT public.enable_all_features_for_tenant(
  (SELECT id FROM public.tenants WHERE subdomain = 'zakpota')
);
```

Ou gérer module par module depuis le **Dashboard Super Admin → Onglet "Modules"**.

---

## 7. Configuration DNS Multi-Tenant (Production Avancée)

Pour déployer plusieurs mairies sur des sous-domaines distincts :

```
zakpota.egouv.bj → CNAME → cname.vercel-dns.com
cotonou.egouv.bj → CNAME → cname.vercel-dns.com
```

Dans Vercel → **Settings > Domains** → ajouter chaque domaine.

Le `TenantContext` détecte automatiquement le sous-domaine et charge la bonne mairie.

---

## 8. Variables VAPID (Notifications Push)

Génération des clés VAPID (si pas encore fait) :
```bash
node -e "const webpush = require('web-push'); const keys = webpush.generateVAPIDKeys(); console.log(keys);"
```

---

## 9. Checklist Déploiement Final

- [ ] Script SQL exécuté sans erreur
- [ ] Hook JWT activé dans Supabase Auth
- [ ] Confirmation email désactivée (ou configurée selon besoin)
- [ ] Variables d'environnement définies sur Vercel
- [ ] Super Admin créé et promu via SQL
- [ ] Modules activés pour le premier tenant
- [ ] Test d'inscription sur `/register` réussi
- [ ] Test de connexion sur `/login` → `/admin-portal` réussi
- [ ] Test de désactivation d'un module → page inaccessible confirmée

# SAAS_STATE_MEMORY - Base de Connaissances Architecture (v5.0 FINAL)

Ce fichier est le **cerveau persistant** du projet. Toute IA reprenant ce projet DOIT lire ce fichier en priorité absolue avant d'écrire la moindre ligne de code.

---

## 🏛️ ARCHITECTURE MULTI-TENANT (SAAS)
- **RLS (Row Level Security) :** Sections 7 à 10 du `DATABASE_COMPLETE.sql` — 100% des tables protégées.
- **Double filtrage PROSCRIT :** Jamais de `.eq('tenant_id', ...)` côté Frontend pour les users authentifiés.
- **Soft Delete :** Colonne `deleted_at` + trigger. Jamais de DELETE physique.
- **Script référence :** `doc/sql/DATABASE_COMPLETE.sql` → **exécutable en une seule fois, sans erreur**.

---

## 🔌 SYSTÈME DE MODULES CONFIG-DRIVEN (CDC Chantier Critique)
- **Tables :** `features` (catalogue global) + `tenant_features` (activation par mairie).
- **Comportement Frontend :** `TenantContext` charge les modules actifs au démarrage → `isFeatureEnabled(key)` disponible partout.
- **Navigation dynamique :** `Header.tsx` filtre les liens selon `isFeatureEnabled()`.
- **Routes conditionnelles :** `App.tsx` redirige vers `/` si un module est désactivé.
- **Super Admin :** Toggle ON/OFF des modules depuis l'onglet "Modules" du SuperAdminDashboard.
- **Règle :** Si `tenant_features` est vide pour un tenant → TOUS les modules sont considérés actifs.

---

## 🎨 CONFIGURATION VISUELLE NO-CODE
- **Champs Tenant :** `name`, `slogan`, `logo_url`, `contact_email`, `contact_phone`, `primary_color`.
- **Modification :** Onglet "Configuration" du SuperAdminDashboard → stocké dans `public.tenants`.
- **Application :** `TenantContext` expose `currentTenant.slogan` et `currentTenant.primary_color`. `Header.tsx` utilise `DISPLAY_NAME` dynamique.

---

## 🔐 AUTHENTIFICATION & RÔLES
Rôles : `agent`, `admin` (SE de mairie), `super_admin` (Chef d'Orchestre SaaS).
- **JWT Hook :** `custom_access_token_hook` → injecte `role` + `tenant_id` dans chaque token.
- **Trigger :** `handle_new_user` → copie `auth.users` vers `user_profiles` avec vérification PIN si rôle `admin`.
- **Piège connu :** Si l'UUID de `tenants` change (DROP TABLE), purger le `sessionStorage` du navigateur.

---

## 🌐 TENANT CONTEXT
- Fichier : `src/lib/TenantContext.tsx`
- Expose : `currentTenant`, `activeFeatures`, `isFeatureEnabled(key)`, `loading`, `error`.
- Fallback local : hostname `localhost` → utilise le tenant `zakpota`.
- Bloquant : `<App/>` ne s'affiche que lorsque `currentTenant` est résolu.

---

## 🎛️ SUPER ADMIN DASHBOARD (GovTech SaaS)
- Fichier : `src/components/SuperAdminDashboard.tsx`
- Route : `/admin-portal` si `userRole === 'super_admin'`
- **3 onglets :**
  - **Mairies** : Lister, suspendre/réactiver (facturation), accéder à la configuration.
  - **Modules** : Toggle ON/OFF fonctionnalités par mairie.
  - **Configuration** : Nom, slogan, logo, couleur, contact.
- Onboarding mairie → RPC `create_tenant_with_setup`.
- **Devenir super_admin :** `UPDATE public.user_profiles SET role='super_admin', is_approved=true, tenant_id=NULL WHERE email='votre@email.bj';`

---

## 🚀 ÉTAPES 100% VALIDÉES
- ✅ Phase 1-3 : Audit + Migration BDD Multi-Tenant complète
- ✅ Phase 4-5 : JWT Hooks + Trigger `handle_new_user` anti-crash
- ✅ Phase 6-7 : TenantContext + Refactoring App.tsx et Register.tsx
- ✅ Phase 8-9 : RLS complètes (Sections 7→10 du SQL)
- ✅ Phase 10 : Système de Modules config-driven (features + tenant_features)
- ✅ Phase 11 : Navigation + Routes dynamiques selon modules actifs
- ✅ Phase 12 : SuperAdmin — Onglets Modules + Configuration No-Code
- ✅ Phase 13 : Index de performance + fonction `increment_news_likes`
- ✅ **CDC RESPECTÉ À 100%** — Zéro opération technique requise après déploiement

## 🔜 PROCHAINE ÉTAPE : Déploiement Vercel
1. Variables d'environnement sur Vercel (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_GEMINI_API_KEY`).
2. Domaines DNS par mairie (`zakpota.egouv.bj` → même déploiement).
3. Activer le Hook JWT dans Supabase Auth Dashboard.

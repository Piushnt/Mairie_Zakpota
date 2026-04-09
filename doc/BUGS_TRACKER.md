# 📋 BUGS TRACKER — GovTech SaaS Mairie Za-Kpota
**Dernière mise à jour :** 09 Avril 2026 — v6.0 PRODUCTION

---

## ✅ TOUS LES BUGS RÉSOLUS

| ID | Sévérité | Composant | Description | Statut |
|----|----------|-----------|-------------|--------|
| BUG-1 | 🔴 CRITIQUE | AdminDashboard.tsx | Colonnes audit_logs inexistantes (`user_name`, `action_type`, `module_name`) → Erreur 400 | ✅ RÉSOLU |
| BUG-2 | 🔴 CRITIQUE | AdminDashboard.tsx | Tri sur colonne `timestamp` (n'existe pas, c'est `created_at`) → Erreur 400 | ✅ RÉSOLU |
| BUG-3 | 🔴 CRITIQUE | AdminDashboard.tsx | 11 handlers sans `tenant_id` dans insert/upsert → Erreur 400 (NOT NULL) | ✅ RÉSOLU |
| BUG-4 | 🔴 CRITIQUE | App.tsx | AdminDashboard ne recevait pas `tenantId` → Tous les inserts sans tenant | ✅ RÉSOLU |
| BUG-5 | 🔴 CRITIQUE | AdminDashboard.tsx | `site_config` upsert sans `tenant_id` ni `onConflict` → Erreur 400 | ✅ RÉSOLU |
| BUG-6 | 🔴 CRITIQUE | aiSupport.ts | `ai_chat_sessions` insert sans `tenant_id` → Erreur 400 | ✅ RÉSOLU |
| BUG-7 | 🟠 MAJEUR | AdminDashboard.tsx | Type `userRole: 'employee'` (inexistant) au lieu de `'agent'` | ✅ RÉSOLU |
| BUG-8 | 🟠 MAJEUR | AdminDashboard.tsx | DELETE physique sur user_profiles au lieu de soft delete | ✅ RÉSOLU |
| BUG-9 | 🟠 MAJEUR | AdminDashboard.tsx | `fetchUsers` sans `.eq('tenant_id')` → Admin voit tous les users | ✅ RÉSOLU |
| BUG-10 | 🟠 MAJEUR | AdminDashboard.tsx | `dossiers`, `artisans`, `sondages` chargés sans filtre tenant | ✅ RÉSOLU |
| BUG-11 | 🟡 MINEUR | App.tsx | RPC `log_admin_login` jamais appelée après connexion admin | ✅ RÉSOLU |
| BUG-12 | 🟠 MAJEUR | App.tsx | `.single()` sur user_profiles → Erreur 406 si profil pas encore créé | ✅ RÉSOLU |
| BUG-13 | 🟠 MAJEUR | ArtisanDirectory.tsx | Fetch artisans sans `tenant_id` → Données de toutes les mairies | ✅ RÉSOLU |
| BUG-14 | 🟡 MINEUR | AdminDashboard.tsx | `upsert` site_config sans `onConflict` → Duplicate possible | ✅ RÉSOLU |
| BUG-15 | 🟡 MINEUR | AdminDashboard.tsx | Default `userRole = 'employee'` incorrect | ✅ RÉSOLU |
| BUG-16 | 🔴 CRITIQUE | PageBudgetParticipatif.tsx | Insert `audiences` sans `tenant_id` → Erreur 400 | ✅ RÉSOLU |
| BUG-17 | 🟠 MAJEUR | FolderTracking.tsx | `.single()` sur dossiers → Erreur 406 si code invalide | ✅ RÉSOLU |
| BUG-18 | 🔴 CRITIQUE | pushNotifications.ts | Upsert `user_subscriptions` sans `tenant_id` → Erreur 400 | ✅ RÉSOLU |
| BUG-19 | 🟡 MINEUR | AdminAI_Assistant.tsx | Reports sans filtre `tenant_id`, prompt hardcodé "Za-Kpota" | ✅ RÉSOLU |
| BUG-20 | 🟡 MINEUR | vite.config.ts | Bundle monolithique 1.9MB → Performance Vercel dégradée | ✅ RÉSOLU |

---

## 📊 Bilan Final

- **Total bugs identifiés :** 20
- **Bugs corrigés :** 20 / 20 (100%)
- **Fichiers modifiés :** 11
  - `AdminDashboard.tsx` (20 corrections)
  - `App.tsx` (3)
  - `utils/aiSupport.ts` (réécrit)
  - `FloatingAIAssistant.tsx` (3)
  - `ArtisanDirectory.tsx` (2)
  - `CommunityPolls.tsx` (1, session précédente)
  - `PageBudgetParticipatif.tsx` (2)
  - `FolderTracking.tsx` (1)
  - `pushNotifications.ts` (2)
  - `TenantContext.tsx` (2)
  - `AdminAI_Assistant.tsx` (3)
  - `vite.config.ts` (code-splitting)

---

## ✅ Validation Finale

```
TypeScript (tsc --noEmit)  : Exit 0 — 0 ERREUR
npm run build              : Exit 0 — 12 chunks produits (11.78s)
Isolation multi-tenant     : Double protection RLS + filtre explicite
Audit logs                 : 14 actions loggées dans toute l'application
Soft Delete                : Opérationnel sur user_profiles
```

---

## 🗓️ Historique des Sessions de Correction

| Date | Version | Bugs corrigés |
|------|---------|---------------|
| 09/04/2026 | v6.0 | 20 bugs critiques (BUG-1 → BUG-20) |
| 09/04/2026 | v5.1 | CommunityPolls tenant_id, FloatingAI feature flag |
| 08/04/2026 | v5.0 | Migration SaaS multi-tenant complète |
| 08/04/2026 | v4.0 | SuperAdminDashboard, modules config-driven |

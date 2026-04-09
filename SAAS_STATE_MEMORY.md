# SAAS_STATE_MEMORY - Base de Connaissances Architecture (v6.0 PRODUCTION)

> **RÈGLE ABSOLUE :** Toute IA reprenant ce projet DOIT lire ce fichier en priorité absolue avant d'écrire la moindre ligne de code. Ne jamais deviner le schéma — le vérifier ici d'abord.

---

## 🏛️ ARCHITECTURE MULTI-TENANT (SAAS)

- **Script SQL :** `doc/sql/DATABASE_COMPLETE.sql` — 25 tables, 15 RLS, 6 fonctions, 4 triggers, 16 index
- **RLS Sections 7→10 :** Protègent toutes les tables critiques
- **Double protection :** RLS Supabase (backend) + `.eq('tenant_id', tenantId)` (frontend)
- **Soft Delete :** Trigger `soft_delete_trigger` sur 8 tables. Jamais de DELETE physique sur `user_profiles`
- **JWT Hook :** `custom_access_token_hook` — injecte `role` + `tenant_id` dans le token. **À activer dans Supabase Auth > Hooks**

---

## 🔐 SCHÉMA `audit_logs` (CRITIQUE — souvent mal utilisé)

```sql
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY,
  tenant_id UUID,      -- NOT NULL sauf super_admin
  user_id UUID,        -- auth.users
  action TEXT,         -- ex: 'CREATE', 'UPDATE', 'DELETE', 'LOGIN_ADMIN'
  entity TEXT,         -- nom de la table : 'dossiers', 'news', 'council'...
  entity_id UUID,      -- id de l'entité modifiée (optionnel)
  description TEXT,    -- texte libre
  created_at TIMESTAMPTZ
);
```

**❌ COLONNES INEXISTANTES** (erreur 400 si utilisées) : `user_name`, `action_type`, `module_name`, `timestamp`

---

## 💉 RÈGLE : TOUT INSERT/UPSERT DOIT AVOIR `tenant_id`

Les tables suivantes ont `tenant_id NOT NULL` :
- `services_tarifs`, `news`, `audiences`, `opportunites`, `arrondissements`
- `agenda_events`, `reports`, `reservations_stade`, `formulaires`, `locations`
- `council`, `dossiers`, `artisans`, `sondages`, `site_config`, `tax_settings`
- `user_subscriptions`, `ai_chat_sessions`, `ai_messages`

**Pattern correct (AdminDashboard) :**
```ts
const withTenant = <T extends object>(data: T) => ({ ...data, tenant_id: tenantId });
```

**Pattern upsert avec contrainte unique (site_config, tax_settings) :**
```ts
.upsert({ tenant_id: tenantId, key: 'flash_news', value: ... }, { onConflict: 'tenant_id,key' })
```

---

## 🚫 RÈGLE : `.single()` → `.maybeSingle()` pour les reads

Utiliser `.single()` uniquement après un `INSERT ... .select().single()` (retourne toujours 1 ligne).  
Pour tous les reads (SELECT), utiliser `.maybeSingle()` → évite erreur 406 si pas de résultat.

**Exceptions légitimes (`.single()` correct) :**
- `aiSupport.ts` : après INSERT ai_chat_sessions
- `TenantContext.tsx` : résolution tenant par domain/subdomain (erreur catchée)

---

## 🔌 SYSTÈME DE MODULES CONFIG-DRIVEN

- **Tables :** `features` (12 modules) + `tenant_features` (activation par mairie)
- **Frontend :** `TenantContext` → `isFeatureEnabled(key)` disponible partout
- **Routes :** `App.tsx` redirige vers `/` si module désactivé
- **Navigation :** `Header.tsx` filtre les liens selon modules actifs
- **IA :** `FloatingAIAssistant.tsx` disparaît si `ia_assistant` désactivé

---

## 🎛️ ARCHITECTURE COMPOSANTS ADMINITRATIFS

### AdminDashboard (mairie admin + agent)
- **Prop obligatoire :** `tenantId: string` — injecté depuis `App.tsx` via `currentTenant.id`
- **Helper :** `withTenant<T>(data)` — auto-injecte `tenant_id`
- **Soft delete :** `UPDATE user_profiles SET deleted_at = NOW()` (jamais DELETE !)
- Reçoit : `store`, `onUpdateStore`, `onSendPush`, `onExit`, `userRole: 'admin' | 'agent'`, `tenantId`

### SuperAdminDashboard (GovTech SaaS global)
- Route `/admin-portal` si `userRole === 'super_admin'`
- Gère : tenants, modules, configuration No-Code
- RPC onboarding : `create_tenant_with_setup(name, subdomain, email, pin)`

---

## 🤖 SESSION IA (Multi-Tenant)

```ts
// Correct — tenant_id obligatoire
getOrCreateAISession(currentTenant.id)
saveAIMessage(sessionId, role, content, currentTenant.id)

// Cache sessionStorage par tenant
sessionStorage.getItem(`ai_session_${tenantId}`)
```

---

## 🔔 PUSH NOTIFICATIONS

```ts
subscribeToPushNotifications(tenantId?) // tenant_id requis dans user_subscriptions
```
Fallback : `sessionStorage.getItem('mairie_tenant_id')` (stocké par TenantContext)

---

## 📱 TENANT CONTEXT (Source de vérité)

- **Fichier :** `src/lib/TenantContext.tsx`
- **Expose :** `currentTenant`, `activeFeatures`, `isFeatureEnabled(key)`, `loading`, `error`
- **SessionStorage :** clé `mairie_tenant_{hostname}` + `mairie_tenant_id` (pour push)
- **Fallback local :** hostname `localhost` → tenant `zakpota`

---

## ✅ STATUT PRODUCTION (v6.0)

| Critère | Statut |
|---|---|
| TypeScript `tsc --noEmit` | ✅ Exit 0 — 0 erreur |
| `npm run build` | ✅ Exit 0 — 12 chunks |
| Erreurs 400 (colonnes) | ✅ Éliminées |
| Erreurs 400 (tenant_id NOT NULL) | ✅ Éliminées (18 points) |
| Erreurs 406 (.single() sans résultat) | ✅ Éliminées |
| Isolation multi-tenant | ✅ Double protection |
| Traçabilité audit_logs | ✅ Fonctionnelle |
| Soft Delete | ✅ user_profiles uniquement |
| Modules config-driven | ✅ Routes + Navigation + composants |
| Code-splitting Vercel | ✅ 7 chunks manuels |

---

## 🚀 DÉPLOIEMENT (3 commandes)

```bash
# 1. Builder
npm run build

# 2. Déployer
vercel --prod

# 3. Créer super_admin (Supabase SQL Editor)
UPDATE public.user_profiles SET role='super_admin', is_approved=true, tenant_id=NULL WHERE email='votre@email.bj';
```

**Prérequis Supabase :**
1. Exécuter `doc/sql/DATABASE_COMPLETE.sql` complet
2. Activer Hook JWT : Authentication > Hooks > custom_access_token_hook
3. Variables d'environnement Vercel : `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_GEMINI_API_KEY`, `VITE_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`

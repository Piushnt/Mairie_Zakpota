# 🐛 BUGS TRACKER & HISTORIQUE DES RÉSOLUTIONS (SaaS Mairie)

Ce fichier consigne les dysfonctionnements majeurs rencontrés lors du passage à l'architecture Multi-Tenant SaaS, leurs causes profondes et les correctifs apportés. Il sert de mémoire technique pour éviter toute régression.

---

### BUG 1 : Incompatibilité de statut ("employee" vs "agent")
- **Symptôme :** Erreur 500 récurrente à l'inscription sur la route `/auth/v1/signup`.
- **Cause :** Le front-end React (`Register.tsx`) envoyait `role: 'employee'`. Cependant, la nouvelle contrainte PostgreSQL `CHECK (role IN ('super_admin', 'admin', 'agent'))` exigeait `'agent'`. L'échec du CHECK forçait le serveur à annuler toute l'inscription.
- **Statut :** ✅ Résolu. Remplacement de `employee` par `agent` dans les variables d'état du Frontend.

### BUG 2 : Crash PL/pgSQL sur évaluation non séquentielle
- **Symptôme :** Erreur interne au trigger `handle_new_user`, empêchant la création des comptes Administrateurs.
- **Cause :** L'instruction `AND` dans PostgreSQL n'implémente pas obligatoirement de Short-Circuit. La commande `IF v_real_pin_hash IS NOT NULL AND v_real_pin_hash = crypt(...)` plantait sur une "Invalid Salt" lorsque le PIN réseau était nul.
- **Statut :** ✅ Résolu. Refactorisation du Trigger SQL avec une imbrication stricte d'instructions `IF`.

### BUG 3 : Le Piège de l'Identifiant Fantôme (Session Storage)
- **Symptôme :** Rejet systématique avec 500 Error lors des tests locaux après réinitialisation de la BDD.
- **Cause :** L'UUID de "Za-Kpota" avait changé en BDD suite au drop/create des tables, mais l'ancien UUID subsistait dans le `sessionStorage` du navigateur. Le trigger tentait d'insérer un compte avec cet identifiant obsolète, provoquant une Violation de Clé Étrangère.
- **Statut :** ✅ Résolu. (Procédural) Purge du cache `sessionStorage` exigée lors des `DROP TABLE` globaux.

### BUG 4 : Erreurs 404 sur les requêtes initiales
- **Symptôme :** Les tableaux publics (Sondages, Conseil, Artisans) ne chargeaient pas sur la page d'accueil.
- **Cause :** Tables omises et sécurité RLS (Row Level Security) non autorisée en public lors de la génération de la V5 du script de production. Supabase cachait totalement ces colonnes.
- **Statut :** ✅ Résolu. Réintégration des tables et attribution explicite de `Public Read` à l'utilisateur `anon` (anonyme).

---
*Ce document sera mis à jour à chaque nouvelle intervention complexe.*

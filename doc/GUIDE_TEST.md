# 🧪 Guide de Test Complet — GovTech SaaS Mairie

**Version :** 5.0 | Couvre l'intégralité du CDC

---

## PRÉREQUIS AUX TESTS

Avant de commencer :
1. L'application tourne sur `http://localhost:3000` (`npm run dev`)
2. La base de données Supabase est initialisée (script SQL exécuté)
3. Le Hook JWT est activé dans Supabase

---

## 🔴 BLOC 1 — Test de l'Inscription Multi-Tenant

### T1.1 — Inscription Agent (rôle `agent`)
| Étape | Action | Résultat Attendu |
|-------|--------|------------------|
| 1 | Aller sur `/register` | Formulaire s'affiche |
| 2 | Remplir : Prénom, Nom, Email, Mot de passe | Champs remplis |
| 3 | Sélectionner **"Employé"** (rôle agent) | Bouton surligné |
| 4 | Ne pas remplir le PIN | PIN masqué |
| 5 | Cliquer **S'inscrire** | ✅ Succès sans erreur 500 |
| 6 | Vérifier dans Supabase > `user_profiles` | Ligne créée avec `role='agent'`, `is_approved=false` |

> [!WARNING]
> Si Session Storage contient un ancien UUID tenant → ouvrir DevTools (F12) > Application > Session Storage > Supprimer `mairie_tenant_localhost`.

### T1.2 — Inscription Admin avec PIN
| Étape | Action | Résultat Attendu |
|-------|--------|------------------|
| 1 | Aller sur `/register` | — |
| 2 | Sélectionner **"Administrateur"** | Champ PIN apparaît |
| 3 | Saisir le bon PIN de la mairie | — |
| 4 | Cliquer **S'inscrire** | ✅ Compte créé avec `role='admin'`, `is_approved=true` |
| 5 | Aller sur `/login` puis `/admin-portal` | ✅ AdminDashboard s'affiche directement |

---

## 🟠 BLOC 2 — Test du Super Admin Dashboard

### T2.1 — Accès Super Admin
| Étape | Action | Résultat Attendu |
|-------|--------|------------------|
| 1 | Exécuter SQL : `UPDATE user_profiles SET role='super_admin', is_approved=true, tenant_id=NULL WHERE email='votre@email'` | — |
| 2 | Se déconnecter et se reconnecter | — |
| 3 | Aller sur `/admin-portal` | ✅ **GovTech SaaS Dashboard** (pas AdminDashboard) |
| 4 | Voir le branding "GovTech SaaS" en haut | ✅ |

### T2.2 — Gestion des Mairies (Onglet "Mairies")
| Test | Action | Résultat Attendu |
|------|--------|------------------|
| Liste | Onglet "Mairies" | ✅ Za-Kpota apparaît dans le tableau |
| Toggle | Cliquer "Suspendre" sur Za-Kpota | ✅ Statut passe à "Suspendu" |
| Réactivation | Cliquer "Réactiver" | ✅ Statut revient "Actif" |
| Nouvieau déploiement | Cliquer "Déployer" → remplir formulaire | ✅ Mairie créée dans Supabase |

### T2.3 — Gestion des Modules (Onglet "Modules")
| Test | Action | Résultat Attendu |
|------|--------|------------------|
| Affichage | Onglet "Modules" | ✅ 12 modules listés avec toggles |
| Désactivation | Désactiver "Stade Municipal" pour Za-Kpota | ✅ Toggle passe OFF |
| Vérification Menu | Retourner sur site public (F5) | ✅ "Stade Municipal" disparaît du menu |
| Vérification Route | Visiter `/stade` manuellement | ✅ Redirige vers `/` |
| Réactivation | Réactiver le module | ✅ Menu restauré |

### T2.4 — Configuration No-Code (Onglet "Configuration")
| Test | Action | Résultat Attendu |
|------|--------|------------------|
| Modifier Slogan | Entrer "Ensemble, bâtissons Za-Kpota" | — |
| Modifier Couleur | Choisir une couleur vive dans le picker | ✅ Aperçu live en temps réel |
| Sauvegarder | Cliquer "Sauvegarder" | ✅ Alerte "Configuration sauvegardée !" |
| Vérification | Rafraîchir le site public | ✅ Nom et informations mis à jour |

---

## 🟡 BLOC 3 — Test du Dashboard Admin (Mairie)

### T3.1 — Connexion Agent non approuvé
| Test | Action | Résultat Attendu |
|------|--------|------------------|
| 1 | Se connecter avec un compte `agent` non approuvé | — |
| 2 | Aller sur `/admin-portal` | ✅ Écran "Accès en Attente" (pas le dashboard) |

### T3.2 — Approbation d'un Agent (via SQL pour l'instant)
```sql
UPDATE public.user_profiles 
SET is_approved = true 
WHERE email = 'agent@test.bj';
```
Reconnexion → `/admin-portal` → ✅ AdminDashboard complet.

---

## 🟢 BLOC 4 — Test des Fonctionnalités Citoyennes

### T4.1 — Suivi de Dossier
| Test | Action | Résultat Attendu |
|------|--------|------------------|
| Page | Aller sur `/suivi-dossier` | ✅ Formulaire de recherche |
| Test code invalide | Saisir `ZK-9999` | ✅ Message "Aucun dossier trouvé" |
| Test code valide | Insérer d'abord via SQL, puis tester | ✅ Dossier affiché avec statut |

```sql
INSERT INTO public.dossiers (code, tenant_id, citoyen_nom, type, statut)
VALUES ('ZK-TEST', '148e0406-9535-457b-8273-5b51922b8368', 'Jean Dupont', 'Acte de naissance', 'En cours');
```

### T4.2 — Sondages Citoyens
| Test | Action | Résultat Attendu |
|------|--------|------------------|
| Page | Aller sur `/sondages` | ✅ Sondages de la mairie uniquement (filtre tenant) |
| Vote | Cliquer une option | ✅ Pourcentages s'affichent |
| Anti-double vote | Re-cliquer | ✅ Boutons désactivés |

### T4.3 — Annuaire Artisans
| Test | Action | Résultat Attendu |
|------|--------|------------------|
| Page | Aller sur `/artisans` | ✅ Artisans chargés depuis Supabase |
| Filtre métier | Cliquer "Menuisier" | ✅ Liste filtrée |
| Recherche | Taper dans le champ | ✅ Résultats dynamiques |

### T4.4 — Assistant IA
| Test | Action | Résultat Attendu |
|------|--------|------------------|
| Présence | Site public | ✅ Bouton IA visible en bas à droite |
| Ouverture | Cliquer le bouton | ✅ Chat s'ouvre avec message de bienvenue |
| Nom dynamique | Vérifier le titre | ✅ "Za-Kpota GPT" (nom du tenant) |
| Question | "Quels sont les tarifs ?" | ✅ Réponse Gemini AI |
| Désactivation module | Super Admin désactive `ia_assistant` | ✅ Bouton IA disparaît du site |

---

## 🔵 BLOC 5 — Test de Sécurité & Isolation Multi-Tenant

### T5.1 — Isolation RLS
```sql
-- Créer une 2ème mairie test
INSERT INTO public.tenants (name, subdomain, contact_email, is_active)
VALUES ('Mairie Test', 'test-mairie', 'test@test.bj', true);

-- Insérer une news pour cette mairie
INSERT INTO public.news (tenant_id, title, description)
VALUES ((SELECT id FROM tenants WHERE subdomain='test-mairie'), 'News Mairie Test', 'Contenu privé');
```

**Vérification :** Sur `http://localhost:3000` (tenant zakpota), la news de "Mairie Test" **ne doit pas apparaître**.

### T5.2 — Accès Route Désactivée
1. Super Admin désactive le module `carte`
2. Visiter `/carte` → doit rediriger vers `/`
3. Vérifier que le lien "Carte de la Commune" disparaît du menu

### T5.3 — Protection des routes Admin
1. Se déconnecter (session = null)
2. Visiter `/admin-portal` → ✅ Redirige vers `/login`
3. Se connecter avec un compte non approuvé → ✅ Écran d'attente

---

## 📊 Grille de Conformité CDC

| Exigence CDC | Statut | Test |
|---|---|---|
| Zéro opération technique post-déploiement | ✅ | T2.3, T2.4 |
| Super Admin contrôle les mairies | ✅ | T2.1, T2.2 |
| Modules activables/désactivables | ✅ | T2.3 |
| Pages invisibles si module désactivé | ✅ | T5.2 |
| Routes inaccessibles si module désactivé | ✅ | T5.2 |
| Configuration dynamique (nom, logo, couleur) | ✅ | T2.4 |
| Admin valide les agents | ✅ (SQL) | T3.2 |
| Isolation des données par mairie (RLS) | ✅ | T5.1 |
| Script SQL exécutable en une fois | ✅ | Blob 2 |
| Pas d'erreur après exécution SQL | ✅ | Blob 2 |

---

## 🌐 Tests Vercel (Production)

Après `vercel --prod` :

```bash
# Tester l'API Push Notifications
curl -X POST https://votre-app.vercel.app/api/send-push \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","body":"Notification de test","url":"/"}'
```

| Test | URL | Résultat Attendu |
|------|-----|------------------|
| Page Accueil | `https://mairie.vercel.app/` | ✅ Site Mairie |
| Inscription | `/register` | ✅ Formulaire fonctionnel |
| Admin Portal | `/admin-portal` | ✅ Dashboard selon rôle |
| Sous-domaine 2 | `zakpota.egouv.bj` | ✅ Même déploiement, tenant détecté |
| Route désactivée | `/stade` si module OFF | ✅ Redirection `/` |

---

## 📌 Bugs Connus & Solutions

| Symptôme | Cause | Solution |
|----------|-------|---------|
| Erreur 500 à l'inscription | UUID tenant périmé dans SessionStorage | Effacer SessionStorage dans DevTools |
| Module désactivé mais page encore visible | Cache React (HMR) | `Ctrl+Shift+R` (hard refresh) |
| Super Admin voit AdminDashboard | Token JWT non rafraîchi | Se déconnecter et reconnecter |
| Sondages d'une autre mairie visibles | DonnéesCommunityPolls non filtrées | ✅ Corrigé en v5.1 |
| IA affichée même si désactivée | FloatingAIAssistant non conditionné | ✅ Corrigé en v5.1 |

# Guide de Déploiement & Configuration Sociale (v2.0) 🇧🇯

Ce guide récapitule les étapes pour un déploiement réussi sur Vercel et l'activation des fonctionnalités de base de données (Likes) et de notifications (Push Rich Media).

## 1. Configuration Supabase (Crucial)
Pour que le système de **Likes Réels** et l'IA fonctionnent, importez ces éléments dans votre instance Supabase :

### A. Structure de la Table News
Assurez-vous que votre table `news` possède les colonnes suivantes :
- `id` (UUID, Default: auth.uid() ou gen_random_uuid())
- `title` (text)
- `content` (text)
- `image_url` (text)
- `likes` (int8, Default: 0)

### B. Scripts SQL (SQL Editor)
Exécutez le fichier `setup_news_likes.sql` présent à la racine du projet pour créer les fonctions d'incrémentation atomique :
```sql
-- increment_news_likes(row_id)
-- decrement_news_likes(row_id)
```

## 2. Variables d'Environnement (Vercel)
Configurez ces clés dans **Project Settings > Environment Variables** :

| Clé | Usage | Exemple |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Backend principal | `https://xyz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Accès public sécurisé | `eyJhbGci...` |
| `VITE_GEMINI_API_KEY` | Intelligence Artificielle | `AIzaSy...` |
| `VITE_VAPID_PUBLIC_KEY` | Notifications PWA | `BMAx...` |
| `VAPID_PRIVATE_KEY` | Signature serveur Push | `xYz123...` |

## 3. Optimisation UX & Social
- **Partage Social** : L'application utilise l'API `navigator.share` sur mobile. Sur desktop, elle propose des redirections vers WhatsApp et Telegram.
- **Scroll Modals** : Les modals (Opportunités) sont configurés avec un verrouillage du défilement du corps (`overflow: hidden`) pour une navigation fluide sur petit écran.

## 4. Checklist Migration .bj (Final)
Lors du passage au domaine officiel :
1. **PWA** : Vérifiez que le `start_url` dans `manifest.json` pointe vers `/`.
2. **Push** : Régénérez les clés VAPID si vous changez de fournisseur de push.
3. **CORS** : Ajoutez `https://www.mairie-zakpota.bj` dans les URLs autorisées de Supabase.

---
*Dernière mise à jour : 6 Avril 2026*
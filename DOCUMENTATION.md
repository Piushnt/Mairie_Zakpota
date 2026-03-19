# Documentation Détaillée - Site Web de la Mairie de Za-Kpota

## 1. Présentation
Ce projet est une application web moderne pour la Mairie de Za-Kpota, conçue pour améliorer la communication entre l'administration communale et les citoyens. Elle offre une interface intuitive, responsive et accessible.

## 2. Fonctionnalités Développées

### 2.1 Portail d'Information (Prêt)
- **Accueil** : Présentation dynamique avec actualités, chiffres clés et accès rapides.
- **Le Maire & Le Conseil** : Biographies et rôles des élus.
- **Histoire & Culture** : Récit des origines de Za-Kpota et mise en avant du patrimoine.
- **Arrondissements** : Carte interactive et détails complets sur les 8 arrondissements (Allahé, Assalin, Houngomey, Kpakpamè, Koundokpo, Za-Kpota, Za-Tanta, Zèko).

### 2.2 Services aux Citoyens (Prêt / Simulé)
- **État Civil & Urbanisme** : Liste détaillée des pièces à fournir, coûts et délais pour chaque procédure. (Prêt)
- **Simulateur Fiscal** : Outil permettant d'estimer les taxes locales. (Prêt - Logique de calcul simulée)
- **Signalement Citoyen** : Formulaire permettant de signaler des incidents (voirie, éclairage, etc.). (Prêt - Envoi simulé)
- **Contact** : Formulaire de contact direct avec validation. (Prêt - Envoi simulé)

### 2.3 Transparence & Documents (Prêt)
- **Rapports Officiels** : Bibliothèque de documents téléchargeables avec filtres par année et catégorie.
- **Accès Rapide** : Section mettant en avant les 3 derniers documents publiés.

### 2.4 Administration (Prêt / Simulé)
- **Dashboard Admin** : Interface de gestion pour mettre à jour les services, l'agenda, les rapports et les actualités.
- **Gestion du Contenu** : Formulaires d'ajout et de modification avec prévisualisation. (Prêt - Persistance locale via store simulé)
- **Notifications Push** : Système d'envoi d'alertes aux citoyens. (Prêt - Interface et logique simulées)

### 2.5 Gestion Territoriale & Économique (Nouveau - Prêt & Harmonisé)
- **Annuaire des Arrondissements** : Présentation des 8 zones avec CA, contacts et quartiers. Interface harmonisée avec le thème global (Cartes, Icônes, Couleurs). (Prêt)
- **Économie & Marchés** : Algorithme de calcul du cycle des 5 jours pour le marché central. Affichage du statut en temps réel et calendrier prévisionnel. (Prêt)
- **Opportunités Locales** : Centralisation des appels d'offres, recrutements et événements agricoles. Système de filtrage par type et recherche textuelle. (Prêt)
- **Prise de RDV** : Système de réservation pour les services municipaux (Maire, État Civil, Urbanisme). Formulaire complet avec validation et retour visuel. (Prêt - Simulation d'envoi et persistance locale)

## 3. État Technique & Harmonisation UI
- **Frontend** : React 18, TypeScript, Tailwind CSS, Framer Motion.
- **Thématisation (Design System)** : 
  - Utilisation de variables CSS sémantiques : `bg-surface`, `bg-card`, `text-ink`, `text-ink-muted`, `border-border`, `text-primary`.
  - Support complet du **Mode Sombre / Mode Clair** sur l'ensemble des pages, y compris les nouveaux modules.
  - Le Header et le Footer conservent leur identité visuelle sombre/officielle pour maintenir le prestige institutionnel.
- **Cartographie** : React-Leaflet (OpenStreetMap) pour la localisation globale.
- **Gestion d'état** : Système de "Store" centralisé (`initialStoreData`) simulant une base de données.
- **Correction de Bugs** : Harmonisation des structures de données entre le `store.js` et les composants TypeScript pour éviter les erreurs de type (ex: `toLowerCase` sur les opportunités).
- **Persistance** : Les modifications via le portail Admin sont persistées dans l'état de l'application (perdues au rafraîchissement, à lier à une DB pour la prod).

## 4. Guide d'Installation Détaillé
1. **Prérequis** : 
   - Node.js (v18.0.0 ou supérieur)
   - npm ou yarn
2. **Installation** : 
   ```bash
   npm install
   ```
3. **Configuration** : 
   - Les variables d'environnement (si nécessaires pour la prod) sont à définir dans un fichier `.env`.
   - Pour le développement, aucune configuration supplémentaire n'est requise.
4. **Lancement du Développement** : 
   ```bash
   npm run dev
   ```
   L'application est alors disponible sur `http://localhost:3000`.
5. **Production** : 
   ```bash
   npm run build
   npm run preview # Pour tester le build localement
   ```

## 5. Guide d'Utilisation
- **Navigation** : Utilisez le menu principal pour accéder aux différents pôles (Mairie, Services, Économie).
- **Admin** : Accédez au portail d'administration via le lien "Admin-Portal" (simulé) pour gérer les contenus.
- **Services** : Les formulaires (Signalement, RDV) valident les données et simulent un envoi réussi avec retour visuel.

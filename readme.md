# 🗺️ OpportuniMap

**Centraliser les opportunités professionnelles au Burkina Faso — pour un accès équitable à l'information.**

Projet soumis pour le hackathon *"Défis mondiaux, solutions locales"* sur Devpost.

---

## Le problème

Au Burkina Faso, l'accès aux opportunités professionnelles (stages, concours, formations, événements) est inégal :

- Les opportunités sont concentrées dans les grandes villes, surtout Ouagadougou
- L'information circule surtout par bouche-à-oreille, WhatsApp ou Facebook
- Les étudiants des autres régions sont désavantagés, non par manque de mérite, mais par manque d'accès à l'information
- Il n'existe pas de plateforme unique qui centralise ces opportunités

## La solution

**OpportuniMap** centralise, organise et diffuse les opportunités professionnelles et éducatives en un seul endroit, avec filtrage et géolocalisation, pour un accès à l'information plus équitable dans tout le pays.

![Page d'accueil](../screenshots/home.png)

## Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| Centralisation | Stages, concours, formations, événements regroupés en un seul endroit |
| Filtrage intelligent | Recherche par type, domaine, ville |
| Carte interactive | Vue d'ensemble par ville + localisation par opportunité |
| Recommandations personnalisées | Mise en avant selon le domaine/ville du profil utilisateur |
| Notifications | Alertes pour les nouvelles opportunités |
| Ajout d'opportunités | Publication communautaire par les utilisateurs |
| Favoris | Sauvegarde pour postuler plus tard |
| Tableau de bord | Résumé personnel : favoris, publications, notifications |

![Liste des opportunités avec filtres](../screenshots/opportunities.png)

![Carte des opportunités par ville](../screenshots/map.png)

## Stack technique

**Backend** : Node.js, Express, PostgreSQL, JWT + bcrypt
**Frontend** : HTML / CSS / JavaScript, Leaflet + OpenStreetMap pour la carte

## Architecture

```
OpportunityMap/
├── backend/
│   ├── config/        # Connexion PostgreSQL
│   ├── models/        # Déclaration des tables
│   ├── controllers/    # Requêtes/réponses HTTP
│   ├── services/       # Logique métier + requêtes SQL
│   ├── routes/         # Endpoints de l'API
│   ├── middleware/     # Vérification JWT + erreurs
│   ├── seeds/           # Données de démonstration
│   └── server.js
└── frontend/
    ├── pages/
    ├── css/
    └── js/
```

## Installation

```bash
cd backend
npm install
```

Créer un fichier `.env` :
```env
DB_HOST=localhost
DB_USER=postgres
DB_NAME=opportunimap
DB_PASSWORD=votre_mot_de_passe
DB_PORT=5432
JWT_SECRET=une_longue_chaine_secrete
JWT_EXPIRES_IN=7d
PORT=5000
```

```bash
node seeds/seed-run.js   # remplit la base avec des données de démonstration
npm run dev
```

Le frontend s'ouvre directement dans un navigateur (`frontend/pages/index.html`) et communique avec l'API sur `http://localhost:5000/api`.

## Endpoints principaux de l'API

| Méthode | Endpoint | Protégé ? |
|---|---|---|
| POST | `/api/auth/register` | Non |
| POST | `/api/auth/login` | Non |
| GET | `/api/opportunities` | Non |
| POST | `/api/opportunities` | Oui |
| GET | `/api/favorites` | Oui |
| GET | `/api/notifications` | Oui |
| GET | `/api/dashboard` | Oui |

## Choix de conception

- **Données fictives** : la démonstration utilise des opportunités fictives, faute de partenariats réels établis à ce stade.
- **Carte au niveau ville uniquement** : puisque les données sont fictives, la carte affiche la ville plutôt qu'une adresse précise inventée, pour rester honnête sur ce qui est réellement vérifiable.
- **UUID plutôt qu'identifiants séquentiels** : empêche de deviner l'existence d'autres enregistrements dans la base.

![Détail d'une opportunité avec carte de localisation](../screenshots/detail.png)

## Sécurité

- Mots de passe hashés avec `bcrypt`
- Requêtes SQL paramétrées (prévention des injections SQL)
- Authentification JWT pour toute action de création/modification/suppression
- Vérification de propriété : seul le créateur peut modifier/supprimer son opportunité

## État actuel du projet

- **Backend** : complet et fonctionnel (authentification, opportunités, favoris, notifications, tableau de bord)
- **Frontend** : accueil, liste/filtrage/carte des opportunités et publication terminés — inscription, connexion, favoris, notifications, tableau de bord et profil en cours

## Utilisation de l'IA

Ce projet a été développé avec l'aide d'Antigravity, un éditeur de code intégrant des outils d'intelligence artificielle, utilisé pour structurer l'architecture backend, déboguer des erreurs, clarifier les bonnes pratiques de sécurité, et assister le développement du frontend. Les décisions de conception et l'implémentation finale ont été réalisées par Farida Garane, auteure du projet.
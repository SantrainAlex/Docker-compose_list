# Application de Gestion des Utilisateurs

Application web complète pour la gestion des utilisateurs avec une architecture moderne utilisant Angular, Node.js et MariaDB.

## Technologies Utilisées

- **Frontend** : Angular 16 avec Angular Material
- **Backend** : Node.js avec Express et Sequelize ORM
- **Base de données** : MariaDB 10.6
- **Conteneurisation** : Docker et Docker Compose

## Prérequis

- Docker
- Docker Compose

## Structure du Projet

```
docker-compose/
├── front/               # Application Angular
├── back/                # API Node.js
├── db/                  # Scripts de base de données
└── docker-compose.yml   # Configuration Docker Compose
```

## Configuration

### Variables d'Environnement

#### Backend
- `DB_HOST` : Hôte MariaDB
- `DB_USER` : Utilisateur de la base de données
- `DB_PASSWORD` : Mot de passe de la base de données
- `DB_NAME` : Nom de la base de données
- `DB_PORT` : Port MariaDB
- `PORT` : Port du backend
- `CORS_ORIGIN` : URL du frontend

#### Frontend
- `API_URL` : URL de l'API backend

## Démarrage

1. Cloner le dépôt :
```bash
git clone <repository-url>
cd docker-compose
```

2. Construire et démarrer les conteneurs :
```bash
docker-compose up -d
```

L'application sera accessible aux URLs suivantes :
- Frontend : http://localhost:8090
- Backend API : http://localhost:3000
- Base de données : localhost:3306

## Fonctionnalités

- Création d'utilisateurs (individuelle et en masse)
- Lecture de la liste des utilisateurs
- Suppression d'utilisateurs
- Validation des données
- Gestion des erreurs
- Sauvegarde automatique des données

## Volumes Docker

- `mariadb_data` : Données persistantes de la base
- `mariadb_config` : Configuration MariaDB
- `mariadb_backup` : Sauvegardes automatiques

## Réseau Docker

- Réseau bridge isolé
- Subnet : 172.20.0.0/16
- Communication sécurisée entre les services

## Maintenance

### Logs
- Rotation automatique des logs
- Taille maximale : 10MB par fichier
- 3 fichiers de rotation par service

### Sauvegardes
- Script automatique de backup dans `/db/backup.sh`
- Rétention des sauvegardes : 7 jours
- Compression automatique des backups

### Healthchecks
- MariaDB : Vérification de la connexion
- Services : Redémarrage automatique en cas de panne

## Bonnes Pratiques Implémentées

1. **Sécurité** :
   - Pas de mots de passe en dur
   - CORS configuré
   - Validation des données

2. **Performance** :
   - Configuration optimisée de MariaDB
   - Compression des backups
   - Gestion efficace des logs

3. **Maintenance** :
   - Scripts automatisés
   - Documentation complète
   - Logs structurés

## À Faire

1. **Sécurité** :
   - Ajouter une authentification JWT
   - Implémenter HTTPS
   - Ajouter une politique de mots de passe

2. **Fonctionnalités** :
   - Ajouter la modification d'utilisateurs
   - Implémenter la pagination
   - Ajouter des filtres de recherche

3. **Tests** :
   - Ajouter des tests unitaires
   - Ajouter des tests d'intégration
   - Configurer CI/CD

4. **Monitoring** :
   - Ajouter Prometheus
   - Configurer Grafana
   - Mettre en place des alertes

## Support

Pour toute question ou problème, veuillez ouvrir une issue dans le dépôt GitHub.

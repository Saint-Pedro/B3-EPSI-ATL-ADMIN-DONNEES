# Atelier Admin Données - B3 EPSI

## Liens

- **GitHub**: [https://github.com/Saint-Pedro/B3-EPSI-ATL-ADMIN-DONNEES](https://github.com/Saint-Pedro/B3-EPSI-ATL-ADMIN-DONNEES)
- **Documentation Swagger**: [https://b3-epsi-atl-admin-donnees.vercel.app/api-doc](https://b3-epsi-atl-admin-donnees.vercel.app/api-doc)

## Description du projet

Ce projet implémente une API RESTful pour la gestion d'une base de données de films, commentaires et cinémas en utilisant:
- **Next.js** comme framework fullstack
- **MongoDB** comme base de données
- **Swagger** pour la documentation automatisée

## Endpoints

### Movies
- `GET /api/movies` - Récupérer tous les films avec pagination
- `GET /api/movies/{idMovie}` - Récupérer un film par ID
- `POST /api/movies` - Créer un nouveau film
- `PUT /api/movies/{idMovie}` - Mettre à jour un film
- `DELETE /api/movies/{idMovie}` - Supprimer un film

### Comments
- `GET /api/comments` - Récupérer tous les commentaires avec pagination
- `GET /api/comments/{idComment}` - Récupérer un commentaire par ID
- `POST /api/comments` - Créer un nouveau commentaire
- `PUT /api/comments/{idComment}` - Mettre à jour un commentaire
- `DELETE /api/comments/{idComment}` - Supprimer un commentaire

### Theaters
- `GET /api/theaters` - Récupérer tous les cinémas avec pagination
- `GET /api/theaters/{idTheater}` - Récupérer un cinéma par ID
- `POST /api/theaters` - Créer un nouveau cinéma
- `PUT /api/theaters/{idTheater}` - Mettre à jour un cinéma
- `DELETE /api/theaters/{idTheater}` - Supprimer un cinéma

### Comments par Film
- `GET /api/movies/{idMovie}/comments` - Récupérer les commentaires d'un film
- `POST /api/movies/{idMovie}/comments` - Ajouter un commentaire à un film


## Configuration locale

Pour configurer et exécuter le projet en local :

1. Clonez le dépôt:
```
git clone https://github.com/Saint-Pedro/B3-EPSI-ATL-ADMIN-DONNEES.git
cd B3-EPSI-ATL-ADMIN-DONNEES
```

2. Installez les dépendances:
```
npm install
```

3. Créez un fichier `.env.local` avec la connexion MongoDB:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/sample_mflix
```

4. Lancez le serveur de développement:
```
npm run dev
```

5. Accédez à la documentation Swagger à l'adresse http://localhost:3000/api-doc

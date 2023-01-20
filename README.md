# TCG-Collect-api

Bienvenue sur le repository de l'API de mon application de gestion de collection de cartes Pokémon _TCG-Collect_.

Cette partie de l'application est le back-end qui gère les données et les interactions avec la base de données.

J'utilise Node.js avec le framework Express pour la gestion des routes, et TypeORM pour la gestion de la base de données PostgreSQL.

Pour l'instant, après s'être authentifié, les utilisateurs peuvent suivre leur collection de cartes, créer une liste de cartes recherchées et mettre en avant leurs cartes favorites.

Mais d'autres fonctionnalités sont à venir...

---

Steps to run this project:

1. Run `npm i` command
2. Setup the _.env_ file with the file _.env.example_
3. Setup the _docker-compose.yml_ file with the file _docker-compose.example_
4. Run `docker-compose up` command
5. Run `npm run start` command

---

Migration :

1. Run `npm run migration:generate` command
2. Run `npm run migration` command

---

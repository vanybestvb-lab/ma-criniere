# Backend Ma Crinière (NestJS + Prisma)

API REST pour produits, inventaire et livraisons. Utilise le schéma Prisma de `../admin/prisma`.

## Prérequis

- Node 18+
- Base de données déjà migrée (voir racine du projet)

## Installation

```bash
cd backend
npm install
npm run prisma:generate
```

Copier `.env.example` vers `.env` et ajuster `DATABASE_URL` (même base que l’admin).

## Lancement

```bash
npm run start:dev
```

API sur **http://localhost:3002** par défaut.

## Endpoints

| Méthode | Route | Description |
|--------|--------|-------------|
| GET | /admin/products | Liste des produits (avec images + inventory) |
| GET | /admin/products/by-slug/:slug | Produit par slug |
| GET | /admin/products/:id | Produit par id |
| POST | /admin/products | Créer un produit |
| PATCH | /admin/products/:id | Modifier un produit |
| GET | /admin/inventory | Liste des niveaux de stock |
| PATCH | /admin/inventory/:productId | Ajuster le stock (stockOnHand, stockReserved, lowStockThreshold) |
| GET | /admin/deliveries | Liste des livraisons |
| GET | /admin/deliveries/:id | Détail d’une livraison |
| PATCH | /admin/deliveries/:id | Mettre à jour statut (PENDING, IN_TRANSIT, DELIVERED), trackingCode, etc. |

# Mise en place Backend + produits fictifs (Ma Crinière)

## 1. Migration Prisma (admin)

Depuis la racine du projet :

```bash
cd admin
npx prisma migrate dev -n add_products_inventory_orders_deliveries
```

Ou depuis la racine :

```bash
npm run db:generate --prefix admin
npx prisma migrate dev -n add_products_inventory_orders_deliveries --schema=admin/prisma/schema.prisma
```

(Si vous utilisez `db:push` en dev sans migrations : `npm run db:push --prefix admin`.)

## 2. Seed (produits, stock, commandes, livraisons)

```bash
npm run db:seed --prefix admin
```

Ou :

```bash
cd admin
npx tsx prisma/seed.ts
```

Le seed :

- Lit `admin/seed/products.mock.json` (~30 produits Ma Crinière)
- Crée ou met à jour les produits (idempotent par `slug`)
- Crée les lignes d’inventaire (stock 5–120, seuil alerte 5–15)
- Crée ~20 commandes fictives avec 1–4 articles
- Crée les livraisons avec statuts PENDING / IN_TRANSIT / DELIVERED

## 3. Backend NestJS

```bash
cd backend
npm install
npm run prisma:generate
cp .env.example .env
# Éditer .env : DATABASE_URL doit pointer vers la même base que l’admin (ex: file:../admin/prisma/dev.db)
npm run start:dev
```

L’API est disponible sur **http://localhost:3002**.

## 4. Variables d’environnement

- **Racine (storefront Next.js)**  
  Créer `.env` avec :
  - `BACKEND_URL=http://localhost:3002` (pour charger les produits depuis l’API)
  - `NEXT_PUBLIC_ADMIN_API_URL=http://localhost:3001` (pour envoi des commandes)

- **Admin (Next.js)**  
  Dans `admin/.env` :
  - `BACKEND_URL=http://localhost:3002` (optionnel : si défini, produits / stock / livraisons viennent de l’API NestJS)
  - `CORS_ORIGIN=http://localhost:3000`
  - `DATABASE_URL=file:./dev.db` (ou chemin vers votre SQLite)

- **Backend (NestJS)**  
  Dans `backend/.env` :
  - `DATABASE_URL=file:../admin/prisma/dev.db` (ou chemin absolu vers le même fichier que l’admin)
  - `PORT=3002`
  - `CORS_ORIGIN=http://localhost:3000,http://localhost:3001`

## 5. Vérification

1. **Storefront** (`npm run dev:site`, port 3000) : la page Produits doit lister les produits venant de l’API si `BACKEND_URL` est défini.
2. **Admin** (`npm run dev --prefix admin`, port 3001) : Produits, Stock, Livraisons affichent les données (Prisma ou API selon `BACKEND_URL`).
3. **Backend** (port 3002) : `GET http://localhost:3002/admin/products` doit retourner les produits en JSON.

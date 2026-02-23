# Ma Crinière — Back-Office Admin

Back-office Next.js 14 (App Router) pour gérer commandes, produits, stock, clients, paiements, livraison, promotions, CMS, rapports et paramètres.

## Stack

- **Next.js 14** (App Router, Server Actions)
- **Prisma** (PostgreSQL)
- **Tailwind CSS**
- **TypeScript** (strict)
- **Recharts** (graphiques), **Zod** (validation), **date-fns**, **bcryptjs** (auth)

## Prérequis

- Node.js 18+
- Une base PostgreSQL (locale ou en ligne)

## Base de données (gratuit, sans install)

Pour une base **gratuite en ligne** (Neon ou Supabase), tout est détaillé ici :  
**[SETUP-DATABASE.md](./SETUP-DATABASE.md)**  
En résumé : inscription sur [Neon](https://console.neon.tech/signup) → copier l’URL de connexion → la coller dans `admin/.env` en `DATABASE_URL`.

## Installation

```bash
cd admin
npm install
cp .env.example .env
# Mettre ta DATABASE_URL dans .env (voir SETUP-DATABASE.md)
npm run db:generate
npm run db:push
npm run db:seed
```

## Démarrage

- **Dev** : `npm run dev` (serveur sur http://localhost:3001)
- **Build** : `npm run build`
- **Prod** : `npm run start`

## Auth

- Connexion : `/admin/login`
- Compte seed : `admin@ma-criniere.com` / `admin123`
- Variable d’environnement `SKIP_AUTH=1` pour désactiver l’auth (dev).

## En cas d’erreur EPERM (Windows)

Si `npm run db:generate` affiche **EPERM** ou « operation not permitted », voir **[DEPANNAGE.md](./DEPANNAGE.md)** (fermer Cursor/serveur, OneDrive, lancer en admin).

## Base de données

- **Prisma Studio** : `npm run db:studio`
- **Migrations** : `npm run db:migrate`
- **Seed** : `npm run db:seed`

## Structure (résumé)

- `src/app/admin/` — routes admin (dashboard, orders, products, stock, customers, payments, shipments, promotions, cms, reports, settings, login)
- `src/app/admin/orders/[id]/` — détail commande (timeline, confirmer paiement, bon de préparation)
- `src/lib/` — Prisma, auth (rôles/permissions), audit
- `src/services/` — dashboard.service
- `src/components/` — PrintButton, AdminShell
- `prisma/schema.prisma` — schéma complet (User RBAC, Order, Product, Payment, Shipment, Coupon, etc.)

## Rôles (RBAC)

- `SUPER_ADMIN` — accès total
- `MANAGER` — ordres, produits, stock, clients, paiements, livraisons, promos, CMS, rapports, paramètres
- `STOCK_MANAGER` — produits, stock, lecture commandes
- `SUPPORT` — commandes, clients (lecture)
- `MARKETING` — promos, CMS, lecture rapports
- `ACCOUNTANT` — lecture commandes, paiements, rapports

Les guards par rôle peuvent être branchés dans les Server Actions et les pages (via session).

## À compléter (suggestions)

- Pagination sur les listes (composant + paramètre `page`)
- CRUD produits (création/édition, variantes, images, SEO)
- Fiche client (détail, notes, segmentation)
- Remboursement partiel, facture PDF, création expédition
- CRUD coupons, pages CMS, bannières
- Export CSV rapports
- Appels à `createAuditLog` dans toutes les actions sensibles
- NextAuth (optionnel) pour session plus robuste

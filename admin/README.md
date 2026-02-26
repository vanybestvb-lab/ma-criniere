# Ma Crinière — Back-Office Admin

Back-office Next.js 14 (App Router) pour gérer commandes, produits, stock, clients, paiements, livraison, promotions, CMS, rapports et paramètres.

## Stack

- **Next.js 14** (App Router, Server Actions)
- **Prisma** (SQLite en dev, PostgreSQL en production / Vercel)
- **Tailwind CSS**
- **TypeScript** (strict)
- **Recharts** (graphiques), **Zod** (validation), **date-fns**, **bcryptjs** (auth)

## Prérequis

- Node.js 18+
- **Dev** : rien de plus (SQLite par défaut). **Production (Vercel)** : base PostgreSQL (Neon, Supabase…).

## Base de données

- **Dev local** : par défaut `admin/.env` utilise SQLite (`DATABASE_URL="file:./prisma/dev.db"`). Après `npm install`, lancer `npm run db:push` puis `npm run db:seed`.
- **Production (Vercel)** : PostgreSQL obligatoire. Voir **[SETUP-DATABASE.md](./SETUP-DATABASE.md)** et **[.env.production.example](./.env.production.example)**. Sur Vercel, le build utilise `schema.postgresql.prisma` ; en base, exécuter `npm run db:migrate` puis `npm run db:seed` (avec `DATABASE_URL` PostgreSQL).

## Installation

```bash
cd admin
npm install
cp .env.example .env
# .env contient déjà SQLite pour le dev ; pour la prod voir SETUP-DATABASE.md
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
- **Dev (SQLite)** : `npm run db:push`, `npm run db:seed`
- **Prod (PostgreSQL)** : `npm run db:migrate` (applique les migrations), puis `npm run db:seed` si besoin

## Structure (résumé)

- `src/app/admin/` — routes admin (dashboard, orders, products, stock, customers, payments, shipments, promotions, cms, reports, settings, login)
- `src/app/admin/orders/[id]/` — détail commande (timeline, confirmer paiement, bon de préparation)
- `src/lib/` — Prisma, auth (rôles/permissions), audit
- `src/services/` — dashboard.service
- `src/components/` — PrintButton, AdminShell
- `prisma/schema.prisma` — schéma SQLite (dev). `prisma/schema.postgresql.prisma` — même schéma pour PostgreSQL (prod / Vercel).

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

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

- **Dev local** : par défaut `admin/.env` utilise SQLite (`DATABASE_URL="file:./dev.db"`). Après `npm install`, lancer `npm run db:push` puis `npm run db:seed` **depuis le dossier `admin/`**.
- **Production (Vercel)** : PostgreSQL obligatoire. Voir **[SETUP-DATABASE.md](./SETUP-DATABASE.md)** et **[.env.production.example](./.env.production.example)**. Les migrations sont appliquées automatiquement au build ; une fois le 1er déploiement fait, exécuter **`npm run db:seed`** en local (avec la même `DATABASE_URL` Neon) pour créer le compte admin.

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

- **Dev** : depuis **`admin/`**, `npm run dev` (serveur sur http://localhost:3001)
- **Build** : `npm run build`
- **Prod** : `npm run start`

## Déploiement Vercel

1. **Projet Vercel** : importer le repo, définir le **Root Directory** sur **`admin`** (si le dépôt contient tout le monorepo).
2. **Variables d’environnement** (Settings → Environment Variables) :
   - **`DATABASE_URL`** : URL PostgreSQL (Neon, Supabase…), ex. `postgresql://...?sslmode=require`
   - **`NEXTAUTH_SECRET`** : chaîne aléatoire sécurisée
   - **`NEXTAUTH_URL`** : URL de l’app déployée, ex. `https://ton-projet.vercel.app`
3. **Déployer** : le build exécute `prisma migrate deploy` (création/mise à jour des tables).
4. **Une fois** : en local, avec la même `DATABASE_URL` dans `admin/.env`, lancer `npm run db:generate:prod` puis `npm run db:seed` pour créer le compte admin (admin@ma-criniere.com / admin123).

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

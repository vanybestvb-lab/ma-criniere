# Déployer Ma Crinière sur Vercel — Guide pas à pas

Ce guide décrit comment déployer **deux projets Vercel** à partir du même dépôt GitHub :
1. **Site vitrine** (boutique) — Next.js à la racine
2. **Dashboard admin** — Next.js dans `admin/`

---

## Vue d’ensemble

| Projet    | Racine  | Framework | Rôle |
|-----------|---------|-----------|------|
| Site vitrine | `.` (racine du repo) | Next.js | Accueil, produits, panier, checkout |
| Admin     | `admin` | Next.js   | Back-office (commandes, stock, etc.) |

Tu vas créer **2 projets** sur Vercel, tous les deux connectés au même repo, avec une **Root Directory** différente pour chacun.

---

# Partie 1 — Site vitrine (boutique)

## Étape 1.1 : Créer le projet Vercel

1. Va sur [vercel.com](https://vercel.com) et connecte-toi.
2. **Add New…** → **Project**.
3. **Import** le dépôt GitHub **ma-criniere** (ou connecte-le s’il ne l’est pas encore).
4. Donne un nom au projet, par ex. **ma-criniere** ou **ma-criniere-site**.

## Étape 1.2 : Configurer le build (site vitrine)

1. **Root Directory** : laisse **vide** (racine du repo).
2. **Framework Preset** : **Next.js** (détecté automatiquement).
3. **Build Command** : laisse par défaut (**`npm run build`**).
4. **Output Directory** : laisse par défaut.
5. **Install Command** : laisse par défaut (**`npm install`**).
6. Clique sur **Deploy** (tu peux d’abord déployer sans variables pour vérifier que le build passe).

## Étape 1.3 : Variables d’environnement (optionnel)

Dans **Settings** → **Environment Variables** du projet **site vitrine** :

| Variable | Valeur | Quand |
|----------|--------|--------|
| `NEXT_PUBLIC_ADMIN_API_URL` | URL de l’admin, ex. `https://ma-criniere-admin.vercel.app` | Pour que le checkout envoie les commandes à l’admin (à remplir après avoir déployé l’admin). |
| `BACKEND_URL` | URL du backend NestJS si tu en déploies un (ex. Railway) | Optionnel ; sans ça, les données viennent des mocks. |

Enregistre, puis **Redeploy** si tu as ajouté des variables après le premier déploiement.

## Étape 1.4 : Vérifier

- L’URL du site sera du type : **`https://ma-criniere-xxx.vercel.app`**.
- Tu dois voir la page d’accueil (hero, produits, etc.).

---

# Partie 2 — Dashboard admin

## Étape 2.1 : Créer un second projet Vercel

1. **Add New…** → **Project**.
2. Choisis à nouveau le dépôt **ma-criniere**.
3. Donne un nom différent, par ex. **ma-criniere-admin**.

## Étape 2.2 : Configurer le build (admin)

1. **Root Directory** : clique sur **Edit** et indique **`admin`** (sans slash). C’est indispensable.
2. **Framework Preset** : **Next.js**.
3. **Build Command** : laisse par défaut (**`npm run build`**). Le `package.json` de `admin/` exécute déjà Prisma generate + migrations + Next build.
4. **Install Command** : **`npm install`**.
5. Clique sur **Deploy**.

## Étape 2.3 : Variables d’environnement (obligatoire pour l’admin)

Dans **Settings** → **Environment Variables** du projet **admin** :

| Variable | Valeur | Environnement |
|----------|--------|----------------|
| **`DATABASE_URL`** | URL PostgreSQL (Neon), ex. `postgresql://USER:PASSWORD@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require` | Production (et Preview si tu veux) |
| **`NEXTAUTH_SECRET`** | Chaîne aléatoire sécurisée (ex. [generate-secret.vercel.app](https://generate-secret.vercel.app/32)) | Production (et Preview) |
| **`NEXTAUTH_URL`** | URL de l’admin, ex. `https://ma-criniere-admin.vercel.app` (sans slash final) | Production (et Preview) |

Coche **Production** (et **Preview** si tu utilises les déploiements de branches). Puis **Save** et **Redeploy**.

## Étape 2.4 : Créer le compte admin en base (une seule fois)

Après le **premier** déploiement réussi de l’admin :

1. Ouvre **`admin/.env`** en local.
2. Remplace temporairement **`DATABASE_URL`** par la **même** URL Neon que sur Vercel.
3. Dans un terminal, depuis **`admin/`** :
   ```bash
   cd admin
   npm run db:generate:prod
   npm run db:seed
   ```
4. Remets **`DATABASE_URL="file:./dev.db"`** dans `admin/.env` pour continuer en dev avec SQLite.

Tu pourras alors te connecter sur l’URL admin avec **admin@ma-criniere.com** / **admin123**.

## Étape 2.5 : Vérifier

- Ouvre **`https://ton-admin.vercel.app/admin/login`**.
- Le message « Base de données inaccessible » ne doit plus s’afficher.
- Connexion avec **admin@ma-criniere.com** / **admin123**.

---

# Partie 3 — Lier site vitrine et admin (optionnel)

Pour que les commandes du checkout du **site** soient envoyées à l’**admin** :

1. Dans le projet Vercel **site vitrine**, va dans **Settings** → **Environment Variables**.
2. Ajoute **`NEXT_PUBLIC_ADMIN_API_URL`** = l’URL de ton admin (ex. `https://ma-criniere-admin.vercel.app`).
3. Redéploie le site vitrine.

Côté admin, si tu as une variable **CORS** ou une config CORS, ajoute l’URL du site vitrine dans les origines autorisées.

---

# Récapitulatif

| Étape | Site vitrine | Admin |
|-------|--------------|--------|
| 1 | Créer projet, Root = (vide) | Créer projet, Root = **admin** |
| 2 | Build = `npm run build` | Build = `npm run build` (déjà avec Prisma) |
| 3 | Variables optionnelles (admin API, backend) | **DATABASE_URL**, **NEXTAUTH_SECRET**, **NEXTAUTH_URL** obligatoires |
| 4 | — | Une fois : **db:seed** en local avec l’URL Neon |

Les deux projets se redéploient automatiquement à chaque **push** sur la branche connectée (souvent `main`).

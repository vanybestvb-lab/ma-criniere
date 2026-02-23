# Rapport d'analyse — Ma Crinière (Next.js & Vercel)

## 1. Structure actuelle du projet

### Racine du dépôt
| Élément | Type | Rôle |
|--------|------|------|
| `package.json` | Config | `build`: `tsc`, `serve`: `serve . -p 3000`, `dev` → admin |
| `tsconfig.json` | TS | Compile `src/**/*.ts` → `js/` (ES2020) |
| `index.html`, `produits.html`, `panier.html`, `checkout.html`, `product.html`, `a-propos.html` | HTML statique | Site vitrine / e‑commerce front |
| `styles.css` | CSS | ~2100 lignes, charte Ma Crinière (variables, header, footer, produits, etc.) |
| `script.js` | JS | Menu mobile, comportements communs |
| `js/*.js` | JS modules | `panier.js`, `checkout.js`, `product-page.js`, `products-listing.js`, `cart-badge.js`, `cart-store.js`, `order-store.js`, `products-data.js`, `types.js` |
| `src/*.ts` | TypeScript | Sources compilées en `js/` (ex. `cart-store.ts`, `checkout.ts`, `types.ts`) |
| `Images Sites Macrinère/` | Assets | Logos et images produits (référencés dans le HTML/CSS) |

### Dossier `admin/`
| Élément | Type | Rôle |
|--------|------|------|
| Next.js 14.2.18 | App Router | `src/app/`, `src/app/admin/` |
| `next.config.js` | Config | `reactStrictMode`, `serverComponentsExternalPackages: ["@prisma/client", "prisma"]` |
| Prisma | BDD | `prisma/schema.prisma`, SQLite (ou autre via `DATABASE_URL`) |
| Port | Dev | 3001 (`npm run dev`) |

**Conclusion :** Deux parties distinctes — **site statique (racine)** et **back-office Next.js (`admin/`)**. Aucun conflit de build entre les deux : la racine utilise `tsc` + `serve`, l’admin utilise `next build`.

---

## 2. Erreurs et points d’attention identifiés

### 2.1 Racine (site statique)
- **Pas de Next.js à la racine** : le `build` actuel est uniquement `tsc` (compilation TS → `js/`). Aucune commande `next build` à la racine.
- **Liens en `.html`** : tous les `<a href="index.html">` etc. — à migrer en routes Next.js avec `<Link href="/">` si on passe le front en Next.js.
- **Images** : chemins du type `Images Sites Macrinère/Logo Ma Crinière Violet.png` (espaces, caractères spéciaux) — à placer dans `public/` et à adapter les chemins (ou utiliser `next/image` avec `/images/...`).
- **Scripts panier/checkout** : logique en JS/TS (localStorage, formulaire multi-étapes). Une migration Next.js devra reprendre cette logique en React (client components) ou via API.

### 2.2 Admin (Next.js)
- **Déjà corrigé** : conflit de nom `dynamic` (import next/dynamic vs `export const dynamic`) → renommé en `nextDynamic`.
- **Déjà corrigé** : Recharts en Server Component → composant client `DashboardChart` + `nextDynamic(..., { ssr: false })`.
- **Déjà corrigé** : Server Action `confirmOrderPayment` retournait `{ ok, error }` alors que l’action de formulaire doit retourner `void` → retour `Promise<void>` + `redirect()` en cas d’erreur.
- **next.config.js** : pas d’`output: 'standalone'` (optionnel sur Vercel, utile seulement pour déploiement Docker/self‑hosted).
- **Variables d’environnement** : Prisma utilise `DATABASE_URL` (ex. dans `admin/.env`) — à configurer dans Vercel (Project → Settings → Environment Variables).

### 2.3 package.json racine
- **Script `dev`** : `npm run dev --prefix admin` — lance uniquement l’admin, pas le site statique. Cohérent si le front reste statique servi par `serve`.
- **Aucune dépendance Next.js à la racine** : normal tant que le front n’est pas migré en Next.js.

---

## 3. Conflits structure HTML vs Next.js

- Il n’y a **pas de conflit** technique : les HTML sont à la racine, l’app Next.js est dans `admin/`. Ils ne partagent pas le même `next build`.
- **Conflit “logique”** : pour un déploiement unique sur Vercel, il faut soit :
  - **Option A** : un seul projet Vercel “Admin” avec Root Directory = `admin` (déployer uniquement l’admin), et garder le site statique ailleurs (Netlify, autre, ou second projet Vercel en static).
  - **Option B** : migrer le site vitrine en Next.js à la racine (nouvelle app Next.js avec `app/`, `public/`, etc.) et avoir **deux projets Vercel** : un pour la racine (boutique), un pour `admin` (back-office).

---

## 4. Corrections effectuées (dans ce chantier)

1. **admin/src/app/admin/dashboard/page.tsx**  
   - Conflit `dynamic` : import renommé en `nextDynamic`, utilisation `nextDynamic(..., { ssr: false })` pour le graphique.

2. **admin/src/app/admin/orders/actions.ts**  
   - `confirmOrderPayment` : type de retour `Promise<void>`, plus de `return { ok, error }`, utilisation de `redirect()` en cas d’erreur, `revalidatePath` conservé.

3. **Rapport** : création de ce fichier et du plan de déploiement ci‑dessous.

---

## 5. Compatibilité Vercel — Admin

- **Build** : dans le dossier `admin`, exécuter `npm install` puis `npm run build`.  
- **next.config.js** : valide pour Vercel (pas de configuration bloquante).  
- **Prisma** : le script `postinstall` lance `prisma generate` — à conserver. Sur Vercel, définir `DATABASE_URL` (ex. Postgres ou autre fourni par Vercel/addon).  
- **Recommandation** : ne pas ajouter `output: 'standalone'` sauf besoin de déploiement non‑Vercel.

---

## 6. Commandes exactes pour déployer sur Vercel

### Déployer uniquement l’admin (recommandé en premier)

1. Sur [vercel.com](https://vercel.com), importer le repo Git (ma-criniere).
2. **Root Directory** : `admin`.
3. **Build Command** : `npm run build` (ou laisser par défaut).
4. **Install Command** : `npm install`.
5. **Variables d’environnement** : ajouter `DATABASE_URL` (et toute autre variable utilisée par l’admin, ex. secrets auth).
6. Déployer.

En local, vérification du build admin :

```bash
cd admin
npm install
npm run build
```

### Déployer ensuite le site vitrine (après migration Next.js à la racine)

Si une app Next.js est ajoutée à la racine (voir section 7) :

1. Créer un **second projet** Vercel lié au même repo.
2. **Root Directory** : laisser vide (racine).
3. **Build Command** : `npm run build` (celui de la racine = `next build`).
4. **Install Command** : `npm install`.
5. Déployer.

---

## 7. Fichiers à modifier manuellement (si besoin)

- **admin/.env** : ne pas commiter. Sur Vercel, configurer `DATABASE_URL` (et autres secrets) dans les Environment Variables.
- **Racine** : si migration du site en Next.js, il faudra :
  - Créer `app/layout.tsx`, `app/page.tsx`, `app/globals.css` (ou importer `styles.css`), composants Header/Footer.
  - Créer les routes : `/produits`, `/produits/[slug]`, `/panier`, `/checkout`, `/a-propos`.
  - Copier/déplacer les images dans `public/images/` et remplacer les chemins (ou utiliser `next/image` avec `/images/...`).
  - Adapter la logique panier/checkout en React (client components + state ou API).

---

## 8. Résumé

| Élément | État |
|--------|------|
| Structure analysée | OK |
| Conflits HTML / Next.js identifiés | Aucun conflit de build ; deux stratégies de déploiement possibles |
| Erreurs admin corrigées | Conflit `dynamic`, Recharts RSC, Server Action retour |
| Admin prêt Vercel | Oui (après `DATABASE_URL` et `npm run build` dans `admin`) |
| Site vitrine Next.js | **Migré** : app Next.js à la racine avec `/`, `/produits`, `/produits/[slug]`, `/panier`, `/checkout`, `/a-propos` |

---

## 9. Migration storefront (racine) — réalisée

- **next.config.js** à la racine : `reactStrictMode`, `images.unoptimized: true`.
- **package.json** racine : `build` = `next build`, dépendances `next`, `react`, `react-dom` ; script `dev:site` = `next dev -p 3000`.
- **tsconfig.json** racine : config compatible Next.js (jsx preserve, paths `@/*`), `exclude: ["admin"]`.
- **app/layout.tsx** : import de `../styles.css`, polices Google, composants `Header` et `Footer`.
- **components/Header.tsx** et **components/Footer.tsx** : navigation avec `Link` (Next.js), images avec `next/image` (chemins `/Images Sites Macrinère/...`).
- **Pages** : `app/page.tsx` (accueil), `app/produits/page.tsx`, `app/produits/[slug]/page.tsx`, `app/panier/page.tsx`, `app/checkout/page.tsx`, `app/a-propos/page.tsx`. Liens en `Link`, plus de `.html`.

### Images (à faire une fois)

Pour que les images s’affichent sur le site Next.js (racine), **copiez le dossier** `Images Sites Macrinère` (à la racine du repo) **dans** `public/`. Vous devez obtenir :

`public/Images Sites Macrinère/Logo Ma Crinière Violet.png`  
`public/Images Sites Macrinère/Logo Ma Crinière.png`  
et tous les autres fichiers (Produit 1.jpg, Produit 2.jpg, etc.).

Sous PowerShell à la racine du projet :

```powershell
Copy-Item -Path "Images Sites Macrinère" -Destination "public\" -Recurse -Force
```

---

## 10. Commandes exactes pour déployer sur Vercel

### Projet 1 — Site vitrine (racine)

1. Vercel → Import Git repo **ma-criniere**.
2. **Root Directory** : laisser **vide** (racine).
3. **Build Command** : `npm run build` ( = `next build`).
4. **Install Command** : `npm install`.
5. Déployer.

Vérification en local (racine) :

```bash
cd c:\Users\vanyb\OneDrive\Documents\GitHub\ma-criniere
npm install
npm run build
npm run dev:site
```

Puis ouvrir http://localhost:3000.

### Projet 2 — Admin

1. Nouveau projet Vercel (ou second projet lié au même repo).
2. **Root Directory** : `admin`.
3. **Build Command** : `npm run build`.
4. **Install Command** : `npm install`.
5. **Variables d’environnement** : `DATABASE_URL` (et tout autre secret).
6. Déployer.

Vérification en local :

```bash
cd admin
npm install
npm run build
```

---

Ce rapport peut servir de base pour la suite de la migration et le déploiement.

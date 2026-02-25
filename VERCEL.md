# Déployer Ma Crinière sur Vercel

Ce guide décrit comment déployer le **site vitrine / boutique** (storefront) sur Vercel.

## Ce qui est déployé

- **Racine du repo** = application Next.js du **site public** (accueil, produits, panier, checkout).
- L’**admin** (`admin/`) et le **backend** NestJS (`backend/`) ne sont pas déployés par ce projet Vercel. Tu peux les héberger séparément (Railway, Render, autre projet Vercel, etc.).

---

## 1. Prérequis

- Compte [Vercel](https://vercel.com)
- Projet poussé sur **GitHub** (ou GitLab / Bitbucket)

---

## 2. Importer le projet sur Vercel

1. Va sur [vercel.com](https://vercel.com) et connecte-toi.
2. **Add New…** → **Project**.
3. **Import** ton dépôt Git `ma-criniere`.
4. Vercel détecte Next.js à la racine. Vérifie :
   - **Root Directory** : `./` (laisser par défaut).
   - **Framework Preset** : Next.js.
   - **Build Command** : `npm run build` (ou laisser vide pour utiliser `vercel.json`).
   - **Output Directory** : laisser par défaut.

---

## 3. Variables d’environnement

Dans **Settings → Environment Variables** du projet Vercel, ajoute :

| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| `NEXT_PUBLIC_ADMIN_API_URL` | URL de l’admin (pour envoi des commandes depuis le checkout). Ex. `https://ton-admin.vercel.app` ou une URL Railway/Render. | Non (sans ça, les commandes restent en localStorage) |
| `NEXT_PUBLIC_BACKEND_URL` ou `BACKEND_URL` | URL du backend NestJS (produits, stock). Ex. `https://ton-backend.railway.app` | Non (sans ça, les produits viennent des mocks / données en dur) |

- Pour que le **navigateur** puisse appeler l’API admin (checkout), il faut **`NEXT_PUBLIC_ADMIN_API_URL`** (préfixe `NEXT_PUBLIC_`).
- Pour le chargement des produits côté serveur, **`BACKEND_URL`** ou **`NEXT_PUBLIC_BACKEND_URL`** suffit.

Déploie à nouveau après avoir ajouté les variables.

---

## 4. Déployer

- **Déploiement automatique** : à chaque push sur la branche connectée (souvent `main`), Vercel rebuild et redéploie.
- **Déploiement manuel** : depuis le dashboard Vercel, onglet **Deployments** → **Redeploy**.

---

## 5. Après le déploiement

- L’URL du site sera du type : `https://ma-criniere-xxx.vercel.app` (ou ton domaine personnalisé).
- Si tu as configuré **CORS** côté admin, mets l’URL Vercel du site dans les origines autorisées (ex. `CORS_ORIGIN=https://ton-site.vercel.app`).
- Pour que le checkout envoie les commandes à l’admin, l’admin doit être en ligne et **`NEXT_PUBLIC_ADMIN_API_URL`** doit pointer vers son URL.

---

## Résumé des commandes (en local)

```bash
# Vérifier le build avant de pousser
npm install
npm run build
```

Si le build passe en local, il devrait passer sur Vercel.

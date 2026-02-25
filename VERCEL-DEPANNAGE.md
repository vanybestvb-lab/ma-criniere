# Vercel : ça ne marche plus — quoi vérifier

## 1. Voir l’erreur exacte sur Vercel

1. Va sur [vercel.com](https://vercel.com) → ton projet **ma-criniere**.
2. Onglet **Deployments** : ouvre le **dernier déploiement** (en haut).
3. Regarde le **statut** :
   - **Building** puis **Error** → le build a échoué. Clique sur le déploiement puis **Building** pour voir les **logs** (erreur TypeScript, npm, etc.).
   - **Ready** mais le site affiche une erreur → problème au **runtime**. Ouvre l’URL du site, note le message (ex. 500, “Application error”). Dans le déploiement, regarde **Functions** / **Runtime Logs** s’il y en a.

Sans le message d’erreur exact (build ou runtime), on ne peut pas cibler la cause.

---

## 2. Build qui échoue

- **Node / npm** : dans **Settings → General**, vérifie **Node.js Version** (ex. 18.x). Tu peux forcer une version dans `package.json` :
  ```json
  "engines": { "node": ">=18" }
  ```
- **Dépendances** : dans les logs de build, cherche `npm ERR!` ou `Module not found`. Si une dépendance a changé, fais `npm install` puis `npm run build` en local et corrige jusqu’à ce que le build passe.
- **TypeScript / ESLint** : une erreur de type ou de lint peut faire échouer le build. Corrige en local puis repousse.

---

## 3. Site “Ready” mais page blanche ou 500

- **Variables d’environnement** : **Settings → Environment Variables**. Si le site appelle une API (admin, backend), vérifie que les URLs sont bien celles de **production** (pas `localhost`). Les variables avec `NEXT_PUBLIC_` doivent être définies pour que le front les voie.
- **CORS** : si le site sur Vercel appelle ton admin ou ton backend, l’admin/backend doit autoriser l’origine Vercel (ex. `https://ton-site.vercel.app`) dans `CORS_ORIGIN` (ou équivalent).

---

## 4. Tester le build en local

Dans le dossier du **site** (racine du repo) :

```bash
cd C:\Users\vanyb\OneDrive\Documents\GitHub\ma-criniere
npm install
npm run build
```

Si le build échoue ici, tu verras la même erreur (ou une proche) sur Vercel. Corrige jusqu’à ce que `npm run build` réussisse, puis commit + push pour redéployer.

---

## 5. Images cassées

Les images du site doivent être dans **`public/`** et **versionnées sur Git**. Si le dossier `public/Images Sites Macrinère/` ne contient que `.gitkeep` et pas les vrais fichiers, sur Vercel les images ne s’afficheront pas. Ajoute les images dans ce dossier et commit-les (ou héberge-les ailleurs et mets les URLs dans le code).

---

## Résumé

1. **Lire les logs** du dernier déploiement (build + éventuellement runtime).
2. **Lancer `npm run build`** à la racine et corriger les erreurs.
3. **Vérifier** les variables d’environnement et les URLs (production, pas localhost).
4. **Vérifier** que les images sont bien dans `public/` et poussées sur le repo.

Si tu peux copier-coller le message d’erreur exact (build ou écran), on pourra cibler la correction.

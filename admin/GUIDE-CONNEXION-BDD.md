# Comment connecter le back-office à une base en ligne (étape par étape)

Ce guide permet que la page de connexion admin ne affiche plus « Base de données inaccessible » et que le back-office fonctionne sur Vercel.

---

## Étape 1 : Créer une base de données gratuite (Neon)

1. Ouvre ton navigateur et va sur : **https://console.neon.tech/signup**
2. Inscris-toi (avec GitHub, Google ou ton email).
3. Une fois connecté, clique sur **New Project**.
4. Donne un nom au projet (ex. `ma-criniere`) et valide.
5. Sur la page du projet, clique sur **Connect** (ou « Connection string »).
6. Dans le menu, choisis **Prisma**.
7. **Copie** l’URL affichée (elle ressemble à :  
   `postgresql://vanyb:PASSWORD@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require`).  
   Garde-la sous la main pour l’étape 2.

---

## Étape 2 : Mettre l’URL dans le projet (en local)

1. Ouvre ton projet **ma-criniere** dans Cursor (ou ton éditeur).
2. Ouvre le fichier **`admin/.env`** (s’il n’existe pas, copie **`admin/.env.example`** et renomme la copie en **`.env`**).
3. Modifie (ou ajoute) la ligne **`DATABASE_URL`** et colle l’URL Neon entre guillemets :
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require"
   ```
   (Remplace par **ta** vraie URL copiée à l’étape 1.)
4. Enregistre le fichier.

---

## Étape 3 : Créer les tables et le compte admin (en local)

1. Ouvre un **terminal** (dans Cursor : Terminal → New Terminal, ou PowerShell).
2. Va dans le dossier **admin** :
   ```bash
   cd admin
   ```
   (Si tu es à la racine du projet : `cd admin`.)
3. Lance ces deux commandes l’une après l’autre :
   ```bash
   npm run db:push
   ```
   puis :
   ```bash
   npm run db:seed
   ```
4. Si tout se passe bien, tu vois des messages de succès. Les tables sont créées dans Neon et le compte **admin@ma-criniere.com** / **admin123** est créé.

---

## Étape 4 : Donner l’URL à Vercel

1. Va sur **https://vercel.com** et connecte-toi.
2. Ouvre le **projet** qui déploie l’admin (celui dont l’URL est ton back-office).
3. Clique sur **Settings** (Paramètres).
4. Dans le menu de gauche, clique sur **Environment Variables**.
5. Clique sur **Add New** (ou « Add »).
6. Renseigne :
   - **Name** : `DATABASE_URL`
   - **Value** : colle **exactement la même** URL Neon que dans `admin/.env`  
     (ex. `postgresql://USER:PASSWORD@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require`)
   - **Environments** : coche au moins **Production** (et **Preview** si tu veux que les prévisualisations utilisent aussi la BDD).
7. Clique sur **Save**.

---

## Étape 5 : Redéployer l’admin sur Vercel

1. Toujours sur la page du projet Vercel.
2. Va dans l’onglet **Deployments**.
3. Sur le **dernier déploiement**, clique sur les **trois points** (⋮) puis **Redeploy** (ou « Redéployer »).
4. Attends la fin du déploiement (quelques dizaines de secondes).

---

## Vérification

1. Ouvre l’URL de ton **back-office** (ex. `https://ton-admin.vercel.app/admin/login`).
2. Tu ne dois plus voir « Base de données inaccessible ».
3. Connecte-toi avec : **admin@ma-criniere.com** / **admin123**.

Si tu vois encore « Base de données inaccessible », vérifie que :
- l’URL dans **`admin/.env`** et dans **Vercel → Environment Variables** est **identique** ;
- tu as bien fait **db:push** et **db:seed** dans `admin/` ;
- tu as bien **redéployé** après avoir ajouté `DATABASE_URL` sur Vercel.

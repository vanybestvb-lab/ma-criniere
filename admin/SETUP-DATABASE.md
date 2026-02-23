# Configurer la base de données (gratuit)

Tu peux utiliser **Neon** (PostgreSQL en ligne, gratuit) sans rien installer.

## Option 1 : Neon (recommandé, ~2 min)

1. **Créer un compte**  
   Ouvre : [https://console.neon.tech/signup](https://console.neon.tech/signup)  
   Inscris-toi avec GitHub, Google ou ton email.

2. **Créer un projet**  
   Après connexion, crée un projet (nom au choix, ex. `ma-criniere`).  
   La région peut rester par défaut.

3. **Récupérer l’URL de connexion**  
   Sur le tableau de bord du projet :
   - Clique sur **Connect** (ou « Connection string »).
   - Choisis **Prisma** dans le menu (ou copie la chaîne « Connection string »).
   - Copie l’URL, elle ressemble à :
     ```txt
     postgresql://USER:PASSWORD@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require
     ```

4. **La mettre dans le projet**  
   Ouvre le fichier **`admin/.env`** et remplace la ligne `DATABASE_URL` par ta chaîne (garde les guillemets) :
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require"
   ```
   Enregistre le fichier.

5. **Créer les tables et les données de test**  
   Dans un terminal, depuis la racine du repo :
   ```bash
   cd admin
   npm run db:push
   npm run db:seed
   ```
   Puis lance l’admin :
   ```bash
   npm run dev
   ```
   Connexion possible avec : **admin@ma-criniere.com** / **admin123**.

---

## Option 2 : Supabase (PostgreSQL gratuit)

1. Va sur [https://supabase.com](https://supabase.com) → **Start your project**.
2. Crée un projet (organisation + mot de passe de la base).
3. Dans **Project Settings → Database**, copie l’**URI** (mode « Transaction » ou « Session »).
4. Colle-la dans `admin/.env` comme `DATABASE_URL="..."`.
5. Ajoute `?pgbouncer=true` à la fin de l’URL si tu utilises le mode « Transaction » (pooler).
6. Exécute `npm run db:push` et `npm run db:seed` dans `admin/`, puis `npm run dev`.

---

## Option 3 : PostgreSQL en local

Si tu préfères installer PostgreSQL sur ta machine :

1. Télécharge l’installateur : [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/).
2. Installe (note le mot de passe du superutilisateur `postgres`).
3. Crée une base (ex. via pgAdmin ou en ligne de commande) :
   ```bash
   psql -U postgres -c "CREATE DATABASE ma_criniere;"
   ```
4. Dans `admin/.env` :
   ```env
   DATABASE_URL="postgresql://postgres:TON_MOT_DE_PASSE@localhost:5432/ma_criniere?schema=public"
   ```
5. Puis dans `admin/` : `npm run db:push`, `npm run db:seed`, `npm run dev`.

---

Une fois `DATABASE_URL` correcte dans `admin/.env`, les commandes `db:push` et `db:seed` créent les tables et le compte admin.

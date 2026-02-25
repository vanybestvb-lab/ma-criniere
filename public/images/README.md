# Images pour le site (Vercel / production)

Pour que le **logo** et les **images produits** s’affichent sur Vercel, les fichiers doivent être **présents dans ce dossier** et **committés sur Git**.

## Fichiers à placer ici

- **Logo**  
  - `Logo Ma Crinière Violet.png` (header, menu mobile)  
  - `Logo Ma Crinière.png` (footer)

- **Produits** (noms exacts utilisés par le code)  
  - `Produit 1.jpg`  
  - `Produit 2.jpg`  
  - `Produit 3.jpg`  
  - `Produit 4.jpg`  
  - `Produit 6.jpg`  
  - `Hero Produits.jpg.jpg`  
  - `Image Produit 8.jpg`  
  - `serum reparateur.jpg`

## Après avoir ajouté les fichiers

Dans le terminal, à la racine du projet :

```bash
git add "public/Images Sites Macrinère/"
git status
git commit -m "Ajout des images logo et produits pour Vercel"
git push
```

Au prochain déploiement Vercel, les images seront prises en compte.

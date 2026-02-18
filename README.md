# ma-criniere
Site vente produits capillaire — Ma Crinière.

## Fonctionnalités

- **Pages produits** : `product.html?slug=...` (ex. `product.html?slug=masque-hydratant-argan`) — détail produit, galerie, prix/promo, stock, ajout au panier, produits similaires.
- **Panier** : `panier.html` — liste, quantités (plafonnées au stock), total, lien vers checkout.
- **Checkout** : `checkout.html` — étapes 2 (infos client), 3 (livraison), 4 (paiement + récap), 5 (confirmation). Données en localStorage (mock).
- **Header** : lien Panier avec badge sur toutes les pages.

## Build TypeScript (optionnel)

Les fichiers JS dans `js/` sont fournis pour que le site fonctionne sans build. Pour recompiler depuis les sources :

```bash
npm install
npm run build
```

Sources : `src/*.ts` (types, products-data, cart-store, cart-badge, product-page, panier, order-store, checkout).

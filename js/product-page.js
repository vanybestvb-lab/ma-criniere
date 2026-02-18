import { initCartBadge } from './cart-badge.js';
import { addToCart } from './cart-store.js';
import { getProductBySlug, getProductPrice, getSimilarProducts } from './products-data.js';

const ROOT_SELECTOR = '[data-product-root]';

function getSlugFromUrl() {
  return new URLSearchParams(window.location.search).get('slug');
}

function formatPrice(price) {
  return price + ' $';
}

var MOCK_REVIEWS = [
  { author: 'Sophie L.', rating: 5, date: '15 janv. 2025', text: 'Produit au top, ma chevelure est plus douce et brillante. Je recommande les yeux fermés.' },
  { author: 'Marie K.', rating: 4, date: '8 janv. 2025', text: 'Très satisfaite du résultat. Livraison rapide et emballage soigné.' },
  { author: 'Claire D.', rating: 5, date: '2 janv. 2025', text: "Enfin un soin qui tient ses promesses. J'achète à nouveau sans hésiter." }
];

function renderReviews() {
  var html = '<section class="product-page-reviews" aria-label="Avis clients">';
  html += '<h2 class="product-page-reviews-title">Avis clients</h2>';
  html += '<div class="product-page-reviews-list">';
  MOCK_REVIEWS.forEach(function (r) {
    html += '<article class="product-page-review">';
    html += '<div class="product-page-review-header">';
    html += '<span class="product-page-review-author">' + r.author + '</span>';
    html += '<span class="product-page-review-stars" aria-label="' + r.rating + ' sur 5">' + '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating) + '</span>';
    html += '<time class="product-page-review-date">' + r.date + '</time>';
    html += '</div><p class="product-page-review-text">' + r.text + '</p></article>';
  });
  html += '</div></section>';
  return html;
}

function renderGallery(images, name) {
  var html = '<div class="product-page-gallery">';
  html += '<div class="product-page-main-image" style="background: url(\'' + images[0] + '\') center/cover;" role="img" aria-label="' + name + '"></div>';
  html += '<div class="product-page-thumbnails">';
  images.forEach(function (img, i) {
    html += '<button type="button" class="product-page-thumb' + (i === 0 ? ' active' : '') + '" style="background: url(\'' + img + '\') center/cover;" data-index="' + i + '" aria-label="Image ' + (i + 1) + '"></button>';
  });
  html += '</div></div>';
  return html;
}

function renderSimilar(similar) {
  var html = '<section class="products product-page-similar" aria-label="Produits similaires">';
  html += '<h2 class="section-title-maskin">Produits <span class="section-title-maskin--script">similaires</span></h2>';
  html += '<div class="products-grid products-grid--elegant">';
  similar.forEach(function (p) {
    html += '<article class="product-card product-card--elegant">';
    html += '<a href="product.html?slug=' + p.slug + '" class="product-image" style="background: url(\'' + p.image + '\') center/cover;"></a>';
    html += '<div class="product-info"><h3 class="product-name"><a href="product.html?slug=' + p.slug + '">' + p.name + '</a></h3>';
    html += '<p class="product-tag">' + p.tag + '</p><p class="product-price">' + formatPrice(getProductPrice(p)) + '</p></div></article>';
  });
  html += '</div></section>';
  return html;
}

function renderProduct(product) {
  var price = getProductPrice(product);
  var hasPromo = !!product.promo;
  var similar = getSimilarProducts(product.id, 4);
  var root = document.querySelector(ROOT_SELECTOR);
  if (!root) return;
  var inner = '<div class="container container--product">';
  inner += '<nav class="product-page-breadcrumb" aria-label="Fil d\'Ariane"><a href="index.html">Accueil</a><span aria-hidden="true">/</span><a href="produits.html">Produits</a><span aria-hidden="true">/</span><span>' + product.name + '</span></nav>';
  inner += '<div class="product-page-layout"><div class="product-page-media">' + renderGallery(product.images, product.name) + '</div>';
  inner += '<div class="product-page-detail">';
  inner += '<p class="product-page-brand-cat">MA CRINIÈRE <span aria-hidden="true">/</span> SOINS <span aria-hidden="true">/</span> ' + product.tag + '</p>';
  inner += '<h1 class="product-page-title">' + product.name + '</h1>';
  inner += '<div class="product-page-promo-tags">';
  if (hasPromo && product.promo) inner += '<span class="product-badge new">' + product.promo.label + '</span>';
  inner += '<span class="product-badge product-badge-tag">' + product.tag + '</span></div>';
  inner += '<p class="product-page-desc-short">' + product.descriptionShort + '</p>';
  inner += '<p class="product-page-en-savoir-plus-wrap"><button type="button" class="product-page-en-savoir-plus" aria-expanded="false">En savoir plus</button></p>';
  inner += '<div class="product-page-desc-long is-hidden" id="product-desc-long"><p>' + product.descriptionLong + '</p></div>';
  inner += '<div class="product-page-prices"><span class="product-price product-page-price">' + formatPrice(price) + '</span>';
  if (hasPromo) inner += '<span class="product-page-price-old">' + formatPrice(product.price) + '</span>';
  inner += '</div>';
  if (product.specs && product.specs.Couleur) {
    inner += '<p class="product-page-couleur"><strong>Couleur :</strong> ' + product.specs.Couleur + '</p>';
  }
  inner += '<p class="product-page-stock' + (product.stock < 5 ? ' low' : '') + '">Stock : ' + product.stock + ' disponible(s)</p>';
  inner += '<div class="product-page-qty"><label for="product-qty">Quantité :</label><div class="product-page-qty-wrap"><button type="button" class="product-page-qty-btn" data-dir="-1" aria-label="Diminuer">−</button><input type="number" id="product-qty" class="product-page-qty-input" value="1" min="1" max="' + product.stock + '"><button type="button" class="product-page-qty-btn" data-dir="1" aria-label="Augmenter">+</button></div></div>';
  inner += '<div class="product-page-actions"><button type="button" class="btn btn-violet product-page-add-cart" data-product-id="' + product.id + '">AJOUTER AU PANIER</button>';
  inner += '<a href="checkout.html" class="btn btn-hero-maskin product-page-buy-now" data-product-id="' + product.id + '">Acheter maintenant</a></div>';
  if (product.specs && Object.keys(product.specs).length > 0) {
    inner += '<div class="product-page-specs"><h3 class="product-page-features-title">Caractéristiques</h3><dl class="product-page-specs-list">';
    Object.keys(product.specs).forEach(function (k) { inner += '<dt>' + k + '</dt><dd>' + product.specs[k] + '</dd>'; });
    inner += '</dl></div>';
  }
  inner += '<div class="product-page-features"><h3 class="product-page-features-title">Points forts</h3><ul>';
  product.features.forEach(function (f) { inner += '<li>' + f + '</li>'; });
  inner += '</ul></div></div></div>';
  inner += renderReviews();
  if (similar.length > 0) inner += renderSimilar(similar);
  inner += '</div>';
  root.innerHTML = inner;

  var mainImg = root.querySelector('.product-page-main-image');
  var thumbs = root.querySelectorAll('.product-page-thumb');
  thumbs.forEach(function (thumb, i) {
    thumb.addEventListener('click', function () {
      thumbs.forEach(function (t) { t.classList.remove('active'); });
      thumb.classList.add('active');
      if (mainImg && product.images[i]) mainImg.style.background = "url('" + product.images[i] + "') center/cover";
    });
  });

  var enSavoirPlus = root.querySelector('.product-page-en-savoir-plus');
  var descLong = root.querySelector('#product-desc-long');
  if (enSavoirPlus && descLong) {
    enSavoirPlus.addEventListener('click', function () {
      var isOpen = descLong.classList.toggle('is-hidden');
      enSavoirPlus.setAttribute('aria-expanded', !isOpen);
      enSavoirPlus.textContent = isOpen ? 'En savoir plus' : 'Voir moins';
    });
  }

  var qtyInput = root.querySelector('.product-page-qty-input');
  var qtyMinus = root.querySelector('.product-page-qty-btn[data-dir="-1"]');
  var qtyPlus = root.querySelector('.product-page-qty-btn[data-dir="1"]');
  if (qtyInput && qtyMinus && qtyPlus) {
    function updateQty(delta) {
      var val = parseInt(qtyInput.value, 10) || 1;
      val = Math.max(1, Math.min(product.stock, val + delta));
      qtyInput.value = val;
    }
    qtyMinus.addEventListener('click', function () { updateQty(-1); });
    qtyPlus.addEventListener('click', function () { updateQty(1); });
    qtyInput.addEventListener('change', function () {
      var val = parseInt(qtyInput.value, 10) || 1;
      qtyInput.value = Math.max(1, Math.min(product.stock, val));
    });
  }

  root.querySelector('.product-page-add-cart') && root.querySelector('.product-page-add-cart').addEventListener('click', function () {
    var qty = parseInt(root.querySelector('.product-page-qty-input').value, 10) || 1;
    qty = Math.max(1, Math.min(product.stock, qty));
    addToCart({ productId: product.id, name: product.name, price: price, image: product.image }, qty);
    var btn = root.querySelector('.product-page-add-cart');
    if (btn) {
      var text = btn.textContent;
      btn.textContent = 'Ajouté !';
      btn.disabled = true;
      setTimeout(function () { btn.textContent = text; btn.disabled = false; }, 1500);
    }
  });
  root.querySelector('.product-page-buy-now') && root.querySelector('.product-page-buy-now').addEventListener('click', function (e) {
    e.preventDefault();
    var qty = parseInt(root.querySelector('.product-page-qty-input').value, 10) || 1;
    qty = Math.max(1, Math.min(product.stock, qty));
    addToCart({ productId: product.id, name: product.name, price: price, image: product.image }, qty);
    window.location.href = 'checkout.html';
  });
}

function renderNotFound() {
  var root = document.querySelector(ROOT_SELECTOR);
  if (!root) return;
  root.innerHTML = '<div class="container container--product"><p class="product-page-not-found">Produit introuvable.</p><a href="produits.html" class="btn btn-violet">Retour au catalogue</a></div>';
}

function initProductPage() {
  initCartBadge();
  var slug = getSlugFromUrl();
  if (!slug) { renderNotFound(); return; }
  var product = getProductBySlug(slug);
  if (!product) { renderNotFound(); return; }
  document.title = product.name + ' — Ma Crinière';
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', product.descriptionShort);
  renderProduct(product);
}

initProductPage();

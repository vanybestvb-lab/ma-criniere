import { initCartBadge } from './cart-badge.js';
import { addToCart } from './cart-store.js';
import {
  getProductBySlug,
  getProductPrice,
  getSimilarProducts,
} from './products-data.js';
import type { Product } from './types.js';

const ROOT_SELECTOR = '[data-product-root]';

function getSlugFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('slug');
}

function formatPrice(price: number): string {
  return `${price} $`;
}

function renderGallery(images: string[], name: string): string {
  return `
    <div class="product-page-gallery">
      <div class="product-page-main-image" style="background: url('${images[0]}') center/cover;" role="img" aria-label="${name}"></div>
      <div class="product-page-thumbnails">
        ${images
          .map(
            (img, i) =>
              `<button type="button" class="product-page-thumb ${i === 0 ? 'active' : ''}" style="background: url('${img}') center/cover;" data-index="${i}" aria-label="Image ${i + 1}"></button>`
          )
          .join('')}
      </div>
    </div>
  `;
}

function renderProduct(product: Product): void {
  const price = getProductPrice(product);
  const hasPromo = !!product.promo;
  const similar = getSimilarProducts(product.id, 4);
  const root = document.querySelector(ROOT_SELECTOR);
  if (!root) return;

  root.innerHTML = `
    <div class="container container--product">
      <nav class="product-page-breadcrumb" aria-label="Fil d'Ariane">
        <a href="index.html">Accueil</a>
        <span aria-hidden="true">/</span>
        <a href="produits.html">Produits</a>
        <span aria-hidden="true">/</span>
        <span>${product.name}</span>
      </nav>
      <div class="product-page-layout">
        <div class="product-page-media">
          ${renderGallery(product.images, product.name)}
        </div>
        <div class="product-page-detail">
          <p class="product-page-brand-cat">MA CRINIÈRE <span aria-hidden="true">/</span> SOINS <span aria-hidden="true">/</span> ${product.tag}</p>
          <h1 class="product-page-title">${product.name}</h1>
          <div class="product-page-promo-tags">
            ${hasPromo && product.promo ? `<span class="product-badge new">${product.promo.label}</span>` : ''}
            <span class="product-badge product-badge-tag">${product.tag}</span>
          </div>
          <p class="product-page-desc-short">${product.descriptionShort}</p>
          <p class="product-page-en-savoir-plus-wrap"><button type="button" class="product-page-en-savoir-plus" aria-expanded="false">En savoir plus</button></p>
          <div class="product-page-desc-long is-hidden" id="product-desc-long"><p>${product.descriptionLong}</p></div>
          <div class="product-page-prices">
            <span class="product-price product-page-price">${formatPrice(price)}</span>
            ${hasPromo ? `<span class="product-page-price-old">${formatPrice(product.price)}</span>` : ''}
          </div>
          ${product.specs?.Couleur ? `<p class="product-page-couleur"><strong>Couleur :</strong> ${product.specs.Couleur}</p>` : ''}
          <p class="product-page-stock ${product.stock < 5 ? 'low' : ''}">Stock : ${product.stock} disponible(s)</p>
          <div class="product-page-qty">
            <label for="product-qty">Quantité :</label>
            <div class="product-page-qty-wrap">
              <button type="button" class="product-page-qty-btn" data-dir="-1" aria-label="Diminuer">−</button>
              <input type="number" id="product-qty" class="product-page-qty-input" value="1" min="1" max="${product.stock}">
              <button type="button" class="product-page-qty-btn" data-dir="1" aria-label="Augmenter">+</button>
            </div>
          </div>
          <div class="product-page-actions">
            <button type="button" class="btn btn-violet product-page-add-cart" data-product-id="${product.id}">AJOUTER AU PANIER</button>
            <a href="checkout.html" class="btn btn-hero-maskin product-page-buy-now" data-product-id="${product.id}">Acheter maintenant</a>
          </div>
          ${
            product.specs && Object.keys(product.specs).length > 0
              ? `
          <div class="product-page-specs">
            <h3 class="product-page-features-title">Caractéristiques</h3>
            <dl class="product-page-specs-list">
              ${Object.entries(product.specs)
                .map(([key, value]) => `<dt>${key}</dt><dd>${value}</dd>`)
                .join('')}
            </dl>
          </div>
          `
              : ''
          }
          <div class="product-page-features">
            <h3 class="product-page-features-title">Points forts</h3>
            <ul>
              ${product.features.map((f) => `<li>${f}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
      ${similar.length > 0 ? renderSimilar(similar) : ''}
    </div>
  `;

  // Gallery thumbnails
  const mainImg = root.querySelector('.product-page-main-image') as HTMLElement;
  const thumbs = root.querySelectorAll('.product-page-thumb');
  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => {
      thumbs.forEach((t) => t.classList.remove('active'));
      thumb.classList.add('active');
      if (mainImg && product.images[i]) {
        mainImg.style.background = `url('${product.images[i]}') center/cover`;
      }
    });
  });

  // En savoir plus
  const enSavoirPlus = root.querySelector('.product-page-en-savoir-plus');
  const descLong = root.querySelector('#product-desc-long');
  if (enSavoirPlus && descLong) {
    enSavoirPlus.addEventListener('click', () => {
      const isOpen = descLong.classList.toggle('is-hidden');
      enSavoirPlus.setAttribute('aria-expanded', String(!isOpen));
      enSavoirPlus.textContent = isOpen ? 'En savoir plus' : 'Voir moins';
    });
  }

  // Quantity
  const qtyInput = root.querySelector('.product-page-qty-input') as HTMLInputElement;
  const qtyMinus = root.querySelector('.product-page-qty-btn[data-dir="-1"]');
  const qtyPlus = root.querySelector('.product-page-qty-btn[data-dir="1"]');
  if (qtyInput && qtyMinus && qtyPlus) {
    const updateQty = (delta: number) => {
      let val = parseInt(qtyInput.value, 10) || 1;
      val = Math.max(1, Math.min(product.stock, val + delta));
      qtyInput.value = String(val);
    };
    qtyMinus.addEventListener('click', () => updateQty(-1));
    qtyPlus.addEventListener('click', () => updateQty(1));
    qtyInput.addEventListener('change', () => {
      let val = parseInt(qtyInput.value, 10) || 1;
      qtyInput.value = String(Math.max(1, Math.min(product.stock, val)));
    });
  }

  const getQty = (): number => {
    const input = root.querySelector('.product-page-qty-input') as HTMLInputElement;
    const qty = parseInt(input?.value ?? '1', 10) || 1;
    return Math.max(1, Math.min(product.stock, qty));
  };

  // Add to cart
  root.querySelector('.product-page-add-cart')?.addEventListener('click', () => {
    addToCart(
      { productId: product.id, name: product.name, price, image: product.image },
      getQty()
    );
    const btn = root.querySelector('.product-page-add-cart');
    if (btn) {
      const text = btn.textContent;
      btn.textContent = 'Ajouté !';
      (btn as HTMLButtonElement).disabled = true;
      setTimeout(() => {
        btn.textContent = text;
        (btn as HTMLButtonElement).disabled = false;
      }, 1500);
    }
  });

  // Buy now
  root.querySelector('.product-page-buy-now')?.addEventListener('click', (e) => {
    e.preventDefault();
    addToCart(
      { productId: product.id, name: product.name, price, image: product.image },
      getQty()
    );
    window.location.href = 'checkout.html';
  });
}

function renderSimilar(similar: Product[]): string {
  return `
    <section class="products product-page-similar" aria-label="Produits similaires">
      <h2 class="section-title-maskin">Produits <span class="section-title-maskin--script">similaires</span></h2>
      <div class="products-grid products-grid--elegant">
        ${similar
          .map(
            (p) => `
          <article class="product-card product-card--elegant">
            <a href="product.html?slug=${p.slug}" class="product-image" style="background: url('${p.image}') center/cover;"></a>
            <div class="product-info">
              <h3 class="product-name"><a href="product.html?slug=${p.slug}">${p.name}</a></h3>
              <p class="product-tag">${p.tag}</p>
              <p class="product-price">${formatPrice(getProductPrice(p))}</p>
            </div>
          </article>
        `
          )
          .join('')}
      </div>
    </section>
  `;
}

function renderNotFound(): void {
  const root = document.querySelector(ROOT_SELECTOR);
  if (!root) return;
  root.innerHTML = `
    <div class="container container--product">
      <p class="product-page-not-found">Produit introuvable.</p>
      <a href="produits.html" class="btn btn-violet">Retour au catalogue</a>
    </div>
  `;
}

export function initProductPage(): void {
  initCartBadge();
  const slug = getSlugFromUrl();
  if (!slug) {
    renderNotFound();
    return;
  }
  const product = getProductBySlug(slug);
  if (!product) {
    renderNotFound();
    return;
  }
  document.title = `${product.name} — Ma Crinière`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', product.descriptionShort);
  renderProduct(product);
}

initProductPage();

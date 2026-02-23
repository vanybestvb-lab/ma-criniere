import { initCartBadge } from './cart-badge.js';
import { addToCart } from './cart-store.js';
import { getProductBySlug, getProductPrice } from './products-data.js';

const CARD_SELECTOR = '[data-product-slug]';
const BTN_SELECTOR = '.product-add-to-cart';

function bindAddToCart(): void {
  initCartBadge();
  document.querySelectorAll(CARD_SELECTOR).forEach((card) => {
    const slug = card.getAttribute('data-product-slug');
    if (!slug) return;
    const product = getProductBySlug(slug);
    if (!product) return;
    const btn = card.querySelector(BTN_SELECTOR);
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const price = getProductPrice(product);
      addToCart(
        {
          productId: product.id,
          name: product.name,
          price,
          image: product.image,
          quantity: 1,
        },
        1
      );
      const label = btn.textContent;
      btn.textContent = 'Ajouté !';
      (btn as HTMLButtonElement).disabled = true;
      setTimeout(() => {
        btn.textContent = label;
        (btn as HTMLButtonElement).disabled = false;
      }, 1500);
    });
  });
}

bindAddToCart();

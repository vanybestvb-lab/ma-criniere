import { getCartCount } from './cart-store.js';

const BADGE_SELECTOR = '[data-cart-badge]';

function updateBadge() {
  const el = document.querySelector(BADGE_SELECTOR);
  if (!el) return;
  const count = getCartCount();
  el.textContent = String(count);
  el.hidden = count === 0;
}

export function initCartBadge() {
  updateBadge();
  window.addEventListener('cart-updated', updateBadge);
}
if (document.querySelector('[data-cart-badge]')) initCartBadge();

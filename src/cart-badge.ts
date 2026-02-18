import { getCartCount } from './cart-store.js';

const BADGE_SELECTOR = '[data-cart-badge]';

function updateBadge(): void {
  const el = document.querySelector(BADGE_SELECTOR);
  if (!el) return;
  const count = getCartCount();
  el.textContent = String(count);
  (el as HTMLElement).hidden = count === 0;
}

export function initCartBadge(): void {
  updateBadge();
  window.addEventListener('cart-updated', updateBadge);
}

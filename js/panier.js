import { initCartBadge } from './cart-badge.js';
import { getCartItems, getCartTotal, removeFromCart, setQuantity } from './cart-store.js';
import { getProductById } from './products-data.js';

const CART_ROOT = '[data-cart-root]';
const CART_EMPTY = '[data-cart-empty]';
const CART_TABLE_BODY = '[data-cart-table-body]';
const CART_TOTAL = '[data-cart-total]';

function formatPrice(price) {
  return price + ' $';
}

function renderCartRow(item) {
  return '<tr data-product-id="' + item.productId + '">' +
    '<td><div class="cart-item-image" style="background-image: url(\'' + item.image + '\');" role="img" aria-label="' + item.name + '"></div></td>' +
    '<td><strong>' + item.name + '</strong></td>' +
    '<td>' + formatPrice(item.price) + '</td>' +
    '<td><div class="cart-qty-wrap">' +
    '<button type="button" aria-label="Diminuer" data-qty="-1">−</button>' +
    '<span data-qty-display>' + item.quantity + '</span>' +
    '<button type="button" aria-label="Augmenter" data-qty="+1">+</button></div></td>' +
    '<td><strong>' + formatPrice(item.subtotal) + '</strong></td>' +
    '<td><button type="button" class="cart-remove" aria-label="Retirer du panier">Retirer</button></td>' +
    '</tr>';
}

function getMaxQuantity(productId) {
  const product = getProductById(productId);
  return product ? product.stock : 99;
}

function renderCart() {
  const root = document.querySelector(CART_ROOT);
  const emptyEl = document.querySelector(CART_EMPTY);
  const tbody = document.querySelector(CART_TABLE_BODY);
  const totalEl = document.querySelector(CART_TOTAL);
  if (!root) return;
  const items = getCartItems();
  const total = getCartTotal();
  const tableWrap = root.querySelector('[data-cart-table-wrap]');
  if (emptyEl) emptyEl.hidden = items.length > 0;
  if (tableWrap) tableWrap.hidden = items.length === 0;
  if (tbody) {
    if (items.length === 0) {
      tbody.innerHTML = '';
    } else {
      tbody.innerHTML = items.map(renderCartRow).join('');
      tbody.querySelectorAll('tr[data-product-id]').forEach(function (row) {
        const productId = row.getAttribute('data-product-id');
        if (!productId) return;
        const maxQty = getMaxQuantity(productId);
        const minusBtn = row.querySelector('button[data-qty="-1"]');
        const plusBtn = row.querySelector('button[data-qty="+1"]');
        const removeBtn = row.querySelector('.cart-remove');
        minusBtn && minusBtn.addEventListener('click', function () {
          const item = items.find(function (i) { return i.productId === productId; });
          if (!item) return;
          setQuantity(productId, item.quantity - 1);
          renderCart();
        });
        plusBtn && plusBtn.addEventListener('click', function () {
          const item = items.find(function (i) { return i.productId === productId; });
          if (!item || item.quantity >= maxQty) return;
          setQuantity(productId, item.quantity + 1);
          renderCart();
        });
        removeBtn && removeBtn.addEventListener('click', function () {
          removeFromCart(productId);
          renderCart();
        });
      });
    }
  }
  if (totalEl) totalEl.textContent = formatPrice(total);
}

export function initPanier() {
  initCartBadge();
  renderCart();
  window.addEventListener('cart-updated', renderCart);
}

initPanier();

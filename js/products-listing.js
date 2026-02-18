import { initCartBadge } from './cart-badge.js';
import { addToCart } from './cart-store.js';
import { getProductBySlug, getProductPrice } from './products-data.js';

var CARD_SELECTOR = '[data-product-slug]';
var BTN_SELECTOR = '.product-add-to-cart';

function bindAddToCart() {
  initCartBadge();
  document.querySelectorAll(CARD_SELECTOR).forEach(function (card) {
    var slug = card.getAttribute('data-product-slug');
    if (!slug) return;
    var product = getProductBySlug(slug);
    if (!product) return;
    var btn = card.querySelector(BTN_SELECTOR);
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var price = getProductPrice(product);
      addToCart({
        productId: product.id,
        name: product.name,
        price: price,
        image: product.image
      }, 1);
      var label = btn.textContent;
      btn.textContent = 'Ajouté !';
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = label;
        btn.disabled = false;
      }, 1500);
    });
  });
}

bindAddToCart();

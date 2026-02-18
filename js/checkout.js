import { initCartBadge } from './cart-badge.js';
import { getCartItems, getCartTotal, clearCart } from './cart-store.js';
import { createOrder } from './order-store.js';

const PANEL_ATTR = 'data-checkout-panel';
const SHIPPING_OPTIONS = [
  { id: 'express-24', label: 'Livraison express 24h (70 km)', price: 15, delay: '24h' },
  { id: 'express-48', label: 'Livraison express 48h', price: 10, delay: '48h' },
  { id: 'standard', label: 'Livraison standard', price: 5, delay: '48-72h' },
];

let currentStep = 1;
let selectedShipping = SHIPPING_OPTIONS[0];
let selectedPayment = 'mobile_money';

function formatPrice(price) {
  return `${price} $`;
}

function showStep(stepIndex) {
  currentStep = stepIndex;
  const steps = document.querySelectorAll('.checkout-step');
  const panels = document.querySelectorAll(`[${PANEL_ATTR}]`);

  steps.forEach((el, i) => {
    const stepNum = i + 1;
    el.classList.remove('active', 'done');
    el.setAttribute('aria-selected', stepNum === stepIndex ? 'true' : 'false');
    if (stepNum === stepIndex) el.classList.add('active');
    else if (stepNum < stepIndex) el.classList.add('done');
  });

  panels.forEach((el, i) => {
    const panelNum = i + 1;
    const isActive = panelNum === stepIndex;
    el.classList.toggle('active', isActive);
    el.hidden = !isActive;
  });

  if (stepIndex === 4) updateOrderSummary();
}

function goNext() {
  if (currentStep === 1) {
    showStep(2);
    return;
  }
  if (currentStep === 2) {
    const form = document.querySelector('[data-checkout-form]');
    if (!form || !form.checkValidity()) {
      form?.reportValidity();
      return;
    }
    showStep(3);
    return;
  }
  if (currentStep === 3) {
    showStep(4);
    return;
  }
}

function goPrev() {
  if (currentStep === 2) showStep(1);
  else if (currentStep === 3) showStep(2);
  else if (currentStep === 4) showStep(3);
}

function bindStepButtons() {
  document.querySelectorAll('.checkout-step').forEach((el) => {
    const step = parseInt(el.getAttribute('data-step'), 10);
    el.addEventListener('click', () => {
      if (step <= currentStep || step === currentStep + 1) showStep(step);
    });
  });

  document.querySelectorAll('[data-checkout-next]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      goNext();
    });
  });

  document.querySelectorAll('[data-checkout-prev]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      goPrev();
    });
  });
}

function renderCartRecap() {
  const container = document.querySelector('[data-checkout-cart-recap]');
  if (!container) return;
  const items = getCartItems();
  const total = getCartTotal();
  if (items.length === 0) {
    container.innerHTML = '<p>Votre panier est vide.</p>';
    return;
  }
  container.innerHTML = `
    <ul class="checkout-cart-list">
      ${items.map((i) => `
        <li class="checkout-cart-item">
          <span class="checkout-cart-item-name">${i.name} × ${i.quantity}</span>
          <span class="checkout-cart-item-price">${formatPrice(i.subtotal)}</span>
        </li>
      `).join('')}
    </ul>
    <p class="checkout-cart-total">Total panier : <strong>${formatPrice(total)}</strong></p>
  `;
}

function bindShipping() {
  SHIPPING_OPTIONS.forEach((opt) => {
    const radio = document.querySelector(`input[name="shipping"][value="${opt.id}"]`);
    const block = radio?.closest('.shipping-option');
    if (!block) return;
    radio?.addEventListener('change', () => {
      selectedShipping = opt;
      document.querySelectorAll('.shipping-option').forEach((b) => b.classList.remove('selected'));
      block.classList.add('selected');
      updateOrderSummary();
    });
    block.addEventListener('click', () => {
      radio.checked = true;
      selectedShipping = opt;
      document.querySelectorAll('.shipping-option').forEach((b) => b.classList.remove('selected'));
      block.classList.add('selected');
      updateOrderSummary();
    });
  });
}

function bindPayment() {
  document.querySelectorAll('input[name="payment"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      selectedPayment = radio.value;
      document.querySelectorAll('.payment-option').forEach((b) => b.classList.remove('selected'));
      radio.closest('.payment-option')?.classList.add('selected');
    });
  });
  document.querySelectorAll('.payment-option').forEach((block) => {
    block.addEventListener('click', () => {
      const radio = block.querySelector('input[name="payment"]');
      if (radio) {
        radio.checked = true;
        selectedPayment = radio.value;
        document.querySelectorAll('.payment-option').forEach((b) => b.classList.remove('selected'));
        block.classList.add('selected');
      }
    });
  });
}

function updateOrderSummary() {
  const subtotal = getCartTotal();
  const shippingCost = selectedShipping.price;
  const total = subtotal + shippingCost;
  const subtotalEl = document.querySelector('[data-summary-subtotal]');
  const shipEl = document.querySelector('[data-summary-shipping]');
  const totalEl = document.querySelector('[data-summary-total]');
  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (shipEl) shipEl.textContent = formatPrice(shippingCost);
  if (totalEl) totalEl.textContent = formatPrice(total);
}

function toOrderItems() {
  return getCartItems().map((i) => ({
    productId: i.productId,
    name: i.name,
    price: i.price,
    quantity: i.quantity,
    image: i.image,
    subtotal: i.subtotal,
  }));
}

function submitCheckout() {
  const form = document.querySelector('[data-checkout-form]');
  if (!form || !form.checkValidity()) {
    form?.reportValidity();
    return;
  }
  const fd = new FormData(form);
  const customer = {
    firstName: (fd.get('prenom') ?? '').toString().trim(),
    lastName: (fd.get('nom') ?? '').toString().trim(),
    email: (fd.get('email') ?? '').toString().trim(),
    phone: (fd.get('tel') ?? '').toString().trim(),
    address: (fd.get('adresse') ?? '').toString().trim(),
  };
  const items = toOrderItems();
  const order = createOrder(customer, items, selectedShipping, selectedPayment);
  clearCart();
  showConfirmation(order.id);
  showStep(5);
}

function showConfirmation(orderId) {
  const panel = document.querySelector(`[${PANEL_ATTR}="5"]`);
  const idEl = panel?.querySelector('[data-order-id]');
  if (idEl) idEl.textContent = orderId;
}

export function initCheckout() {
  initCartBadge();
  const items = getCartItems();
  if (items.length === 0) {
    window.location.href = 'panier.html';
    return;
  }

  renderCartRecap();

  const shipContainer = document.querySelector('[data-shipping-options]');
  if (shipContainer) {
    shipContainer.innerHTML = SHIPPING_OPTIONS.map(
      (opt, i) => `
      <label class="shipping-option ${i === 0 ? 'selected' : ''}">
        <input type="radio" name="shipping" value="${opt.id}" ${i === 0 ? 'checked' : ''}>
        <span>${opt.label}</span>
        <strong>${formatPrice(opt.price)}</strong> — ${opt.delay}
      </label>
    `
    ).join('');
  }

  showStep(1);
  bindStepButtons();
  bindShipping();
  bindPayment();
  updateOrderSummary();

  document.querySelector('[data-checkout-submit]')?.addEventListener('click', (e) => {
    e.preventDefault();
    submitCheckout();
  });
}

initCheckout();

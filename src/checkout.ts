import { initCartBadge } from './cart-badge.js';
import { getCartItems, getCartTotal, clearCart } from './cart-store.js';
import { createOrder } from './order-store.js';
import type { Customer, OrderItem, ShippingOption } from './types.js';

const STEP_ATTR = 'data-checkout-step';
const PANEL_ATTR = 'data-checkout-panel';
const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'express-24', label: 'Livraison express 24h (70 km)', price: 15, delay: '24h' },
  { id: 'express-48', label: 'Livraison express 48h', price: 10, delay: '48h' },
  { id: 'standard', label: 'Livraison standard', price: 5, delay: '48-72h' },
];

let selectedShipping: ShippingOption = SHIPPING_OPTIONS[0];
let selectedPayment = 'mobile_money';

function formatPrice(price: number): string {
  return `${price} $`;
}

function getCurrentStep(): number {
  const step = document.querySelector(`.checkout-step.${STEP_ATTR}`);
  const idx = document.querySelectorAll('.checkout-step').length;
  const active = document.querySelector('.checkout-step.active');
  if (!active) return 1;
  const steps = Array.from(document.querySelectorAll('.checkout-step'));
  const i = steps.indexOf(active as Element);
  return i >= 0 ? i + 1 : 1;
}

function showStep(stepIndex: number): void {
  document.querySelectorAll('.checkout-step').forEach((el, i) => {
    el.classList.remove('active', 'done');
    if (i + 1 === stepIndex) el.classList.add('active');
    else if (i + 1 < stepIndex) el.classList.add('done');
  });
  document.querySelectorAll(`[${PANEL_ATTR}]`).forEach((el, i) => {
    (el as HTMLElement).classList.toggle('active', i + 1 === stepIndex);
  });
}

function bindSteps(): void {
  document.querySelectorAll('.checkout-step').forEach((el, i) => {
    el.addEventListener('click', () => showStep(i + 1));
  });
}

function bindShipping(): void {
  SHIPPING_OPTIONS.forEach((opt) => {
    const radio = document.querySelector(`input[name="shipping"][value="${opt.id}"]`) as HTMLInputElement;
    const block = radio?.closest('.shipping-option');
    radio?.addEventListener('change', () => {
      selectedShipping = opt;
      document.querySelectorAll('.shipping-option').forEach((b) => b.classList.remove('selected'));
      block?.classList.add('selected');
      updateOrderSummary();
    });
    block?.addEventListener('click', () => {
      radio.checked = true;
      selectedShipping = opt;
      document.querySelectorAll('.shipping-option').forEach((b) => b.classList.remove('selected'));
      block.classList.add('selected');
      updateOrderSummary();
    });
  });
}

function bindPayment(): void {
  document.querySelectorAll('input[name="payment"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      selectedPayment = (radio as HTMLInputElement).value;
      document.querySelectorAll('.payment-option').forEach((b) => b.classList.remove('selected'));
      (radio as HTMLInputElement).closest('.payment-option')?.classList.add('selected');
    });
  });
  document.querySelectorAll('.payment-option').forEach((block) => {
    block.addEventListener('click', () => {
      const radio = block.querySelector('input[name="payment"]') as HTMLInputElement;
      if (radio) {
        radio.checked = true;
        selectedPayment = radio.value;
        document.querySelectorAll('.payment-option').forEach((b) => b.classList.remove('selected'));
        block.classList.add('selected');
      }
    });
  });
}

function updateOrderSummary(): void {
  const items = getCartItems();
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

function toOrderItems(): OrderItem[] {
  return getCartItems().map((i) => ({
    productId: i.productId,
    name: i.name,
    price: i.price,
    quantity: i.quantity,
    image: i.image,
    subtotal: i.subtotal,
  }));
}

function submitCheckout(): void {
  const form = document.querySelector('[data-checkout-form]') as HTMLFormElement;
  if (!form || !form.checkValidity()) {
    form?.reportValidity();
    return;
  }
  const fd = new FormData(form);
  const customer: Customer = {
    firstName: (fd.get('prenom') as string)?.trim() ?? '',
    lastName: (fd.get('nom') as string)?.trim() ?? '',
    email: (fd.get('email') as string)?.trim() ?? '',
    phone: (fd.get('tel') as string)?.trim() ?? '',
    address: (fd.get('adresse') as string)?.trim() ?? '',
  };
  const items = toOrderItems();
  const order = createOrder(customer, items, selectedShipping, selectedPayment);
  clearCart();
  showConfirmation(order.id);
  showStep(5);
}

function showConfirmation(orderId: string): void {
  const panel = document.querySelector(`[${PANEL_ATTR}="5"]`);
  const idEl = panel?.querySelector('[data-order-id]');
  if (idEl) idEl.textContent = orderId;
}

export function initCheckout(): void {
  initCartBadge();
  const items = getCartItems();
  if (items.length === 0) {
    window.location.href = 'panier.html';
    return;
  }

  // Render shipping options if placeholder exists
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

  showStep(2);
  bindSteps();
  bindShipping();
  bindPayment();
  updateOrderSummary();

  const btn = document.querySelector('[data-checkout-submit]');
  btn?.addEventListener('click', (e) => {
    e.preventDefault();
    submitCheckout();
  });
}

initCheckout();

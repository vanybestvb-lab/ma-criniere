import { initCartBadge } from './cart-badge.js';
import { getCartItems, getCartTotal, clearCart } from './cart-store.js';
import { createOrder } from './order-store.js';
const PANEL_ATTR = 'data-checkout-panel';
const SHIPPING_OPTIONS = [
    { id: 'express-24', label: 'Livraison express 24h (70 km)', price: 15, delay: '24h' },
    { id: 'express-48', label: 'Livraison express 48h', price: 10, delay: '48h' },
    { id: 'standard', label: 'Livraison standard', price: 5, delay: '48-72h' },
];
let selectedShipping = SHIPPING_OPTIONS[0];
let selectedPayment = 'mobile_money';
function formatPrice(price) {
    return `${price} $`;
}
function showStep(stepIndex) {
    document.querySelectorAll('.checkout-step').forEach((el, i) => {
        el.classList.remove('active', 'done');
        if (i + 1 === stepIndex)
            el.classList.add('active');
        else if (i + 1 < stepIndex)
            el.classList.add('done');
    });
    document.querySelectorAll(`[${PANEL_ATTR}]`).forEach((el, i) => {
        el.classList.toggle('active', i + 1 === stepIndex);
    });
}
function bindSteps() {
    document.querySelectorAll('.checkout-step').forEach((el, i) => {
        el.addEventListener('click', () => showStep(i + 1));
    });
}
function bindShipping() {
    SHIPPING_OPTIONS.forEach((opt) => {
        const radio = document.querySelector(`input[name="shipping"][value="${opt.id}"]`);
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
    if (subtotalEl)
        subtotalEl.textContent = formatPrice(subtotal);
    if (shipEl)
        shipEl.textContent = formatPrice(shippingCost);
    if (totalEl)
        totalEl.textContent = formatPrice(total);
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
        firstName: fd.get('prenom')?.trim() ?? '',
        lastName: fd.get('nom')?.trim() ?? '',
        email: fd.get('email')?.trim() ?? '',
        phone: fd.get('tel')?.trim() ?? '',
        address: fd.get('adresse')?.trim() ?? '',
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
    if (idEl)
        idEl.textContent = orderId;
}
export function initCheckout() {
    initCartBadge();
    const items = getCartItems();
    if (items.length === 0) {
        window.location.href = 'panier.html';
        return;
    }
    // Render shipping options if placeholder exists
    const shipContainer = document.querySelector('[data-shipping-options]');
    if (shipContainer) {
        shipContainer.innerHTML = SHIPPING_OPTIONS.map((opt, i) => `
      <label class="shipping-option ${i === 0 ? 'selected' : ''}">
        <input type="radio" name="shipping" value="${opt.id}" ${i === 0 ? 'checked' : ''}>
        <span>${opt.label}</span>
        <strong>${formatPrice(opt.price)}</strong> — ${opt.delay}
      </label>
    `).join('');
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

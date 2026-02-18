const STORAGE_KEY = 'ma-criniere-cart';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x) =>
        typeof x === 'object' &&
        x !== null &&
        typeof x.productId === 'string' &&
        typeof x.name === 'string' &&
        typeof x.price === 'number' &&
        typeof x.quantity === 'number' &&
        typeof x.image === 'string' &&
        typeof x.subtotal === 'number'
    );
  } catch {
    return [];
  }
}

function save(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function notify() {
  window.dispatchEvent(new CustomEvent('cart-updated'));
}

export function getCartItems() {
  return load();
}

export function getCartCount() {
  return load().reduce((sum, i) => sum + i.quantity, 0);
}

export function getCartTotal() {
  return load().reduce((sum, i) => sum + i.subtotal, 0);
}

export function addToCart(item, quantity = 1) {
  const qty = Math.max(1, Math.floor(quantity));
  const items = load();
  const existing = items.find((i) => i.productId === item.productId);
  if (existing) {
    existing.quantity += qty;
    existing.subtotal = existing.price * existing.quantity;
  } else {
    items.push({
      ...item,
      quantity: qty,
      subtotal: item.price * qty,
    });
  }
  save(items);
  notify();
}

export function removeFromCart(productId) {
  const items = load().filter((i) => i.productId !== productId);
  save(items);
  notify();
}

export function setQuantity(productId, quantity) {
  const qty = Math.max(0, Math.floor(quantity));
  if (qty === 0) {
    removeFromCart(productId);
    return;
  }
  const items = load();
  const item = items.find((i) => i.productId === productId);
  if (!item) return;
  item.quantity = qty;
  item.subtotal = item.price * qty;
  save(items);
  notify();
}

export function clearCart() {
  save([]);
  notify();
}

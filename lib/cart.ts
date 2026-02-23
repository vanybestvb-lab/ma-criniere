/**
 * Store panier côté client (localStorage).
 * Clé et format alignés avec l’ancien js/cart-store.js pour compatibilité.
 */

const STORAGE_KEY = "ma-criniere-cart";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  subtotal: number;
}

function load(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is CartItem =>
        typeof x === "object" &&
        x !== null &&
        typeof (x as CartItem).productId === "string" &&
        typeof (x as CartItem).name === "string" &&
        typeof (x as CartItem).price === "number" &&
        typeof (x as CartItem).quantity === "number" &&
        typeof (x as CartItem).image === "string" &&
        typeof (x as CartItem).subtotal === "number"
    );
  } catch {
    return [];
  }
}

function save(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function notifyCartUpdated(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("cart-updated"));
}

export function getCartItems(): CartItem[] {
  return load();
}

export function getCartCount(): number {
  return load().reduce((sum, i) => sum + i.quantity, 0);
}

export function getCartTotal(): number {
  return load().reduce((sum, i) => sum + i.subtotal, 0);
}

export function addToCart(
  item: Omit<CartItem, "quantity" | "subtotal">,
  quantity = 1
): void {
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
  notifyCartUpdated();
}

export function removeFromCart(productId: string): void {
  const items = load().filter((i) => i.productId !== productId);
  save(items);
  notifyCartUpdated();
}

export function setQuantity(productId: string, quantity: number): void {
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
  notifyCartUpdated();
}

export function clearCart(): void {
  save([]);
  notifyCartUpdated();
}

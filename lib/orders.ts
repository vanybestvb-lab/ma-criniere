/**
 * Store commandes côté client (localStorage).
 * Aligné avec l’ancien js/order-store.js pour compatibilité.
 */

const STORAGE_KEY = "ma-criniere-orders";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  subtotal: number;
}

export interface ShippingOption {
  id: string;
  label: string;
  price: number;
  delay: string;
}

export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

export interface Order {
  id: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  shipping: ShippingOption;
  shippingCost: number;
  total: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

function loadOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveOrders(orders: Order[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function generateOrderId(): string {
  const prefix = "MC";
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const r = Math.random().toString(36).slice(-4).toUpperCase();
  return `${prefix}${y}${m}${d}-${r}`;
}

export function createOrder(
  customer: Customer,
  items: OrderItem[],
  shipping: ShippingOption,
  paymentMethod: string
): Order {
  const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
  const order: Order = {
    id: generateOrderId(),
    customer,
    items,
    subtotal,
    shipping,
    shippingCost: shipping.price,
    total: subtotal + shipping.price,
    status: "PENDING",
    paymentMethod,
    createdAt: new Date().toISOString(),
  };
  const orders = loadOrders();
  orders.unshift(order);
  saveOrders(orders);
  return order;
}

export function getOrderById(id: string): Order | undefined {
  return loadOrders().find((o) => o.id === id);
}

export function getOrders(): Order[] {
  return loadOrders();
}

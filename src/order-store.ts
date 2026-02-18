import type { Customer, Order, OrderItem, OrderStatus, ShippingOption } from './types.js';

const STORAGE_KEY = 'ma-criniere-orders';

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as Order[];
  } catch {
    return [];
  }
}

function saveOrders(orders: Order[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function generateOrderId(): string {
  const prefix = 'MC';
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
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
    status: 'PENDING',
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

export function setOrderStatus(orderId: string, status: OrderStatus): void {
  const orders = loadOrders();
  const order = orders.find((o) => o.id === orderId);
  if (order) {
    order.status = status;
    saveOrders(orders);
  }
}

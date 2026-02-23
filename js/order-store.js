const STORAGE_KEY = 'ma-criniere-orders';
function loadOrders() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed))
            return [];
        return parsed;
    }
    catch {
        return [];
    }
}
function saveOrders(orders) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}
function generateOrderId() {
    const prefix = 'MC';
    const date = new Date();
    const y = date.getFullYear().toString().slice(-2);
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const r = Math.random().toString(36).slice(-4).toUpperCase();
    return `${prefix}${y}${m}${d}-${r}`;
}
export function createOrder(customer, items, shipping, paymentMethod) {
    const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
    const order = {
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
export function getOrderById(id) {
    return loadOrders().find((o) => o.id === id);
}
export function getOrders() {
    return loadOrders();
}
export function setOrderStatus(orderId, status) {
    const orders = loadOrders();
    const order = orders.find((o) => o.id === orderId);
    if (order) {
        order.status = status;
        saveOrders(orders);
    }
}

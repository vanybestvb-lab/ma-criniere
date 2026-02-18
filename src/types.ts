/** Types stricts pour Ma Crinière — e-commerce */

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  subtotal: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tag: string;
  price: number;
  promo?: { percent: number; label: string };
  image: string;
  images: string[];
  descriptionShort: string;
  descriptionLong: string;
  features: string[];
  /** Caractéristiques dynamiques (Marque, Dimensions, Couleur, Poids, etc.) */
  specs?: Record<string, string>;
  stock: number;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  subtotal: number;
}

export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

export interface ShippingOption {
  id: string;
  label: string;
  price: number;
  delay: string;
}

export interface Order {
  id: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  shipping: ShippingOption;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  createdAt: string;
}

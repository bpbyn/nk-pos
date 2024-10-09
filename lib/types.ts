import { ReactNode } from 'react';

export const routes = {
  DASHBOARD: '/',
  ORDERS: '/orders',
  PRODUCTS: '/products',
  CUSTOMERS: '/customers',
  ANALYTICS: '/analytics',
} as const;

export const orderStatus = {
  // BREWING: 'brewing',
  // SERVING: 'serving',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  // LOADING: 'loading',
} as const;

export const productType = {
  hot: 'hot',
  cold: 'cold',
  snack: 'snack',
} as const;

export const productSize = {
  regular: 'Regular',
  large: 'Large',
} as const;

export type NavigationList = {
  label: string;
  route: string;
  asset: ReactNode;
};

export type Product = {
  id: string;
  name: string;
  size: {
    [size in keyof typeof productSize]: number; // size and price..
  };
  type: ProductType;
  asset?: string;
};

export type Order = {
  id: string;
  orderId?: string;
  customerName: string;
  timestamp: number;
  status: OrderStatus;
  orders: OrderDetail[];
  totalPrice: number;
};

export type OrderDetail = {
  productId: Product['id'];
  size: ProductSize;
  quantity: number;
  price: number;
  type: Product['type'];
};

export type ProductType = (typeof productType)[keyof typeof productType];

export type ProductSize = keyof typeof productSize;

export type OrderStatus = (typeof orderStatus)[keyof typeof orderStatus];

export type Counter = {
  date: number;
  queueCount: number;
};

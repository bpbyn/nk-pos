import { ReactNode } from 'react';

export const routes = {
  DASHBOARD: '/',
  ORDERS: '/orders',
  PRODUCTS: '/products',
  CUSTOMERS: '/customers',
  ANALYTICS: '/analytics',
};

export type NavigationList = {
  label: string;
  route: string;
  asset: ReactNode;
};

export type Product = {
  name: string;
  price: ProductPricePerVariant;
  asset?: string;
};

export type ProductPricePerVariant = {
  hot?: ProductPrice;
  cold?: ProductPrice;
};

export type ProductPrice = {
  regular: number;
  large: number;
};

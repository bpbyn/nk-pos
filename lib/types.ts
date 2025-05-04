import { ReactNode } from 'react';
import { UploadedFileData } from 'uploadthing/types';

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

export const productCategory = {
  drinks: 'drinks',
  snacks: 'snacks',
} as const;

export const productSubCategory = {
  coffee: 'coffee',
  nonCoffee: 'nonCoffee',
  snack: 'snack',
} as const;

export const productType = {
  hot: 'hot',
  cold: 'cold',
} as const;

export const productTypeLabels: Record<ProductType, string> = {
  hot: 'Hot',
  cold: 'Cold',
};

export const productSubCategoryLabels: Record<ProductSubCategory, string> = {
  coffee: 'Coffee',
  nonCoffee: 'Non-Coffee',
  snack: 'Snacks',
};

export const productSize = {
  regular: 'Regular',
  large: 'Large',
} as const;

export const productStatus = {
  active: 'Active',
  inactive: 'Inactive',
} as const;

export const userRole = {
  user: 'user',
  admin: 'admin',
} as const;

export type NavigationList = {
  label: string;
  route: string;
  asset: ReactNode;
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  category: ProductCategory;
  subcategory: ProductSubCategory;
  type: ProductType;
  size: {
    [size in keyof typeof productSize]: number; // size and price..
  };
  status: ProductStatus;
  asset?: ImageFile;
  timestamp: number;
  extras?: Extra[];
};

export type Order = {
  id: string;
  orderId?: string;
  customerName: string;
  timestamp: number;
  status: OrderStatus;
  orders: OrderDetail[];
  totalPrice: number;
  notes?: string;
};

export type OrderDetail = {
  productId: Product['id'];
  size: ProductSize;
  quantity: number;
  price: number;
  type: Product['type'];
  extras?: OrderExtra[];
};

export type Extra = {
  id: string;
  name: string;
  price: number;
  status: ProductStatus;
  timestamp: number;
  asset?: ImageFile;
};

export type OrderExtra = {
  extra: Extra;
  quantity: number;
};

export type ProductType = (typeof productType)[keyof typeof productType];

export type ProductSize = keyof typeof productSize;

export type ProductStatus = keyof typeof productStatus;

export type ProductCategory = keyof typeof productCategory;

export type ProductSubCategory = keyof typeof productSubCategory;

export type OrderStatus = (typeof orderStatus)[keyof typeof orderStatus];

export type UserRole = keyof typeof userRole;

export type Counter = {
  date: number;
  queueCount: number;
};

export type ImageFile = Pick<UploadedFileData, 'key' | 'url' | 'name'>;

// ANALYTICS
export type ProductSizeAnalytics = {
  cups: Product['size'] & { total: number };
  total: Product['size'] & { total: number };
};

export type CupsAnalytics = {
  [size in ProductSize | 'total']: number;
};

// USER

export type User = {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

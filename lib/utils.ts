import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Product, ProductType } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const millisToDate = (date: number) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

export const pad = (n: number) => {
  const s = '000' + n;
  return s.substring(s.length - 4);
};

export const filterProducts = (products: Product[], product: ProductType) =>
  products.filter((p) => p.type === product);

export const findProduct = <T, K extends keyof T>(products: T[], key: K, value: T[K]) =>
  products.find((product) => product[key] === value);

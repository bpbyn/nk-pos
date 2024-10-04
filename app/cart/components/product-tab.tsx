'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useOrderStore from '@/lib/store';
import { ProductType, productType } from '@/lib/types';
import { filterProducts } from '@/lib/utils';
import React from 'react';

import ProductCard from './product-card';

export default function ProductTab() {
  const products = useOrderStore((state) => state.products);

  return (
    <Tabs defaultValue={productType.cold}>
      <TabsList className="flex justify-center md:inline-block">
        {Object.keys(productTypeLabels).map((value, i) => (
          <TabsTrigger key={`tabs-trigger-${i}`} value={value}>
            {productTypeLabels[value as keyof typeof productTypeLabels]}
          </TabsTrigger>
        ))}
      </TabsList>
      {(Object.keys(productTypeLabels) as Array<ProductType>).map((value, i) => {
        const filteredProducts = filterProducts(products, value);
        return (
          <TabsContent key={`tabs-content-${i}`} value={value}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[...filteredProducts].map((product, i) => (
                <ProductCard product={product} key={`${product}-${i}`} />
              ))}
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

export const productTypeLabels: Record<ProductType, string> = {
  hot: 'Hot Drinks',
  cold: 'Cold Drinks',
  snack: 'Snacks',
};

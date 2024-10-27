'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import useOrderStore from '@/lib/store';
import { ProductType, productTypeLabels } from '@/lib/types';
import React, { useMemo } from 'react';

import ProductCard from './product-card';

type ProductTabProps = {
  searchTerm?: string;
  productTab: string;
};

export default function ProductTab({ searchTerm, productTab }: ProductTabProps) {
  const products = useOrderStore((state) => state.products);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      return (
        (product.name.toLocaleLowerCase().includes(searchTerm ?? product.name) ||
          product.type.toLocaleLowerCase().includes(searchTerm ?? product.type)) &&
        product.type === productTab
      );
    });
  }, [productTab, products, searchTerm]);

  return (
    <div>
      {(Object.keys(productTypeLabels) as Array<ProductType>).map((value, i) => (
        <TabsContent key={`tabs-content-${i}`} value={value}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredProducts.length > 0 ? (
              [...filteredProducts].map((product, i) => (
                <ProductCard product={product} key={`${product}-${i}`} />
              ))
            ) : (
              <Card className="col-span-3 border-none shadow-none md:border-solid">
                <CardHeader>
                  <CardTitle className="text-center text-lg font-bold tracking-tight">
                    You have no items here.
                  </CardTitle>
                  <CardDescription className="text-center">
                    You can start selling as soon as you add it in the Products Tab.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </TabsContent>
      ))}
    </div>
  );
}

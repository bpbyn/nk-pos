'use client';

import Shell from '@/components/shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductType, productType, productTypeLabels } from '@/lib/types';
import { Search } from 'lucide-react';
import React, { useState } from 'react';

import CheckoutCard from './components/checkout-card';
import CheckoutDrawer from './components/checkout-drawer';
import ProductTab from './components/product-tab';

export default function Cart() {
  const [searchTerm, setSearchTerm] = useState('');
  const [productTab, setProductTab] = useState<ProductType>(productType.cold);

  return (
    <Shell>
      <Tabs
        defaultValue={productType.cold}
        onValueChange={(value) => setProductTab(value as ProductType)}
      >
        <TabsList className="mb-2 md:inline-block">
          {Object.keys(productTypeLabels).map((value, i) => (
            <TabsTrigger key={`tabs-trigger-${i}`} value={value}>
              {productTypeLabels[value as keyof typeof productTypeLabels]}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="col-span-1 lg:col-span-2">
            <Card className="lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between px-6 py-2">
                <div className="hidden py-4 md:flex md:flex-col">
                  <CardTitle className="text-3xl font-bold tracking-tight">Menu</CardTitle>
                  <CardDescription>Select customer&apos;s order below.</CardDescription>
                </div>
                <div className="flex w-full gap-2 md:w-auto lg:gap-0">
                  <div className="relative ml-auto flex-1 md:grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="w-full rounded-lg bg-background pl-8 text-base placeholder:text-sm md:w-[200px] md:text-sm lg:w-[300px]"
                      onChange={(e) => setSearchTerm(e.target.value.toLocaleLowerCase())}
                    />
                  </div>
                  <CheckoutDrawer />
                </div>
              </CardHeader>
              <CardContent>
                <ProductTab searchTerm={searchTerm.toLocaleLowerCase()} productTab={productTab} />
              </CardContent>
            </Card>
          </div>
          <CheckoutCard className="hidden lg:inline-block" />
        </div>
      </Tabs>
    </Shell>
  );
}

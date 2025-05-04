'use client';

import Shell from '@/components/shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  ProductSubCategory,
  ProductType,
  productSubCategory,
  productSubCategoryLabels,
  productType,
} from '@/lib/types';
import { cn } from '@/lib/utils';
import { Flame, Search, Snowflake } from 'lucide-react';
import React, { useState } from 'react';

import CheckoutCard from './components/checkout-card';
import CheckoutDrawer from './components/checkout-drawer';
import ProductTab from './components/product-tab';

export default function Cart() {
  const [searchTerm, setSearchTerm] = useState('');
  const [productTab, setProductTab] = useState<ProductSubCategory>(productSubCategory.coffee);
  const [productTypeTab, setProductTypeTab] = useState<ProductType[]>([
    productType.cold,
    productType.hot,
  ]);

  return (
    <Shell>
      <Tabs
        defaultValue={productSubCategory.coffee}
        onValueChange={(value) => setProductTab(value as ProductSubCategory)}
      >
        <TabsList className="mb-2 flex justify-around md:inline-block">
          {Object.keys(productSubCategoryLabels).map((value, i) => (
            <TabsTrigger
              key={`tabs-trigger-${i}`}
              value={value}
              className="w-full md:w-auto"
              disabled={value === productSubCategory.snack}
            >
              {productSubCategoryLabels[value as keyof typeof productSubCategoryLabels]}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="grid grid-cols-1 gap-4 gap-y-0 lg:grid-cols-3">
          <div className="col-span-1 lg:col-span-2">
            <Card className="lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between px-4 py-2 lg:px-6">
                <div className="hidden py-4 md:flex md:flex-col">
                  <CardTitle className="text-3xl font-bold tracking-tight">Menu</CardTitle>
                  <CardDescription>Select customer&apos;s order below.</CardDescription>
                </div>
                <div className="flex w-full gap-1 md:w-auto lg:gap-2">
                  <div className="relative ml-auto flex-1 md:grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search Menu..."
                      className="flex rounded-lg bg-background pl-8 text-base placeholder:text-sm md:w-[200px] md:text-sm lg:w-[250px]"
                      onChange={(e) => setSearchTerm(e.target.value.toLocaleLowerCase())}
                    />
                  </div>
                  <div className="flex gap-1">
                    <ToggleGroup
                      type="multiple"
                      defaultValue={productTypeTab}
                      onValueChange={(value) =>
                        setProductTypeTab(value.map((v) => v as ProductType))
                      }
                    >
                      <ToggleGroupItem
                        value={productType.hot}
                        className={cn(
                          'transition-colors data-[state=on]:bg-accent data-[state=on]:text-red-500 supports-hover:hover:text-red-300 data-[state=on]:dark:text-red-300'
                        )}
                      >
                        <Flame className="h-4 w-4" />
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value={productType.cold}
                        className={cn(
                          'transition-colors data-[state=on]:bg-accent data-[state=on]:text-blue-500 supports-hover:hover:text-blue-300 data-[state=on]:dark:text-blue-300'
                        )}
                      >
                        <Snowflake className="h-4 w-4" />
                      </ToggleGroupItem>
                    </ToggleGroup>
                    <CheckoutDrawer />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[calc(100vh-210px)] overflow-y-auto px-4 md:h-auto lg:px-6">
                <ProductTab
                  searchTerm={searchTerm.toLocaleLowerCase()}
                  productTab={productTab}
                  productTypeTab={productTypeTab}
                />
              </CardContent>
            </Card>
          </div>
          <CheckoutCard className="hidden lg:inline-block" />
        </div>
      </Tabs>
    </Shell>
  );
}

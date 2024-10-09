import Shell from '@/components/shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import React from 'react';

import CheckoutCard from './components/checkout-card';
import CheckoutDrawer from './components/checkout-drawer';
import ProductTab from './components/product-tab';

export default async function Cart() {
  return (
    <Shell>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="col-span-1 lg:col-span-2">
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div className="hidden md:flex md:flex-col">
                <CardTitle className="text-xl font-bold">Menu</CardTitle>
                <CardDescription>Select customer&apos;s order below.</CardDescription>
              </div>
              <div className="flex w-full gap-4 md:w-auto">
                <div className="relative ml-auto flex-1 md:grow-0">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                  />
                </div>
                <CheckoutDrawer />
              </div>
            </CardHeader>
            <CardContent>
              <ProductTab />
            </CardContent>
          </Card>
        </div>
        <CheckoutCard className="hidden lg:inline-block" />
      </div>
    </Shell>
  );
}

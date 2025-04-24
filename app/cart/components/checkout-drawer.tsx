'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import useOrderStore from '@/lib/store';
import { ShoppingBag } from 'lucide-react';
import React, { useState } from 'react';

import CheckoutCard from './checkout-card';

export default function CheckoutDrawer() {
  const orderDetails = useOrderStore((state) => state.orderDetails);
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleDrawerChange = (open: boolean) => {
    setOpenDrawer(open);
    if (open) {
      useOrderStore.getState().getQueueCount('counter', 'queue');
    }
  };

  return (
    <Drawer onOpenChange={handleDrawerChange} open={openDrawer}>
      <DrawerTrigger asChild>
        <div className="relative">
          <Button size="icon" variant="outline" className="lg:hidden">
            <ShoppingBag className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          {orderDetails.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs lg:hidden"
            >
              {orderDetails.length}
            </Badge>
          )}
        </div>
      </DrawerTrigger>
      <DrawerContent className="px-4 pb-4">
        <DrawerHeader>
          <DrawerTitle></DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <CheckoutCard onCheckout={() => setOpenDrawer(!openDrawer)} />
      </DrawerContent>
    </Drawer>
  );
}

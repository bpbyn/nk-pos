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
import { cn } from '@/lib/utils';
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
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              'border-none hover:text-orange-500 hover:dark:text-orange-300 lg:hidden',
              orderDetails.length > 0 && 'bg-accent text-orange-500 dark:text-orange-300'
            )}
          >
            <ShoppingBag className="h-4 w-4" />
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
        <DrawerTitle />
        <DrawerDescription />
        <DrawerHeader className="p-1" />
        <CheckoutCard onCheckout={() => setOpenDrawer(!openDrawer)} />
      </DrawerContent>
    </Drawer>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ShoppingBag } from 'lucide-react';
import React, { useState } from 'react';

import CheckoutCard from './checkout-card';

export default function CheckoutMobileCard() {
  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <Drawer onOpenChange={() => setOpenDrawer(!openDrawer)} open={openDrawer}>
      <DrawerTrigger asChild>
        <Button size="icon" variant="outline" className="lg:hidden">
          <ShoppingBag className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-4 pb-8">
        <DrawerHeader>
          <DrawerTitle></DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <CheckoutCard onCheckout={() => setOpenDrawer(!openDrawer)} />
      </DrawerContent>
    </Drawer>
  );
}

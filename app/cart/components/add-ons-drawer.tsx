import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';
import { OrderDetail, OrderExtra, Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';
import React, { useState } from 'react';

import AddOnsCard from './add-ons-card';

type AddOnsDrawerProps = {
  productId: Product['id'];
  order: OrderDetail;
  onAddOnsChange: (addOns: OrderExtra[]) => void;
  className?: React.ComponentProps<'div'>['className'];
};

export default function AddOnsDrawer({ productId, order, onAddOnsChange }: AddOnsDrawerProps) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  if (isDesktop) {
    return (
      <Dialog onOpenChange={() => setOpenDrawer(!openDrawer)} open={openDrawer}>
        <DialogTrigger asChild>
          <Button variant="link" className="justify-start p-0 pl-1" disabled={order.quantity === 0}>
            <div className="relative flex items-center justify-start gap-1 overflow-hidden">
              <div
                className={cn(
                  'text-xs font-medium text-muted-foreground transition-all duration-500 ease-in-out',
                  order.quantity > 0 && '-translate-y-10'
                )}
              >
                Extras
              </div>
              <div
                className={cn(
                  'absolute translate-y-full text-xs font-medium text-muted-foreground transition-all duration-500 ease-in-out',
                  order.quantity > 0 && 'translate-y-0'
                )}
              >
                Extras
              </div>
              <ArrowUpRight
                className={cn(
                  'h-4 w-4 transition-all duration-1000 ease-in-out',
                  order.quantity > 0 && '-translate-y-14 translate-x-14'
                )}
              />
              <ArrowUpRight
                className={cn(
                  'absolute h-4 w-4 -translate-x-0 translate-y-14 transition-all duration-1000 ease-in-out',
                  order.quantity > 0 && 'translate-x-10 translate-y-0'
                )}
              />
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="mt-2 sm:max-w-[425px]">
          <DialogTitle />
          <DialogDescription />
          <DialogHeader />
          <AddOnsCard
            productId={productId}
            onAddOnsChange={(addOns) => {
              setOpenDrawer(!openDrawer);
              onAddOnsChange?.(addOns);
            }}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer onOpenChange={() => setOpenDrawer(!openDrawer)} open={openDrawer}>
      <DrawerTrigger asChild>
        <Button variant="link" className="justify-start p-0 pl-2" disabled={order.quantity === 0}>
          <div className="relative flex items-center justify-start gap-1 overflow-hidden">
            <div
              className={cn(
                'text-xs font-medium text-muted-foreground transition-all duration-500 ease-in-out',
                order.quantity > 0 && '-translate-y-10'
              )}
            >
              Extras
            </div>
            <div
              className={cn(
                'absolute translate-y-full text-xs font-medium text-muted-foreground transition-all duration-500 ease-in-out',
                order.quantity > 0 && 'translate-y-0'
              )}
            >
              Extras
            </div>
            <ArrowUpRight
              className={cn(
                'h-4 w-4 transition-all duration-1000 ease-in-out',
                order.quantity > 0 && '-translate-y-14 translate-x-14'
              )}
            />
            <ArrowUpRight
              className={cn(
                'absolute h-4 w-4 -translate-x-0 translate-y-14 transition-all duration-1000 ease-in-out',
                order.quantity > 0 && 'translate-x-10 translate-y-0'
              )}
            />
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-4 pb-4">
        <DrawerTitle />
        <DrawerDescription />
        <DrawerHeader className="p-1" />
        <AddOnsCard
          productId={productId}
          onAddOnsChange={(addOns) => {
            setOpenDrawer(!openDrawer);
            onAddOnsChange?.(addOns);
          }}
        />
      </DrawerContent>
    </Drawer>
  );
}

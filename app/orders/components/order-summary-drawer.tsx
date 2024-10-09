import { Badge } from '@/components/ui/badge';
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
import { Order, orderStatus } from '@/lib/types';
import { ArrowUpRight } from 'lucide-react';
import React, { useState } from 'react';

import OrderTable from './order-table';

export default function OrderSummaryDrawer({ order }: { order: Order }) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog onOpenChange={() => setOpenDrawer(!openDrawer)} open={openDrawer}>
        <DialogTrigger asChild>
          <Button variant="link" className="p-0">
            <div className="flex items-center gap-1">
              <div className="text-md text-muted-foreground">Order #{order.id}</div>
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center justify-between pl-2 pr-3 pt-2">
              <div className="grid gap-3">
                <DialogTitle>Order #{order.id}</DialogTitle>
                <DialogDescription>Order of {order.customerName}</DialogDescription>
              </div>
              <div className="grid gap-2">
                {order.status === orderStatus.ACTIVE ? (
                  <Badge
                    variant="secondary"
                    className="bg-green-100/50 capitalize text-green-500 dark:bg-green-900/50 dark:text-green-300"
                  >
                    {order.status}
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-blue-100/50 text-blue-500 dark:bg-blue-900/50 dark:text-blue-300"
                  >
                    Complete
                  </Badge>
                )}
              </div>
            </div>
          </DialogHeader>
          <OrderTable orderDetails={order.orders} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer onOpenChange={() => setOpenDrawer(!openDrawer)} open={openDrawer}>
      <DrawerTrigger asChild>
        <Button variant="link" className="p-0">
          <div className="flex items-center gap-1">
            <div className="text-md text-muted-foreground">Order #{order.id}</div>
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-4 pb-8">
        <DrawerHeader className="px-2 pb-8 text-left">
          <div className="flex items-center justify-between">
            <div className="grid gap-2">
              <DrawerTitle>Order #{order.id}</DrawerTitle>
              <DrawerDescription>Order of {order.customerName}</DrawerDescription>
            </div>
            <div className="grid gap-2">
              {order.status === orderStatus.ACTIVE ? (
                <Badge
                  variant="secondary"
                  className="bg-green-100/50 capitalize text-green-500 dark:bg-green-900/50 dark:text-green-300"
                >
                  {order.status}
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-blue-100/50 text-blue-500 dark:bg-blue-900/50 dark:text-blue-300"
                >
                  Complete
                </Badge>
              )}
            </div>
          </div>
        </DrawerHeader>
        <OrderTable orderDetails={order.orders} />
      </DrawerContent>
    </Drawer>
  );
}

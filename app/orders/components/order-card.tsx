import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { updateDocument } from '@/lib/firebase/service';
import { Order, OrderStatus, orderStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';
import { toast } from 'sonner';

import CancelDialog from './cancel-dialog';
import OrderSummaryDrawer from './order-summary-drawer';

type OrderCardProps = {
  order: Order;
};

export default function OrderCard({ order }: OrderCardProps) {
  const handleOrderStatus = async (status: Omit<OrderStatus, 'active'>) => {
    if (!order.orderId) return;
    try {
      toast.loading('Updating order status... Please wait.');
      await updateDocument('orders', order.orderId, { status: status });
      toast.success('Order status successfully updated!');
      toast.dismiss();
    } catch (e) {
      toast.error('Failed to update the order. Please try again after sometime');
      console.error('Error occurred while updating the order', e);
    }
  };

  const getCardContent: Record<OrderStatus, ReactNode> = {
    [orderStatus.ACTIVE]: (
      <>
        <CancelDialog onCancel={() => handleOrderStatus(orderStatus.CANCELLED)} />
        <Button variant="default" onClick={() => handleOrderStatus(orderStatus.COMPLETED)}>
          Serve
        </Button>
      </>
    ),
    [orderStatus.CANCELLED]: (
      <div className="text-xs text-muted-foreground">This order has been cancelled.</div>
    ),
    [orderStatus.COMPLETED]: (
      <div className="text-xs text-muted-foreground">This order has been completed and served.</div>
    ),
  };

  return (
    <Card className="min-w-60">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold leading-none">{order.customerName}</h3>
            <OrderSummaryDrawer order={order} />
          </div>
          <div className="grid gap-2">
            <Badge
              variant="secondary"
              className={cn(
                order.status === orderStatus.ACTIVE &&
                  'bg-green-100/50 capitalize text-green-500 dark:bg-green-900/50 dark:text-green-300',
                order.status === orderStatus.COMPLETED &&
                  'bg-blue-100/50 capitalize text-blue-500 dark:bg-blue-900/50 dark:text-blue-300',
                order.status === orderStatus.CANCELLED &&
                  'bg-red-100/50 capitalize text-red-500 dark:bg-red-900/50 dark:text-red-300'
              )}
            >
              {order.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between pr-6">
        {getCardContent[order.status]}
      </CardContent>
    </Card>
  );
}

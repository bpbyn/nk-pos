import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Order, orderStatus } from '@/lib/types';
import React from 'react';

import OrderSummaryDrawer from './order-summary-drawer';

type OrderCardProps = {
  order: Order;
  onCancel?: () => void;
  onSubmit?: () => void;
};

export default function OrderCard({ order, onCancel, onSubmit }: OrderCardProps) {
  return (
    <Card className="min-w-60">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold leading-none">{order.customerName}</h3>
            <OrderSummaryDrawer order={order} />
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
      </CardHeader>
      <CardContent className="flex items-center justify-between pr-6">
        {order.status === orderStatus.ACTIVE ? (
          <>
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>

            <Button variant="default" onClick={onSubmit}>
              Serve
            </Button>
          </>
        ) : (
          <div className="text-xs text-muted-foreground">
            This order has been completed and served.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

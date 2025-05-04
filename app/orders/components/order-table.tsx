import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import useOrderStore from '@/lib/store';
import { Order, OrderDetail, Product } from '@/lib/types';
import { findProduct } from '@/lib/utils';
import React from 'react';

export default function OrderTable({ order }: { order: Order }) {
  const products = useOrderStore((state) => state.products);
  const orderDetails = order.orders as OrderDetail[];

  return (
    <div className="grid gap-4">
      <Table>
        <TableHeader>
          <TableRow></TableRow>
        </TableHeader>
        <TableBody>
          {orderDetails.map((orderDetail, i) => {
            const product = findProduct<Product, keyof Product>(
              products,
              'id',
              orderDetail.productId
            );

            return (
              <TableRow key={`order-detail-${i}`}>
                <TableCell className="flex gap-4">
                  <Badge variant="outline">{orderDetail.quantity}</Badge>
                  <div className="font-medium">{product?.name}</div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{orderDetail.size}</Badge>
                      <Badge variant="secondary">{orderDetail.type}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {orderDetail.extras?.map((extra) => (
                        <Badge
                          key={extra.extra.id}
                          variant="secondary"
                          className="whitespace-nowrap lowercase"
                        >
                          {extra.quantity}x {extra.extra.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {order.notes && (
        <div className="flex items-center justify-between gap-2 rounded-md bg-muted p-4 text-sm">
          <div className="p-2">{order.notes}</div>
        </div>
      )}
    </div>
  );
}

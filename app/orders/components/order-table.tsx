import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import useOrderStore from '@/lib/store';
import { OrderDetail, Product } from '@/lib/types';
import { findProduct } from '@/lib/utils';
import React from 'react';

export default function OrderTable({ orderDetails }: { orderDetails: OrderDetail[] }) {
  const products = useOrderStore((state) => state.products);

  return (
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
                <div className="flex justify-end gap-2">
                  <Badge variant="secondary">{orderDetail.size}</Badge>
                  <Badge variant="secondary">{orderDetail.type}</Badge>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

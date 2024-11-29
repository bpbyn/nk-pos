import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Order, orderStatus } from '@/lib/types';
import { cn, dateFormatter } from '@/lib/utils';
import React from 'react';

export default function CustomersTable({ orders }: { orders: Order[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="">Customer</TableHead>
          <TableHead className="text-center md:table-cell">Amount</TableHead>
          <TableHead className="hidden text-center xl:table-cell">Date</TableHead>
          <TableHead className="text-center md:table-cell">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order, i) => {
          return (
            <TableRow key={`customer-item-${i}`}>
              <TableCell className="font-medium">{order.customerName}</TableCell>
              <TableCell className="text-center">₱{order.totalPrice}</TableCell>
              <TableCell className="hidden text-center xl:block">
                {dateFormatter().format(order.timestamp).split(',').join('')}
              </TableCell>
              <TableCell className="text-center">
                {
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
                }
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

'use client';

import Shell from '@/components/shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/lib/firebase/firebase';
import useOrderStore from '@/lib/store';
import { Order, orderStatus } from '@/lib/types';
import { cn, dateFormatter } from '@/lib/utils';
import { DocumentData, collection, onSnapshot, query, where } from '@firebase/firestore';
import { startOfDay } from 'date-fns';
import { File } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export default function Customers() {
  const orders = useOrderStore((state) => state.orders);
  const tabList = ['today', 'week', 'month'] as const;
  const [customerTab, setCustomerTab] = useState<(typeof tabList)[number]>(tabList[0]);

  useEffect(() => {
    const orderCollectionRef = collection(db, 'orders');
    const startDay = startOfDay(new Date()).valueOf();

    const q = query(orderCollectionRef, where('timestamp', '>', startDay));
    const unsubscribe = onSnapshot(q, (snapshots) => {
      const fetchedOrders = snapshots.docs
        .map((doc: DocumentData) => {
          const { customerName, timestamp, id, status, orders, totalPrice } = doc.data();
          const completeDoc: Order = {
            id,
            orderId: doc.id,
            customerName,
            timestamp,
            status,
            orders,
            totalPrice,
          };
          return completeDoc;
        })
        .sort((a, b) => b.timestamp - a.timestamp);
      useOrderStore.setState({ orders: fetchedOrders });
    });
    return () => unsubscribe();
  }, []);

  return (
    <Shell>
      <Tabs
        defaultValue={customerTab}
        onValueChange={(value) => setCustomerTab(value as (typeof tabList)[number])}
      >
        <div className="flex items-center">
          <TabsList>
            {tabList.map((tab, i) => (
              <TabsTrigger
                key={`tabs-trigger-customers-${i}`}
                value={tab}
                className="capitalize"
                disabled={tab !== 'today'}
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="ml-auto flex items-center gap-2 pr-1">
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.values(orderStatus).map((type, i) => (
                  <DropdownMenuCheckboxItem
                    key={`dropdown-menu-${i}`}
                    className="capitalize"
                    checked={selectedProductType === type}
                    onCheckedChange={() => handleFilterChange(type)}
                  >
                    {type}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu> */}
            <Button size="sm" variant="outline" className="hidden h-7 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
            </Button>
          </div>
        </div>
        {tabList.map((tab, i) => {
          return (
            <TabsContent value={tab} key={`tabList-${i}`}>
              <Card>
                <CardHeader className="flex-row items-center justify-between px-6 py-2 md:p-6">
                  <div className="hidden md:flex md:flex-col">
                    <CardTitle className="text-3xl font-bold tracking-tight">Customers</CardTitle>
                    <CardDescription>Recent orders by customers on your store.</CardDescription>
                  </div>
                  {/* INSERT SEARCH FN HERE IF NEEDED */}
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="">Customer</TableHead>
                          <TableHead className="md:table-cell">Amount</TableHead>
                          <TableHead className="hidden md:table-cell">Date</TableHead>
                          <TableHead className="md:table-cell">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order, i) => {
                          return (
                            <TableRow key={`customer-item-${i}`}>
                              <TableCell className="font-medium">{order.customerName}</TableCell>
                              <TableCell>₱{order.totalPrice}</TableCell>
                              <TableCell className="hidden md:block">
                                {dateFormatter().format(order.timestamp).split(',').join('')}
                              </TableCell>
                              <TableCell>
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
                  ) : (
                    <Card className="col-span-3 mt-2 border-none shadow-none md:border-solid">
                      <CardHeader>
                        <CardTitle className="text-center text-lg font-bold tracking-tight">
                          You have no items here.
                        </CardTitle>
                        <CardDescription className="text-center">
                          Always be prepared for the next customer.
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </Shell>
  );
}

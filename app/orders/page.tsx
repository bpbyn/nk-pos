'use client';

import Shell from '@/components/shell';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/lib/firebase/firebase';
import useOrderStore from '@/lib/store';
import { Order, orderStatus } from '@/lib/types';
import { DocumentData, collection, onSnapshot, query, where } from '@firebase/firestore';
import React, { useEffect } from 'react';

import OrderCard from './components/order-card';

export default function Orders() {
  const orders = useOrderStore((state) => state.orders);

  useEffect(() => {
    const orderCollectionRef = collection(db, 'orders');
    const startOfDay = new Date(new Date().setHours(0, 0, 0, 0)).valueOf();

    const q = query(orderCollectionRef, where('timestamp', '>', startOfDay));
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
      <div className="grid">
        <Tabs defaultValue="active" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="complete">Complete</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-2 grid gap-2 md:grid-cols-3 md:gap-4">
            {orders.length > 0 ? (
              orders.map((order, i) => <OrderCard key={`orderCardAll-${i}`} order={order} />)
            ) : (
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle className="text-center text-lg font-bold tracking-tight">
                    You have no items here.
                  </CardTitle>
                  <CardDescription className="text-center">
                    You can start selling as soon as you add it in the Products Tab.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="active" className="mt-0 grid gap-2 md:grid-cols-3 md:gap-4">
            {orders.filter((order) => order.status === orderStatus.ACTIVE).length > 0 ? (
              orders
                .filter((order) => order.status === orderStatus.ACTIVE)
                .map((order, i) => <OrderCard key={`orderCardActive-${i}`} order={order} />)
            ) : (
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle className="text-center text-lg font-bold tracking-tight">
                    You have no items here.
                  </CardTitle>
                  <CardDescription className="text-center">
                    You can start selling as soon as you add it in the Products Tab.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="complete" className="mt-0 grid gap-2 md:grid-cols-3 md:gap-4">
            {orders.filter((order) => order.status === orderStatus.COMPLETED).length > 0 ? (
              orders
                .filter((order) => order.status === orderStatus.COMPLETED)
                .map((order, i) => <OrderCard key={`orderCardComplete-${i}`} order={order} />)
            ) : (
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle className="text-center text-lg font-bold tracking-tight">
                    You have no items here.
                  </CardTitle>
                  <CardDescription className="text-center">
                    You can start selling as soon as you add it in the Products Tab.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
}

'use client';

import Shell from '@/components/shell';
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
      const fetchedOrders = snapshots.docs.map((doc: DocumentData) => {
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
      });
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
            {orders.map((order, i) => (
              <OrderCard key={`orderCardAll-${i}`} order={order} />
            ))}
          </TabsContent>
          <TabsContent value="active" className="mt-0 grid gap-2 md:grid-cols-3 md:gap-4">
            {orders
              .filter((order) => order.status === orderStatus.ACTIVE)
              .map((order, i) => (
                <OrderCard key={`orderCardActive-${i}`} order={order} />
              ))}
          </TabsContent>
          <TabsContent value="complete" className="mt-0 grid gap-2 md:grid-cols-3 md:gap-4">
            {orders
              .filter((order) => order.status === orderStatus.COMPLETED)
              .map((order, i) => (
                <OrderCard key={`orderCardComplete-${i}`} order={order} />
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
}

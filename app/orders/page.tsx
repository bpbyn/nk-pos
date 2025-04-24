'use client';

import Shell from '@/components/shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/lib/firebase/firebase';
import useOrderStore from '@/lib/store';
import { Order, orderStatus } from '@/lib/types';
import { DocumentData, collection, onSnapshot, query, where } from '@firebase/firestore';
import { startOfDay } from 'date-fns';
import React, { useEffect, useMemo } from 'react';

import OrderCard from './components/order-card';

export default function Orders() {
  const orders = useOrderStore((state) => state.orders);

  useEffect(() => {
    const orderCollectionRef = collection(db, 'ordersV2');
    const startDay = startOfDay(new Date()).valueOf();

    const q = query(orderCollectionRef, where('timestamp', '>', startDay));
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

  // Use useMemo to compute filtered orders
  const allOrders = useMemo(() => orders, [orders]);
  const activeOrders = useMemo(
    () => orders.filter((order) => order.status === orderStatus.ACTIVE),
    [orders]
  );
  const completedOrders = useMemo(
    () => orders.filter((order) => order.status === orderStatus.COMPLETED),
    [orders]
  );

  return (
    <Shell>
      <div className="grid space-y-4">
        <Tabs defaultValue="active" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="complete">Complete</TabsTrigger>
          </TabsList>
          <Card className="mt-2 border-none md:border-solid">
            <div className="hidden p-6 md:flex md:flex-col">
              <CardTitle className="text-3xl font-bold tracking-tight">Orders</CardTitle>
              <CardDescription className="text-muted-foreground">
                {`Track and complete customer's order here.`}
              </CardDescription>
            </div>
            <CardContent className="p-0 md:px-6 md:pb-6">
              {/* All Orders */}
              <TabsContent
                value="all"
                className="mt-2 grid grid-cols-[auto-fit] gap-2 md:gap-4"
                style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}
              >
                {allOrders.length > 0 ? (
                  allOrders.map((order, i) => <OrderCard key={`orderCardAll-${i}`} order={order} />)
                ) : (
                  <Card className="col-span-full">
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

              {/* Active Orders */}
              <TabsContent
                value="active"
                className="mt-0 grid grid-cols-[auto-fit] gap-2 md:gap-4"
                style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}
              >
                {activeOrders.length > 0 ? (
                  activeOrders.map((order, i) => (
                    <OrderCard key={`orderCardActive-${i}`} order={order} />
                  ))
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

              {/* Completed Orders */}
              <TabsContent
                value="complete"
                className="mt-0 grid grid-cols-[auto-fit] gap-2 md:gap-4"
                style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}
              >
                {completedOrders.length > 0 ? (
                  completedOrders.map((order, i) => (
                    <OrderCard key={`orderCardComplete-${i}`} order={order} />
                  ))
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
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </Shell>
  );
}

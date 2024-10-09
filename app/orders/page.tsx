'use client';

import Shell from '@/components/shell';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/lib/firebase/firebase';
import useOrderStore from '@/lib/store';
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
        const completeDoc = {
          id,
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
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="complete">Complete</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="grid gap-2 pt-2 md:grid-cols-3 md:gap-4">
            {orders.map((order, i) => (
              <OrderCard key={`orderCard-${i}`} order={order} />
            ))}
            {/* <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold leading-none">Joco</h3>
                    <Button variant="link" className="p-0">
                      <div className="flex items-center gap-1">
                        <p className="text-sm text-muted-foreground">Order #001</p>
                        <ArrowUpRight className="h-5 w-5" />
                      </div>
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-green-100/50 text-green-500 dark:bg-green-900/50 dark:text-green-300"
                    >
                      Active
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between p-4">
                <Button variant="ghost">Cancel</Button>
                <Button>Serve</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold leading-none">Marion</h3>
                    <Button variant="link" className="p-0">
                      <div className="flex items-center gap-1">
                        <p className="text-sm text-muted-foreground">Order #002</p>
                        <ArrowUpRight className="h-5 w-5" />
                      </div>
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-green-100/50 text-green-500 dark:bg-green-900/50 dark:text-green-300"
                    >
                      Active
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between p-4">
                <Button variant="ghost">Cancel</Button>
                <Button>Serve</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold leading-none">Brian</h3>
                    <Button variant="link" className="p-0">
                      <div className="flex items-center gap-1">
                        <p className="text-sm text-muted-foreground">Order #003</p>
                        <ArrowUpRight className="h-5 w-5" />
                      </div>
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    <Badge
                      variant="outline"
                      className="bg-blue-100/50 text-blue-500 dark:bg-blue-900/50 dark:text-blue-300"
                    >
                      Complete
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="py-4 text-xs text-muted-foreground">
                  This order has been completed and served.
                </p>
              </CardContent>
            </Card> */}
          </TabsContent>
          <TabsContent value="active">Brewing</TabsContent>
          <TabsContent value="complete">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
}

'use client';

import Shell from '@/components/shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAnalytics } from '@/hooks/use-analytics';
import useAuth from '@/hooks/use-auth';
import { db } from '@/lib/firebase/firebase';
import useOrderStore from '@/lib/store';
import { Order, ProductType, productType, userRole } from '@/lib/types';
import { startOfDay } from 'date-fns';
import { DocumentData, collection, onSnapshot, query, where } from 'firebase/firestore';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import AnalyticsCard from './analytics/components/analytics-card';
import ProductSalesCard from './analytics/components/product-sales-card';
import Cart from './cart/page';
import CustomersTable from './customers/components/customers-table';

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tabProductType, setTabProductType] = useState<ProductType>(productType.cold);
  const { analyticsCard, totalCups, groupedProductTypes } = useAnalytics(orders, tabProductType);
  const userSignIn = useOrderStore((state) => state.user);
  const { user } = useAuth();

  useEffect(() => {
    const orderCollectionRef = collection(db, 'ordersV2');
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

      setOrders(fetchedOrders);
    });
    return () => unsubscribe();
  }, []);

  return userSignIn?.role === userRole.admin ? (
    <Shell>
      <div className="grid h-full gap-4">
        <Card className="h-full border-none md:border-solid">
          <CardHeader className="p-3 md:p-6">
            <div className="items-center justify-end gap-8 p-4 md:flex md:justify-between md:p-0">
              <div>
                <CardTitle className="text-3xl font-bold tracking-tight md:inline-block">
                  Dashboard
                </CardTitle>
                <CardDescription>
                  <span>
                    {`${user?.displayName?.split(' ')[0]}, here's what's happening with your sales
                    today.`}
                  </span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
              {analyticsCard.map(({ title, icon, value, valueDescription }, i) =>
                totalCups ? (
                  <AnalyticsCard
                    key={`analytics-card-${i}`}
                    title={title}
                    icon={icon}
                    value={value}
                    valueDescription={valueDescription}
                  />
                ) : (
                  <Card key={`analytics-skeleton-${i}`} className="space-y-4 p-6">
                    <Skeleton className="h-4" />
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </Card>
                )
              )}
              <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center">
                  <div className="grid gap-2">
                    <CardTitle>Customers</CardTitle>
                    <CardDescription>Recent customers who bought from your store.</CardDescription>
                  </div>
                  <Button asChild size="sm" className="ml-auto">
                    <Link href="/customers">
                      View All
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <CustomersTable orders={orders.slice(0, 10)} />
                </CardContent>
              </Card>
              <Tabs
                defaultValue={productType.cold}
                onValueChange={(value) => setTabProductType(value as ProductType)}
                className="md:col-span-2"
              >
                <TabsList>
                  {Object.keys(productType)
                    .slice(0, -1)
                    .map((type, i) => (
                      <TabsTrigger
                        value={type}
                        className="capitalize"
                        key={`radial-analytics-card-tabs-${i}`}
                      >
                        {type}
                      </TabsTrigger>
                    ))}
                </TabsList>
                {Object.keys(productType)
                  .slice(0, -1)
                  .map((type, i) => (
                    <TabsContent value={type} key={`radial-analytics-card-${i}`}>
                      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                        <ProductSalesCard
                          className="md:col-span-4"
                          productTypes={groupedProductTypes}
                        />
                        {/* <div className="grid gap-4 md:col-span-2 md:gap-8">
                          <RadialAnalyticsCard
                            cups={totalCupsPerSize[0]}
                            total={totalCupsPerSize[1]}
                          />
                          <ProductFeatureCard
                            groupedProductTypes={groupedProductTypes.slice(0, 3)}
                            featureType="bestSeller"
                          />
                        </div> */}
                      </div>
                    </TabsContent>
                  ))}
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  ) : (
    <Cart />
  );
}

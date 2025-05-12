'use client';

import Shell from '@/components/shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDateRangePicker } from '@/components/ui/date-range-picker';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAnalytics } from '@/hooks/use-analytics';
import { db } from '@/lib/firebase/firebase';
import { Order, ProductType, orderStatus, productType } from '@/lib/types';
import { endOfDay, startOfDay, sub } from 'date-fns';
import { DocumentData, collection, onSnapshot, query, where } from 'firebase/firestore';
import { File } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

import AnalyticsCard from './components/analytics-card';
import AverageSalesCard from './components/average-sales-card';
import DailyCupsSoldAreaCard from './components/daily-cups-sold-area-card';
import ProductFeatureCard from './components/product-feature-card';
import ProductSalesCard from './components/product-sales-card';
import RadialAnalyticsCard from './components/radial-chart-card';

export default function Analytics() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tabProductType, setTabProductType] = useState<ProductType>(productType.cold);
  const [date, setDate] = useState<DateRange | undefined>({
    from: sub(new Date(), { days: 7 }),
    to: new Date(),
  });

  const {
    totalSalesPerDate,
    totalCups,
    totalDailyCupsSold,
    totalCupsPerSize,
    groupedProductTypes,
    analyticsCard,
  } = useAnalytics(orders, tabProductType);

  useEffect(() => {
    const orderCollectionRef = collection(db, 'ordersV2');
    if (date?.from && date.to) {
      const q = query(
        orderCollectionRef,
        where('timestamp', '>=', startOfDay(date.from).valueOf()),
        where('timestamp', '<=', endOfDay(date.to).valueOf())
      );

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
          .filter((order) => order.status === orderStatus.COMPLETED)
          .sort((a, b) => b.timestamp - a.timestamp);

        setOrders(fetchedOrders);
      });
      return () => unsubscribe();
    }
  }, [date]);

  return (
    <Shell>
      <div className="grid h-full gap-4">
        <Card className="h-full border-none md:border-solid">
          <CardHeader className="p-3 md:p-6">
            <div className="hidden items-center justify-end gap-8 md:flex md:justify-between">
              <div>
                <CardTitle className="hidden text-3xl font-bold tracking-tight md:inline-block">
                  Analytics
                </CardTitle>
                <CardDescription>
                  Monitor sales performance with detailed insights from your order data.
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarDateRangePicker date={date} onDateChange={setDate} />
                <Button size="sm" className="h-8 gap-1" disabled>
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
              <div className="flex items-center space-x-2 md:hidden">
                <CalendarDateRangePicker date={date} onDateChange={setDate} />
                <Button size="sm" className="h-8 gap-1" disabled>
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
                </Button>
              </div>
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
              <Tabs
                defaultValue={productType.cold}
                onValueChange={(value) => setTabProductType(value as ProductType)}
                className="md:col-span-full"
              >
                <TabsList>
                  {Object.keys(productType).map((type, i) => (
                    <TabsTrigger
                      value={type}
                      className="capitalize"
                      key={`radial-analytics-card-tabs-${i}`}
                    >
                      {type}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {Object.keys(productType).map((type, i) => (
                  <TabsContent value={type} key={`radial-analytics-card-${i}`}>
                    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                      <ProductSalesCard
                        className="md:col-span-2"
                        productTypes={groupedProductTypes}
                      />
                      <div className="grid gap-8 md:col-span-1">
                        <RadialAnalyticsCard
                          cups={totalCupsPerSize[0]}
                          total={totalCupsPerSize[1]}
                        />
                        <AverageSalesCard salesPerDate={totalSalesPerDate} />
                      </div>
                      <div className="grid place-content-start gap-4 md:col-span-1 md:gap-8">
                        <ProductFeatureCard
                          groupedProductTypes={groupedProductTypes.slice(0, 3)}
                          featureType="bestSeller"
                        />
                        <ProductFeatureCard
                          groupedProductTypes={groupedProductTypes
                            .slice(1)
                            .slice(-3)
                            .reverse()
                            .sort((a, b) => a.price - b.price)}
                          featureType="leastPopular"
                        />
                        <DailyCupsSoldAreaCard dailyCupsSold={totalDailyCupsSold} />
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}

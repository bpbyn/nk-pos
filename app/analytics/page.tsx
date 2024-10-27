'use client';

import Shell from '@/components/shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDateRangePicker } from '@/components/ui/date-range-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { productType } from '@/lib/types';
import { ChartSpline, CupSoda, File, PhilippinePeso, SquarePen } from 'lucide-react';
import React, { useMemo } from 'react';

import AnalyticsCard from './components/analytics-card';
import AverageCupsAreaCard from './components/average-cups-area-card';
import AverageSalesCard from './components/average-sales-card';
import ProductFeatureCard from './components/product-feature-card';
import ProductSalesCard from './components/product-sales-card';
import RadialAnalyticsCard from './components/radial-chart-card';

export default function Analytics() {
  const analyticsCard = useMemo(
    () => [
      {
        title: 'Total Sales',
        icon: <PhilippinePeso className="h-4 w-4 text-muted-foreground" />,
        value: '₱60,795',
        valueDescription: '+20.1% from last month',
      },
      {
        title: 'Total Cups',
        icon: <CupSoda className="h-4 w-4 text-muted-foreground" />,
        value: '350',
        valueDescription: '+180.1% from last month',
      },
      {
        title: 'Average Daily Cups',
        icon: <ChartSpline className="h-4 w-4 text-muted-foreground" />,
        value: '40',
        valueDescription: '+19% from last month',
      },
      {
        title: 'Total Orders',
        icon: <SquarePen className="h-4 w-4 text-muted-foreground" />,
        value: '120',
        valueDescription: '+20.1% from last month',
      },
    ],
    []
  );

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
                <CalendarDateRangePicker />
                <Button size="sm" className="h-8 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
              {analyticsCard.map(({ title, icon, value, valueDescription }, i) => (
                <AnalyticsCard
                  key={`analytics-card-${i}`}
                  title={title}
                  icon={icon}
                  value={value}
                  valueDescription={valueDescription}
                />
              ))}
              <Tabs defaultValue={productType.cold} className="md:col-span-full">
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
                        <ProductSalesCard className="md:col-span-2" />
                        <div className="grid gap-8 md:col-span-1">
                          <RadialAnalyticsCard
                            cups={{ regular: 70, large: 20, total: 90 }}
                            total={{ regular: 4900, large: 1400, total: 6300 }}
                          />
                          <AverageSalesCard />
                        </div>
                        <div className="grid place-content-start gap-4 md:col-span-1 md:gap-8">
                          <ProductFeatureCard className="h-fit" />
                          <ProductFeatureCard className="h-fit" />
                          <AverageCupsAreaCard />
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

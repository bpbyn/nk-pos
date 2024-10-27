'use client';

import Shell from '@/components/shell';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { CalendarDateRangePicker } from '@/components/ui/date-range-picker';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { productType } from '@/lib/types';
import { ChartSpline, CupSoda, File, PhilippinePeso, SquarePen } from 'lucide-react';
import React, { useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Label,
  LabelList,
  Rectangle,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';

import AnalyticsCard from './components/analytics-card';
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
                        <Card className="md:col-span-2">
                          <CardHeader className="flex flex-row items-center">
                            <div className="grid gap-2">
                              <CardTitle>Sales by Product Type</CardTitle>
                              <CardDescription>
                                Breakdown of sales by different product types.
                              </CardDescription>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Product</TableHead>
                                  <TableHead className="text-right">Qty</TableHead>
                                  <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="w-full">
                                    <ChartContainer
                                      config={{
                                        steps: {
                                          label: 'Steps',
                                          color: 'hsl(var(--chart-1))',
                                        },
                                      }}
                                      className="aspect-auto h-[32px]"
                                    >
                                      <BarChart
                                        accessibilityLayer
                                        layout="vertical"
                                        margin={{
                                          left: 0,
                                          top: 0,
                                          right: 0,
                                          bottom: 0,
                                        }}
                                        data={[
                                          {
                                            date: 'Caramel Macchiato',
                                            steps: 20,
                                          },
                                        ]}
                                      >
                                        <Bar
                                          dataKey="steps"
                                          fill="var(--color-steps)"
                                          radius={4}
                                          barSize={32}
                                        >
                                          <LabelList
                                            position="insideLeft"
                                            dataKey="date"
                                            offset={8}
                                            fontSize={12}
                                            fill="white"
                                          />
                                        </Bar>
                                        <YAxis dataKey="date" type="category" tickCount={1} hide />
                                        <XAxis
                                          dataKey="steps"
                                          type="number"
                                          domain={[0, 100]}
                                          hide
                                        />
                                      </BarChart>
                                    </ChartContainer>
                                  </TableCell>
                                  <TableCell className="text-right">25</TableCell>
                                  <TableCell className="text-right">₱405</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                        <div className="grid gap-8 md:col-span-1">
                          <RadialAnalyticsCard
                            cups={{ regular: 70, large: 20, total: 90 }}
                            total={{ regular: 4900, large: 1400, total: 6300 }}
                          />
                          <Card>
                            <CardHeader className="space-y-0 pb-2">
                              <CardDescription>Today</CardDescription>
                              <CardTitle className="text-4xl tabular-nums">
                                ₱12,584{' '}
                                <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                                  sales
                                </span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ChartContainer
                                config={{
                                  steps: {
                                    label: 'Steps',
                                    color: 'hsl(var(--chart-1))',
                                  },
                                }}
                              >
                                <BarChart
                                  accessibilityLayer
                                  margin={{
                                    left: -4,
                                    right: -4,
                                  }}
                                  data={[
                                    {
                                      date: '2024-01-01',
                                      steps: 2000,
                                    },
                                    {
                                      date: '2024-01-02',
                                      steps: 2100,
                                    },
                                    {
                                      date: '2024-01-03',
                                      steps: 2200,
                                    },
                                    {
                                      date: '2024-01-04',
                                      steps: 1300,
                                    },
                                    {
                                      date: '2024-01-05',
                                      steps: 1400,
                                    },
                                    {
                                      date: '2024-01-06',
                                      steps: 2500,
                                    },
                                    {
                                      date: '2024-01-07',
                                      steps: 1600,
                                    },
                                  ]}
                                >
                                  <Bar
                                    dataKey="steps"
                                    fill="var(--color-steps)"
                                    radius={5}
                                    fillOpacity={0.4}
                                    activeBar={<Rectangle fillOpacity={0.8} />}
                                    shape={(props: any) => {
                                      return (
                                        <Rectangle
                                          {...props}
                                          fillOpacity={
                                            props.payload.date === '2024-01-03' ? 1 : 0.2
                                          }
                                        />
                                      );
                                    }}
                                  />
                                  <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={4}
                                    tickFormatter={(value) => {
                                      return new Date(value).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                      });
                                    }}
                                  />
                                  <ChartTooltip
                                    defaultIndex={2}
                                    content={
                                      <ChartTooltipContent
                                        hideIndicator
                                        labelFormatter={(value) => {
                                          return new Date(value).toLocaleDateString('en-US', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                          });
                                        }}
                                      />
                                    }
                                    cursor={false}
                                  />
                                  <ReferenceLine
                                    y={1200}
                                    stroke="hsl(var(--muted-foreground))"
                                    strokeDasharray="3 3"
                                    strokeWidth={1}
                                  >
                                    <Label
                                      position="insideBottomLeft"
                                      value="Average Sales"
                                      offset={10}
                                      fill="hsl(var(--foreground))"
                                    />
                                    <Label
                                      position="insideTopLeft"
                                      value="12,343"
                                      className="text-lg"
                                      fill="hsl(var(--foreground))"
                                      offset={10}
                                      startOffset={100}
                                    />
                                  </ReferenceLine>
                                </BarChart>
                              </ChartContainer>
                            </CardContent>
                            <CardFooter className="flex-col items-start gap-1">
                              <CardDescription>
                                Over the past 7 days, you have walked{' '}
                                <span className="font-medium text-foreground">53,305</span> steps.
                              </CardDescription>
                              <CardDescription>
                                You need <span className="font-medium text-foreground">12,584</span>{' '}
                                more steps to reach your goal.
                              </CardDescription>
                            </CardFooter>
                          </Card>
                        </div>
                        <div className="grid place-content-start gap-4 md:col-span-1 md:gap-8">
                          <Card className="h-fit">
                            <CardHeader className="p-4 pb-0">
                              <CardTitle>{`Caramel Macchiato`}</CardTitle>
                              <CardDescription className="text-sm">
                                {`You're best seller so far! You've sold a total of {quantity} cups on this product. Good job!`}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-2">
                              <div className="flex items-baseline gap-2 text-3xl font-bold tabular-nums leading-none">
                                ₱4,405
                              </div>
                              <ChartContainer
                                config={{
                                  calories: {
                                    label: 'Calories',
                                    color: 'hsl(var(--chart-1))',
                                  },
                                }}
                                className="ml-auto w-[64px]"
                              >
                                <BarChart
                                  accessibilityLayer
                                  margin={{
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    bottom: 0,
                                  }}
                                  data={[
                                    {
                                      date: '2024-01-01',
                                      calories: 354,
                                    },
                                    {
                                      date: '2024-01-02',
                                      calories: 514,
                                    },
                                    {
                                      date: '2024-01-03',
                                      calories: 745,
                                    },
                                    {
                                      date: '2024-01-04',
                                      calories: 834,
                                    },
                                    {
                                      date: '2024-01-05',
                                      calories: 945,
                                    },
                                    {
                                      date: '2024-01-06',
                                      calories: 1056,
                                    },
                                    {
                                      date: '2024-01-07',
                                      calories: 1345,
                                    },
                                  ]}
                                >
                                  <Bar
                                    dataKey="calories"
                                    fill="var(--color-calories)"
                                    radius={2}
                                    fillOpacity={0.2}
                                    shape={(props: any) => {
                                      return (
                                        <Rectangle
                                          {...props}
                                          fillOpacity={
                                            props.payload.date === '2024-01-07' ? 1 : 0.2
                                          }
                                        />
                                      );
                                    }}
                                  />
                                  <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={4}
                                    hide
                                  />
                                </BarChart>
                              </ChartContainer>
                            </CardContent>
                          </Card>
                          <Card className="h-fit">
                            <CardHeader className="p-4 pb-0">
                              <CardTitle>{`Caramel Macchiato`}</CardTitle>
                              <CardDescription className="text-sm">
                                {`You're best seller so far! You've sold a total of {quantity} cups on this product. Good job!`}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-2">
                              <div className="flex items-baseline gap-2 text-3xl font-bold tabular-nums leading-none">
                                ₱4,405
                              </div>
                              <ChartContainer
                                config={{
                                  calories: {
                                    label: 'Calories',
                                    color: 'hsl(var(--chart-1))',
                                  },
                                }}
                                className="ml-auto w-[64px]"
                              >
                                <BarChart
                                  accessibilityLayer
                                  margin={{
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    bottom: 0,
                                  }}
                                  data={[
                                    {
                                      date: '2024-01-01',
                                      calories: 354,
                                    },
                                    {
                                      date: '2024-01-02',
                                      calories: 514,
                                    },
                                    {
                                      date: '2024-01-03',
                                      calories: 745,
                                    },
                                    {
                                      date: '2024-01-04',
                                      calories: 834,
                                    },
                                    {
                                      date: '2024-01-05',
                                      calories: 945,
                                    },
                                    {
                                      date: '2024-01-06',
                                      calories: 1056,
                                    },
                                    {
                                      date: '2024-01-07',
                                      calories: 1345,
                                    },
                                  ]}
                                >
                                  <Bar
                                    dataKey="calories"
                                    fill="var(--color-calories)"
                                    radius={2}
                                    fillOpacity={0.2}
                                    shape={(props: any) => {
                                      return (
                                        <Rectangle
                                          {...props}
                                          fillOpacity={
                                            props.payload.date === '2024-01-07' ? 1 : 0.2
                                          }
                                        />
                                      );
                                    }}
                                  />
                                  <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={4}
                                    hide
                                  />
                                </BarChart>
                              </ChartContainer>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="space-y-0 pb-0">
                              <CardDescription>Average Cups in 7 days</CardDescription>
                              <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
                                8
                                <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                                  hr
                                </span>
                                35
                                <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                                  min
                                </span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                              <ChartContainer
                                config={{
                                  time: {
                                    label: 'Time',
                                    color: 'hsl(var(--chart-2))',
                                  },
                                }}
                              >
                                <AreaChart
                                  accessibilityLayer
                                  data={[
                                    {
                                      date: '2024-01-01',
                                      time: 8.5,
                                    },
                                    {
                                      date: '2024-01-02',
                                      time: 7.2,
                                    },
                                    {
                                      date: '2024-01-03',
                                      time: 8.1,
                                    },
                                    {
                                      date: '2024-01-04',
                                      time: 6.2,
                                    },
                                    {
                                      date: '2024-01-05',
                                      time: 5.2,
                                    },
                                    {
                                      date: '2024-01-06',
                                      time: 8.1,
                                    },
                                    {
                                      date: '2024-01-07',
                                      time: 7.0,
                                    },
                                  ]}
                                  margin={{
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    bottom: 0,
                                  }}
                                >
                                  <XAxis dataKey="date" hide />
                                  <YAxis domain={['dataMin - 5', 'dataMax + 2']} hide />
                                  <defs>
                                    <linearGradient id="fillTime" x1="0" y1="0" x2="0" y2="1">
                                      <stop
                                        offset="5%"
                                        stopColor="var(--color-time)"
                                        stopOpacity={0.8}
                                      />
                                      <stop
                                        offset="95%"
                                        stopColor="var(--color-time)"
                                        stopOpacity={0.1}
                                      />
                                    </linearGradient>
                                  </defs>
                                  <Area
                                    dataKey="time"
                                    type="natural"
                                    fill="url(#fillTime)"
                                    fillOpacity={0.4}
                                    stroke="var(--color-time)"
                                  />
                                  <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                    formatter={(value) => (
                                      <div className="flex min-w-[120px] items-center text-xs text-muted-foreground">
                                        Time in bed
                                        <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                                          {value}
                                          <span className="font-normal text-muted-foreground">
                                            hr
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  />
                                </AreaChart>
                              </ChartContainer>
                            </CardContent>
                          </Card>
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

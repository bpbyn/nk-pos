import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import React from 'react';
import { Bar, BarChart, Label, Rectangle, ReferenceLine, XAxis } from 'recharts';

type AverageSalesCardProps = {
  className?: React.ComponentProps<'div'>['className'];
  salesPerDate: Array<{ date: string; sales: number }>;
};

export default function AverageSalesCard({ className, salesPerDate }: AverageSalesCardProps) {
  const totalSales = salesPerDate.reduce((total, { sales }) => total + sales, 0);
  const averageSales = Math.round(totalSales / salesPerDate.length);

  return (
    <Card className={cn('', className)}>
      {averageSales ? (
        <CardHeader className="space-y-0 pb-2">
          <CardDescription>Total Sales</CardDescription>
          <CardTitle className="text-4xl tabular-nums">₱{totalSales}</CardTitle>
        </CardHeader>
      ) : (
        <div className="space-y-2 p-6 pb-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-32" />
        </div>
      )}
      <CardContent>
        {averageSales ? (
          <ChartContainer
            config={{
              sales: {
                label: 'Sales',
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
              data={salesPerDate}
            >
              <Bar
                dataKey="sales"
                fill="var(--color-sales)"
                radius={5}
                fillOpacity={0.4}
                activeBar={<Rectangle fillOpacity={0.8} />}
                shape={(props: any) => {
                  const currentDate = format(new Date(), 'yyyy-MM-dd');
                  return (
                    <Rectangle
                      {...props}
                      fillOpacity={props.payload.date === currentDate ? 1 : 0.2}
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
                  value={`₱${averageSales}`}
                  className="text-lg"
                  fill="hsl(var(--foreground))"
                  offset={10}
                  startOffset={100}
                />
              </ReferenceLine>
            </BarChart>
          </ChartContainer>
        ) : (
          <div>
            <Skeleton className="h-28 w-full" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-1">
        {averageSales ? (
          <CardDescription>
            Over the past {salesPerDate.length} days that you&apos;ve open your store, you&apos;ve
            gained <span className="font-medium text-foreground">₱{totalSales}</span> of sales.
          </CardDescription>
        ) : (
          <div className="w-full">
            <Skeleton className="h-14" />
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

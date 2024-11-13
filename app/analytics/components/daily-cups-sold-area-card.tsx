import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import React from 'react';
import { Area, AreaChart, XAxis, YAxis } from 'recharts';

type DailyCupsSoldAreaCardProps = {
  className?: React.ComponentProps<'div'>['className'];
  dailyCupsSold: Array<{ date: string; quantity: number }>;
};

export default function DailyCupsSoldAreaCard({
  className,
  dailyCupsSold,
}: DailyCupsSoldAreaCardProps) {
  const totalCups = dailyCupsSold.reduce((total, cups) => total + cups.quantity, 0);

  return (
    <Card className={cn('', className)}>
      {totalCups ? (
        <CardHeader className="space-y-0 pb-0">
          <CardDescription>Daily Cups Sold</CardDescription>
          <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
            {totalCups}
            <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
              Total Cups
            </span>
          </CardTitle>
        </CardHeader>
      ) : (
        <div className="space-y-2 p-6 pb-0">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-9 w-36 rounded-md" />
        </div>
      )}
      <CardContent className="p-0">
        {totalCups ? (
          <ChartContainer
            config={{
              quantity: {
                label: 'Quantity',
                color: 'hsl(var(--chart-2))',
              },
            }}
          >
            <AreaChart
              accessibilityLayer
              data={dailyCupsSold}
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
                <linearGradient id="fillQuantity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-quantity)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-quantity)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area
                dataKey="quantity"
                type="natural"
                fill="url(#fillQuantity)"
                fillOpacity={0.4}
                stroke="var(--color-quantity)"
              />
              <ChartTooltip
                cursor={false}
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
                formatter={(value) => (
                  <div className="flex min-w-[120px] items-center text-xs text-muted-foreground">
                    Cups Sold
                    <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                      {value}
                      <span className="font-normal text-muted-foreground">cups</span>
                    </div>
                  </div>
                )}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="p-6">
            <Skeleton className="h-28 w-full" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

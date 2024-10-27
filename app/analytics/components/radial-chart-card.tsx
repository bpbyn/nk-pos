import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { ProductSizeAnalytics } from '@/lib/types';
import React from 'react';
import { PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts';

type RadialAnalyticsCardProps = ProductSizeAnalytics;

export default function RadialAnalyticsCard({ cups, total }: RadialAnalyticsCardProps) {
  const defaultTargetTotal = 100;
  const totalCups = cups.regular + cups.large;
  const totalPrice = total.regular + total.large;

  return (
    <Card className="md:max-w-md">
      <CardContent className="flex gap-4 p-6 pt-6">
        <div className="grid items-center gap-2">
          <div className="grid flex-1 auto-rows-min gap-0.5">
            <div className="text-sm text-primary">Regular</div>
            <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none text-chart-1">
              {cups.regular}
              <span className="text-sm font-normal text-chart-1">cups</span>
            </div>
            <div className="text-xs text-muted-foreground">₱{total.regular}</div>
          </div>
          <div className="grid flex-1 auto-rows-min gap-0.5">
            <div className="text-sm text-primary">Large</div>
            <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none text-chart-2">
              {cups.large}
              <span className="text-sm font-normal text-chart-2">cups</span>
            </div>
            <div className="text-xs text-muted-foreground">₱{total.large}</div>
          </div>
          <div className="grid flex-1 auto-rows-min gap-0.5">
            <div className="text-sm text-primary">Total</div>
            <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none text-chart-3">
              {totalCups}
              <span className="text-sm font-normal text-chart-3">cups</span>
            </div>
            <div className="text-xs text-muted-foreground">₱{totalPrice}</div>
          </div>
        </div>
        <ChartContainer
          config={{
            regular: {
              label: 'Regular',
              color: 'hsl(var(--chart-1))',
            },
            large: {
              label: 'Large',
              color: 'hsl(var(--chart-2))',
            },
            total: {
              label: 'Total',
              color: 'hsl(var(--chart-3))',
            },
          }}
          className="mx-auto aspect-square w-full max-w-[80%]"
        >
          <RadialBarChart
            margin={{
              left: -10,
              right: -10,
              top: -10,
              bottom: -10,
            }}
            data={[
              {
                activity: 'total',
                value:
                  (totalCups > defaultTargetTotal
                    ? defaultTargetTotal
                    : totalCups / defaultTargetTotal) * 100,
                fill: 'var(--color-total)',
              },
              {
                activity: 'regular',
                value:
                  (cups.regular > defaultTargetTotal
                    ? defaultTargetTotal
                    : cups.regular / defaultTargetTotal) * 100,
                fill: 'var(--color-regular)',
              },
              {
                activity: 'large',
                value:
                  (cups.large > defaultTargetTotal
                    ? defaultTargetTotal
                    : cups.large / defaultTargetTotal) * 100,
                fill: 'var(--color-large)',
              },
            ]}
            innerRadius="20%"
            barSize={24}
            startAngle={90}
            endAngle={450}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} dataKey="value" tick={false} />
            <RadialBar dataKey="value" background cornerRadius={5} />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

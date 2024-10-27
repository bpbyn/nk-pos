import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import React from 'react';
import { Bar, BarChart, Rectangle, XAxis } from 'recharts';

type ProductFeatureCardProps = {
  className?: React.ComponentProps<'div'>['className'];
};

export default function ProductFeatureCard({ className }: ProductFeatureCardProps) {
  return (
    <Card className={cn('', className)}>
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
                    fillOpacity={props.payload.date === '2024-01-07' ? 1 : 0.2}
                  />
                );
              }}
            />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={4} hide />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

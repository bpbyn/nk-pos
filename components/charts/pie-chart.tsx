import React from 'react';
import { Label, Pie, PieChart } from 'recharts';

import { Card, CardContent } from '../ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';

const chartData = [
  { browser: 'Apple Cranberry', visitors: 275, fill: 'var(--color-chrome)' },
  { browser: 'Strawberry Lemonade', visitors: 200, fill: 'var(--color-safari)' },
  { browser: 'Earth Matcha', visitors: 287, fill: 'var(--color-firefox)' },
  { browser: 'Iced Matcha Latte', visitors: 173, fill: 'var(--color-edge)' },
  { browser: 'Sea Salt Latte', visitors: 190, fill: 'var(--color-other)' },
  { browser: 'Iced Salted Caramel Latte', visitors: 275, fill: 'var(--color-chrome)' },
  { browser: 'Iced Caramel Macchiato', visitors: 200, fill: 'var(--color-safari)' },
  { browser: 'Iced Choco Milk', visitors: 287, fill: 'var(--color-firefox)' },
  { browser: 'Iced Sweetened Cold Brew', visitors: 173, fill: 'var(--color-edge)' },
  { browser: 'Matcha Espresso Fusion', visitors: 190, fill: 'var(--color-other)' },
  { browser: 'Peppermint Mocha', visitors: 275, fill: 'var(--color-chrome)' },
  { browser: 'Dark Mocha', visitors: 200, fill: 'var(--color-safari)' },
  { browser: 'Iced White Chocolate Mocha', visitors: 287, fill: 'var(--color-firefox)' },
  { browser: 'Hazelnut Coffee Jelly', visitors: 173, fill: 'var(--color-edge)' },
  { browser: 'Pink Velvet', visitors: 190, fill: 'var(--color-other)' },
  { browser: 'Pink Velvet Espresso', visitors: 275, fill: 'var(--color-chrome)' },
  { browser: 'Iced Butterscotch Latte', visitors: 200, fill: 'var(--color-safari)' },
  { browser: 'Fresh Lemonade', visitors: 287, fill: 'var(--color-firefox)' },
  { browser: 'Iced Shakened Ameri Coco', visitors: 173, fill: 'var(--color-edge)' },
  { browser: 'Pumpkin Spiced Latte', visitors: 190, fill: 'var(--color-other)' },
];
const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  chrome: {
    label: 'Chrome',
    color: 'hsl(var(--chart-1))',
  },
  safari: {
    label: 'Safari',
    color: 'hsl(var(--chart-2))',
  },
  firefox: {
    label: 'Firefox',
    color: 'hsl(var(--chart-3))',
  },
  edge: {
    label: 'Edge',
    color: 'hsl(var(--chart-4))',
  },
  other: {
    label: 'Other',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

export default function PieChartText() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);
  return (
    <Card className="flex flex-col">
      {/* <CardHeader className="items-center pb-0">
        <CardTitle></CardTitle>
        <CardDescription></CardDescription>
      </CardHeader> */}
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}

import React from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader } from '../ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';

export default function HorizontalBarChart() {
  const chartData = [
    { month: 'Apple Cranberry', desktop: 186, mobile: 80 },
    { month: 'Strawberry Lemonade', desktop: 305, mobile: 200 },
    { month: 'Earth Matcha', desktop: 237, mobile: 120 },
    { month: 'Iced Matcha Latte', desktop: 73, mobile: 190 },
    { month: 'Sea Salt Latte', desktop: 209, mobile: 130 },
    { month: 'Iced Salted Caramel Latte', desktop: 214, mobile: 140 },
    { month: 'Iced Caramel Macchiato', desktop: 214, mobile: 140 },
    { month: 'Iced Choco Milk', desktop: 214, mobile: 140 },
    // { month: 'Iced Sweetened Cold Brew', desktop: 214, mobile: 140 },
    // { month: 'Matcha Espresso Fusion', desktop: 214, mobile: 140 },
    // { month: 'Peppermint Mocha', desktop: 214, mobile: 140 },
    // { month: 'Dark Mocha', desktop: 214, mobile: 140 },
    // { month: 'Iced White Chocolate Mocha', desktop: 214, mobile: 140 },
    // { month: 'Hazelnut Coffee Jelly', desktop: 214, mobile: 140 },
    // { month: 'Pink Velvet', desktop: 214, mobile: 140 },
    // { month: 'Pink Velvet Espresso', desktop: 214, mobile: 140 },
    // { month: 'Iced Butterscotch Latte', desktop: 214, mobile: 140 },
    // { month: 'Fresh Lemonade', desktop: 214, mobile: 140 },
    // { month: 'Iced Shakened Ameri Coco', desktop: 214, mobile: 140 },
    // { month: 'Pumpkin Spiced Latte', desktop: 214, mobile: 140 },
  ];
  const chartConfig = {
    desktop: {
      label: 'Desktop',
      color: 'hsl(var(--chart-1))',
    },
    mobile: {
      label: 'Mobile',
      color: 'hsl(var(--chart-2))',
    },
    label: {
      color: 'hsl(var(--background))',
    },
  } satisfies ChartConfig;
  return (
    <Card>
      <CardHeader>
        {/* <CardTitle>Bar Chart - Custom Label</CardTitle> */}
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            width={200}
            margin={
              {
                // right: 16,
              }
            }
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="desktop" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Bar dataKey="desktop" layout="vertical" fill="var(--color-desktop)" radius={4}>
              <LabelList
                dataKey="month"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="desktop"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}

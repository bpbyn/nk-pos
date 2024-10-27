import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import React from 'react';
import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts';

type ProductSalesCardProps = {
  className?: React.ComponentProps<'div'>['className'];
};

export default function ProductSalesCard({ className }: ProductSalesCardProps) {
  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Sales by Product Type</CardTitle>
          <CardDescription>Breakdown of sales by different product types.</CardDescription>
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
                    <Bar dataKey="steps" fill="var(--color-steps)" radius={4} barSize={32}>
                      <LabelList
                        position="insideLeft"
                        dataKey="date"
                        offset={8}
                        fontSize={12}
                        fill="white"
                      />
                    </Bar>
                    <YAxis dataKey="date" type="category" tickCount={1} hide />
                    <XAxis dataKey="steps" type="number" domain={[0, 100]} hide />
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
  );
}

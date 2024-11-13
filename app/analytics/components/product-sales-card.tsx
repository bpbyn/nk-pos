import { SkeletonTable } from '@/components/skeleton-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useOrderStore from '@/lib/store';
import { OrderDetail, Product } from '@/lib/types';
import { cn, findProduct } from '@/lib/utils';
import React from 'react';
import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts';

type ProductSalesCardProps = {
  className?: React.ComponentProps<'div'>['className'];
  productTypes: Pick<OrderDetail, 'productId' | 'quantity' | 'price'>[];
};

export default function ProductSalesCard({ className, productTypes }: ProductSalesCardProps) {
  const products = useOrderStore((state) => state.products);
  let maxQty = 0;

  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center">
        {productTypes.length > 0 ? (
          <div className="grid gap-2">
            <CardTitle>Sales by Product Type</CardTitle>
            <CardDescription>Breakdown of sales by different product types.</CardDescription>
          </div>
        ) : (
          <div className="w-full space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-3/5" />
          </div>
        )}
      </CardHeader>

      <CardContent>
        {productTypes.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productTypes.map((product, i) => {
                const productName = findProduct<Product, keyof Product>(
                  products,
                  'id',
                  product.productId
                )?.name;
                maxQty = product.quantity > maxQty ? product.quantity : maxQty;
                return (
                  <TableRow key={`product-type-card-${i}`}>
                    <TableCell className="w-full">
                      <ChartContainer
                        config={{
                          product: {
                            label: 'Product',
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
                              product: productName,
                              quantity: product.quantity,
                            },
                          ]}
                        >
                          <Bar
                            dataKey="quantity"
                            fill="var(--color-product)"
                            radius={4}
                            barSize={32}
                          >
                            <LabelList
                              position="insideLeft"
                              dataKey="product"
                              offset={8}
                              fontSize={12}
                              fill="white"
                            />
                          </Bar>
                          <YAxis dataKey="product" type="category" tickCount={1} hide />
                          <XAxis dataKey="quantity" type="number" domain={[0, maxQty]} hide />
                        </BarChart>
                      </ChartContainer>
                    </TableCell>
                    <TableCell className="text-right">{product.quantity}</TableCell>
                    <TableCell className="text-right">₱{product.price}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <SkeletonTable rows={2} columns={3} />
        )}
      </CardContent>
    </Card>
  );
}

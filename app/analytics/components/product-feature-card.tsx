import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import useOrderStore from '@/lib/store';
import { OrderDetail, Product } from '@/lib/types';
import { cn, findProduct } from '@/lib/utils';
import React from 'react';
import { Bar, BarChart, Rectangle, XAxis } from 'recharts';

type ProductFeatureCardProps = {
  className?: React.ComponentProps<'div'>['className'];
  groupedProductTypes: Array<Pick<OrderDetail, 'productId' | 'quantity' | 'price'>>;
  featureType: 'bestSeller' | 'leastPopular';
};

export default function ProductFeatureCard({
  className,
  groupedProductTypes,
  featureType,
}: ProductFeatureCardProps) {
  const products = useOrderStore((state) => state.products);
  const productName = findProduct<Product, keyof Product>(
    products,
    'id',
    groupedProductTypes[0]?.productId
  )?.name;

  const productDescription =
    featureType === 'bestSeller'
      ? `Your best seller so far! You've sold a total of ${groupedProductTypes[0]?.quantity} cups on this product. Good job!`
      : `Your least selling item. You've sold a total of ${groupedProductTypes[0]?.quantity} cups on this product. Don't worry, let's keep trying!`;

  return (
    <Card className={cn('h-fit', className)}>
      <CardHeader className="p-6 pb-0">
        <CardTitle>{productName ?? <Skeleton className="h-4 w-32" />}</CardTitle>
        {productName ? (
          <CardDescription className="text-sm">{productDescription}</CardDescription>
        ) : (
          <Skeleton className="h-16">
            <div className="invisible">{productDescription}</div>
          </Skeleton>
        )}
      </CardHeader>
      {productName ? (
        <CardContent className="flex flex-row items-baseline gap-4 p-6 pt-2">
          <div className="flex items-baseline gap-2 text-3xl font-bold tabular-nums leading-none">
            {`₱${groupedProductTypes[0]?.price}`}
          </div>
          <ChartContainer
            config={{
              quantity: {
                label: 'Quantity',
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
              data={groupedProductTypes}
            >
              <Bar
                dataKey="quantity"
                fill="var(--color-quantity)"
                radius={2}
                fillOpacity={0.2}
                shape={(props: any) => {
                  return (
                    <Rectangle
                      {...props}
                      fillOpacity={
                        props.payload.productId === groupedProductTypes[0].productId ? 1 : 0.2
                      }
                    />
                  );
                }}
              />
              <XAxis dataKey="productId" tickLine={false} axisLine={false} tickMargin={4} hide />
            </BarChart>
          </ChartContainer>
        </CardContent>
      ) : (
        <div className="p-6 pt-2">
          <Skeleton className="h-12" />
        </div>
      )}
    </Card>
  );
}

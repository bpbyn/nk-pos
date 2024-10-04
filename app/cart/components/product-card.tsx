'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useOrderStore from '@/lib/store';
import { OrderDetail, Product, ProductSize, productSize } from '@/lib/types';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import React, { useMemo, useState } from 'react';

import ProductStepper from './product-stepper';

export type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const addOrder = useOrderStore((state) => state.addOrder);
  const orderDetails = useOrderStore((state) => state.orderDetails);

  const orderDetail = useMemo(
    () => orderDetails.find((o) => o.productId === product.id),
    [orderDetails, product.id]
  );

  const initialState = {
    productId: product.id,
    size: orderDetail?.size ?? 'regular',
    quantity: orderDetail?.quantity ?? 0,
    type: orderDetail?.type ?? product.type,
    price: orderDetail?.price ?? product.size['regular'],
  };

  const [order, setOrder] = useState<OrderDetail>(initialState);

  const handleTabChange = (value: string) => {
    setOrder((orderDetail) => ({
      ...orderDetail,
      size: value as ProductSize,
      price: product.size[value as ProductSize] * orderDetail.quantity, // computes total price for the certain product..
    }));
  };

  const handleStepperChange = (value: number) => {
    setOrder((orderDetail) => ({
      ...orderDetail,
      quantity: value,
      price: product.size[orderDetail.size] * value, // computes total price for the certain product..
    }));
  };

  return (
    <Card className="min-w-72">
      <CardHeader className="flex h-full flex-col justify-between">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8">
          <div className="relative min-h-48 w-full md:h-auto">
            <Image
              src={product.asset ?? '/placeholder.svg'}
              alt={product.name}
              priority
              fill
              className="rounded-xl object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="flex flex-col justify-center gap-4">
            <CardTitle className="align-center flex justify-between text-xl md:inline-block">
              {product.name}
              <Badge className="grid w-fit md:hidden">{product.size[order.size]}</Badge>
            </CardTitle>
            <Badge className="hidden w-fit md:inline-block">{product.size[order.size]}</Badge>

            <Tabs value={order.size} onValueChange={handleTabChange}>
              <TabsList className="w-full bg-transparent pl-0">
                <TabsTrigger
                  value="regular"
                  className="w-full data-[state=active]:bg-muted md:text-xs"
                >
                  {productSize.regular}
                </TabsTrigger>
                <TabsTrigger
                  value="large"
                  className="w-full data-[state=active]:bg-muted md:text-xs"
                  disabled={!product.size['large']}
                >
                  {productSize.large}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        <CardContent className="grid gap-y-4 px-0 pb-0 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <ProductStepper
              className="justify-center"
              value={order.quantity}
              onValueChange={handleStepperChange}
            />
            <Button disabled={order.quantity < 1} onClick={() => addOrder(order)}>
              <Plus className="mr-2 h-3 w-3" /> Add to Cart
            </Button>
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  );
}

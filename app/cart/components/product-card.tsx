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
      <CardHeader className="flex flex-col justify-between h-full">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8">
          <Image
            src={product.asset ?? '/placeholder.svg'}
            alt={product.name}
            priority
            width="0"
            height="0"
            sizes="100vw"
            className="w-full h-48 object-cover md:h-auto rounded-xl"
          />
          <div className="flex flex-col justify-center gap-4">
            <CardTitle className="text-xl">{product.name}</CardTitle>
            <Badge className="w-fit">{product.size[order.size]}</Badge>

            <Tabs value={order.size} onValueChange={handleTabChange}>
              <TabsList className="bg-transparent w-full pl-0">
                <TabsTrigger
                  value="regular"
                  className="data-[state=active]:bg-muted w-full md:text-xs"
                >
                  {productSize.regular}
                </TabsTrigger>
                <TabsTrigger
                  value="large"
                  className="data-[state=active]:bg-muted w-full md:text-xs"
                  disabled={!product.size['large']}
                >
                  {productSize.large}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        <CardContent className="px-0 grid gap-y-4 pt-2 pb-0">
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

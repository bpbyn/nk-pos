'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useOrderStore from '@/lib/store';
import {
  OrderDetail,
  OrderExtra,
  Product,
  ProductSize,
  productSize,
  productType,
} from '@/lib/types';
import { cn } from '@/lib/utils';
import { BadgePlus } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import AddOnsDrawer from './add-ons-drawer';
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

  useEffect(() => {
    if (product) {
      setImgSrc(product.asset?.url ?? '/placeholder.svg');
    }
  }, [product]);

  const initialState = {
    productId: product.id,
    size: orderDetail?.size ?? 'regular',
    quantity: orderDetail?.quantity ?? 0,
    type: orderDetail?.type ?? product.type,
    price: orderDetail?.price ?? product.size['regular'],
  };

  const [order, setOrder] = useState<OrderDetail>(initialState);
  const [imgSrc, setImgSrc] = useState<string>(product.asset?.url ?? '/placeholder.svg');

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

  const handleAddOnsChange = (addOns: OrderExtra[]) => {
    setOrder((orderDetail) => ({
      ...orderDetail,
      extras: addOns,
    }));
  };

  return (
    <Card className="min-w-72 dark:bg-secondary/50">
      <CardHeader className="flex h-full flex-col justify-center">
        <div className="grid grid-cols-2 gap-4 md:gap-8">
          <Image
            src={imgSrc ? imgSrc : '/placeholder.svg'}
            alt={product.name}
            onError={() => setImgSrc('/placeholder.svg')}
            priority
            className="aspect-[2/3] w-full rounded-md object-cover"
            width="300"
            height="300"
          />
          <div className="flex flex-col justify-between md:justify-center md:gap-6">
            <CardTitle className="align-center flex justify-between text-xl md:inline-block">
              {product.name}
            </CardTitle>
            <div className="grid">
              <div className="flex gap-2">
                <Badge className="grid w-fit" variant="outline">
                  ₱{product.size[order.size]}
                </Badge>
                <Badge
                  className={cn(
                    product.type === productType.hot.toLocaleLowerCase() &&
                      'bg-red-100/50 capitalize text-red-500 dark:bg-red-900/50 dark:text-red-300',
                    product.type === productType.cold &&
                      'bg-blue-100/50 capitalize text-blue-500 dark:bg-blue-900/50 dark:text-blue-300',
                    'grid w-fit capitalize'
                  )}
                >
                  {product.type}
                </Badge>
              </div>
              <AddOnsDrawer
                productId={product.id}
                order={order}
                onAddOnsChange={handleAddOnsChange}
              />
            </div>
            <Tabs value={order.size} onValueChange={handleTabChange}>
              <TabsList className="w-full bg-transparent pl-0">
                <TabsTrigger
                  value="regular"
                  className="w-full shadow-none data-[state=active]:bg-muted md:text-xs"
                  disabled={product.size['regular'] === 0}
                >
                  {productSize.regular}
                </TabsTrigger>
                <TabsTrigger
                  value="large"
                  className="w-full shadow-none data-[state=active]:bg-muted md:text-xs"
                  disabled={product.size['large'] === 0}
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
            <Button
              onClick={() => {
                if (order.quantity < 1) return;
                addOrder(order);
                toast.success(`Product added to cart.`);
              }}
            >
              <div className="flex items-center gap-1">
                <BadgePlus className="h-3.5 w-3.5" />
                <span>Add to Cart</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  );
}

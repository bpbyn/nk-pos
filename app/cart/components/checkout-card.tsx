'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { addDocument, updateCounter } from '@/lib/firebase/service';
import useOrderStore from '@/lib/store';
import { Order, Product, orderStatus } from '@/lib/types';
import { cn, findProduct, pad } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import ProductStepper from './product-stepper';

const CheckoutSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required.'),
});

export default function CheckoutCard({
  onCheckout,
  className,
}: {
  onCheckout?: () => void;
  className?: string;
}) {
  const orderDetails = useOrderStore((state) => state.orderDetails);
  const { queueCount } = useOrderStore((state) => state.queueCount);
  const products = useOrderStore((state) => state.products);
  const addQueueCount = useOrderStore((state) => state.addQueueCount);
  const updateOrder = useOrderStore((state) => state.updateOrder);
  const removeOrder = useOrderStore((state) => state.removeOrder);
  const clearOrder = useOrderStore((state) => state.clearOrder);

  const totalPrice = useMemo(
    () => orderDetails.reduce((total, orderDetail) => total + orderDetail.price, 0),
    [orderDetails]
  );

  const form = useForm<z.infer<typeof CheckoutSchema>>({
    resolver: zodResolver(CheckoutSchema),
    defaultValues: {
      customerName: '',
    },
  });

  async function onSubmit({ customerName }: z.infer<typeof CheckoutSchema>) {
    if (totalPrice === 0) return;
    onCheckout?.();
    try {
      toast.loading('Placing the order... Please wait.');
      const newQueueCount = queueCount + 1;

      const order: Order = {
        customerName,
        id: `SO-${pad(newQueueCount)}`,
        orders: orderDetails,
        status: orderStatus.BREWING,
        timestamp: Date.now(),
        totalPrice,
      };

      await addDocument('orders', order);
      await updateCounter(newQueueCount);
      addQueueCount();

      toast.success('Successfully posted!');
      toast.dismiss();

      form.reset();
      clearOrder();
    } catch (e) {
      toast.error('Failed to place order. Please try again after sometime');
      console.error('Error occurred while placing the order', e);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className={cn('flex flex-col overflow-hidden lg:col-span-1', className)}>
          <CardHeader className="flex flex-col bg-muted/50 py-4">
            <CardTitle className="flex w-full items-center justify-between">
              <div className="text-xl font-bold">Cart</div>
              <div className="font-normal text-muted-foreground">SO-{pad(queueCount)}</div>
            </CardTitle>
            <div className="ml-auto flex items-center gap-1"></div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between gap-4 px-6 py-4 text-sm">
            <div className="grid gap-3">
              <div className="text-lg font-bold">Order Details</div>
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="name"
                        placeholder="Enter customer name..."
                        className="w-full text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="pl-1" />
                  </FormItem>
                )}
              />

              {/* <Separator className="mt-1" /> */}
              <ul className="grid max-h-[30rem] grid-cols-1 gap-3 overflow-y-auto">
                {orderDetails.map((orderDetail, i) => {
                  const product = findProduct<Product, keyof Product>(
                    products,
                    'id',
                    orderDetail.productId
                  );
                  return (
                    <li key={`orderDetail-${i}`} className="grid grid-cols-2 gap-2">
                      <span className="grid grid-rows-3 gap-1 lg:grid-rows-1">
                        <span className="text-md font-bold">{product?.name}</span>
                        <span className="text-xs">₱{product?.size[orderDetail.size]} each</span>
                        <div className="flex justify-start gap-2">
                          <Badge variant="secondary" className="px-2 py-0">
                            {orderDetail.type}
                          </Badge>
                          <Badge variant="secondary" className="px-2 py-0">
                            {orderDetail.size}
                          </Badge>
                        </div>
                      </span>
                      <ProductStepper
                        value={orderDetail.quantity}
                        onValueChange={(value) =>
                          updateOrder(
                            orderDetail.productId,
                            orderDetail.size,
                            product?.size[orderDetail.size] ?? 0,
                            value
                          )
                        }
                        showDelete={true}
                        onDelete={() => removeOrder(orderDetail.productId, orderDetail.size)}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
            {orderDetails.length > 0 ? (
              <div>
                <Separator className="mb-2" />
                <ul className="grid gap-4">
                  <li className="flex items-center justify-between font-semibold">
                    <span className="text-accent-foreground">Total</span>
                    <span>₱{totalPrice}</span>
                  </li>
                  <Button type="submit">Checkout</Button>
                </ul>
              </div>
            ) : (
              <div className="grid place-items-center">
                <h3 className="text-lg font-bold tracking-tight">You have no orders.</h3>
                <p className="text-xs text-muted-foreground">
                  Stay prepared for the next customer.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-row items-center justify-between border-t bg-muted/50 px-6 py-3">
            <div className="text-xs text-muted-foreground">
              Created on: <time dateTime="2024-09-20">September 20, 2024 </time>
            </div>
            <div className="text-xs text-muted-foreground">
              Cashier: <b>Joco</b>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

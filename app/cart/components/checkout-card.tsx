'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import useAuth from '@/hooks/use-auth';
import { addDocument, updateCounter } from '@/lib/firebase/service';
import useOrderStore from '@/lib/store';
import { Order, Product, orderStatus } from '@/lib/types';
import { cn, findProduct, pad } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { NotepadText, TicketPercent } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import ProductStepper from './product-stepper';

const CheckoutSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required.'),
  notes: z.string().optional(),
});

export default function CheckoutCard({
  onCheckout,
  className,
}: {
  onCheckout?: () => void;
  className?: string;
}) {
  const { user } = useAuth();
  const [seniorDiscount, setSeniorDiscount] = useState<boolean>(false);

  const orderDetails = useOrderStore((state) => state.orderDetails);
  const { queueCount } = useOrderStore((state) => state.queueCount);
  const products = useOrderStore((state) => state.products);
  const addQueueCount = useOrderStore((state) => state.addQueueCount);
  const updateOrder = useOrderStore((state) => state.updateOrder);
  const removeOrder = useOrderStore((state) => state.removeOrder);
  const clearOrder = useOrderStore((state) => state.clearOrder);

  const { subTotal, totalPrice } = useMemo(() => {
    const subtotal = orderDetails.reduce((total, orderDetail) => {
      // Calculate the base price for the product
      const basePrice = orderDetail.price;

      // Calculate the total price for extras
      const extrasPrice = orderDetail.extras
        ? orderDetail.extras.reduce(
            (extrasTotal, extra) => extrasTotal + extra.extra.price * extra.quantity,
            0
          )
        : 0;

      // Add base price and extras price to the total
      return total + basePrice + extrasPrice;
    }, 0);

    // Apply discount if seniorDiscount is true
    const discount = seniorDiscount ? 10 : 0;

    return { subTotal: subtotal, totalPrice: subtotal - discount };
  }, [orderDetails, seniorDiscount]);

  const form = useForm<z.infer<typeof CheckoutSchema>>({
    resolver: zodResolver(CheckoutSchema),
    defaultValues: {
      customerName: '',
      notes: '',
    },
  });

  async function onSubmit({ customerName, notes }: z.infer<typeof CheckoutSchema>) {
    if (totalPrice === 0) return;
    onCheckout?.();
    try {
      toast.loading('Placing the order... Please wait.');
      const newQueueCount = queueCount + 1;

      const order: Order = {
        customerName,
        id: pad(queueCount),
        orders: orderDetails,
        status: orderStatus.ACTIVE,
        timestamp: Date.now(),
        totalPrice,
        notes,
      };

      await addDocument('ordersV2', order);
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

  const toggleSeniorDiscount = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setSeniorDiscount(!seniorDiscount);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="col-span-1 grid h-fit">
        <Card className={cn('flex flex-col overflow-hidden lg:col-span-1', className)}>
          <CardHeader className="flex flex-col bg-muted/50 py-2 md:py-4">
            <CardTitle className="flex w-full items-center justify-between">
              <div className="text-xl font-bold">Cart</div>
              <div className="font-normal text-muted-foreground">SO-{pad(queueCount)}</div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex max-h-[66vh] flex-1 flex-col justify-between gap-4 overflow-y-auto px-6 py-2 text-sm md:py-4">
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
                        className="w-full text-base placeholder:text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="pl-1" />
                  </FormItem>
                )}
              />

              {/* <Separator className="mt-1" /> */}
              <ul className="grid max-h-[33vh] grid-cols-1 gap-3 overflow-y-auto">
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
                        {orderDetail.extras && (
                          <div className="flex flex-col items-start gap-2">
                            <span className="text-xs">
                              extras <br />
                            </span>
                            <div className="flex flex-wrap justify-start gap-2 text-xs">
                              {orderDetail.extras.map((orderExtra) => (
                                <Badge
                                  key={orderExtra.extra.id}
                                  variant="secondary"
                                  className="whitespace-nowrap px-2 py-0 lowercase"
                                >
                                  {orderExtra.quantity}x {orderExtra.extra.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </span>
                      <ProductStepper
                        value={orderDetail.quantity}
                        onValueChange={(value) =>
                          updateOrder(
                            orderDetail.productId,
                            orderDetail.size,
                            product?.size[orderDetail.size] ?? 0,
                            orderDetail.extras ?? [],
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
                {/* Discounts Section */}
                <Accordion type="single" collapsible className="w-full border-b-0">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="py-2">
                      <div className="flex items-center justify-start gap-2">
                        <TicketPercent className="h-4 w-4" />
                        <span className="text-sm font-bold">Discounts</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex items-center justify-between gap-2 rounded-md bg-muted p-4">
                        <div className="flex items-center">
                          <div>
                            <p className="font-medium">Senior Citizen Discount</p>
                            <p className="text-sm text-muted-foreground">
                              ₱10 off for senior citizens
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="default"
                          onClick={toggleSeniorDiscount}
                          className={
                            seniorDiscount
                              ? 'bg-green-100/50 capitalize text-green-500 hover:text-white dark:bg-green-900/50 dark:text-green-300'
                              : ''
                          }
                        >
                          {seniorDiscount ? 'Applied' : 'Apply'}
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2" className="border-b-0">
                    <AccordionTrigger className="py-2">
                      <div className="flex items-center justify-start gap-2">
                        <NotepadText className="h-4 w-4" />
                        <span className="text-sm font-bold">Notes</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex items-center justify-between gap-2 rounded-md bg-muted p-2">
                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormControl>
                                <Textarea
                                  placeholder="Add any special instructions or notes for the order..."
                                  className="resize-none text-base placeholder:text-sm"
                                  rows={2}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between pt-2 text-xs text-accent-foreground">
                      <span>Subtotal</span>
                      <span>₱{subTotal}</span>
                    </div>
                    {seniorDiscount && (
                      <div className="flex items-center justify-between text-xs text-green-500 dark:text-green-300">
                        <span>Senior Discount</span>
                        <span>-₱10</span>
                      </div>
                    )}
                  </div>
                </div>
                <Separator className="my-2" />
                <ul className="grid gap-4">
                  <li className="flex items-center justify-between font-semibold">
                    <span className="text-accent-foreground">Total</span>
                    <span>₱{totalPrice}</span>
                  </li>
                  <Button type="submit">Checkout</Button>
                </ul>
              </div>
            ) : (
              <div className="grid place-items-center pb-6">
                <h3 className="text-lg font-bold tracking-tight">You have no orders.</h3>
                <p className="text-xs text-muted-foreground">
                  Stay prepared for the next customer.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-row items-center justify-between border-t bg-muted/50 px-6 py-3">
            <div className="text-xs text-muted-foreground">
              Created on: <time>{new Intl.DateTimeFormat('en-US').format(new Date())}</time>
            </div>
            <div className="text-xs text-muted-foreground">
              Cashier: <b>{user?.displayName?.split(' ')[0] ?? 'Cashier User'}</b>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

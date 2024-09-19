'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent, // CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Product } from '@/lib/types';
import { Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

export type ProductCardProps = {
  product: Product;
};

export default function ProductCard({
  product: {
    name,
    // price: { hot, cold },
    asset,
  },
}: ProductCardProps) {
  return (
    <Card className="min-w-72">
      <CardHeader className="flex flex-col justify-between h-full">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8">
          <Image
            src={asset ?? ''}
            alt={name}
            priority
            width="0"
            height="0"
            sizes="100vw"
            className="w-full h-48 object-cover md:h-auto rounded-xl"
          />
          <div className="flex flex-col justify-center gap-4">
            <CardTitle className="text-xl">{name}</CardTitle>
            {/* <CardDescription> */}
            <Badge className="w-fit">₱120</Badge>

            <Tabs defaultValue="regular">
              <TabsList className="bg-transparent w-full pl-0">
                <TabsTrigger
                  value="regular"
                  className="data-[state=active]:bg-muted w-full md:text-xs"
                >
                  REGULAR
                </TabsTrigger>
                <TabsTrigger
                  value="large"
                  className="data-[state=active]:bg-muted w-full md:text-xs"
                >
                  LARGE
                </TabsTrigger>
              </TabsList>
              {/* <TabsContent value="hot">Make changes to your account here.</TabsContent>
            <TabsContent value="cold">Change your password here.</TabsContent>
            <TabsContent value="snack">Change your password here.</TabsContent> */}
            </Tabs>
            {/* </CardDescription> */}
          </div>
        </div>
        <CardContent className="px-0 grid gap-y-4 pt-2 pb-0">
          {/* <ToggleGroup type="single" defaultValue="regular" variant="outline">
            <ToggleGroupItem className="text-xs font-semibold w-full" value="regular">
              REGULAR
            </ToggleGroupItem>
            <ToggleGroupItem className="text-xs font-semibold w-full " value="large">
              LARGE
            </ToggleGroupItem>
          </ToggleGroup> */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 md:justify-center">
              <Button variant="outline" className="" size="icon" onClick={() => ({})}>
                <Minus className="h-3 w-3" />
              </Button>
              <Badge variant="secondary" className="py-2 shadow">
                <div className="text-center w-full">1</div>
              </Badge>
              <Button variant="outline" className="" size="icon" onClick={() => ({})}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <Button onClick={() => ({})} className="">
              <Plus className="mr-2 h-3 w-3" /> Add to Cart
            </Button>
          </div>
        </CardContent>
      </CardHeader>
      {/* <CardFooter> */}
      {/* <Button onClick={() => addToCart(coffee)} className="w-full"> */}
      {/* <Button onClick={() => ({})} className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add to Cart
        </Button> */}
      {/* </CardFooter> */}
    </Card>
  );
}

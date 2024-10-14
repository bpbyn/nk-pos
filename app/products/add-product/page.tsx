'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { productStatus } from '@/lib/types';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import ProductForm from '../components/product-form';

export default function AddProduct() {
  const router = useRouter();
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Add Product
          </h1>
          <Badge
            variant="secondary"
            className="ml-auto bg-green-100/50 capitalize text-green-500 dark:bg-green-900/50 dark:text-green-300 sm:ml-0"
          >
            {productStatus.active}
          </Badge>
        </div>
        <ProductForm />
      </div>
    </div>
  );
}

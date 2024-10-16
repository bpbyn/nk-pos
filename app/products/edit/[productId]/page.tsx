'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getDocument } from '@/lib/firebase/service';
import { Product, productStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import ProductForm from '../../components/product-form';

type EditProductProps = {
  params: { productId: Product['id'] };
};

export default function EditProduct({ params: { productId } }: EditProductProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | undefined>();

  /**
   * we can fetch this but since products is already in the store, let's just find it for now.
   * */
  useEffect(() => {
    const getProducts = async () => {
      return await getDocument('products', productId);
    };

    getProducts().then((res) => setProduct({ id: productId, ...res } as Product));
  }, [productId]);

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Edit Product
          </h1>
          <Badge
            variant="secondary"
            className={cn(
              product?.status === productStatus.active.toLocaleLowerCase() &&
                'bg-green-100/50 capitalize text-green-500 dark:bg-green-900/50 dark:text-green-300',
              'capitalize'
            )}
          >
            {product?.status}
          </Badge>
        </div>
        <ProductForm product={product} />
      </div>
    </div>
  );
}

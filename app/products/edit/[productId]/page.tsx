'use client';

import { Icons } from '@/components/icons';
import { getDocument } from '@/lib/firebase/service';
import { Product } from '@/lib/types';
import React, { useEffect, useState } from 'react';

import ProductForm from '../../components/product-form';

type EditProductProps = {
  params: { productId: Product['id'] };
};

export default function EditProduct({ params: { productId } }: EditProductProps) {
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
      {product ? (
        <ProductForm product={product} />
      ) : (
        <div className="grid h-full place-content-center">
          <Icons.spinner className="h-10 w-10 animate-spin" />
        </div>
      )}
    </div>
  );
}

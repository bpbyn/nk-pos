'use client';

import React from 'react';

import ProductForm from '../components/product-form';

export default function AddProduct() {
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <ProductForm />
    </div>
  );
}

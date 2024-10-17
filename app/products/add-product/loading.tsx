import { Icons } from '@/components/icons';
import React from 'react';

export default function AddProductLoading() {
  return (
    <div className="grid h-full place-content-center">
      <Icons.spinner className="h-10 w-10 animate-spin" />
    </div>
  );
}

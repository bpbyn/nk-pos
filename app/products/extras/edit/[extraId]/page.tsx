'use client';

import { Icons } from '@/components/icons';
import { getDocument } from '@/lib/firebase/service';
import { Extra } from '@/lib/types';
import React, { useEffect, useState } from 'react';

import ExtrasForm from '../../components/extras-form';

type EditExtrasProps = {
  params: { extraId: Extra['id'] };
};

export default function EditProduct({ params: { extraId } }: EditExtrasProps) {
  const [extra, setExtra] = useState<Extra | undefined>();

  useEffect(() => {
    const getExtras = async () => {
      return await getDocument('extras', extraId);
    };

    getExtras().then((res) => setExtra({ id: extraId, ...res } as Extra));
  }, [extraId]);

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      {extra ? (
        <ExtrasForm extra={extra} />
      ) : (
        <div className="grid h-full place-content-center">
          <Icons.spinner className="h-10 w-10 animate-spin" />
        </div>
      )}
    </div>
  );
}

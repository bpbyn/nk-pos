'use server';

import { addDocument } from '@/lib/firebase/service';
import { productSchema } from '@/lib/schema';

export const submitForm = async (formData: FormData) => {
  try {
    const parsedSize = JSON.parse(formData.get('size') as string);
    const parsedAsset = JSON.parse(formData.get('asset') as string);

    const parsedData = productSchema.safeParse({
      name: formData.get('name'),
      description: formData.get('description'),
      category: formData.get('category'),
      type: formData.get('type'),
      size: parsedSize,
      asset: parsedAsset,
      status: formData.get('status'),
    });

    const { success, data: doc } = parsedData;

    if (success) {
      await addDocument('products', { ...doc, timestamp: new Date().valueOf() });
    }
  } catch (e) {
    console.error(e);
  }
};

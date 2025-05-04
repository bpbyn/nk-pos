'use server';

import { addDocument, updateDocument } from '@/lib/firebase/service';
import { extraSchema, productSchema } from '@/lib/schema';
import { Extra, Product } from '@/lib/types';

export const addSubmitForm = async (formData: FormData) => {
  try {
    const parsedSize = JSON.parse(formData.get('size') as string);
    const parsedExtras = JSON.parse(formData.get('extras') as string);
    const parsedAsset = JSON.parse(formData.get('asset') as string);

    const parsedData = productSchema.safeParse({
      name: formData.get('name'),
      description: formData.get('description'),
      category: formData.get('category'),
      subcategory: formData.get('subcategory'),
      type: formData.get('type'),
      size: parsedSize,
      extras: parsedExtras,
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

export const editSubmitForm = async (formData: FormData, id: Product['id']) => {
  try {
    const parsedSize = JSON.parse(formData.get('size') as string);
    const parsedExtras = JSON.parse(formData.get('extras') as string);
    const parsedAsset = JSON.parse(formData.get('asset') as string);

    const parsedData = productSchema.safeParse({
      name: formData.get('name'),
      description: formData.get('description'),
      category: formData.get('category'),
      subcategory: formData.get('subcategory'),
      type: formData.get('type'),
      size: parsedSize,
      extras: parsedExtras,
      asset: parsedAsset,
      status: formData.get('status'),
    });

    const { success, data: doc } = parsedData;

    if (success) {
      await updateDocument('products', id, { ...doc, timestamp: new Date().valueOf() });
    }
  } catch (e) {
    console.error(e);
  }
};

export const addSubmitExtrasForm = async (formData: FormData) => {
  try {
    const parsedData = extraSchema.safeParse({
      name: formData.get('name'),
      price: formData.get('price'),
      status: formData.get('status'),
    });

    const { success, data: doc } = parsedData;

    if (success) {
      await addDocument('extras', { ...doc, timestamp: new Date().valueOf() });
    }
  } catch (e) {
    console.error(e);
  }
};

export const editSubmitExtrasForm = async (formData: FormData, id: Extra['id']) => {
  try {
    const parsedData = extraSchema.safeParse({
      name: formData.get('name'),
      price: formData.get('price'),
      status: formData.get('status'),
    });

    const { success, data: doc } = parsedData;

    if (success) {
      await updateDocument('extras', id, { ...doc, timestamp: new Date().valueOf() });
    }
  } catch (e) {
    console.error(e);
  }
};

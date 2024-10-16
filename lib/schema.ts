import { z } from 'zod';

import { productCategory, productStatus, productType } from './types';

// const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB in bytes
// const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

export const productSchema = z.object({
  name: z.string({ message: 'Name is required' }).min(3, 'Name should be at least 3 characters.'),
  description: z
    .string()
    .min(10, 'Description should be at least 10 characters')
    .optional()
    .or(z.literal('')),
  category: z.nativeEnum(productCategory, {
    errorMap: () => ({ message: 'Please select a category.' }),
  }),
  type: z.nativeEnum(productType, {
    errorMap: () => ({ message: 'Please select a type.' }),
  }),
  size: z.object({
    regular: z.coerce
      .number({
        required_error: 'Price is required',
        invalid_type_error: 'Price must be a number',
      })
      .int()
      .positive({ message: 'Price is required for regular drinks' }),
    large: z.coerce
      .number({
        required_error: 'Price is required',
        invalid_type_error: 'Price must be a number',
      })
      .nullable()
      .optional(),
  }),
  // size: z.string().default(productSize.regular),
  // image: z
  //   .instanceof(File)
  //   .refine(
  //     (file) => file.size <= MAX_FILE_SIZE,
  //     `Image size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`
  //   )
  //   .refine(
  //     (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
  //     `Only the following image types are allowed: ${ACCEPTED_IMAGE_TYPES.join(', ')}.`
  //   )
  //   .optional()
  //   .nullable(),
  status: z
    .string({
      message: 'Status is required',
    })
    .default(productStatus.active),
  asset: z
    .object({
      key: z.string().optional(),
      name: z.string().optional(),
      appUrl: z.string().optional(),
    })
    .optional(),
});

export type ProductSchema = z.infer<typeof productSchema>;

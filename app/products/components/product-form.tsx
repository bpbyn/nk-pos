'use client';

import { addSubmitForm, editSubmitForm } from '@/app/actions/form';
import { deleteUTFiles } from '@/app/actions/remove-image';
import CustomDialog from '@/components/custom-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { ProductSchema, productSchema } from '@/lib/schema';
import useOrderStore from '@/lib/store';
import {
  ImageFile,
  Product,
  ProductSize,
  productCategory,
  productSize,
  productStatus,
  productType,
} from '@/lib/types';
import { UploadButton } from '@/lib/uploadthing/uploadthing';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type ProductFormProps = {
  product?: Product;
};

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [preview, setPreview] = useState<ImageFile | undefined>(undefined);
  const [size, setSize] = useState<ProductSize>('regular');

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      category: productCategory.drinks,
      type: productType.cold,
      size: {
        regular: 0,
        large: 0,
      },
      status: productStatus.active.toLocaleLowerCase(),
      asset: {
        key: '',
        name: '',
        appUrl: '',
      },
    },
    mode: 'onChange',
  });

  useEffect(() => {
    form.reset(product);
    setPreview(product?.asset);
  }, [form, product]);

  const isEdit = useMemo(() => (product ? true : false), [product]);

  const removeImage = async () => {
    toast.loading('Deleting image... Please wait.');
    const imgSrc = form.getValues('asset');
    if (!imgSrc || !imgSrc.key) return;
    try {
      await deleteUTFiles([imgSrc.key]);
      toast.success('Image deleted.');
      setPreview(undefined);
      form.setValue('asset', {}, { shouldValidate: true, shouldDirty: true });
      toast.dismiss();
    } catch (e) {
      toast.error('Failed to delete image. Please try again after sometime');
      console.error('Failed to delete image', e);
      toast.dismiss();
    }
  };

  const handleDiscard = () => {
    if (form.formState.isDirty) {
      form.reset();
    }
    router.back();
  };

  const onSubmit: SubmitHandler<ProductSchema> = async (values) => {
    try {
      toast.loading(`${isEdit ? 'Editing' : 'Adding new'}  product... Please wait.`);

      if (values.size.large === 0) {
        delete values.size.large;
      }

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description || '');
      formData.append('category', values.category);
      formData.append('type', values.type);
      formData.append('size', JSON.stringify(values.size));
      formData.append('asset', JSON.stringify(values.asset));
      formData.append('status', values.status);

      if (isEdit && product) {
        await editSubmitForm(formData, product.id);
      } else {
        await addSubmitForm(formData);
      }

      toast.success(`Product successfully ${isEdit ? 'edited' : 'added'}.`);
      toast.dismiss();

      useOrderStore.getState().getProducts('products');

      if (isEdit) {
        router.back();
      } else {
        form.reset(undefined, { keepDirtyValues: true });
      }
    } catch (e) {
      toast.error(`Failed to ${isEdit ? 'edit' : 'add'} product. Please try again after sometime`);
      console.error(`Failed to ${isEdit ? 'edit' : 'add'} product`, e);
      toast.dismiss();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>
                  Ensure all fields are completed accurately before submitting.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="name">Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              className="w-full"
                              placeholder="Product name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="description">Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Product Description"
                              className="min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Product Category</CardTitle>
                <CardDescription>{`Select whether the product you're adding falls into the categories.`}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="category">Category</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value ?? form.watch('category')}
                            >
                              <SelectTrigger id="category" aria-label="Select category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={productCategory.drinks}>Drinks</SelectItem>
                                <SelectItem value={productCategory.snacks}>Snacks</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>Fill up product type, size and price.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="!border-b-0">
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value ?? form.watch('type')}
                                >
                                  <SelectTrigger id="productType" aria-label="Select product type">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value={productType.cold}>Cold</SelectItem>
                                    <SelectItem value={productType.hot}>Hot</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          onValueChange={(value) => setSize(value as ProductSize)}
                          defaultValue={productSize.regular.toLocaleLowerCase()}
                        >
                          <SelectTrigger id="productSize" aria-label="Select product size">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={productSize.regular.toLocaleLowerCase()}>
                              {productSize.regular}
                            </SelectItem>
                            <SelectItem value={productSize.large.toLocaleLowerCase()}>
                              {productSize.large}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`size.${size}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} value={form.getValues(`size.${size}`)!} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      {/* Let's keep this for now, this might be helpful in the future :) */}
                      {/* <TableCell>
                        <ToggleGroup
                          type="single"
                          defaultValue={size}
                          onValueChange={(value) => setSize(value as ProductSize)}
                          variant="outline"
                          className="justify-start"
                        >
                          <ToggleGroupItem value={productSize.regular.toLocaleLowerCase()}>
                            R
                          </ToggleGroupItem>
                          <ToggleGroupItem value={productSize.large.toLocaleLowerCase()}>
                            L
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </TableCell> */}
                    </TableRow>
                  </TableBody>
                </Table>
                {form.formState.errors.size?.regular && (
                  <p className="p-2 text-sm font-medium text-destructive">
                    {form.formState.errors.size.regular.message}
                  </p>
                )}
                {form.formState.errors.size?.large && (
                  <p className="p-2 text-sm font-medium text-destructive">
                    {form.formState.errors.size.large.message}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
          <Card className="h-fit overflow-hidden">
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
              <CardDescription>
                Upload your image in JPEG or PNG format. Max file size 4MB. Minimum dimension
                200x200 pixels.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="grid">
                  <Image
                    alt="Product image"
                    className="aspect-square w-full rounded-md object-cover"
                    height="300"
                    src={preview?.appUrl ? preview?.appUrl : '/placeholder.svg'}
                    width="300"
                    priority
                    onError={(e) => console.error(e)}
                  />
                  <input
                    {...form.register('asset')}
                    type="file"
                    accept="image/*"
                    className="hidden"
                  />
                  {!preview?.appUrl && (
                    <UploadButton
                      className="mt-4 ut-button:!h-auto ut-button:w-fit ut-button:bg-primary ut-button:px-4 ut-button:py-2 ut-button:text-sm ut-button:font-medium ut-button:text-primary-foreground ut-button:after:bg-green-500 ut-button:focus-within:ring-0 ut-button:focus-within:ring-offset-0 ut-allowed-content:hidden"
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        toast.success('Image successfully uploaded!');
                        toast.dismiss();
                        const resImg: ImageFile = {
                          key: res[0].key,
                          appUrl: res[0].appUrl,
                          name: res[0].name,
                        };
                        setPreview(resImg);
                        form.setValue('asset', resImg, { shouldDirty: true });
                      }}
                      onUploadError={(error: Error) => {
                        toast.error('Failed to upload image. Please try again after sometime');
                        console.error('Failed to upload image', error);
                      }}
                    />
                  )}
                </div>

                {preview?.appUrl && (
                  <div className="grid gap-2">
                    <Button type="button" variant="destructive" onClick={removeImage}>
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
                <CardDescription>
                  Choose the product status to determine its availability.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    {/* <Label htmlFor="status">Status</Label> */}
                    {/* <Select defaultValue={productStatus.active}>
                      <SelectTrigger id="status" aria-label="Select status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={productStatus.active}>Active</SelectItem>
                        <SelectItem value={productStatus.inactive}>Inactive</SelectItem>
                      </SelectContent>
                    </Select> */}
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="status">Status</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value ?? form.watch('status')}
                              // defaultValue={field.value ?? productStatus.active.toLocaleLowerCase()}
                            >
                              <SelectTrigger id="productStatus" aria-label="Select product status">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={productStatus.active.toLocaleLowerCase()}>
                                  Active
                                </SelectItem>
                                <SelectItem value={productStatus.inactive.toLocaleLowerCase()}>
                                  Inactive
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 pt-4 md:justify-center md:pt-8">
          <CustomDialog
            disabled={!form.formState.isDirty}
            onApprove={handleDiscard}
            dlgTitle="Confirm Product Cancellation"
            dlgDesc="Are you sure you want to discard your changes to this product? This action cannot be undone."
            btnNoDesc="No, Keep Changes"
            btnYesDesc="Yes, Discard Changes"
          />
          <Button type="submit">{`${isEdit ? 'Edit' : 'Save'} Product`}</Button>
        </div>
      </form>
    </Form>
  );
}

'use client';

import { addSubmitExtrasForm, editSubmitExtrasForm } from '@/app/actions/form';
import CustomDialog from '@/components/custom-dialog';
import { Badge } from '@/components/ui/badge';
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
import { ExtraSchema, extraSchema } from '@/lib/schema';
import useOrderStore from '@/lib/store';
import { Extra, productStatus as extraStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type ExtrasFormProps = {
  extra?: Extra;
};

export default function ExtrasForm({ extra }: ExtrasFormProps) {
  const router = useRouter();
  const [shouldOpen, setShouldOpen] = useState(false);

  const form = useForm<z.infer<typeof extraSchema>>({
    resolver: zodResolver(extraSchema),
    defaultValues: {
      name: extra?.name || '',
      price: extra?.price || 0,
      status: extra?.status || extraStatus.active.toLocaleLowerCase(),
    },
    mode: 'onChange',
  });

  useEffect(() => {
    form.reset(extra);
  }, [form, extra]);

  const isEdit = useMemo(() => !!extra, [extra]);

  const onSubmit: SubmitHandler<ExtraSchema> = async (values) => {
    try {
      if (!form.formState.isDirty) return;
      toast.loading(`${isEdit ? 'Saving' : 'Adding new'} extra... Please wait.`);

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('price', values.price.toString());
      formData.append('status', values.status);

      if (isEdit && extra) {
        await editSubmitExtrasForm(formData, extra.id);
      } else {
        await addSubmitExtrasForm(formData);
      }

      toast.success(`Extra successfully ${isEdit ? 'updated' : 'added'}.`);
      toast.dismiss();

      useOrderStore.getState().getProducts('extras');
      router.back();
    } catch (e) {
      toast.error(`Failed to ${isEdit ? 'edit' : 'add'} extra. Please try again later.`);
      console.error(`Failed to ${isEdit ? 'edit' : 'add'} extra`, e);
      toast.dismiss();
    }
  };

  const handleDiscardChanges = () => {
    if (form.formState.isDirty) {
      form.reset();
    }
    router.back();
  };

  const handleKeepChanges = () => {
    setShouldOpen(!shouldOpen);
  };

  return (
    <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => {
            if (form.formState.isDirty) {
              setShouldOpen(!shouldOpen);
            } else {
              router.back();
            }
          }}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          {isEdit ? 'Edit' : 'Add'} Extra
        </h1>
        <Badge
          variant="secondary"
          className={cn(
            form.getValues('status') === extraStatus.active &&
              'bg-green-100/50 capitalize text-green-500 dark:bg-green-900/50 dark:text-green-300',
            'capitalize'
          )}
        >
          {form.getValues('status')}
        </Badge>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Extra Details</CardTitle>
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
                                placeholder="Extra name"
                                className="w-full text-base placeholder:text-sm md:text-sm"
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
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="price">Price</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Extra price"
                                className="w-full text-base placeholder:text-sm md:text-sm"
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
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Extra Status</CardTitle>
                  <CardDescription>
                    Choose the extra status to determine its availability.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="status">Status</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="extraStatus" aria-label="Select extra status">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={extraStatus.active.toLocaleLowerCase()}>
                                    Active
                                  </SelectItem>
                                  <SelectItem value={extraStatus.inactive.toLocaleLowerCase()}>
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
              onApprove={handleDiscardChanges}
              onDecline={() => handleKeepChanges()}
              shouldOpen={shouldOpen}
              dlgTitle="Confirm Extra Cancellation"
              dlgDesc="Are you sure you want to discard your changes to this extra? This action cannot be undone."
              btnNoDesc="No, Keep Changes"
              btnYesDesc="Yes, Discard Changes"
            />
            <Button type="submit">Save Extra</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

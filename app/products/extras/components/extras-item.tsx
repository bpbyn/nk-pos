import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/components/ui/table';
import { deleteDocument } from '@/lib//firebase/service';
import { db } from '@/lib/firebase/firebase';
import useOrderStore from '@/lib/store';
import { Extra, Product, productStatus } from '@/lib/types';
import { cn, dateFormatter } from '@/lib/utils';
import { collection, doc, getDocs, writeBatch } from 'firebase/firestore';
import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

type ExtrasItemProps = {
  extra: Extra;
};

export default function ExtrasItem({ extra }: ExtrasItemProps) {
  const clearOrder = useOrderStore((state) => state.clearOrder);
  const router = useRouter();

  async function removeExtraFromProducts() {
    const productsSnapshot = await getDocs(collection(db, 'products'));

    const batch = writeBatch(db);

    productsSnapshot.forEach((productDoc) => {
      const productData = productDoc.data() as Product;

      if (productData.extras && Array.isArray(productData.extras)) {
        const updatedExtras = productData.extras.filter((e) => e.id !== extra.id);

        // Only update if something actually changed
        if (updatedExtras.length !== productData.extras.length) {
          const productRef = doc(db, 'products', productDoc.id);
          batch.update(productRef, { extras: updatedExtras });
        }
      }
    });

    await batch.commit();
  }

  const handleDeleteProduct = async () => {
    toast.loading('Deleting extras... Please wait.');

    try {
      await deleteDocument('extras', extra.id);
      await removeExtraFromProducts();
      clearOrder();
      useOrderStore.getState().getProducts('extras');
      useOrderStore.getState().getProducts('products');
      toast.success('Extras successfully deleted.');
      toast.dismiss();
    } catch (e) {
      toast.error('Failed to delete extras. Please try again after sometime');
      console.error('Failed to delete extras', e);
      toast.dismiss();
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{extra.name}</TableCell>
      <TableCell>
        <Badge
          variant="secondary"
          className={cn(
            extra.status === productStatus.active.toLocaleLowerCase() &&
              'bg-green-100/50 capitalize text-green-500 dark:bg-green-900/50 dark:text-green-300',
            'capitalize'
          )}
        >
          {extra.status}
        </Badge>
      </TableCell>

      <TableCell>
        <div className="flex">
          <div className="flex h-5 items-center space-x-4 text-sm">
            <div>₱{extra.price}</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {dateFormatter().format(extra.timestamp).split(',').join('')}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => router.push(`extras/edit/${extra.id}`)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteProduct}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

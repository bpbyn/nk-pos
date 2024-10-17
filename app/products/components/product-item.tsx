import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { TableCell, TableRow } from '@/components/ui/table';
import { deleteDocument } from '@/lib/firebase/service';
import useOrderStore from '@/lib/store';
import { Product, productStatus, productType } from '@/lib/types';
import { cn, dateFormatter } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

type ProductItemProps = {
  product: Product;
};

export default function ProductItem({ product }: ProductItemProps) {
  const [imgSrc, setImgSrc] = useState<string>('/placeholder.svg');
  const router = useRouter();

  const handleDeleteProduct = async () => {
    toast.loading('Deleting product... Please wait.');
    try {
      await deleteDocument('products', product.id);
      toast.success('Product successfully deleted.');
      toast.dismiss();
      useOrderStore.getState().getProducts('products');
    } catch (e) {
      toast.error('Failed to delete product. Please try again after sometime');
      console.error('Failed to delete product', e);
      toast.dismiss();
    }
  };

  useEffect(() => {
    if (product) {
      setImgSrc(product.asset?.url ?? '/placeholder.svg');
    }
  }, [product]);

  return (
    <TableRow>
      <TableCell className="sm:table-cell">
        <Image
          alt={product.name}
          className="aspect-auto rounded-md object-contain"
          src={imgSrc ? imgSrc : '/placeholder.svg'}
          height={64}
          width={150}
          style={{ height: 'auto', width: 'auto' }}
          priority
          onError={() => setImgSrc('/placeholder.svg')}
        />
      </TableCell>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell className="hidden md:table-cell">
        <Badge
          variant="secondary"
          className={cn(
            product.status === productStatus.active.toLocaleLowerCase() &&
              'bg-green-100/50 capitalize text-green-500 dark:bg-green-900/50 dark:text-green-300',
            'capitalize'
          )}
        >
          {product.status}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge
          variant="secondary"
          className={cn(
            product.type === productType.hot.toLocaleLowerCase() &&
              'bg-red-100/50 capitalize text-red-500 dark:bg-red-900/50 dark:text-red-300',
            product.type === productType.cold &&
              'bg-blue-100/50 capitalize text-blue-500 dark:bg-blue-900/50 dark:text-blue-300',
            'capitalize'
          )}
        >
          {product.type}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="flex">
          <div className="flex h-5 items-center space-x-4 text-sm">
            <div>₱{product.size.regular}</div>
            <Separator orientation="vertical" />
            <div>{`${product.size.large ? `₱${product.size.large}` : `-`}`}</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {dateFormatter().format(product.timestamp).split(',').join('')}
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
            <DropdownMenuItem onClick={() => router.push(`products/edit/${product.id}`)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteProduct}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

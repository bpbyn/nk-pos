'use client';

import Shell from '@/components/shell';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useOrderStore from '@/lib/store';
import { ProductStatus, ProductType, productType } from '@/lib/types';
import { File, ListFilter, PlusCircle, Search } from 'lucide-react';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';

import ProductItem from './components/product-item';

export default function Products() {
  const products = useOrderStore((state) => state.products);
  const [productTab, setProductTab] = useState<ProductStatus | 'all'>('all');
  const [selectedProductType, setSelectedProductType] = useState<ProductType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const tabList = ['all', 'active', 'inactive'];

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const productStatus =
          product.status === (productTab === 'all' ? product.status : productTab);
        const productType = product.type === (selectedProductType ?? product.type);
        const productName = product.name.toLocaleLowerCase().includes(searchTerm ?? product.name);
        return productStatus && productType && productName;
      })
      .sort((a, b) => +b.timestamp - +a.timestamp);
  }, [productTab, products, searchTerm, selectedProductType]);

  const handleFilterChange = (value: ProductType) => {
    setSelectedProductType((productType) => (productType === value ? null : value));
  };

  return (
    <Shell>
      <Tabs
        defaultValue="all"
        onValueChange={(value) => setProductTab(value as ProductStatus | 'all')}
      >
        <div className="flex items-center">
          <TabsList>
            {tabList.map((tab, i) => (
              <TabsTrigger key={`tabs-trigger-${i}`} value={tab} className="capitalize">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="ml-auto flex items-center gap-2 pr-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {[productType.hot, productType.cold].map((type, i) => (
                  <DropdownMenuCheckboxItem
                    key={`dropdown-menu-${i}`}
                    className="capitalize"
                    checked={selectedProductType === type}
                    onCheckedChange={() => handleFilterChange(type)}
                  >
                    {type}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" className="h-7 gap-1" disabled>
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
            </Button>
            <Link href="/products/add-product">
              <Button size="sm" className="h-7 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Product</span>
              </Button>
            </Link>
          </div>
        </div>
        {tabList.map((tab, i) => {
          return (
            <TabsContent value={tab} key={`tabList-${i}`}>
              <Card>
                <CardHeader className="flex-row items-center justify-between px-6 py-2 md:p-6">
                  <div className="hidden md:flex md:flex-col">
                    <CardTitle className="text-3xl font-bold tracking-tight">Products</CardTitle>
                    <CardDescription>Manage your products here.</CardDescription>
                  </div>
                  <div className="flex w-full gap-2 md:w-auto">
                    <div className="relative ml-auto flex-1 md:grow-0">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search..."
                        className="w-full rounded-lg bg-background pl-8 text-base placeholder:text-sm md:w-[200px] md:text-sm lg:w-[320px]"
                        onChange={(e) => setSearchTerm(e.target.value.toLocaleLowerCase())}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredProducts.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="table-cell w-[100px]">
                            <span className="sr-only">Image</span>
                          </TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="hidden md:table-cell">Status</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="hidden md:table-cell">Price</TableHead>
                          <TableHead className="hidden md:table-cell">Updated at</TableHead>
                          <TableHead>
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.map((product, i) => (
                          <ProductItem key={`product-item-${tab}-${i}`} product={product} />
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Card className="col-span-3 mt-2 border-none shadow-none md:border-solid">
                      <CardHeader>
                        <CardTitle className="text-center text-lg font-bold tracking-tight">
                          You have no items here.
                        </CardTitle>
                        <CardDescription className="text-center">
                          Add a new item in the Products Tab.
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  )}
                </CardContent>
                {filteredProducts.length > 0 && (
                  <CardFooter>
                    <div className="text-xs text-muted-foreground">
                      Showing <strong>1-{filteredProducts.length}</strong> of
                      <strong> {products.length}</strong> products
                    </div>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </Shell>
  );
}

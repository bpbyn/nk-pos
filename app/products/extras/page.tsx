'use client';

import Shell from '@/components/shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useOrderStore from '@/lib/store';
import { ProductStatus } from '@/lib/types';
import { DiamondPlus, Search } from 'lucide-react';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';

import ExtrasItem from './components/extras-item';

export default function Extras() {
  const extras = useOrderStore((state) => state.extras);
  const [extrasTab, setExtrasTab] = useState<ProductStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const tabList = ['all', 'active', 'inactive'];

  const filteredExtras = useMemo(() => {
    return extras
      .filter((extra) => {
        const extraStatus = extra.status === (extrasTab === 'all' ? extra.status : extrasTab);
        const extraName = extra.name.toLocaleLowerCase().includes(searchTerm ?? extra.name);
        return extraStatus && extraName;
      })
      .sort((a, b) => +b.timestamp - +a.timestamp);
  }, [extras, extrasTab, searchTerm]);

  return (
    <Shell>
      <Tabs
        defaultValue="active"
        onValueChange={(value) => setExtrasTab(value as ProductStatus | 'all')}
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
            <Link href="/products/extras/add-extras">
              <Button size="sm" className="h-7 gap-1">
                <DiamondPlus className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Extras</span>
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
                    <CardTitle className="text-3xl font-bold tracking-tight">Extras</CardTitle>
                    <CardDescription>Manage your extras / add-ons here.</CardDescription>
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
                  {filteredExtras.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead className="hidden md:table-cell">Updated at</TableHead>
                          <TableHead>
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredExtras.map((extra, i) => (
                          <ExtrasItem key={`extras-item-${tab}-${i}`} extra={extra} />
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
                          Add a new item in the Extras Tab.
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </Shell>
  );
}

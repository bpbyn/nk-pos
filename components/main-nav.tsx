'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet, // SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Package2, PanelLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

import DynamicBreadcrumb from './dynamic-breadcrumb';
import { ModeToggle } from './mode-toggle';
import { navigationList } from './side-nav';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export default function MainNav() {
  const currentPath = usePathname();
  const [openSheet, setOpenSheet] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet onOpenChange={() => setOpenSheet(!openSheet)} open={openSheet}>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <SheetHeader>
            <SheetTitle>{}</SheetTitle>
            <SheetDescription>{}</SheetDescription>
          </SheetHeader>

          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Northern Kaffeine</span>
            </Link>
            {navigationList.map(({ label, route, asset }, i) => (
              <Link
                key={`navlist-mobile-${i}`}
                href={route}
                className={cn(
                  'flex items-center gap-4 px-2.5 hover:text-foreground',
                  currentPath === route ? 'text-foreground' : 'text-muted-foreground'
                )}
                onClick={() => setOpenSheet(false)}
              >
                {asset}
                {label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <DynamicBreadcrumb />
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>
      <ModeToggle />
      <>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" width={50} height={50} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        {/* <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn> */}
      </>
    </header>
  );
}

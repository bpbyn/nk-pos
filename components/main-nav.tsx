'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet, // SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import useAuth from '@/hooks/use-auth';
import { publicRoutes } from '@/lib/routes';
import useOrderStore from '@/lib/store';
import { userRole } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CircleUser, LogOut, PanelLeft, Settings, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

import CommandMenu from './command-menu';
import DynamicBreadcrumb from './dynamic-breadcrumb';
import { ModeToggle } from './mode-toggle';
import { navigationList } from './side-nav';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function MainNav() {
  const currentPath = usePathname();
  const [openSheet, setOpenSheet] = useState(false);
  const { user, logOut } = useAuth();
  const userSignIn = useOrderStore((state) => state.user);

  const filteredNavList =
    userSignIn?.role === userRole.user
      ? navigationList.filter((nav) => publicRoutes.includes(nav.route))
      : navigationList;

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
              href={'/'}
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary p-1 text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Image
                src={'/nk_black.png'}
                alt="nk logo"
                width={48}
                height={48}
                className="hidden transition-all group-hover:scale-110 dark:block"
              />
              <Image
                src={'/nk_white.png'}
                alt="nk logo"
                width={48}
                height={48}
                className="block transition-all group-hover:scale-110 dark:hidden"
              />
              <span className="sr-only">Northern Kaffeine</span>
            </Link>
            {filteredNavList.map(({ label, route, asset }, i) => (
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
        {/* <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
        /> */}
        <CommandMenu />
      </div>
      <ModeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
            <Avatar>
              {user?.photoURL ? (
                <AvatarImage
                  src={user?.photoURL ?? ''}
                  alt="photoURL"
                  className="overflow-hidden rounded-full"
                  width={36}
                  height={36}
                />
              ) : (
                <AvatarFallback>
                  <CircleUser className="h-5 w-5" />
                </AvatarFallback>
              )}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <div>{user?.displayName}</div>
            <div className="text-xs font-normal text-muted-foreground">{user?.email}</div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="space-x-2" disabled>
            <User className="h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="space-x-2" disabled>
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem className="space-x-2" onClick={logOut}>
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

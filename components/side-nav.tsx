'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { publicRoutes } from '@/lib/routes';
import useOrderStore from '@/lib/store';
import { NavigationList, userRole } from '@/lib/types';
import { cn } from '@/lib/utils';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Inbox, LineChart, ListChecks, Package, Settings, ShoppingBag, Users2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function SideNav() {
  const currentPath = usePathname();
  const userSignIn = useOrderStore((state) => state.user);

  const filteredNavList =
    userSignIn?.role === userRole.user
      ? navigationList.filter((nav) => publicRoutes.includes(nav.route))
      : navigationList;

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 py-4">
        <Link
          href={'/'}
          className="group flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary p-1 text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Image
            src={'/nk_black.png'}
            alt="nk logo"
            width={30}
            height={30}
            className="hidden transition-all group-hover:scale-110 dark:block"
          />
          <Image
            src={'/nk_white.png'}
            alt="nk logo"
            width={30}
            height={30}
            className="block transition-all group-hover:scale-110 dark:hidden"
          />
          <span className="sr-only">Northern Kaffeine</span>
        </Link>
        <TooltipProvider>
          {filteredNavList.map(({ label, route, asset }, i) => (
            <Tooltip key={`navlist-${i}`}>
              <TooltipTrigger asChild>
                <Link
                  href={route}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8',
                    currentPath === route
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {asset}
                  <span className="sr-only">{label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{label}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8',
                  currentPath === 'Settings'
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground'
                )}
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  );
}

export const navigationList: NavigationList[] = [
  {
    label: 'Dashboard',
    route: '/',
    asset: <Inbox className="h-5 w-5" />,
  },
  {
    label: 'Cart',
    route: '/cart',
    asset: <ShoppingBag className="h-5 w-5" />,
  },
  {
    label: 'Orders',
    route: '/orders',
    asset: <ListChecks className="h-5 w-5" />,
  },
  {
    label: 'Customers',
    route: '/customers',
    asset: <Users2 className="h-5 w-5" />,
  },
  {
    label: 'Products',
    route: '/products',
    asset: <Package className="h-5 w-5" />,
  },
  {
    label: 'Analytics',
    route: '/analytics',
    asset: <LineChart className="h-5 w-5" />,
  },
];

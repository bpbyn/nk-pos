'use client';

import { publicRoutes } from '@/lib/routes';
import useOrderStore from '@/lib/store';
import { userRole } from '@/lib/types';
import { cn } from '@/lib/utils';
import { DialogProps } from '@radix-ui/react-dialog';
import { FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import { navigationList } from './side-nav';
import { Button } from './ui/button';
import { CommandDialog, CommandEmpty, CommandInput, CommandItem, CommandList } from './ui/command';

export default function CommandMenu({ ...props }: DialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const userSignIn = useOrderStore((state) => state.user);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  const filteredNavList =
    userSignIn?.role === userRole.user
      ? navigationList.filter((nav) => publicRoutes.includes(nav.route))
      : navigationList;

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          'relative h-8 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64'
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="inline-flex">Search...</span>
        {/* <span className="inline-flex lg:hidden">Search...</span> */}
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        {/* <CommandInput placeholder="What are you searching for?" /> */}
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {filteredNavList.map((nav, i) => (
            <CommandItem
              key={`cmd-item-${i}`}
              value={nav.label}
              onSelect={() => runCommand(() => router.push(nav.route))}
            >
              <div className="mr-2 h-4 w-4">
                <FileText className="h-3 w-3" />
              </div>
              {nav.label}
            </CommandItem>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ShellProps {
  className?: string;
  children: ReactNode;
}

export default function Shell({ className, children }: ShellProps) {
  return (
    <main className={cn('grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-4', className)}>
      {children}
    </main>
  );
}

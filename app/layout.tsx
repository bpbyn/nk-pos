import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import Providers from '@/providers/providers';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import ProtectedLayout from './protected-layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Northern Kaffeine POS',
  description: 'A point of sale system for Norther Kaffeine',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        // className={cn('antialiased', inter.className, vollkorn.className, josefinSans.className)}
        className={cn('grid min-h-svh w-full bg-muted/30 antialiased', inter.className)}
      >
        <Providers>
          <ProtectedLayout>{children}</ProtectedLayout>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}

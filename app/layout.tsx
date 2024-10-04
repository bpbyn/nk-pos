import MainNav from '@/components/main-nav';
import SideNav from '@/components/side-nav';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import Providers from '@/providers/providers';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });
// const vollkorn = Vollkorn({ subsets: ['latin'] });
// const josefinSans = Josefin_Sans({ subsets: ['latin'] });
// const urbanist = Urbanist({ subsets: ['latin'] });

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
        className={cn('flex min-h-svh w-full flex-col bg-muted/30 antialiased', inter.className)}
      >
        <Providers>
          <SideNav />
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <MainNav />
            {children}
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}

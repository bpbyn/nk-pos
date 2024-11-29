'use client';

import MainNav from '@/components/main-nav';
import PageNotFound from '@/components/page-not-found';
import SideNav from '@/components/side-nav';
import useAuth from '@/hooks/use-auth';
import { publicRoutes } from '@/lib/routes';
import useOrderStore from '@/lib/store';
import { userRole } from '@/lib/types';
import { usePathname } from 'next/navigation';
import React from 'react';

import SignIn from './(auth)/sign-in/page';
import Loading from './products/add-product/loading';

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();
  const pathName = usePathname();
  const userSignIn = useOrderStore((state) => state.user);

  if (!publicRoutes.includes(pathName) && userSignIn?.role === userRole.user) {
    return <PageNotFound />;
  }

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <SignIn />;
  }

  return (
    <div>
      <SideNav />
      <div className="grid grid-rows-[auto,1fr] sm:gap-4 sm:py-4 sm:pl-14">
        <MainNav />
        {children}
      </div>
    </div>
  );
}

'use client';

import useOrderStore from '@/lib/store';
import { userRole } from '@/lib/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';

export default function DynamicBreadcrumb() {
  const paths = usePathname();
  const pathNames = paths
    .split('/')
    .filter((path) => path)
    .filter((path) => path.length < 15);

  const userSignIn = useOrderStore((state) => state.user);

  return (
    <Breadcrumb className="hidden pl-1 md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">{userSignIn?.role === userRole.admin ? 'Dashboard' : 'Home'}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {pathNames.length > 0 && <BreadcrumbSeparator />}
        {pathNames.map((path, i) => {
          const formattedPath = path.replace(/-/g, ' ');
          const href = `/${pathNames.slice(0, i + 1).join('/')}`;
          return (
            <Fragment key={`breadcrumb-container-${i}`}>
              {pathNames.length === i + 1 ? (
                <BreadcrumbItem key={`breadcrumb-${i}`}>
                  <BreadcrumbPage className="capitalize">{formattedPath}</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={href} className="capitalize" key={`breadcrumb-${i}`}>
                    {formattedPath}
                  </Link>
                </BreadcrumbLink>
              )}
              {pathNames.length !== i + 1 && (
                <BreadcrumbSeparator key={`breadcrumb-separator-${i}`} />
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

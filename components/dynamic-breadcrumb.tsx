'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathNames.length > 0 && <BreadcrumbSeparator />}
        {pathNames.map((path, i) => {
          const formattedPath = path.replace(/-/g, ' ');
          const href = `/${pathNames.slice(0, i + 1).join('/')}`;
          return (
            <>
              {pathNames.length === i + 1 ? (
                <BreadcrumbItem>
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
            </>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

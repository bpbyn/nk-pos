'use client';

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

  return (
    // <Breadcrumb className="hidden gap-0 pl-1 md:flex">
    //   <BreadcrumbList>
    //     <BreadcrumbItem
    //       className={cn(
    //         'h-7 hover:rounded-full hover:bg-muted',
    //         pathNames.length === 0 && 'rounded-full bg-muted text-primary'
    //       )}
    //     >
    //       <BreadcrumbLink asChild>
    //         <Link className="px-4" href="/">
    //           Dashboard
    //         </Link>
    //       </BreadcrumbLink>
    //     </BreadcrumbItem>
    //     {pathNames.length > 0 && <BreadcrumbSeparator />}
    //     {pathNames.map((path, i) => {
    //       const formattedPath = path.replace(/-/g, ' ');
    //       const href = `/${pathNames.slice(0, i + 1).join('/')}`;
    //       return (
    //         <Fragment key={`breadcrumb-container-${i}`}>
    //           {pathNames.length === i + 1 ? (
    //             <BreadcrumbItem key={`breadcrumb-${i}`} className="h-7 rounded-full bg-muted px-4">
    //               <BreadcrumbPage className="font-medium capitalize">
    //                 {formattedPath}
    //               </BreadcrumbPage>
    //             </BreadcrumbItem>
    //           ) : (
    //             <BreadcrumbItem className="h-7 px-4 hover:rounded-full hover:bg-muted">
    //               <BreadcrumbLink asChild>
    //                 <Link href={href} className="capitalize" key={`breadcrumb-${i}`}>
    //                   {formattedPath}
    //                 </Link>
    //               </BreadcrumbLink>
    //             </BreadcrumbItem>
    //           )}
    //           {pathNames.length !== i + 1 && (
    //             <BreadcrumbSeparator key={`breadcrumb-separator-${i}`} />
    //           )}
    //         </Fragment>
    //       );
    //     })}
    //   </BreadcrumbList>
    // </Breadcrumb>
    <Breadcrumb className="hidden pl-1 md:flex">
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

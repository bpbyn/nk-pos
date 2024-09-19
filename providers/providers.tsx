import { ClerkProvider } from '@clerk/nextjs';
import React, { ReactNode } from 'react';

import { ThemeProvider } from './theme-provider';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="default" enableSystem disableTransitionOnChange>
      <ClerkProvider>{children}</ClerkProvider>
    </ThemeProvider>
  );
}

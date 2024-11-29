import React, { ReactNode } from 'react';

import AuthProvider from './auth-provider';
import { ThemeProvider } from './theme-provider';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}

'use client';

import { SessionProvider } from 'next-auth/react';
import { MobileMenuProvider } from '@/contexts/MobileMenuContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <MobileMenuProvider>
        {children}
      </MobileMenuProvider>
    </SessionProvider>
  );
}

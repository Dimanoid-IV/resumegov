'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { pageview } from '@/lib/gtag';

/**
 * Client-side component that tracks page views on route changes
 */
export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    pageview(pathname);
  }, [pathname]);

  return null;
}

'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';
import { pageview } from '@/lib/gtag';

function AnalyticsInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    // Initial pageview is sent by <GoogleAnalytics />; only track SPA navigations here.
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    const qs = searchParams.toString();
    pageview(qs ? `${pathname}?${qs}` : pathname);
  }, [pathname, searchParams]);

  return null;
}

/**
 * Tracks App Router client navigations as GA4 page views.
 * Suspense is required because useSearchParams() needs it in Next.js.
 */
export default function Analytics() {
  return (
    <Suspense fallback={null}>
      <AnalyticsInner />
    </Suspense>
  );
}

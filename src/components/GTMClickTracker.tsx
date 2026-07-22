'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/gtag';

/**
 * Tracks clicks on elements with data-gtm-event as GA4 events.
 */
export default function GTMClickTracker() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const el = target.closest('[data-gtm-event]') as HTMLElement | null;
      if (!el) return;

      const eventName = el.getAttribute('data-gtm-event');
      if (!eventName) return;

      trackEvent({
        eventName,
        element_text: el.textContent?.trim(),
        element_href: (el as HTMLAnchorElement).href || undefined,
      });
    }

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  return null;
}

'use client';

import { useEffect } from 'react';

/**
 * GTM CTA Click Tracker
 * Listens for clicks on elements with data-gtm-event attribute
 * and pushes to dataLayer for GTM tracking.
 */
export default function GTMClickTracker() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const el = target.closest('[data-gtm-event]') as HTMLElement | null;
      
      if (el && window.dataLayer) {
        const eventName = el.getAttribute('data-gtm-event');
        if (eventName) {
          window.dataLayer.push({
            event: eventName,
            element_text: el.textContent?.trim(),
            element_href: (el as HTMLAnchorElement).href || undefined,
          });
        }
      }
    }

    document.addEventListener('click', handleClick, true);
    
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, []);

  return null;
}

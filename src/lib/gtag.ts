/**
 * Google Analytics 4 helpers (gtag.js)
 * Measurement ID: G-WL9BDH49MY
 */

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-WL9BDH49MY';

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set' | 'consent',
      targetOrAction: string | Date,
      params?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

function canTrack(): boolean {
  if (typeof window === 'undefined') return false;
  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.NEXT_PUBLIC_ENABLE_GA4 !== 'true'
  ) {
    return false;
  }
  return true;
}

/** SPA page views — call on App Router pathname changes */
export function pageview(url: string) {
  if (!canTrack() || typeof window.gtag !== 'function') return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

/** Custom GA4 events */
export function trackEvent({
  eventName,
  ...params
}: {
  eventName: string;
  [key: string]: unknown;
}) {
  if (!canTrack() || typeof window.gtag !== 'function') return;

  window.gtag('event', eventName, params);
}

/**
 * Google Analytics 4 helpers (gtag.js)
 * Measurement ID: G-WL9BDH49MY
 */

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-WL9BDH49MY';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type GoogleAnalyticsIdentifiers = {
  clientId?: string;
  sessionId?: string;
};

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

/**
 * Reads GA identifiers immediately before an external checkout redirect so a
 * server-confirmed purchase can be attached to the originating GA session.
 */
export async function getGoogleAnalyticsIdentifiers(): Promise<GoogleAnalyticsIdentifiers> {
  if (!canTrack() || typeof window.gtag !== 'function') return {};

  const read = (field: 'client_id' | 'session_id') =>
    new Promise<string | undefined>(resolve => {
      let settled = false;
      const timeout = window.setTimeout(() => {
        if (!settled) resolve(undefined);
      }, 600);

      window.gtag?.('get', GA_MEASUREMENT_ID, field, (value: unknown) => {
        settled = true;
        window.clearTimeout(timeout);
        resolve(typeof value === 'string' || typeof value === 'number' ? String(value) : undefined);
      });
    });

  const [clientId, sessionId] = await Promise.all([read('client_id'), read('session_id')]);
  return { clientId, sessionId };
}

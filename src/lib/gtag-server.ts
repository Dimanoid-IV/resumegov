/**
 * Server-side GA4 event tracking for API routes
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-WL9BDH49MY';

type GA4EventParams = Record<string, string | number | boolean | Array<Record<string, unknown>>>;

/**
 * Send event to GA4 Measurement Protocol API
 * Used for server-side tracking (Stripe webhooks, etc.)
 */
export async function trackGA4Event({
  eventName,
  params = {},
  clientId,
  sessionId,
  userId,
}: {
  eventName: string;
  params?: GA4EventParams;
  clientId?: string;
  sessionId?: string;
  userId?: string;
}): Promise<boolean> {
  const apiSecret = process.env.GA4_API_SECRET;
  if (!GA_MEASUREMENT_ID || !apiSecret || !clientId) {
    console.warn('GA4 purchase tracking skipped: measurement ID, API secret, or client ID is missing');
    return false;
  }

  const payload = {
    client_id: clientId,
    ...(userId ? { user_id: userId } : {}),
    events: [
      {
        name: eventName,
        params: {
          ...params,
          ...(sessionId && /^\d+$/.test(sessionId) ? { session_id: Number(sessionId) } : {}),
          engagement_time_msec: 1000,
        },
      },
    ],
  };

  try {
    const response = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(GA_MEASUREMENT_ID)}&api_secret=${encodeURIComponent(apiSecret)}`,
      {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      },
    );
    if (!response.ok) {
      console.error(`GA4 Measurement Protocol returned ${response.status}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Failed to send GA4 event:', error);
    return false;
  }
}

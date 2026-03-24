/**
 * Server-side GA4 event tracking for API routes
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-WL9BDH49MY";

/**
 * Send event to GA4 Measurement Protocol API
 * Used for server-side tracking (Stripe webhooks, etc.)
 */
export async function trackGA4Event({
  eventName,
  value,
  sessionId,
  userId,
}: {
  eventName: string;
  value?: number;
  sessionId?: string;
  userId?: string;
}) {
  if (!GA_MEASUREMENT_ID) {
    console.warn('GA_MEASUREMENT_ID not configured');
    return;
  }

  const payload = {
    client_id: sessionId || userId || 'anonymous',
    events: [
      {
        name: eventName,
        params: {
          value,
          engagement_time_msec: 1000,
        },
      },
    ],
  };

  try {
    await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=YOUR_API_SECRET`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Failed to send GA4 event:', error);
  }
}

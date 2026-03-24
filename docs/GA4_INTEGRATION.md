# Google Analytics 4 Integration Guide

## Overview

ResumeGov uses GA4 for tracking user engagement and conversion events with production-only filtering.

## Installation

GA4 is already installed in `app/layout.tsx`:

- Global site tag (gtag.js) loaded via Next.js Script component
- Strategy: `afterInteractive` (non-blocking)
- Measurement ID: `G-WL9BDH49MY`

## Configuration

### Environment Variables (Optional)

Create `.env.local`:

```bash
NEXT_PUBLIC_ENABLE_GA4=true
```

This enables GA4 tracking in development mode. By default, tracking only works in production.

## Tracked Events

### 1. Page Views (Automatic)

Tracked on every route change via `components/Analytics.tsx`.

### 2. Custom SaaS Events

#### resume_analysis_started
**When:** User clicks "Get My Compliance Score" on `/start`  
**Location:** `app/start/page.tsx`  
**Parameters:**
- event_category: 'engagement'
- non_interaction: false

#### resume_analysis_completed
**When:** Analysis results page loads with compatibility score  
**Location:** `app/results/[analysisId]/page.tsx`  
**Parameters:**
- event_category: 'engagement'
- value: compatibility_score (0-100)
- non_interaction: false

#### optimization_run
**When:** Two-pass compression engine runs  
**Location:** `app/api/optimize/route.ts`  
**Parameters:**
- optimization_passes: number of compression passes (1 or 2)
- word_count_reduction: words removed

#### credit_purchase (Future)
**When:** User purchases Analyst plan ($19.99)  
**Location:** Stripe webhook or checkout API  
**Parameters:**
- value: 1999 (cents)
- currency: 'USD'

#### subscription_started (Future)
**When:** User subscribes to Professional plan ($39.99/mo)  
**Location:** Stripe webhook  
**Parameters:**
- value: 3999 (cents)
- currency: 'USD'
- recurring: true

## Implementation Details

### Client-Side Tracking

```typescript
// In client components
import { event } from '@/lib/gtag';

event({
  eventName: 'custom_event',
  value: 1,
  custom_param: 'value',
});
```

### Server-Side Tracking (For APIs)

```typescript
// In API routes
import { event } from '@/lib/gtag';

event({
  eventName: 'api_event',
  value: 100,
});
```

Note: Server-side events use the same gtag function but require window object check.

## Production Filtering

GA4 tracking is disabled in development by default:

```typescript
// lib/gtag.ts
if (process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_ENABLE_GA4 !== 'true') {
  return; // Skip tracking
}
```

To enable in development:
1. Add `NEXT_PUBLIC_ENABLE_GA4=true` to `.env.local`
2. Restart dev server

## Testing

### Verify Tracking in Browser

1. Install **Google Tag Assistant** Chrome extension
2. Open your site
3. Check if gtag.js loads
4. Verify events fire correctly

### Check Real-Time Reports

1. Go to GA4 Dashboard → Reports → Realtime
2. Perform actions on your site
3. See events appear within seconds

## Privacy & Compliance

### GDPR Considerations

- Add cookie consent banner before tracking
- Respect Do Not Track (DNT) settings
- Provide opt-out mechanism

### IP Anonymization

GA4 automatically anonymizes IP addresses. No additional configuration needed.

## Future Enhancements

1. **Enhanced Ecommerce Tracking**
   - Track resume credits usage
   - Monitor subscription lifecycle

2. **User Properties**
   - plan_type: 'free' | 'basic' | 'pro'
   - credits_remaining: number
   - analyses_count: number

3. **Conversion Funnels**
   - Landing → Start → Upload → Results → Payment
   - Identify drop-off points

## Troubleshooting

### Events Not Showing Up

1. Check browser console for errors
2. Verify GA_MEASUREMENT_ID is correct
3. Ensure gtag script loaded (Network tab)
4. Wait 24-48 hours for data processing

### Duplicate Page Views

Make sure `Analytics` component is only rendered once in `layout.tsx`.

## Resources

- [GA4 Documentation](https://support.google.com/analytics/answer/9304153)
- [gtag.js Reference](https://developers.google.com/gtagjs/reference)
- [Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4)

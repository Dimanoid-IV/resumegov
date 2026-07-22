'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/gtag';

export default function ResultsAnalytics({
  compatibilityScore,
}: {
  compatibilityScore: number;
}) {
  useEffect(() => {
    trackEvent({
      eventName: 'resume_analysis_completed',
      value: compatibilityScore,
      event_category: 'engagement',
    });
  }, [compatibilityScore]);

  return null;
}

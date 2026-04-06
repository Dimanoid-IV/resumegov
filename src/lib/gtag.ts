/**
 * Google Analytics 4 Configuration via Google Tag Manager
 * GTM Container ID: GT-MQDTST4W
 * GA4 Measurement ID: G-WL9BDH49MY
 */

export const GA_MEASUREMENT_ID = "G-WL9BDH49MY";
export const GTM_CONTAINER_ID = "GT-MQDTST4W";

// Type definition for gtag and dataLayer functions
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId?: string,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

/**
 * Track custom events via GTM dataLayer
 */
export const trackEvent = ({
  eventName,
  ...params
}: {
  eventName: string;
  [key: string]: any;
}) => {
  // Only track in production
  if (process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_ENABLE_GA4 !== 'true') {
    return;
  }
  
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...params,
    });
  }
};

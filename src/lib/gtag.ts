/**
 * Google Analytics 4 Configuration
 */

export const GA_MEASUREMENT_ID = "G-WL9BDH49MY";

// Type definition for gtag function
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId?: string,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

/**
 * Track page views on route changes
 */
export const pageview = (url: string) => {
  // Only track in production
  if (process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_ENABLE_GA4 !== 'true') {
    return;
  }
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

/**
 * Track custom events
 */
export const event = ({
  eventName,
  value,
  ...params
}: {
  eventName: string;
  value?: number;
  [key: string]: any;
}) => {
  // Only track in production
  if (process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_ENABLE_GA4 !== 'true') {
    return;
  }
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      value,
      ...params,
    });
  }
};

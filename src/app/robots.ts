import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/set-password/',
          '/auth/callback',
        ],
      },
    ],
    sitemap: 'https://resumegov.com/sitemap.xml',
  };
}

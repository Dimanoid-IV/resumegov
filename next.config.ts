import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-parse', '@napi-rs/canvas'],

  // ── Canonical domain redirect ─────────────────────────────────────────────
  // Redirect bare domain → www (301 permanent, SEO-safe)
  async redirects() {
    return [
      {
        source: '/usajobs-resume-requirements',
        destination: '/guides/usajobs-resume-requirements',
        permanent: true,
      },
      {
        source: '/federal-resume-2-page-rule',
        destination: '/blog/federal-resume-2-page-limit-2025',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'resumegov.com',
          },
        ],
        destination: 'https://www.resumegov.com/:path*',
        permanent: true,
      },
    ];
  },

  // ── Security headers ──────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

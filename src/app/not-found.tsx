import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Page Not Found — ResumeGov',
  description: 'The page you requested could not be found.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-md w-full text-center">
          {/* Status */}
          <p className="text-7xl font-bold text-slate-200 mb-2 font-mono">404</p>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Page not found</h1>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            The page you are looking for does not exist or has been moved.
            Use the links below to get back on track.
          </p>

          {/* Primary CTA */}
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-semibold rounded hover:bg-slate-800 transition-colors w-full mb-3"
          >
            Go to Homepage
          </Link>

          {/* Secondary links */}
          <div className="flex gap-3">
            <Link
              href="/blog"
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-slate-300 text-slate-700 font-medium text-sm rounded hover:border-slate-400 hover:bg-white transition-colors"
            >
              Browse Guides
            </Link>
            <Link
              href="/start"
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-slate-300 text-slate-700 font-medium text-sm rounded hover:border-slate-400 hover:bg-white transition-colors"
            >
              Analyze Resume
            </Link>
          </div>

          {/* Disclaimer */}
          <p className="mt-10 text-xs text-slate-400">
            ResumeGov is an independent compliance tool and is not affiliated with USAJOBS or OPM.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white tracking-tight">
            Resume<span className="text-blue-400">Gov</span>
          </span>
          <span className="text-slate-600 text-xs">— Federal Resume Compliance Infrastructure</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-slate-500">
          <Link href="/blog" className="hover:text-slate-300 transition-colors">Guides</Link>
          <Link href="/#pricing" className="hover:text-slate-300 transition-colors">Pricing</Link>
          <Link href="/login" className="hover:text-slate-300 transition-colors">Sign in</Link>
          <Link href="/dashboard" className="hover:text-slate-300 transition-colors">Dashboard</Link>
        </div>
        <p className="text-xs text-slate-600">OPM 2-page rule effective Sep 27, 2025</p>
      </div>
      <div className="max-w-6xl mx-auto px-6 pt-6 border-t border-slate-900">
        <p className="text-xs text-slate-700 text-center">
          ResumeGov is an independent compliance tool and is not affiliated with USAJOBS or the U.S. Office of Personnel Management (OPM).
        </p>
      </div>
    </footer>
  );
}

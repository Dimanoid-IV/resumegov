import Link from 'next/link';

export default function SiteNav() {
  return (
    <nav className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-white tracking-tight text-lg">
            Resume<span className="text-blue-400">Gov</span>
          </span>
          <span
            className="hidden sm:inline-block px-1.5 py-0.5 bg-blue-900 text-blue-300 text-xs font-mono rounded"
            aria-label="United States Federal Resume Compliance"
          >
            🇺🇸
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/blog" className="text-sm text-slate-400 hover:text-white transition-colors">
            Guides
          </Link>
          <Link href="/#pricing" className="text-sm text-slate-400 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link
            href="/login"
            className="text-sm px-4 py-1.5 bg-white text-slate-900 font-semibold rounded hover:bg-slate-100 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </nav>
  );
}

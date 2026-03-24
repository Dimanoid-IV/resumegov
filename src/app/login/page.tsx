'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Tab = 'password' | 'magic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>('password');

  // Password tab
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Magic link tab
  const [magicEmail, setMagicEmail] = useState('');
  const [magicSent, setMagicSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // ── Password sign-in ────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
    setLoading(false);
  };

  // ── Magic link ──────────────────────────────────────────────────────────
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = magicEmail.trim().toLowerCase();
    if (!EMAIL_RE.test(trimmed)) {
      setError('Enter a valid email address.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        shouldCreateUser: false,
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setMagicSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Nav */}
      <nav className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-white tracking-tight">
            Resume<span className="text-blue-400">Gov</span>
          </Link>
          <Link href="/start" className="text-sm text-slate-400 hover:text-white transition-colors">
            Start free →
          </Link>
        </div>
      </nav>

      {/* Body */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Sign in to ResumeGov</h1>
            <p className="text-slate-500 text-sm mt-1">
              Don&apos;t have an account?{' '}
              <Link href="/start" className="text-blue-600 hover:underline font-medium">
                Get your free analysis →
              </Link>
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {/* Tab bar */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => { setTab('password'); setError(null); }}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  tab === 'password'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Email & Password
              </button>
              <button
                onClick={() => { setTab('magic'); setError(null); setMagicSent(false); }}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  tab === 'magic'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Magic Link
              </button>
            </div>

            <div className="p-6">
              {/* Error */}
              {error && (
                <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z" />
                  </svg>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {tab === 'password' ? (
                /* ── Password form ── */
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@agency.gov"
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Signing in…' : 'Sign In'}
                  </button>
                </form>
              ) : (
                /* ── Magic link form ── */
                magicSent ? (
                  <div className="text-center py-4">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="font-semibold text-slate-900 mb-1">Check your email</p>
                    <p className="text-sm text-slate-500">
                      We sent a sign-in link to{' '}
                      <strong className="text-slate-700">{magicEmail}</strong>.
                      The link expires in 60 minutes.
                    </p>
                    <button
                      onClick={() => { setMagicSent(false); setMagicEmail(''); }}
                      className="mt-4 text-sm text-blue-600 hover:underline"
                    >
                      Use a different email
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleMagicLink} className="space-y-4">
                    <p className="text-sm text-slate-500">
                      Enter your email and we&apos;ll send a one-click sign-in link.
                      No password needed.
                    </p>
                    <div>
                      <label htmlFor="magic-email" className="block text-sm font-medium text-slate-700 mb-1">
                        Email address
                      </label>
                      <input
                        id="magic-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={magicEmail}
                        onChange={e => setMagicEmail(e.target.value)}
                        placeholder="you@agency.gov"
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending…
                        </span>
                      ) : 'Send Magic Link'}
                    </button>
                  </form>
                )
              )}
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center mt-4">
            New to ResumeGov?{' '}
            <Link href="/start" className="text-blue-600 hover:underline">
              Get 3 free analyses →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

type Stage = 'input' | 'sent' | 'error';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function StartPage() {
  const [email, setEmail] = useState('');
  const [stage, setStage] = useState<Stage>('input');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Surface URL error params (from /auth/callback redirects)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get('error');
    if (err) {
      setErrorMsg(decodeURIComponent(err));
      setStage('error');
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');

    const trimmed = email.trim().toLowerCase();
    if (!EMAIL_RE.test(trimmed)) {
      setErrorMsg('Enter a valid email address.');
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/upload`,
        shouldCreateUser: true,
      },
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      setStage('error');
    } else {
      setStage('sent');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Nav */}
      <nav className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-white tracking-tight">
            Resume<span className="text-blue-400">Gov</span>
          </Link>
          <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
            Sign in
          </Link>
        </div>
      </nav>

      {/* Body */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">

          {/* Compliance badge */}
          <div className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-1.5 border border-slate-200 bg-white rounded px-3 py-1 text-xs font-mono text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              OPM 2-page rule — September 27, 2025
            </span>
          </div>

          {/* Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">

            {stage === 'sent' ? (
              /* ── Sent State ── */
              <div className="text-center">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-slate-900 mb-2">Check your email</h1>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  We sent a sign-in link to <strong className="text-slate-700">{email}</strong>.
                  Click the link to continue to your resume upload.
                </p>
                <p className="text-xs text-slate-400 mb-6">
                  The link expires in 60 minutes. No password required.
                </p>
                <button
                  onClick={() => { setStage('input'); setEmail(''); }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Use a different email
                </button>
              </div>
            ) : (
              /* ── Input / Error State ── */
              <>
                <h1 className="text-2xl font-bold text-slate-900 leading-tight mb-2">
                  Get Your Free Federal<br />Resume Compatibility Score
                </h1>
                <p className="text-slate-500 text-sm mb-6">
                  Enter your email to receive your structured analysis. No password required.
                </p>

                {/* Inline error */}
                {errorMsg && (
                  <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z" />
                    </svg>
                    <p className="text-sm text-red-700">{errorMsg}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@agency.gov"
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending link…
                      </span>
                    ) : 'Continue'}
                  </button>
                </form>

                {/* Microcopy */}
                <p className="text-xs text-slate-400 mt-4 text-center">
                  We do not share your data. Used only to deliver your analysis.
                </p>

                {/* Divider + Sign in link */}
                <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                  <p className="text-xs text-slate-400">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-600 hover:underline font-medium">
                      Sign in with password
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Compliance callout */}
          <div className="mt-6 border border-slate-200 bg-white rounded-lg p-4 text-xs text-slate-500">
            <p className="font-semibold text-slate-700 mb-1">What you receive — free</p>
            <ul className="space-y-1">
              {[
                'Compatibility score (0–100)',
                'Keyword match analysis',
                'Specialized experience coverage',
                '2-page compliance check',
                'Top missing qualification elements',
              ].map(item => (
                <li key={item} className="flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

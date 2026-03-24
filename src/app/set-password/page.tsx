'use client';

import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// ─── Inner component (uses useSearchParams) ────────────────────────────────

function SetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const analysisId = searchParams.get('analysisId') ?? '';

  const supabase = createClient();

  // Auth state
  const [email, setEmail] = useState('');
  const [authChecked, setAuthChecked] = useState(false);

  // Form state
  const [mode, setMode] = useState<'password' | 'magic'>('password');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Magic link state
  const [magicEmail, setMagicEmail] = useState('');
  const [magicSent, setMagicSent] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace(`/start`);
        return;
      }
      setEmail(user.email ?? '');
      setMagicEmail(user.email ?? '');
      setAuthChecked(true);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Set Password ──────────────────────────────────────────────────────────

  async function handleSetPassword(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');

    if (password.length < 8) {
      setStatus('error');
      setMessage('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setStatus('error');
      setMessage(error.message);
    } else {
      setStatus('success');
      setMessage('Password saved. Redirecting to your dashboard…');
      setTimeout(() => router.push('/dashboard'), 1800);
    }
  }

  // ── Resend Magic Link ─────────────────────────────────────────────────────

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: magicEmail.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        shouldCreateUser: false,
      },
    });
    setLoading(false);
    if (error) {
      setStatus('error');
      setMessage(error.message);
    } else {
      setMagicSent(true);
    }
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const resultHref = analysisId ? `/results/${analysisId}` : '/dashboard';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Nav */}
      <nav className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-white tracking-tight">
            Resume<span className="text-blue-400">Gov</span>
          </Link>
          <Link
            href={resultHref}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            ← Back to results
          </Link>
        </div>
      </nav>

      {/* Body */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md space-y-4">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Save Your Optimized Resume
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              Create a password to access your results anytime.{' '}
              {email && (
                <span className="font-medium text-slate-700">{email}</span>
              )}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => { setMode('password'); setMessage(''); setStatus('idle'); }}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  mode === 'password'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Set Password
              </button>
              <button
                onClick={() => { setMode('magic'); setMessage(''); setStatus('idle'); }}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  mode === 'magic'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Continue via Magic Link
              </button>
            </div>

            <div className="p-6">

              {/* Status message */}
              {message && (
                <div
                  className={`mb-4 px-4 py-3 rounded-lg text-sm flex items-start gap-2 border ${
                    status === 'success'
                      ? 'bg-green-50 border-green-200 text-green-700'
                      : 'bg-red-50 border-red-200 text-red-700'
                  }`}
                >
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {status === 'success' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z" />
                    )}
                  </svg>
                  {message}
                </div>
              )}

              {mode === 'password' ? (
                /* ── Password form ── */
                <form onSubmit={handleSetPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      New password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Confirm password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || status === 'success'}
                    className="w-full py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Saving…
                      </span>
                    ) : 'Save Password & Continue'}
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
                    <p className="text-sm font-semibold text-slate-900 mb-1">Magic link sent</p>
                    <p className="text-sm text-slate-500">
                      Check <strong className="text-slate-700">{magicEmail}</strong> for your sign-in link.
                      It expires in 60 minutes.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleMagicLink} className="space-y-4">
                    <p className="text-sm text-slate-500">
                      We&apos;ll send a secure sign-in link to your email. No password needed.
                    </p>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Email address
                      </label>
                      <input
                        type="email"
                        required
                        value={magicEmail}
                        onChange={e => setMagicEmail(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Sending…' : 'Send Magic Link'}
                    </button>
                  </form>
                )
              )}
            </div>
          </div>

          {/* Skip + upgrade section */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              Ready to optimize?
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Purchase a credit to compress your resume to the OPM 2-page standard.
              Qualification language is never removed.
            </p>
            <Link
              href={`/#pricing`}
              className="block w-full py-2.5 bg-slate-900 text-white text-sm font-semibold text-center rounded-lg hover:bg-slate-800 transition-colors"
            >
              View Pricing — from $9.99
            </Link>
            <div className="mt-3 text-center">
              <Link
                href={resultHref}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors underline underline-offset-2"
              >
                Skip for now — go back to results
              </Link>
            </div>
          </div>

          {/* Compliance note */}
          <p className="text-xs text-slate-400 text-center px-4">
            ResumeGov never fabricates experience. All optimizations preserve required
            qualification language per OPM standards effective September 27, 2025.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Page (wraps with Suspense for useSearchParams) ────────────────────────

export default function SetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SetPasswordInner />
    </Suspense>
  );
}

'use client';

import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// ─── Request Form (Step 1) ───────────────────────────────────────────────────

function RequestResetForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const trimmed = email.trim().toLowerCase();
    if (!EMAIL_RE.test(trimmed)) {
      setError('Enter a valid email address.');
      return;
    }
    setLoading(true);
    const supabase = createClient();
    // Always call resetPasswordForEmail — do NOT reveal whether email exists
    await supabase.auth.resetPasswordForEmail(trimmed, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password&type=recovery`,
    });
    setLoading(false);
    // Always show success regardless of whether email exists (security requirement)
    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">Check your email</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          If an account exists for <strong className="text-slate-700">{email}</strong>,
          a password reset link has been sent. The link expires in 60 minutes.
        </p>
        <p className="text-xs text-slate-400 mt-4">
          Did not receive an email? Check your spam folder or{' '}
          <button
            onClick={() => { setSent(false); setEmail(''); }}
            className="text-blue-600 hover:underline"
          >
            try again
          </button>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-slate-500">
        Enter the email address associated with your account. We will send a
        secure password reset link valid for 60 minutes.
      </p>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z" />
          </svg>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="reset-email" className="block text-sm font-medium text-slate-700 mb-1">
          Email address
        </label>
        <input
          id="reset-email"
          type="text"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
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
            Sending…
          </span>
        ) : 'Send Reset Link'}
      </button>
    </form>
  );
}

// ─── New Password Form (Step 3) ──────────────────────────────────────────────

function NewPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
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
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setStatus('error');
      setMessage(error.message);
    } else {
      setStatus('success');
      setMessage('Password updated. Redirecting to your dashboard…');
      setTimeout(() => router.push('/dashboard'), 1800);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-slate-500">
        Choose a new password for your account. Minimum 8 characters.
      </p>

      {message && (
        <div
          className={`flex items-start gap-2 px-4 py-3 rounded-lg text-sm border ${
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

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          New password
        </label>
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Minimum 8 characters"
          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Confirm new password
        </label>
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
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
        ) : 'Set New Password'}
      </button>
    </form>
  );
}

// ─── Inner (uses useSearchParams) ────────────────────────────────────────────

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  // When callback redirects here after token exchange, it passes ?recovered=1
  const recovered = searchParams.get('recovered') === '1';

  // Also check Supabase session — if user has recovery session, show new password form
  const [mode, setMode] = useState<'loading' | 'request' | 'set'>('loading');

  useEffect(() => {
    if (recovered) {
      setMode('set');
      return;
    }
    // Check if there's an active recovery session
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setMode('set');
      } else {
        setMode('request');
      }
    });
  }, [recovered]);

  if (mode === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
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

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {mode === 'set' ? 'Set New Password' : 'Reset Password'}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {mode === 'set'
                ? 'Choose a secure password for your account.'
                : 'Enter your email to receive a secure reset link.'}
            </p>
          </div>

          {/* Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
            {mode === 'set' ? <NewPasswordForm /> : <RequestResetForm />}
          </div>

          <p className="text-xs text-slate-400 text-center mt-4">
            Remember your password?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Page export ─────────────────────────────────────────────────────────────

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordInner />
    </Suspense>
  );
}

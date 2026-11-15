import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { Database } from '@/types/database';
import { safeAuthReturnPath } from '@/lib/auth-return';

export const dynamic = 'force-dynamic';

/** Verify email token hashes without a browser verifier; retain old PKCE links. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const next = safeAuthReturnPath(searchParams.get('next'));
  const pendingCookies: { name: string; value: string; options?: CookieOptions }[] = [];
  function redirect(path: string) {
    const response = NextResponse.redirect(new URL(path, origin));
    response.headers.set('Cache-Control', 'no-store');
    response.headers.set('Referrer-Policy', 'no-referrer');
    for (const { name, value, options } of pendingCookies) response.cookies.set(name, value, options);
    return response;
  }
  function retry(code: string) {
    const params = new URLSearchParams({ error: code });
    if (next.startsWith('/api/checkout?') || next === '/dashboard' || next === '/set-password') {
      params.set('next', next);
      return redirect(`/login?${params}`);
    }
    return redirect(`/start?${params}`);
  }

  if (searchParams.has('error')) return retry('email_link_expired');
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const validTokenType = type === 'email' || type === 'recovery';
  if (!code && !(tokenHash && validTokenType)) return retry('email_link_invalid');

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: values => { pendingCookies.push(...values); },
    } },
  );

  const { error } = tokenHash && validTokenType
    ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    : await supabase.auth.exchangeCodeForSession(code!);
  if (error) {
    // Never include tokens, provider messages, or request URLs in logs/redirects.
    console.warn('[auth/callback] Verification failed', { code: error.code || 'unknown', method: tokenHash ? 'email_hash' : 'pkce' });
    const missingVerifier = !tokenHash && (/verifier/i.test(error.message) || error.code === 'flow_state_not_found');
    return retry(missingVerifier ? 'email_link_browser' : 'email_link_expired');
  }
  return redirect(type === 'recovery' ? '/reset-password?recovered=1' : next);
}

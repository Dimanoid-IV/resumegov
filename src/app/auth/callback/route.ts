import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

export const dynamic = 'force-dynamic';

/**
 * GET /auth/callback
 * Exchanges a magic link / OAuth code for a Supabase session.
 * Redirects to `next` param (defaults to /upload).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/upload';
  const error = searchParams.get('error');

  // Surface Supabase-level errors back to /start
  if (error) {
    const desc = searchParams.get('error_description') ?? 'Authentication failed';
    return NextResponse.redirect(
      `${origin}/start?error=${encodeURIComponent(desc)}`
    );
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/start?error=missing_code`);
  }

  const cookieStore = await cookies();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — safe to ignore
          }
        },
      },
    }
  );

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error('Magic link exchange error:', exchangeError.message);
    return NextResponse.redirect(
      `${origin}/start?error=${encodeURIComponent(exchangeError.message)}`
    );
  }

  // Redirect to intended destination (default: /upload)
  const safeNext = next.startsWith('/') ? next : '/upload';
  return NextResponse.redirect(`${origin}${safeNext}`);
}

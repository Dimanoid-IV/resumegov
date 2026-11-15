import { safePostLoginPath } from './checkout-flow';

export function safeAuthReturnPath(requested: string | null): string {
  if (!requested || !requested.startsWith('/') || requested.startsWith('//') || requested.includes('\\')) return '/upload';
  try {
    const url = new URL(requested, 'https://resumegov.invalid');
    if (url.origin !== 'https://resumegov.invalid') return '/upload';
    if (url.pathname === '/api/checkout') {
      const checkout = safePostLoginPath(requested);
      return checkout.startsWith('/api/checkout?') ? checkout : '/upload';
    }
    if (url.pathname === '/dashboard' || url.pathname === '/set-password') return url.pathname;
    if (url.pathname === '/upload') return url.searchParams.get('auth') === 'success' ? '/upload?auth=success' : '/upload';
  } catch { /* An invalid destination falls back to the resume flow. */ }
  return '/upload';
}

export function authErrorMessage(code: string): string {
  switch (code) {
    case 'email_link_browser':
      return 'This sign-in link could not be completed in this browser. Request a new link and open it in the same browser where you started. Your saved draft is still available in the original browser.';
    case 'email_link_expired':
      return 'This sign-in link has expired or was already used. Request a new link to continue.';
    default:
      return 'We could not complete sign-in. Request a new email link and try again.';
  }
}

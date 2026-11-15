import LoginForm from './LoginForm';
import { safePostLoginPath } from '@/lib/checkout-flow';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  return <LoginForm nextPath={safePostLoginPath(next ?? null)} initialError={error} />;
}

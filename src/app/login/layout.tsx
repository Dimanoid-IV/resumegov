import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | ResumeGov',
  description: 'Sign in to your ResumeGov account.',
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

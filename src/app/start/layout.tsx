import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Federal Resume Checker for USAJOBS | ResumeGov',
  description:
    'Add your federal resume and a USAJOBS vacancy before email. Find missing qualification evidence and review two-page formatting risk for free.',
  alternates: { canonical: 'https://www.resumegov.com/start' },
  robots: { index: true, follow: true },
};

export default function StartLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

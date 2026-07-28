import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Federal Resume Compatibility Score | ResumeGov',
  description:
    'Start a free USAJOBS resume analysis for qualification language, required work-history details, and two-page formatting risk.',
  alternates: { canonical: 'https://www.resumegov.com/start' },
  robots: { index: true, follow: true },
};

export default function StartLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

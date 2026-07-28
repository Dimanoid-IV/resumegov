import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analyze Your Federal Resume | ResumeGov',
  description: 'Private workspace for signed-in ResumeGov users to analyze a federal resume.',
  robots: { index: false, follow: false },
};

export default function UploadLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.resumegov.com';

export const metadata: Metadata = {
  title: 'Editorial Standards | ResumeGov',
  description: 'ResumeGov editorial standards ensure accuracy, compliance, and alignment with OPM regulations and Title 5 federal hiring standards.',
  alternates: { canonical: `${SITE_URL}/editorial-standards` },
  openGraph: {
    title: 'Editorial Standards | ResumeGov',
    description: 'Our commitment to compliance accuracy and expert review in federal hiring guidance.',
    url: `${SITE_URL}/editorial-standards`,
    type: 'website',
  },
};

export default function EditorialStandardsPage() {
  return (
    <>
      <SiteNav />
      
      <main className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-gray-50 border-b">
          <div className="container mx-auto px-4 py-8 max-w-3xl">
            <nav className="text-sm text-gray-500 mb-5" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">Editorial Standards</span>
            </nav>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              ResumeGov Editorial Standards
            </h1>
          </div>
        </header>

        {/* Content */}
        <article className="container mx-auto px-4 py-10 max-w-3xl">
          
          {/* Mission */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              ResumeGov is committed to providing accurate, compliance-focused guidance for federal job applicants. Our editorial standards ensure that all content aligns with current Office of Personnel Management (OPM) regulations, USAJOBS qualification frameworks, and Title 5 federal hiring requirements.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We exist to help applicants navigate the complexity of federal resume requirements, GS-level evaluation criteria, and specialized experience documentation — reducing confusion and increasing successful referrals through regulatory precision.
            </p>
          </section>

          {/* Content Development Process */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Content Development Process</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Every article published on ResumeGov undergoes a structured development process grounded in authoritative sources:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>OPM Regulations.</strong> All guidance references current Title 5 Code of Federal Regulations and official OPM qualification standards.</li>
              <li><strong>USAJOBS Documentation.</strong> Content reflects actual USAJOBS application workflows, resume builder constraints, and HR screening procedures.</li>
              <li><strong>Federal HR Procedural Standards.</strong> Articles incorporate category rating methodology, specialized experience evaluation frameworks, and selective placement factor application as practiced by federal HR specialists.</li>
              <li><strong>Regulatory Updates.</strong> Content is updated when OPM issues new guidance or when USAJOBS modifies application requirements.</li>
            </ul>
          </section>

          {/* Expert Review Process */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Expert Review Process</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All articles are reviewed by former federal HR specialists and USAJOBS subject matter experts before publication. This review ensures:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Alignment with Title 5 qualification frameworks</li>
              <li>Accurate interpretation of specialized experience requirements</li>
              <li>Correct application of time-in-grade regulations</li>
              <li>Proper explanation of category rating procedures</li>
              <li>Compliance with current OPM word count and formatting mandates</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Reviewers verify that every claim about federal hiring requirements can be traced to an official regulatory source or documented HR procedure.
            </p>
          </section>

          {/* Update Policy */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Update Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              ResumeGov maintains a rigorous update schedule to ensure content remains current:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Quarterly Reviews.</strong> All articles are reviewed at least once per quarter for regulatory accuracy.</li>
              <li><strong>Event-Driven Updates.</strong> Content is updated immediately when OPM issues new regulations, USAJOBS modifies application procedures, or significant policy changes occur.</li>
              <li><strong>Version Tracking.</strong> Updated articles display both original publication date and last modified date for transparency.</li>
              <li><strong>Correction Protocol.</strong> Errors identified by readers or reviewers are corrected within 5 business days with clear notation of the change.</li>
            </ul>
          </section>

          {/* Independence Disclosure */}
          <section className="mb-10 p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Independence Disclosure</h2>
            <p className="text-gray-700 leading-relaxed">
              ResumeGov is an independent compliance tool and is not affiliated with USAJOBS, the U.S. Office of Personnel Management (OPM), or any federal agency. Our editorial content is developed independently and reflects our own research and analysis of publicly available federal hiring regulations.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact & Feedback</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you identify an error, have suggestions for improvement, or need clarification on any editorial content, please contact us at:
            </p>
            <p className="text-gray-700">
              <a href="mailto:editorial@resumegov.com" className="text-blue-600 hover:underline">editorial@resumegov.com</a>
            </p>
          </section>

          {/* Back to Blog */}
          <div className="mt-12 pt-8 border-t">
            <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </div>

        </article>
      </main>

      <SiteFooter />
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';

const URL = 'https://www.resumegov.com/guides/usajobs-resume-requirements';

export const metadata: Metadata = {
  title: 'USAJOBS Resume Requirements: 2026 Checklist | ResumeGov',
  description: 'A source-reviewed checklist for the two-page limit, work experience details, qualifications, education, file format, and vacancy-specific instructions.',
  alternates: { canonical: URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'USAJOBS Resume Requirements: 2026 Checklist',
    description: 'Check the official resume requirements before submitting a federal application.',
    url: URL,
    type: 'article',
  },
};

const requirements = [
  {
    title: 'Keep the resume to two pages or less',
    body: 'USAJOBS restricts covered resumes to two pages. OPM does not publish a universal word limit, so verify the final rendered file rather than relying on a word-count target.',
  },
  {
    title: 'Identify each relevant role',
    body: 'Include the job title and employer. For prior federal employment, include the series and grade when relevant.',
  },
  {
    title: 'Show dates and hours',
    body: 'Use start and end dates with month and year, and include hours worked per week so the reviewer can determine the duration of experience.',
  },
  {
    title: 'Prove the qualifications',
    body: 'Describe work that demonstrates the qualifications and specialized experience in the announcement. Use its terminology only where it truthfully matches your work.',
  },
  {
    title: 'Include education or credentials when relevant',
    body: 'Name the institution, completion date, and degree. Add certifications, licenses, transcripts, or other documentation when the announcement requires them.',
  },
  {
    title: 'Follow the individual announcement',
    body: 'The Required Documents, Qualifications, How You Will Be Evaluated, and How to Apply sections control the application. General guidance cannot override them.',
  },
];

const faq = [
  {
    q: 'Is there an official federal resume word limit?',
    a: 'No universal word limit is stated in the current OPM applicant guidance. The requirement is two pages or less. Formatting and content density determine how many words fit legibly.',
  },
  {
    q: 'Should I copy the vacancy announcement?',
    a: 'No. Use relevant terminology to make truthful experience easy to verify, but do not copy a requirement you cannot support with your own dates, duties, scope, and results.',
  },
  {
    q: 'Does ResumeGov determine whether I am eligible?',
    a: 'No. ResumeGov identifies documentation gaps and alignment signals. The hiring agency makes all eligibility, qualification, referral, and selection decisions.',
  },
];

export default function USAJOBSResumeRequirementsPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'USAJOBS Resume Requirements: 2026 Checklist',
    dateModified: '2026-08-10',
    author: { '@type': 'Organization', name: 'ResumeGov Editorial Team' },
    publisher: { '@type': 'Organization', name: 'ResumeGov' },
    mainEntityOfPage: URL,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <SiteNav />
      <main className="bg-white">
        <header className="bg-slate-900 py-16 text-white">
          <div className="max-w-4xl mx-auto px-6">
            <nav aria-label="Breadcrumb" className="text-sm text-slate-400 mb-5">
              <Link href="/" className="hover:text-white">Home</Link> <span className="mx-2">/</span> USAJOBS Resume Requirements
            </nav>
            <p className="text-xs uppercase tracking-widest text-blue-300 mb-3">Source-reviewed checklist · updated August 10, 2026</p>
            <h1 className="text-4xl font-bold tracking-tight">USAJOBS Resume Requirements</h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-300">What the current official guidance requires, what depends on the vacancy, and what to check before submitting.</p>
          </div>
        </header>

        <section className="max-w-4xl mx-auto px-6 py-14">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 mb-10 text-sm text-blue-900">
            <strong>Short answer:</strong> keep the resume to two pages or less, document relevant work with month/year dates and hours per week, and show how your experience satisfies the announcement. There is no official universal word-count target.
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-6">Pre-submission checklist</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {requirements.map((item, index) => (
              <article key={item.title} className="rounded-xl border border-slate-200 p-5">
                <span className="text-xs font-mono text-blue-700">0{index + 1}</span>
                <h3 className="font-semibold text-slate-900 mt-2 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.body}</p>
              </article>
            ))}
          </div>

          <section className="mt-14 rounded-xl bg-slate-50 border border-slate-200 p-7">
            <h2 className="text-2xl font-bold text-slate-900">Check your resume against one vacancy</h2>
            <p className="mt-3 text-slate-600 max-w-2xl">Add your resume and one vacancy before entering an email. ResumeGov first verifies that both contain enough information for a useful comparison, then identifies missing evidence and two-page formatting risk.</p>
            <Link href="/start?source=guide:requirements" data-gtm-event="requirements_cta_click" data-cta-context="guide:requirements" className="inline-flex mt-5 rounded bg-slate-900 text-white font-semibold px-5 py-3 hover:bg-slate-800">Check My Resume Free</Link>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-bold text-slate-900 mb-5">Common questions</h2>
            <div className="space-y-3">
              {faq.map(item => (
                <details key={item.q} className="border border-slate-200 rounded-lg p-5">
                  <summary className="font-semibold text-slate-900 cursor-pointer">{item.q}</summary>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="mt-14 border-t border-slate-200 pt-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Official sources</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li><a className="text-blue-700 hover:underline" href="https://www.opm.gov/policy-data-oversight/hiring-information/merit-hiring-plan-resources/applicant-guidance-on-the-two-page-resume-limit/">OPM applicant guidance on the two-page resume limit</a></li>
              <li><a className="text-blue-700 hover:underline" href="https://help.usajobs.gov/faq/application/documents/resume/what-to-include">USAJOBS: What to include in a federal resume</a></li>
              <li><a className="text-blue-700 hover:underline" href="https://help.usajobs.gov/how-to/account/documents/resume">USAJOBS: Upload or build a resume</a></li>
            </ul>
          </section>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

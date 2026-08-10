import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import WordCountCalculator from './WordCountCalculator';

const URL = 'https://www.resumegov.com/guides/federal-resume-word-count-calculator';

export const metadata: Metadata = {
  title: 'Federal Resume Word Counter & Two-Page Guide | ResumeGov',
  description: 'Count federal resume words privately in your browser, then use the official two-page rule and final PDF—not an invented word cap—to check length.',
  alternates: { canonical: URL },
  robots: { index: true, follow: true },
};

export default function FederalResumeWordCountCalculatorPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Federal Resume Word Counter',
    description: 'A browser-based word and character counter with source-reviewed two-page resume guidance.',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    url: URL,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <SiteNav />
      <main className="bg-slate-50 min-h-screen">
        <header className="bg-slate-900 text-white py-14">
          <div className="max-w-4xl mx-auto px-6">
            <nav aria-label="Breadcrumb" className="text-sm text-slate-400 mb-5">
              <Link href="/" className="hover:text-white">Home</Link> <span className="mx-2">/</span> Federal Resume Word Counter
            </nav>
            <h1 className="text-4xl font-bold tracking-tight">Federal Resume Word Counter</h1>
            <p className="mt-4 text-lg text-slate-300 max-w-2xl">Count text privately, then verify the final two-page document. OPM does not publish a universal federal resume word limit.</p>
          </div>
        </header>

        <section className="max-w-4xl mx-auto px-6 py-12">
          <WordCountCalculator />

          <div className="grid gap-5 md:grid-cols-2 mt-10">
            <article className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-bold text-slate-900">What actually controls</h2>
              <ul className="mt-4 list-disc pl-5 text-sm text-slate-600 space-y-2">
                <li>The resume must be two pages or less for covered USAJOBS applications.</li>
                <li>The final file must remain legible.</li>
                <li>The announcement controls required content and documents.</li>
                <li>Relevant qualification evidence matters more than reaching a target word count.</li>
              </ul>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-bold text-slate-900">Next useful check</h2>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">Compare the resume with the exact vacancy announcement to find missing dates, hours, specialized-experience evidence, and unsupported wording.</p>
              <Link href="/start" data-gtm-event="word_counter_cta_click" className="inline-flex mt-5 rounded bg-slate-900 text-white font-semibold px-5 py-3 hover:bg-slate-800">Check My Resume Free</Link>
            </article>
          </div>

          <section className="mt-12 border-t border-slate-200 pt-8 text-sm text-slate-600">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Official guidance</h2>
            <p>See the <a className="text-blue-700 hover:underline" href="https://www.opm.gov/policy-data-oversight/hiring-information/merit-hiring-plan-resources/applicant-guidance-on-the-two-page-resume-limit/">OPM applicant guidance</a> and the <a className="text-blue-700 hover:underline" href="https://help.usajobs.gov/faq/application/documents/resume/what-to-include">USAJOBS resume checklist</a>. Last reviewed August 10, 2026.</p>
          </section>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

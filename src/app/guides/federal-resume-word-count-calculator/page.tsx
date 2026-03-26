import { Metadata } from 'next';
import Link from 'next/link';
import WordCountCalculator from './WordCountCalculator';

export const metadata: Metadata = {
  title: 'Federal Resume Word Count Calculator (2025 OPM 2-Page Rule)',
  description:
    'Check your federal resume word count instantly. Understand the 950–1,050 optimal range under the September 2025 OPM 2-page rule.',
  keywords: [
    'federal resume word count calculator',
    'how many words federal resume',
    'federal resume word limit',
    'usajobs resume word count',
    'opm 2 page resume word count',
    'federal resume length 2025',
  ],
  authors: [{ name: 'ResumeGov Editorial Team' }],
  openGraph: {
    title: 'Federal Resume Word Count Calculator (2025 OPM 2-Page Rule)',
    description:
      'Check your federal resume word count instantly. Understand the 950–1,050 optimal range under the September 2025 OPM 2-page rule.',
    type: 'article',
    url: 'https://resumegov.com/guides/federal-resume-word-count-calculator',
    images: [
      {
        url: '/og-federal-resume-word-count-calculator.jpg',
        width: 1200,
        height: 630,
        alt: 'Federal Resume Word Count Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Federal Resume Word Count Calculator (2025)',
    description: 'Live word count with OPM compliance zones. Optimal range: 950–1,050 words.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://resumegov.com/guides/federal-resume-word-count-calculator',
  },
};

const softwareAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Federal Resume Word Count Calculator',
  description:
    'A free browser-based tool that counts words in a federal resume and indicates OPM 2-page rule compliance zones in real time.',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  url: 'https://resumegov.com/guides/federal-resume-word-count-calculator',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How many words should a federal resume be?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Under the September 2025 OPM 2-page rule, the optimal federal resume word count is 950–1,050 words using standard formatting (11-point font, 1-inch margins, single-spaced). Resumes below 900 words typically lack required content detail. Resumes exceeding 1,100 words risk having content truncated during HR evaluation.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the federal resume word limit in 2025?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'OPM does not specify an exact word limit — it specifies a 2-page limit effective September 27, 2025. However, at standard formatting, 1,100 words is the practical ceiling before content begins to overflow onto a third page. Content beyond page two is not evaluated by HR specialists.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if my federal resume exceeds 1,100 words?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Resumes exceeding 1,100 words at standard formatting likely extend beyond two pages. Under the OPM September 2025 evaluation policy, HR specialists only review the first two pages. Any specialized experience language, certifications, or qualifications placed after the two-page threshold will not be considered in the eligibility determination.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does word count alone determine federal resume compliance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Word count is a necessary condition, not a sufficient one. A resume within the 950–1,050 word range may still receive an Ineligible rating if it is missing required data fields (month/year dates, hours per week) or lacks specialized experience language matching the vacancy announcement.',
      },
    },
  ],
};

export default function FederalResumeWordCountCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-slate-900 border-b border-slate-800">
          <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="font-bold text-white tracking-tight">
              Resume<span className="text-blue-400">Gov</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/pricing" className="text-sm text-slate-400 hover:text-white transition-colors">
                Pricing
              </Link>
            </div>
          </div>
        </nav>

        <article className="max-w-3xl mx-auto px-6 py-12">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 border border-blue-200 bg-blue-50 rounded px-2.5 py-1 text-xs font-mono text-blue-700">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                OPM 2-Page Rule — September 2025
              </span>
              <span className="text-xs text-slate-500">Free tool</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-4">
              Federal Resume Word Count Calculator
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed">
              Paste your federal resume text below to see your word count and compliance zone
              under the September 2025 OPM 2-page evaluation policy.
            </p>
          </header>

          {/* Interactive Calculator — client component */}
          <WordCountCalculator />

          {/* Color zone legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 mb-12">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
              <p className="text-xs font-semibold text-blue-700">Below 900</p>
              <p className="text-xs text-blue-600 mt-1">Too thin — missing required detail</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <p className="text-xs font-semibold text-green-700">950 – 1,050</p>
              <p className="text-xs text-green-600 mt-1">Optimal — fits within 2 pages</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
              <p className="text-xs font-semibold text-yellow-700">1,051 – 1,100</p>
              <p className="text-xs text-yellow-600 mt-1">Caution — approaching limit</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
              <p className="text-xs font-semibold text-red-700">Over 1,100</p>
              <p className="text-xs text-red-600 mt-1">Over limit — truncation risk</p>
            </div>
          </div>

          {/* Section 1 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              What Is the Correct Word Count for a Federal Resume?
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              OPM does not publish a specific word count requirement. The official standard is a
              2-page limit, effective September 27, 2025. Under this policy, HR specialists are
              instructed to evaluate only the first two pages of any resume submitted through
              USAJOBS.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              The word count ranges shown in this tool are derived from standard formatting
              conventions: 11-point font (Arial or Calibri), 1-inch margins on all sides,
              single-spaced or 1.15 line spacing. At these settings, one page accommodates
              approximately 475–550 words. Two pages therefore correspond to 950–1,100 words,
              depending on section headers and spacing.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-4">
              <p className="text-sm font-semibold text-slate-800 mb-3">Word count compliance reference:</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-blue-400 flex-shrink-0" />
                  <span className="text-slate-700"><strong>Below 900 words:</strong> Resume likely lacks required content depth. HR specialists need detailed experience entries to verify qualifications. A thin resume fails by omission.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
                  <span className="text-slate-700"><strong>950–1,050 words:</strong> Optimal range. Contains sufficient detail for qualification assessment while fitting comfortably within the two-page evaluation window.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-yellow-400 flex-shrink-0" />
                  <span className="text-slate-700"><strong>1,051–1,100 words:</strong> Caution zone. Resume is approaching the page limit. Minor formatting variations (larger font, wider margins) may cause overflow onto page three.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
                  <span className="text-slate-700"><strong>Over 1,100 words:</strong> High truncation risk. At standard formatting, content beyond 1,100 words will likely fall on page three or beyond and will not be evaluated.</span>
                </div>
              </div>
            </div>

            <p className="text-slate-700 leading-relaxed">
              These ranges assume the resume is submitted as a plain text or minimally formatted
              document. Resumes with large headers, tables, or wide line spacing will reach the
              two-page limit at lower word counts.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              What Happens If You Exceed 1,100 Words?
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Under the September 2025 OPM guidance, HR specialists are instructed to evaluate
              only the first two pages of a federal resume. This is not a soft recommendation —
              it is an evaluation policy. Content placed after page two is not reviewed during
              the initial qualification determination.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              The practical risk is severe for applicants who structure their resumes in
              chronological order with the most detail at the beginning. If total word count
              is over 1,100 words, it is likely that:
            </p>
            <ul className="space-y-3 text-slate-700 mb-4">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <span>
                  <strong>Specialized experience language</strong> from later positions falls
                  beyond page two and is not evaluated against the vacancy announcement.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <span>
                  <strong>Certifications and education</strong> listed toward the end of the
                  resume are not verified during the compliance check.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <span>
                  <strong>Time-in-grade verification</strong> may be incomplete if earlier
                  position entries are absent from the evaluated portion of the resume.
                </span>
              </li>
            </ul>
            <p className="text-slate-700 leading-relaxed">
              Applicants with genuine qualifications receive Ineligible ratings not because they
              lack experience, but because that experience was documented outside the evaluated
              window. This is a structural failure, not a qualification failure.
            </p>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Why Word Count Alone Is Not Enough
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              A resume within the 950–1,050 word range is not automatically compliant. Word count
              is a necessary condition, not a sufficient one. HR specialists verify multiple
              data fields beyond length, and a correctly-sized resume can still receive an
              Ineligible rating if required elements are absent.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              The most common compliance failures on properly-sized resumes include:
            </p>
            <ul className="space-y-2 text-slate-700 mb-5">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                <span>Missing month/year employment dates for one or more positions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                <span>Hours per week not specified for each role</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                <span>No explicit specialized experience language drawn from the vacancy announcement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                <span>Keyword alignment below the threshold required by the occupational series</span>
              </li>
            </ul>
            <p className="text-slate-700 leading-relaxed">
              For a complete breakdown of all mandatory elements and formatting standards, see
              the{' '}
              <Link
                href="/guides/usajobs-resume-requirements"
                className="text-blue-600 hover:underline"
              >
                USAJOBS resume requirements guide
              </Link>
              .
            </p>
          </section>

          {/* Strong CTA */}
          <section className="my-12">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-8 text-center">
              <h3 className="text-xl font-bold text-white mb-3">
                Word Count Is One Signal. Compliance Is the Goal.
              </h3>
              <p className="text-slate-300 mb-6 max-w-md mx-auto">
                Run a full structural analysis — required fields, keyword alignment,
                specialized experience coverage, and compliance score.
              </p>
              <Link
                href="/"
                className="inline-block bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Run Full Compliance Analysis
              </Link>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-5">
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  How many words should a federal resume be?
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  The optimal range under the September 2025 OPM 2-page rule is 950–1,050 words
                  at standard formatting. Resumes below 900 words typically lack required content
                  depth. Resumes exceeding 1,100 words risk truncation during HR evaluation.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-5">
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  What is the federal resume word limit in 2025?
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  OPM specifies a 2-page limit, not an exact word count. At standard formatting,
                  1,100 words is the practical ceiling before content overflows onto page three.
                  Content beyond page two is not evaluated by HR specialists under current policy.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-5">
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  What happens if my federal resume exceeds 1,100 words?
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Resumes exceeding 1,100 words at standard formatting likely extend beyond two
                  pages. Under the OPM September 2025 evaluation policy, HR specialists only
                  review the first two pages. Qualification language placed after the two-page
                  threshold will not be considered in the eligibility determination.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-5">
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  Does word count alone determine federal resume compliance?
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  No. Word count is a necessary condition, not a sufficient one. A resume within
                  the 950–1,050 word range may still receive an Ineligible rating if it is missing
                  required data fields or lacks specialized experience language matching the
                  vacancy announcement.
                </p>
              </div>
            </div>
          </section>

          {/* Internal links */}
          <section className="border-t border-slate-200 pt-6 mb-8">
            <p className="text-sm text-slate-500 mb-3">Related Resources:</p>
            <ul className="text-sm space-y-1">
              <li>
                <Link href="/guides/usajobs-resume-requirements" className="text-blue-600 hover:underline">
                  USAJOBS Resume Requirements — Full Compliance Guide
                </Link>
              </li>
              <li>
                <Link href="/federal-resume-2-page-rule" className="text-blue-600 hover:underline">
                  Federal Resume 2-Page Rule (OPM September 2025)
                </Link>
              </li>
              <li>
                <Link href="/blog/federal-resume-2-page-limit-2025" className="text-blue-600 hover:underline">
                  OPM 2-Page Federal Resume Rule — Detailed Breakdown
                </Link>
              </li>
              <li>
                <Link href="/" className="text-blue-600 hover:underline">
                  Free Federal Resume Compliance Check
                </Link>
              </li>
            </ul>
          </section>
        </article>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-8 mt-4">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-between mb-4">
              <Link href="/" className="font-bold text-white tracking-tight">
                Resume<span className="text-blue-400">Gov</span>
              </Link>
              <div className="flex items-center gap-4 text-sm">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-800">
              <p className="text-xs text-slate-500 text-center">
                ResumeGov is an independent compliance tool and is not affiliated with USAJOBS or
                the U.S. Office of Personnel Management (OPM).
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

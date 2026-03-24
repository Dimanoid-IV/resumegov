import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Federal Resume 2-Page Rule (2025) — OPM Word Count & USAJOBS Requirements',
  description: 'Learn how the September 27, 2025 OPM 2-page federal resume rule affects USAJOBS applications. Word count limits, compliance requirements, and how to avoid ineligible ratings.',
  keywords: [
    'federal resume 2 page rule',
    'OPM 2 page resume rule',
    'federal resume word count 2025',
    'USAJOBS resume length requirement',
    'how long should a federal resume be',
    'OPM resume guidelines',
    'federal resume format',
  ],
  authors: [{ name: 'ResumeGov Editorial Team' }],
  openGraph: {
    title: 'Federal Resume 2-Page Rule (2025) — OPM Word Count & USAJOBS Requirements',
    description: 'Learn how the September 27, 2025 OPM 2-page federal resume rule affects USAJOBS applications. Word count limits and compliance requirements.',
    type: 'article',
    url: 'https://resumegov.com/federal-resume-2-page-rule',
    images: [
      {
        url: '/og-federal-resume-rule.jpg',
        width: 1200,
        height: 630,
        alt: 'Federal Resume 2-Page Rule Guide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Federal Resume 2-Page Rule (2025)',
    description: 'OPM word count and USAJOBS requirements explained.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://resumegov.com/federal-resume-2-page-rule',
  },
};

// JSON-LD structured data
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Federal Resume 2-Page Rule (Effective September 27, 2025)',
  description: 'Comprehensive guide to the OPM 2-page federal resume rule, word count requirements, and USAJOBS compliance standards.',
  author: {
    '@type': 'Organization',
    name: 'ResumeGov Editorial Team',
  },
  publisher: {
    '@type': 'Organization',
    name: 'ResumeGov',
    logo: {
      '@type': 'ImageObject',
      url: 'https://resumegov.com/logo.png',
    },
  },
  datePublished: '2025-03-24',
  dateModified: '2025-03-24',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://resumegov.com/federal-resume-2-page-rule',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'When did the OPM 2-page resume rule take effect?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The OPM 2-page federal resume rule took effect on September 27, 2025. HR specialists are instructed to evaluate only the first two pages of federal resumes submitted through USAJOBS.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the maximum word count for a federal resume?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'While OPM specifies a 2-page limit rather than a specific word count, standard formatting results in approximately 950–1,050 words. The safe range is 900–1,100 words, with 1,100 words being the hard ceiling to avoid truncation.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I submit more than two pages to USAJOBS?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, USAJOBS allows uploads exceeding two pages. However, under the September 2025 rule, HR specialists are instructed to evaluate only the first two pages. Content beyond page two will not be considered in qualification determinations.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if my resume exceeds 1,100 words?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Resumes exceeding 1,100 words risk being truncated during HR review. Critical qualification language may fall beyond the evaluated portion, resulting in "Ineligible" ratings even for qualified applicants.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does OPM require exactly 1,000 words?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. OPM does not specify an exact word count. The requirement is a 2-page limit. The 950–1,050 word range is derived from standard formatting conventions (11-point font, 1-inch margins, single-spaced).',
      },
    },
  ],
};

export default function FederalResume2PageRulePage() {
  return (
    <>
      {/* JSON-LD Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
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

        {/* Main Content */}
        <article className="max-w-3xl mx-auto px-6 py-12">
          {/* Header */}
          <header className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 border border-blue-200 bg-blue-50 rounded px-2.5 py-1 text-xs font-mono text-blue-700">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Updated March 2025
              </span>
              <span className="text-xs text-slate-500">
                8 min read
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-4">
              Federal Resume 2-Page Rule (Effective September 27, 2025)
            </h1>
            
            <p className="text-lg text-slate-600 leading-relaxed">
              Understanding the new OPM guideline that requires HR specialists to evaluate only the first two pages of federal resumes—and why qualified applicants are receiving "Ineligible" ratings as a result.
            </p>
          </header>

          {/* Intro */}
          <section className="prose prose-slate max-w-none mb-12">
            <p className="text-slate-700 leading-relaxed">
              Effective September 27, 2025, the U.S. Office of Personnel Management (OPM) implemented a revised evaluation standard for federal resumes submitted through USAJOBS. Under this rule, human resources specialists are instructed to assess only the first two pages of a resume when determining qualification eligibility.
            </p>
            <p className="text-slate-700 leading-relaxed">
              This change has significant implications for applicants. Resumes that exceed the 2-page limit risk having critical qualification language excluded from review, resulting in "Ineligible" ratings—even when the applicant possesses the required specialized experience.
            </p>
          </section>

          {/* Section 1 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Did OPM Implement a 2-Page Federal Resume Limit?
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Yes. On September 27, 2025, OPM issued guidance directing HR specialists to evaluate only the first two pages of federal resumes submitted through USAJOBS. This policy applies to all competitive service announcements and excepted service positions that require resume-based qualification assessments.
            </p>
            <p className="text-slate-700 leading-relaxed">
              The practical effect is straightforward: content beyond page two will not be considered in the initial qualification determination. While applicants may still upload longer resumes, any specialized experience, certifications, or achievements listed after the two-page threshold will be invisible to HR evaluators.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              What Is the Correct Word Count for a 2-Page Federal Resume?
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              OPM specifies a page count (2 pages) rather than a specific word count. However, using standard formatting conventions—11-point font, 1-inch margins, single-spaced—the following word count ranges apply:
            </p>
            
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-4">
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-semibold">•</span>
                  <span><strong>Below 900 words:</strong> Too thin; likely missing required detail</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-semibold">•</span>
                  <span><strong>950–1,050 words:</strong> Optimal range; fits comfortably within 2 pages</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-semibold">•</span>
                  <span><strong>1,051–1,100 words:</strong> Caution zone; may approach page limit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-semibold">•</span>
                  <span><strong>1,100+ words:</strong> High truncation risk; likely exceeds 2 pages</span>
                </li>
              </ul>
            </div>

            <p className="text-slate-700 leading-relaxed">
              The 900-word minimum serves as a floor to ensure adequate detail for qualification assessment. The 1,100-word hard ceiling prevents truncation during HR review.
            </p>
          </section>

          {/* CTA Block */}
          <section className="my-12">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-center">
              <h3 className="text-xl font-bold text-white mb-3">
                Check Your Federal Resume Compliance — Free
              </h3>
              <p className="text-blue-100 mb-5">
                Get your compatibility score and verify 2-page rule compliance in under 60 seconds.
              </p>
              <Link 
                href="/"
                className="inline-block bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Get My Compliance Score — Free
              </Link>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Why Qualified Applicants Are Receiving "Ineligible" Ratings
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Under the 2-page rule, several common issues result in automatic "Ineligible" ratings despite applicants possessing legitimate qualifications:
            </p>
            
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
              <li><strong>Missing qualification language:</strong> Specialized experience statements from the vacancy announcement do not appear within the first two pages.</li>
              <li><strong>Resume truncation:</strong> Critical achievements or certifications fall beyond page two and are not evaluated.</li>
              <li><strong>Missing month/year dates:</strong> Employment history lacks specific start/end dates, preventing time-in-grade verification.</li>
              <li><strong>Missing hours per week:</strong> Failure to include "hours per week" for each position triggers automatic rejection under OPM formatting requirements.</li>
              <li><strong>Unverifiable time-in-grade:</strong> GS-level promotion eligibility cannot be confirmed without complete employment chronology.</li>
            </ul>

            <p className="text-slate-700 leading-relaxed">
              These are structural failures, not qualification failures. Applicants possess the required experience but fail to present it within the constrained evaluation window.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              What Must Be Included in a Compliant Federal Resume
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              A federally compliant resume must include the following elements within the first two pages:
            </p>
            
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Job title for each position held</li>
              <li>Employer name (agency, department, or company)</li>
              <li>Start and end dates (month/year format required)</li>
              <li>Hours per week for each position</li>
              <li>GS level and series (if current or former federal employee)</li>
              <li>Specialized experience language matching the vacancy announcement</li>
              <li>Relevant certifications, training, or credentials</li>
              <li>Supervisor name and contact information (optional but recommended)</li>
            </ul>

            <p className="text-slate-700 leading-relaxed mt-4">
              Omission of any mandatory element—particularly dates, hours per week, or specialized experience language—can result in immediate disqualification regardless of applicant qualifications.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              How HR Specialists Evaluate Federal Resumes
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              HR specialists use a structured checklist approach when evaluating federal resumes. The process follows these steps:
            </p>
            
            <ol className="list-decimal pl-6 space-y-2 text-slate-700">
              <li><strong>Mandatory element check:</strong> Verify presence of job titles, employers, dates, and hours per week.</li>
              <li><strong>Time-in-grade verification:</strong> Confirm applicant meets GS-level promotion eligibility (if applicable).</li>
              <li><strong>Specialized experience mapping:</strong> Match resume content against Required Specialized Experience statements in the vacancy announcement.</li>
              <li><strong>Keyword alignment:</strong> Identify presence of occupation-specific terminology and competency language.</li>
              <li><strong>Qualification determination:</strong> Issue "Eligible" or "Ineligible" rating before forwarding to hiring manager.</li>
            </ol>

            <p className="text-slate-700 leading-relaxed mt-4">
              This evaluation occurs before the hiring manager ever sees the resume. An "Ineligible" rating at this stage ends the application regardless of actual qualifications.
            </p>
          </section>

          {/* Section 6 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              How ResumeGov Enforces the 2-Page Rule
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              ResumeGov uses a deterministic, rule-based validation engine to ensure federal resume compliance:
            </p>
            
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li><strong>4-component scoring model:</strong> Keyword Alignment (40%), Specialized Experience Coverage (30%), Federal Compliance (20%), Achievement Density (10%).</li>
              <li><strong>Deterministic formula:</strong> AI cannot invent scores; all scoring derives from structured validation rules.</li>
              <li><strong>Two-pass compression engine:</strong> Automatically reduces resumes exceeding 1,100 words while preserving required qualification language.</li>
              <li><strong>Protected qualification language:</strong> Specialized experience statements are flagged and cannot be removed during compression.</li>
              <li><strong>Coverage percentage tracking:</strong> Measures what percentage of Required Specialized Experience statements are explicitly addressed in the resume.</li>
            </ul>

            <p className="text-slate-700 leading-relaxed mt-4">
              This structured approach eliminates guesswork and ensures every resume meets the September 2025 standard before submission.
            </p>
          </section>

          {/* FAQs */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  When did the OPM 2-page resume rule take effect?
                </h3>
                <p className="text-slate-700">
                  The OPM 2-page federal resume rule took effect on September 27, 2025. HR specialists are instructed to evaluate only the first two pages of federal resumes submitted through USAJOBS.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  What is the maximum word count for a federal resume?
                </h3>
                <p className="text-slate-700">
                  While OPM specifies a 2-page limit rather than a specific word count, standard formatting results in approximately 950–1,050 words. The safe range is 900–1,100 words, with 1,100 words being the hard ceiling to avoid truncation.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Can I submit more than two pages to USAJOBS?
                </h3>
                <p className="text-slate-700">
                  Yes, USAJOBS allows uploads exceeding two pages. However, under the September 2025 rule, HR specialists are instructed to evaluate only the first two pages. Content beyond page two will not be considered in qualification determinations.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  What happens if my resume exceeds 1,100 words?
                </h3>
                <p className="text-slate-700">
                  Resumes exceeding 1,100 words risk being truncated during HR review. Critical qualification language may fall beyond the evaluated portion, resulting in "Ineligible" ratings even for qualified applicants.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Does OPM require exactly 1,000 words?
                </h3>
                <p className="text-slate-700">
                  No. OPM does not specify an exact word count. The requirement is a 2-page limit. The 950–1,050 word range is derived from standard formatting conventions (11-point font, 1-inch margins, single-spaced).
                </p>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="mb-12">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <p className="text-slate-700 text-center mb-4">
                Before submitting your next USAJOBS application, verify your compliance score.
              </p>
              <div className="text-center">
                <Link 
                  href="/"
                  className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get My Compliance Score — Free
                </Link>
              </div>
            </div>
          </section>

          {/* Internal Links */}
          <section className="border-t border-slate-200 pt-6">
            <p className="text-sm text-slate-500 mb-3">Related Resources:</p>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>
                <Link href="/" className="text-blue-600 hover:underline">
                  Free Federal Resume Compliance Check
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-blue-600 hover:underline">
                  Pricing Plans — Analyst & Professional Tiers
                </Link>
              </li>
            </ul>
          </section>
        </article>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-8 mt-12">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-between mb-4">
              <Link href="/" className="font-bold text-white tracking-tight">
                Resume<span className="text-blue-400">Gov</span>
              </Link>
              <div className="flex items-center gap-4 text-sm">
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </div>
            </div>
            <div className="max-w-6xl mx-auto px-6 pt-6 border-t border-slate-800">
              <p className="text-xs text-slate-500 text-center">
                ResumeGov is an independent compliance tool and is not affiliated with USAJOBS or the U.S. Office of Personnel Management (OPM).
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

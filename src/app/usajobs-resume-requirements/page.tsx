import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'USAJOBS Resume Requirements (2025 Guide) — OPM Format & Compliance Rules',
  description:
    'Understand official USAJOBS and OPM federal resume requirements in 2025. Required sections, formatting rules, and how to avoid ineligible ratings.',
  keywords: [
    'USAJOBS resume requirements 2025',
    'federal resume format requirements',
    'OPM resume requirements',
    'what must be included in a federal resume',
    'how to write a resume for USAJOBS',
    'federal resume sections',
    'USAJOBS application requirements',
  ],
  authors: [{ name: 'ResumeGov Editorial Team' }],
  openGraph: {
    title: 'USAJOBS Resume Requirements (2025 Guide) — OPM Format & Compliance Rules',
    description:
      'Understand official USAJOBS and OPM federal resume requirements in 2025. Required sections, formatting rules, and how to avoid ineligible ratings.',
    type: 'article',
    url: 'https://resumegov.com/usajobs-resume-requirements',
    images: [
      {
        url: '/og-usajobs-resume-requirements.jpg',
        width: 1200,
        height: 630,
        alt: 'USAJOBS Resume Requirements 2025 Guide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'USAJOBS Resume Requirements (2025 Guide)',
    description: 'OPM format rules, required sections, and compliance checklist explained.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://resumegov.com/usajobs-resume-requirements',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'USAJOBS Resume Requirements (2025 Complete Guide)',
  description:
    'Comprehensive guide to USAJOBS and OPM federal resume requirements in 2025, including required sections, formatting rules, and compliance standards.',
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
  datePublished: '2025-03-26',
  dateModified: '2025-03-26',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://resumegov.com/usajobs-resume-requirements',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Does USAJOBS require a specific resume format?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'USAJOBS does not mandate a specific template, but federal resumes must meet OPM content requirements. This includes structured work history with month/year dates, hours per week, supervisor contact, and specialized experience language. Resumes that omit these elements may result in an "Ineligible" rating during HR review.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long can a federal resume be in 2025?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'As of September 27, 2025, OPM requires HR specialists to evaluate only the first two pages of a federal resume. Using standard formatting (11-point font, 1-inch margins), this corresponds to approximately 950–1,050 words. Content beyond the two-page threshold will not be considered in qualification determinations.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if I miss required information on my federal resume?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Missing required elements—such as month/year dates, hours per week, or specialized experience language—typically results in an automatic "Ineligible" rating. HR specialists must verify specific data points before forwarding an application to the hiring manager. Structural omissions cannot be corrected after the announcement closes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is a 1-page resume acceptable for federal jobs?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A 1-page federal resume is generally too brief to include all required content. OPM evaluation criteria require detailed work history entries, specialized experience statements, and educational credentials. Most compliant federal resumes require approximately 900–1,100 words to meet minimum content requirements.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to include salary and supervisor contact on my federal resume?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Salary figures are optional but recommended, as they assist HR specialists in verifying pay band eligibility for certain positions. Supervisor name and contact information are also optional but expected by many agency HR offices. Including both reduces follow-up requests and speeds the qualification review process.',
      },
    },
  ],
};

export default function USAJOBSResumeRequirementsPage() {
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
              <span className="text-xs text-slate-500">10 min read</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-4">
              USAJOBS Resume Requirements (2025 Complete Guide)
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed">
              Federal resumes are not standard private-sector documents. They must satisfy OPM evaluation
              criteria before a hiring manager ever reviews your application. This guide covers every required
              section, formatting rule, and compliance standard for 2025.
            </p>
          </header>

          {/* Intro */}
          <section className="mb-12 text-slate-700 leading-relaxed space-y-4">
            <p>
              When you apply to a federal position through USAJOBS, your resume is first reviewed by a
              human resources specialist—not a hiring manager. That specialist applies a structured checklist
              derived from OPM qualification standards to determine whether you are "Eligible" or "Ineligible"
              before your application advances.
            </p>
            <p>
              This compliance-driven process differs fundamentally from private-sector hiring, where resumes
              are read holistically. In federal hiring, missing a single required data point—such as hours per
              week or month/year employment dates—can result in automatic disqualification regardless of your
              actual qualifications.
            </p>
          </section>

          {/* Section 1 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Are Federal Resumes Different from Private Sector Resumes?
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Yes. Federal resumes differ from private-sector resumes in both structure and purpose. Key
              distinctions include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
              <li>
                <strong>Longer format:</strong> Federal resumes are expected to contain detailed work history
                entries. Under current OPM guidelines, a compliant resume requires approximately 900–1,100 words
                to include all required elements.
              </li>
              <li>
                <strong>Structured data requirements:</strong> Every work experience entry must include specific
                fields: employer name, job title, dates of employment (month/year), hours worked per week, and
                a description of duties and accomplishments.
              </li>
              <li>
                <strong>Evaluation before the hiring manager:</strong> HR specialists assess your eligibility
                and assign a qualification rating before the resume reaches the selecting official. Failure at
                this stage ends the application.
              </li>
              <li>
                <strong>Compliance-driven review:</strong> Qualification is determined by matching your resume
                content against defined OPM criteria—not by general impression. Missing language or data
                fields produce automatic negative outcomes.
              </li>
            </ul>
            <p className="text-slate-700 leading-relaxed">
              A private-sector resume optimized for ATS parsing or recruiter skimming will not meet federal
              evaluation standards without significant restructuring.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Required Sections in a Federal Resume
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              OPM and USAJOBS specify the following content requirements for federal resumes. Omitting any
              mandatory element can trigger an "Ineligible" rating during HR review.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-6">
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span><strong>Full legal name</strong> — as it appears on government identification documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span><strong>Contact information</strong> — mailing address, phone number, and email address</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span><strong>Citizenship status</strong> — required for positions restricted to U.S. citizens</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Work experience (detailed)</strong> — including employer name, job title, location,
                    and a full description of duties and achievements for each role
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Month/year dates</strong> — start and end dates in MM/YYYY format for every
                    position; year-only dates are insufficient for time-in-grade verification
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Hours per week</strong> — required for each position; part-time experience is
                    prorated during qualification calculations
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Salary</strong> — optional but recommended; assists HR in verifying pay band
                    eligibility for certain competitive service announcements
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Supervisor name and contact</strong> — optional but expected by many agency HR
                    offices; its absence may prompt follow-up requests that delay review
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Education</strong> — institution name, degree, major, and graduation date;
                    required for positions with education-based qualification standards
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Certifications and licenses</strong> — title, issuing organization, and expiration
                    date where applicable
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Specialized experience statements</strong> — explicit language drawn from or
                    closely aligned with the "Required Specialized Experience" section of the vacancy
                    announcement
                  </span>
                </li>
              </ul>
            </div>

            <p className="text-slate-700 leading-relaxed">
              The most common cause of ineligible ratings is not inadequate qualifications—it is the failure
              to present required data in the expected format. HR specialists follow a structured checklist;
              information that is absent cannot be assumed.
            </p>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Formatting Rules for USAJOBS Resumes
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              USAJOBS does not require applicants to use a specific template. However, federal resumes must
              be formatted in a manner that supports accurate evaluation. The following conventions apply:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>
                <strong>No mandatory template:</strong> You may use any word processor or the USAJOBS
                resume builder. The content and structure matter more than the visual design.
              </li>
              <li>
                <strong>Readability required:</strong> Plain, readable formatting is expected. Dense
                paragraphs, complex layouts, or non-standard fonts can impede evaluation.
              </li>
              <li>
                <strong>Reverse chronological order:</strong> Most recent position listed first, with
                complete entries for all relevant roles.
              </li>
              <li>
                <strong>GS-level alignment:</strong> Experience entries should clearly demonstrate
                the scope and complexity appropriate to the GS level of the target position.
              </li>
              <li>
                <strong>Avoid graphics and tables:</strong> Visual elements may not render correctly
                in USAJOBS systems and can obscure required text content.
              </li>
              <li>
                <strong>Plain text preferred:</strong> Standard fonts (Times New Roman, Arial, Calibri),
                11–12 point size, 1-inch margins, and single or 1.15 line spacing ensure consistent
                rendering across government systems.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Federal Resume Word Count &amp; Page Limits
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              As of September 27, 2025, OPM requires HR specialists to evaluate only the first two pages
              of any federal resume submitted through USAJOBS. Content beyond page two is not considered
              in qualification determinations.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Using standard formatting, the two-page limit corresponds to approximately 950–1,050 words.
              Resumes below 900 words typically lack sufficient detail to satisfy all required content
              fields. Resumes exceeding 1,100 words risk truncation during evaluation.
            </p>
            <p className="text-slate-700 leading-relaxed">
              For a detailed breakdown of word count ranges, formatting standards, and truncation risks,
              see the{' '}
              <Link href="/federal-resume-2-page-rule" className="text-blue-600 hover:underline">
                OPM 2-page resume rule
              </Link>{' '}
              guide.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              How HR Specialists Evaluate Federal Resumes
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              The federal hiring process includes a structured qualification review conducted by HR
              specialists before any hiring manager involvement. Understanding this process is essential
              to structuring a compliant resume.
            </p>
            <ol className="list-decimal pl-6 space-y-3 text-slate-700">
              <li>
                <strong>Qualification determination first:</strong> The HR specialist determines whether
                you meet the minimum qualification requirements for the position before anything else
                is reviewed.
              </li>
              <li>
                <strong>Specialized experience matching:</strong> Resume content is compared against
                the "Required Specialized Experience" statements in the vacancy announcement. Language
                must be present and clearly articulated.
              </li>
              <li>
                <strong>Time-in-grade validation:</strong> For competitive service promotions, the
                specialist verifies that the applicant has spent the required amount of time at the
                preceding GS grade level.
              </li>
              <li>
                <strong>Keyword alignment:</strong> Occupation-specific terminology and competency
                language relevant to the position series are identified and assessed.
              </li>
              <li>
                <strong>Structured review process:</strong> The review follows OPM-defined procedures.
                An "Ineligible" determination at this stage removes the application from consideration
                before the hiring manager sees it.
              </li>
            </ol>
            <p className="text-slate-700 leading-relaxed mt-4">
              This process is not subjective. It is a compliance check. A resume that does not
              contain the required language and data fields will not advance, regardless of the
              applicant's actual experience.
            </p>
          </section>

          {/* Section 6 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Common Mistakes That Lead to Ineligible Ratings
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              The following errors are among the most frequent causes of ineligible ratings on
              USAJOBS applications:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>
                <strong>Missing dates:</strong> Employment entries without month/year start and end
                dates cannot be used for time-in-grade verification.
              </li>
              <li>
                <strong>Missing hours per week:</strong> HR specialists are required to prorate
                part-time experience. Without this field, experience cannot be accurately calculated.
              </li>
              <li>
                <strong>Resume exceeds 2 pages:</strong> Under the September 2025 OPM rule,
                content beyond page two is not evaluated. Critical qualification language placed
                late in a long resume will not be seen.
              </li>
              <li>
                <strong>No specialized experience language:</strong> Generic job descriptions
                that do not reflect the specific language of the vacancy announcement fail
                to demonstrate required qualifications.
              </li>
              <li>
                <strong>Copy-pasted private-sector resume:</strong> Private-sector resumes
                are not formatted to meet OPM data requirements and typically lack the
                structured fields necessary for federal evaluation.
              </li>
              <li>
                <strong>Vague achievement statements:</strong> Descriptions that lack specific
                scope, scale, or outcome do not support qualification determinations and
                reduce keyword alignment scores.
              </li>
            </ul>
          </section>

          {/* Mid-page CTA */}
          <section className="my-12">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-center">
              <h3 className="text-xl font-bold text-white mb-3">
                Check Your Resume for USAJOBS Compliance
              </h3>
              <p className="text-blue-100 mb-5">
                Verify required sections, word count, and specialized experience coverage
                before submitting your next federal application.
              </p>
              <Link
                href="/"
                className="inline-block bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Run a Free Compliance Check
              </Link>
            </div>
          </section>

          {/* Section 7 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              How ResumeGov Helps Ensure Federal Resume Compliance
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              ResumeGov is an independent compliance analysis tool designed to identify structural
              gaps in federal resumes before submission. It does not write resumes or guarantee
              outcomes, but provides a structured assessment based on OPM evaluation criteria.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>
                <strong>Structured extraction:</strong> The tool parses uploaded resumes to identify
                whether required data fields—dates, hours per week, contact information—are present
                in each work experience entry.
              </li>
              <li>
                <strong>Compliance scoring:</strong> A rule-based scoring model evaluates keyword
                alignment, specialized experience coverage, federal compliance markers, and
                achievement density across a 100-point scale.
              </li>
              <li>
                <strong>Word count enforcement:</strong> Resumes are assessed against the 900–1,100
                word target range. Resumes exceeding 1,100 words receive a flag indicating truncation
                risk under the current OPM page limit.
              </li>
              <li>
                <strong>Semantic coverage analysis:</strong> The tool measures the percentage of
                Required Specialized Experience statements from the vacancy announcement that are
                explicitly addressed in the resume content.
              </li>
            </ul>
          </section>

          {/* FAQ Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Does USAJOBS require a specific resume format?
                </h3>
                <p className="text-slate-700">
                  USAJOBS does not mandate a specific template, but federal resumes must meet OPM
                  content requirements. This includes structured work history with month/year dates,
                  hours per week, supervisor contact, and specialized experience language. Resumes
                  that omit these elements may result in an "Ineligible" rating during HR review.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  How long can a federal resume be in 2025?
                </h3>
                <p className="text-slate-700">
                  As of September 27, 2025, OPM requires HR specialists to evaluate only the first
                  two pages of a federal resume. Using standard formatting (11-point font, 1-inch
                  margins), this corresponds to approximately 950–1,050 words. Content beyond the
                  two-page threshold will not be considered in qualification determinations.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  What happens if I miss required information on my federal resume?
                </h3>
                <p className="text-slate-700">
                  Missing required elements—such as month/year dates, hours per week, or specialized
                  experience language—typically results in an automatic "Ineligible" rating. HR
                  specialists must verify specific data points before forwarding an application to
                  the hiring manager. Structural omissions cannot be corrected after the announcement
                  closes.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Is a 1-page resume acceptable for federal jobs?
                </h3>
                <p className="text-slate-700">
                  A 1-page federal resume is generally too brief to include all required content.
                  OPM evaluation criteria require detailed work history entries, specialized
                  experience statements, and educational credentials. Most compliant federal
                  resumes require approximately 900–1,100 words to meet minimum content requirements.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Do I need to include salary and supervisor contact on my federal resume?
                </h3>
                <p className="text-slate-700">
                  Salary figures are optional but recommended, as they assist HR specialists in
                  verifying pay band eligibility for certain positions. Supervisor name and contact
                  information are also optional but expected by many agency HR offices. Including
                  both reduces follow-up requests and speeds the qualification review process.
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
                <Link href="/federal-resume-2-page-rule" className="text-blue-600 hover:underline">
                  OPM 2-Page Resume Rule — Word Count &amp; Compliance Guide
                </Link>
              </li>
              <li>
                <Link href="/" className="text-blue-600 hover:underline">
                  Free Federal Resume Compliance Check
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-blue-600 hover:underline">
                  Pricing Plans — Analyst &amp; Professional Tiers
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
                ResumeGov is an independent compliance tool and is not affiliated with USAJOBS or the
                U.S. Office of Personnel Management (OPM).
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'USAJOBS Resume Requirements (2025 Guide) — OPM Compliance Rules',
  description:
    'Understand official USAJOBS and OPM federal resume requirements in 2025. Required sections, formatting rules, and how to avoid ineligible ratings.',
  keywords: [
    'usajobs resume requirements',
    'federal resume requirements 2025',
    'opm resume requirements',
    'what must be included in a federal resume',
    'how to write a resume for usajobs',
    'federal resume compliance',
    'federal resume format 2025',
  ],
  authors: [{ name: 'ResumeGov Editorial Team' }],
  openGraph: {
    title: 'USAJOBS Resume Requirements (2025 Guide) — OPM Compliance Rules',
    description:
      'Understand official USAJOBS and OPM federal resume requirements in 2025. Required sections, formatting rules, and how to avoid ineligible ratings.',
    type: 'article',
    url: 'https://resumegov.com/guides/usajobs-resume-requirements',
    images: [
      {
        url: '/og-usajobs-resume-requirements-guide.jpg',
        width: 1200,
        height: 630,
        alt: 'USAJOBS Resume Requirements 2025 Compliance Guide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'USAJOBS Resume Requirements (2025 Guide)',
    description: 'Required sections, OPM formatting rules, and how to avoid ineligible ratings.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://resumegov.com/guides/usajobs-resume-requirements',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'USAJOBS Resume Requirements (2025 Complete Guide)',
  description:
    'A comprehensive compliance guide covering all USAJOBS and OPM federal resume requirements for 2025, including mandatory elements, formatting rules, and qualification evaluation criteria.',
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
    '@id': 'https://resumegov.com/guides/usajobs-resume-requirements',
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
        text: 'USAJOBS does not mandate a specific resume template. However, federal resumes must include all OPM-required data fields: month/year employment dates, hours worked per week, supervisor contact information, and specialized experience narratives. Resumes missing these elements receive an automatic Ineligible rating regardless of applicant qualifications.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if I omit required information from my federal resume?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Omitting mandatory elements — such as employment dates, hours per week, or specialized experience language — results in an Ineligible rating during the HR qualification review. This determination is made before the hiring manager sees the application. The application is removed from consideration and cannot be corrected after the vacancy announcement closes.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long should a federal resume be in 2025?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'As of September 27, 2025, OPM requires HR specialists to evaluate only the first two pages of a federal resume. Using standard formatting conventions (11-point font, 1-inch margins), this corresponds to approximately 950–1,050 words. Content beyond two pages is not considered in qualification determinations.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is a one-page resume acceptable for a federal job application?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A one-page federal resume is generally insufficient. OPM requires detailed work history entries with structured data fields for each position, along with specialized experience narratives and educational credentials. Most compliant federal resumes require 900–1,100 words to satisfy minimum content requirements across all mandatory sections.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to include salary and supervisor contact on a federal resume?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Salary information is optional but recommended, as it supports pay band eligibility verification for certain competitive service positions. Supervisor name and contact information are also optional but expected by many federal HR offices. Including both fields reduces the likelihood of follow-up requests that delay the qualification review.',
      },
    },
  ],
};

export default function USAJOBSResumeRequirementsGuidePage() {
  return (
    <>
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

        <article className="max-w-3xl mx-auto px-6 py-12">
          {/* Header */}
          <header className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 border border-blue-200 bg-blue-50 rounded px-2.5 py-1 text-xs font-mono text-blue-700">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Updated March 2025
              </span>
              <span className="text-xs text-slate-500">12 min read</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-4">
              USAJOBS Resume Requirements (2025 Complete Guide)
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed">
              Federal resumes are compliance documents, not marketing materials. Before a hiring manager
              reviews your application, a human resources specialist applies a structured OPM checklist
              to determine whether you are eligible. Understanding what that checklist requires is the
              prerequisite for any successful federal application.
            </p>
          </header>

          {/* Intro */}
          <section className="mb-12 space-y-4 text-slate-700 leading-relaxed">
            <p>
              When you submit a resume through USAJOBS, the first person to evaluate it is not a hiring
              manager — it is an HR specialist working from OPM qualification standards. That specialist
              is looking for specific data fields, structured experience narratives, and compliance
              markers. If any required element is absent, the application receives an Ineligible rating
              and is removed from consideration before the selecting official sees it.
            </p>
            <p>
              This guide covers every requirement, in the order they are typically evaluated, based on
              current OPM guidance and federal hiring practice as of 2025.
            </p>
          </section>

          {/* Section 1 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Are Federal Resumes Different from Private Sector Resumes?
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Yes. The structural differences are significant and consequential. Federal resumes
              operate within a compliance framework that has no equivalent in private-sector hiring.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              In private-sector recruiting, a resume is reviewed holistically — a recruiter reads it
              and forms an impression. In federal hiring, an HR specialist applies a defined qualification
              standard developed by OPM. That standard specifies what information must be present, in
              what form, and at what level of detail.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-4">
              <p className="text-sm font-semibold text-slate-700 mb-3">The federal HR screening checklist includes:</p>
              <ul className="space-y-2 text-slate-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">—</span>
                  <span>Verification that all mandatory data fields are present and complete</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">—</span>
                  <span>Confirmation that specialized experience language matches the vacancy announcement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">—</span>
                  <span>Time-in-grade validation for competitive service promotion eligibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">—</span>
                  <span>Keyword alignment with the occupational series requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">—</span>
                  <span>Qualification determination issued before any hiring manager involvement</span>
                </li>
              </ul>
            </div>
            <p className="text-slate-700 leading-relaxed">
              A resume that passes this review is rated Eligible. A resume that fails on any checklist
              item is rated Ineligible. There is no middle ground and no opportunity to supplement
              the submission after the announcement closes.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Mandatory Elements Required by OPM
            </h2>
            <p className="text-slate-700 leading-relaxed mb-5">
              The following elements are required in a compliant federal resume. Missing any mandatory
              field typically triggers an Ineligible rating during HR qualification review.
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-slate-300 pl-4">
                <p className="font-semibold text-slate-900 text-sm">Full Legal Name</p>
                <p className="text-slate-600 text-sm mt-1">
                  Your name as it appears on government-issued identification. Required on every
                  page of the resume if submitted as a multi-page document.
                </p>
              </div>
              <div className="border-l-4 border-slate-300 pl-4">
                <p className="font-semibold text-slate-900 text-sm">Contact Information</p>
                <p className="text-slate-600 text-sm mt-1">
                  Mailing address, phone number, and email address. All must be current and
                  functional at the time of submission.
                </p>
              </div>
              <div className="border-l-4 border-slate-300 pl-4">
                <p className="font-semibold text-slate-900 text-sm">Citizenship Status</p>
                <p className="text-slate-600 text-sm mt-1">
                  Required for positions restricted to U.S. citizens. Some positions accept
                  non-citizens; the vacancy announcement specifies eligibility.
                </p>
              </div>
              <div className="border-l-4 border-slate-300 pl-4">
                <p className="font-semibold text-slate-900 text-sm">Work Experience (Detailed)</p>
                <p className="text-slate-600 text-sm mt-1">
                  Each position must include employer name, job title, location, and a full
                  narrative description of duties, responsibilities, and accomplishments. Abbreviated
                  entries are insufficient for qualification determination.
                </p>
              </div>
              <div className="border-l-4 border-red-400 pl-4 bg-red-50 py-2 pr-3 rounded-r">
                <p className="font-semibold text-slate-900 text-sm">Month/Year Employment Dates</p>
                <p className="text-slate-600 text-sm mt-1">
                  Start and end dates in MM/YYYY format are required for every position. Year-only
                  dates are insufficient. Missing or imprecise dates prevent time-in-grade verification
                  and are among the most common causes of Ineligible ratings.
                </p>
              </div>
              <div className="border-l-4 border-red-400 pl-4 bg-red-50 py-2 pr-3 rounded-r">
                <p className="font-semibold text-slate-900 text-sm">Hours Per Week</p>
                <p className="text-slate-600 text-sm mt-1">
                  Required for each position. Part-time experience is prorated during OPM
                  qualification calculations. Omitting this field prevents accurate experience
                  verification and results in automatic disqualification.
                </p>
              </div>
              <div className="border-l-4 border-slate-300 pl-4">
                <p className="font-semibold text-slate-900 text-sm">Salary (Recommended)</p>
                <p className="text-slate-600 text-sm mt-1">
                  Optional but recommended. Supports pay band eligibility verification for
                  certain competitive service announcements. Its absence may prompt HR follow-up
                  that delays the review process.
                </p>
              </div>
              <div className="border-l-4 border-slate-300 pl-4">
                <p className="font-semibold text-slate-900 text-sm">Supervisor Name and Contact</p>
                <p className="text-slate-600 text-sm mt-1">
                  Optional but expected by many agency HR offices. Including supervisor contact
                  information reduces follow-up requests and supports the verification process.
                </p>
              </div>
              <div className="border-l-4 border-slate-300 pl-4">
                <p className="font-semibold text-slate-900 text-sm">Education</p>
                <p className="text-slate-600 text-sm mt-1">
                  Institution name, degree type, major field of study, and graduation date are
                  required for positions with education-based qualification standards. Partial
                  entries are insufficient for verification.
                </p>
              </div>
              <div className="border-l-4 border-slate-300 pl-4">
                <p className="font-semibold text-slate-900 text-sm">Certifications and Licenses</p>
                <p className="text-slate-600 text-sm mt-1">
                  Title, issuing organization, and expiration date where applicable. Required
                  certifications listed in the vacancy announcement must appear explicitly.
                </p>
              </div>
              <div className="border-l-4 border-blue-400 pl-4 bg-blue-50 py-2 pr-3 rounded-r">
                <p className="font-semibold text-slate-900 text-sm">Specialized Experience Narrative</p>
                <p className="text-slate-600 text-sm mt-1">
                  The most consequential section for qualification determination. Your experience
                  entries must contain explicit language that maps to the Required Specialized
                  Experience statements in the vacancy announcement. Generic descriptions that do
                  not reflect the specific terminology of the posting fail to demonstrate required
                  qualifications, regardless of actual experience held.
                </p>
              </div>
            </div>

            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-900">
                <strong>Why missing elements cause Ineligible ratings:</strong> HR specialists apply
                OPM qualification standards as a structured checklist. Each required field must be
                present and verifiable. A field that is absent cannot be assumed or inferred. The
                review is not a holistic reading — it is a data verification process. One missing
                field is sufficient to remove an application from consideration.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Federal Resume Formatting Requirements
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              USAJOBS does not enforce a specific template. However, federal resumes must be formatted
              in a manner that supports accurate, efficient evaluation by HR specialists working
              under time constraints.
            </p>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                <span>
                  <strong>Reverse chronological order:</strong> Most recent position listed first.
                  All relevant positions must appear with complete structured entries. Gaps in
                  employment history should be accounted for.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                <span>
                  <strong>Plain formatting:</strong> Standard fonts (Arial, Calibri, Times New Roman)
                  at 11–12 point size with 1-inch margins are strongly preferred. Complex formatting
                  reduces readability in government document management systems.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                <span>
                  <strong>No graphics or tables:</strong> Visual elements may not render correctly
                  when resumes are processed through USAJOBS and agency HR systems. All content
                  must be in plain text format.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                <span>
                  <strong>Clear GS-level alignment:</strong> Each work experience entry should
                  demonstrate scope, complexity, and responsibility at a level consistent with
                  the target GS grade. Vague or junior-sounding descriptions undermine
                  qualification determination even when experience is genuinely relevant.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                <span>
                  <strong>Structured experience blocks:</strong> Each position entry should follow
                  a consistent structure: job title, employer, location, dates, hours per week,
                  salary (optional), supervisor contact (optional), followed by a detailed narrative
                  of duties, responsibilities, and accomplishments.
                </span>
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Federal Resume Length Rules (September 2025 Update)
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Effective September 27, 2025, OPM issued guidance directing HR specialists to evaluate
              only the first two pages of any federal resume submitted through USAJOBS. Content
              beyond the two-page threshold is not considered in qualification determinations.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              This policy has significant practical implications. A resume that contains all required
              elements but places critical qualification language on page three will receive an
              Ineligible rating. The HR specialist is not permitted to read beyond page two under
              the current evaluation standard.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Using standard formatting conventions, the two-page limit corresponds to approximately
              950–1,050 words. Resumes below 900 words typically lack the content depth required to
              satisfy all mandatory fields. Resumes exceeding 1,100 words risk having critical content
              truncated from the evaluation window.
            </p>
            <p className="text-slate-700 leading-relaxed">
              For a detailed breakdown of word count ranges, formatting standards, and compliance
              thresholds, see the complete{' '}
              <Link
                href="/blog/federal-resume-2-page-limit-2025"
                className="text-blue-600 hover:underline"
              >
                OPM 2-page federal resume rule
              </Link>{' '}
              guide.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              How HR Specialists Determine Qualification
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              The qualification determination process follows a structured sequence. Understanding
              each stage helps applicants structure their resumes to pass each checkpoint.
            </p>
            <ol className="space-y-4 text-slate-700">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center mt-0.5">1</span>
                <div>
                  <p className="font-semibold text-slate-900">Keyword extraction</p>
                  <p className="text-sm text-slate-600 mt-1">
                    The specialist identifies occupation-specific terminology and competency language
                    in the resume. Terms must be present explicitly — implied or paraphrased
                    experience does not satisfy this requirement.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center mt-0.5">2</span>
                <div>
                  <p className="font-semibold text-slate-900">Specialized experience threshold</p>
                  <p className="text-sm text-slate-600 mt-1">
                    The resume must demonstrate the Required Specialized Experience stated in the
                    vacancy announcement. This is typically one year of experience at or equivalent
                    to the next lower grade level. The language in the resume must explicitly map
                    to the vacancy announcement language.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center mt-0.5">3</span>
                <div>
                  <p className="font-semibold text-slate-900">Time-in-grade validation</p>
                  <p className="text-sm text-slate-600 mt-1">
                    For competitive service promotions, the specialist verifies that the applicant
                    has served the required time at the immediately preceding GS grade level.
                    This requires complete month/year employment dates and hours per week for
                    each relevant position.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center mt-0.5">4</span>
                <div>
                  <p className="font-semibold text-slate-900">Compliance checks</p>
                  <p className="text-sm text-slate-600 mt-1">
                    Mandatory data fields are verified: employment dates, hours per week, supervisor
                    information (where required), and educational credentials. Each field is a
                    binary check — present or absent.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center mt-0.5">5</span>
                <div>
                  <p className="font-semibold text-slate-900">Achievement differentiation</p>
                  <p className="text-sm text-slate-600 mt-1">
                    Among applications that pass all compliance checks, achievement statements
                    with specific scope, scale, and outcome language differentiate candidates
                    for best-qualified determinations. Vague descriptions that pass compliance
                    may still result in lower category placement.
                  </p>
                </div>
              </li>
            </ol>
            <p className="text-slate-700 leading-relaxed mt-4">
              An Ineligible determination at any stage removes the application before the hiring
              manager is involved. The selecting official never sees applications that fail HR
              qualification review.
            </p>
          </section>

          {/* Mid-page CTA */}
          <section className="my-12">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-center">
              <h3 className="text-xl font-bold text-white mb-3">
                Check Your Federal Resume Before You Apply
              </h3>
              <p className="text-blue-100 mb-5 max-w-md mx-auto">
                Verify required sections, word count compliance, and specialized experience
                coverage before your next USAJOBS submission.
              </p>
              <Link
                href="/"
                className="inline-block bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Analyze My Resume — Free
              </Link>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Common Mistakes That Trigger Ineligible Ratings
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              The following errors account for the majority of Ineligible ratings on USAJOBS
              applications. Each is a structural failure, not a qualification failure.
            </p>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <span>
                  <strong>Missing or incomplete employment dates.</strong> Year-only entries (e.g.,
                  "2019–2022") cannot be used to verify time-in-grade. Month and year are required
                  for every position.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <span>
                  <strong>Absent hours per week.</strong> Without this field, HR cannot accurately
                  prorate part-time experience or verify full-time equivalency. This is a mandatory
                  field for every work history entry.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <span>
                  <strong>Resume exceeding two pages.</strong> Under the September 2025 OPM rule,
                  HR specialists evaluate only the first two pages. Qualification language placed
                  on page three or beyond is not reviewed.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <span>
                  <strong>No specialized experience language.</strong> Generic descriptions of
                  duties do not demonstrate compliance with Required Specialized Experience
                  criteria. The resume must contain terminology that explicitly reflects the
                  vacancy announcement language.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <span>
                  <strong>Private-sector resume submitted without adaptation.</strong> Private-sector
                  resumes are structured for ATS scanning and recruiter skimming. They do not contain
                  the structured data fields required by OPM evaluation standards and will fail
                  compliance review.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <span>
                  <strong>Vague achievement statements.</strong> Descriptions without specific scope,
                  scale, or measurable outcome do not support qualification determination and reduce
                  keyword alignment scores during best-qualified ranking.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <span>
                  <strong>Education section incomplete.</strong> Positions requiring specific degrees
                  or coursework necessitate complete education entries including institution name,
                  degree type, major, and graduation date. Partial entries cannot be verified.
                </span>
              </li>
            </ul>
          </section>

          {/* FAQ Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-5">
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  Does USAJOBS require a specific resume format?
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  USAJOBS does not mandate a specific resume template. However, federal resumes must
                  include all OPM-required data fields: month/year employment dates, hours worked per
                  week, supervisor contact information, and specialized experience narratives. Resumes
                  missing these elements receive an automatic Ineligible rating regardless of applicant
                  qualifications.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-5">
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  What happens if I omit required information from my federal resume?
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Omitting mandatory elements results in an Ineligible rating during the HR
                  qualification review. This determination is made before the hiring manager sees the
                  application. The application is removed from consideration and cannot be corrected
                  after the vacancy announcement closes.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-5">
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  How long should a federal resume be in 2025?
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  As of September 27, 2025, OPM requires HR specialists to evaluate only the first
                  two pages of a federal resume. Using standard formatting conventions (11-point font,
                  1-inch margins), this corresponds to approximately 950–1,050 words. Content beyond
                  two pages is not considered in qualification determinations.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-5">
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  Is a one-page resume acceptable for a federal job application?
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  A one-page federal resume is generally insufficient. OPM requires detailed work
                  history entries with structured data fields for each position, along with specialized
                  experience narratives and educational credentials. Most compliant federal resumes
                  require 900–1,100 words to satisfy minimum content requirements.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-5">
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  Do I need to include salary and supervisor contact on a federal resume?
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Both fields are optional but recommended. Salary information supports pay band
                  eligibility verification for certain competitive service positions. Supervisor
                  name and contact information reduces follow-up requests that delay the
                  qualification review.
                </p>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="mb-12">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
              <p className="text-slate-700 mb-4">
                Before submitting your next USAJOBS application, verify your compliance score.
              </p>
              <Link
                href="/"
                className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get My Compliance Score — Free
              </Link>
            </div>
          </section>

          {/* Internal Links */}
          <section className="border-t border-slate-200 pt-6 mb-8">
            <p className="text-sm text-slate-500 mb-3">Related Resources:</p>
            <ul className="text-sm space-y-1">
              <li>
                <Link
                  href="/blog/federal-resume-2-page-limit-2025"
                  className="text-blue-600 hover:underline"
                >
                  OPM 2-Page Federal Resume Rule — Full Compliance Guide
                </Link>
              </li>
              <li>
                <Link href="/federal-resume-2-page-rule" className="text-blue-600 hover:underline">
                  Federal Resume 2-Page Rule (Quick Reference)
                </Link>
              </li>
              <li>
                <Link href="/" className="text-blue-600 hover:underline">
                  Free Federal Resume Compliance Check
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-blue-600 hover:underline">
                  Pricing — Analyst and Professional Plans
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

import type { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://resumegov.app';

// ─── SEO Metadata ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'ResumeGov — Federal Resume Compliance for USAJOBS',
  description:
    'ResumeGov validates federal resumes against OPM\'s 2-page rule, GS-level qualification standards, and vacancy-specific language requirements. Compliance-first. No fabrication.',
  keywords: [
    'federal resume',
    'USAJOBS',
    'OPM 2-page rule',
    'federal resume compliance',
    'GS level',
    'federal job application',
    'resume optimizer',
    'September 2025 OPM',
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'ResumeGov — Federal Resume Compliance for USAJOBS',
    description:
      'Validates federal resumes against the OPM 2-page rule, GS-level qualification standards, and vacancy-specific language. Built for compliance.',
    url: SITE_URL,
    siteName: 'ResumeGov',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ResumeGov — Federal Resume Compliance',
    description:
      'OPM 2-page rule is in effect. ResumeGov checks word count, qualification language, and GS compatibility before you submit.',
  },
  robots: { index: true, follow: true },
};

// ─── FAQ Schema (JSON-LD) ─────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: 'When did the OPM 2-page federal resume rule take effect?',
    a: 'The Office of Personnel Management 2-page federal resume limit became effective September 27, 2025. All USAJOBS applications submitted on or after that date are subject to the requirement. HR specialists are instructed to evaluate only the first two pages; content on subsequent pages is not considered.',
  },
  {
    q: 'What is the exact word count target for a compliant federal resume?',
    a: 'The optimal range is 950–1,050 words, corresponding to approximately two standard pages at normal formatting. ResumeGov enforces a hard ceiling of 1,100 words. Submissions exceeding this threshold risk disqualification during initial HR screening.',
  },
  {
    q: 'Does ResumeGov fabricate or invent experience?',
    a: 'No. ResumeGov never fabricates experience, credentials, or achievements. The compression engine removes redundancy and condenses passive language while preserving all required qualification elements verbatim. Every optimization is reviewable before submission.',
  },
  {
    q: 'How does the scoring formula work?',
    a: 'The compatibility score is calculated from four weighted components: Keyword Match (40%), Specialized Experience alignment (30%), Compliance with mandatory elements (20%), and Achievement Evidence (10%). Each component is scored 0–100 and weighted into a composite 0–100 score.',
  },
  {
    q: 'Will optimization remove required qualification language?',
    a: 'No. The compression engine flags all language extracted from the vacancy announcement\'s qualification requirements as protected. This language is never removed during any compression pass. A qualification coverage percentage is reported with every optimization.',
  },
  {
    q: 'What is included in the free plan?',
    a: 'The free plan includes 3 resume analyses with full scoring breakdowns, keyword gap identification, and word count compliance checking. Resume optimization (compression to the 950–1,050 word target) requires a paid credit or subscription.',
  },
];

function FAQSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-white tracking-tight text-lg">Resume<span className="text-blue-400">Gov</span></span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 bg-blue-900 text-blue-300 text-xs font-mono rounded">OPM 2025</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/blog" className="text-sm text-slate-400 hover:text-white transition-colors">Guides</Link>
          <Link href="#pricing" className="text-sm text-slate-400 hover:text-white transition-colors">Pricing</Link>
          <Link href="/login" className="text-sm px-4 py-1.5 bg-white text-slate-900 font-semibold rounded hover:bg-slate-100 transition-colors">Sign in</Link>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="bg-slate-900 pt-20 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        {/* Sub-label */}
        <div className="inline-flex items-center gap-2 border border-slate-700 bg-slate-800 rounded px-3 py-1.5 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
          <p className="text-xs font-mono text-slate-300 uppercase tracking-wide">Structured Rule-Based Evaluation Engine</p>
        </div>

        {/* Compliance alert */}
        <div className="inline-flex items-center gap-2 border border-slate-700 bg-slate-800 rounded px-3 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
          <p className="text-xs font-mono text-slate-300">OPM 2-page rule in effect — September 27, 2025</p>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight mb-5">
          Federal Resume Compliance<br className="hidden sm:block" /> for USAJOBS.
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mb-8 leading-relaxed">
          Stop receiving 'Ineligible' ratings for positions you qualify for.
          ResumeGov validates your federal resume against the OPM 2-page rule,
          GS-level qualification requirements, and vacancy-specific language — before HR screening.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <Link
            href="/start"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-slate-900 font-semibold rounded hover:bg-slate-100 transition-colors"
          >
            Get My Compliance Score — Free
          </Link>
          <Link
            href="/blog/federal-resume-2-page-limit-2025"
            className="inline-flex items-center justify-center px-6 py-3 border border-slate-700 text-slate-300 font-medium rounded hover:border-slate-500 hover:text-white transition-colors"
          >
            Read the 2025 Regulation Guide
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
          {[
            { stat: '1,000+', label: 'Federal resumes evaluated' },
            { stat: '4-component', label: 'Structured scoring' },
            { stat: '0%', label: 'No fabrication. Ever.' },
            { stat: 'Independent', label: 'Compliance platform' },
          ].map(item => (
            <div key={item.label} className="border-l border-slate-700 pl-4">
              <p className="text-xl font-bold text-white mb-1">{item.stat}</p>
              <p className="text-xs text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="border-t border-slate-800 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { stat: '950–1,050', label: 'Target word range' },
            { stat: '1,100', label: 'Hard word ceiling' },
            { stat: 'Deterministic', label: 'Scoring model' },
            { stat: '100%', label: 'Qualification preserved' },
          ].map(({ stat, label }) => (
            <div key={label}>
              <p className="text-2xl font-bold font-mono text-white">{stat}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Problem ──────────────────────────────────────────────────────────────────

function Problem() {
  const problems = [
    {
      title: 'Wrong length',
      body: 'Federal resumes require exactly 2 pages under the September 2025 OPM rule. Most applicants submit 4–8 page resumes that HR is now instructed to truncate at page two — causing qualified candidates to appear ineligible.',
    },
    {
      title: 'Missing qualification language',
      body: 'HR specialists use structured checklists. If your resume does not contain the exact qualification language from the vacancy announcement, you receive an ineligible rating before a hiring manager ever sees your application.',
    },
    {
      title: 'Unverifiable time-in-grade',
      body: 'Every position must list month/year dates and average hours per week. Missing this data prevents HR from calculating whether you meet the 52-week time-in-grade requirement — a near-automatic disqualifier.',
    },
  ];
  return (
    <section className="bg-white py-20 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-xs font-mono text-blue-700 uppercase tracking-widest mb-3">The problem</p>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            30–50% of qualified federal applicants<br className="hidden sm:block" /> receive ineligible ratings.
          </h2>
          <p className="mt-4 text-slate-500 max-w-xl">
            Not because they lack qualifications — because their resumes fail the HR screening checklist on format, length, or language.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((p) => (
            <div key={p.title} className="border border-slate-200 rounded-lg p-6">
              <div className="w-8 h-8 flex items-center justify-center bg-red-50 rounded mb-4">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{p.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Two-Page Rule ────────────────────────────────────────────────────────────

function TwoPageRule() {
  return (
    <section className="bg-slate-50 py-20 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-xs font-mono text-blue-700 uppercase tracking-widest mb-3">OPM Regulation</p>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-5">
              The 2-Page Rule.<br />Effective September 27, 2025.
            </h2>
            <p className="text-slate-500 leading-relaxed mb-6">
              The Office of Personnel Management formalized a 2-page federal resume limit.
              HR specialists are instructed to use only the first two pages for qualification determinations.
              Content beyond page two is not evaluated.
            </p>
            <p className="text-slate-500 leading-relaxed">
              The rule does not specify a word count directly — it specifies page count.
              Based on standard federal document formatting, two pages maps to a specific word range
              that ResumeGov enforces automatically.
            </p>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Minimum floor', value: '900 words', color: 'text-slate-500', bar: 'bg-slate-300', pct: '45%', note: 'Below this appears thin' },
              { label: 'Target range', value: '950–1,050 words', color: 'text-green-700', bar: 'bg-green-500', pct: '60%', note: 'Optimal compliance zone' },
              { label: 'Caution zone', value: '1,051–1,100 words', color: 'text-amber-700', bar: 'bg-amber-400', pct: '78%', note: 'Borderline — review required' },
              { label: 'Hard ceiling', value: '> 1,100 words', color: 'text-red-700', bar: 'bg-red-500', pct: '100%', note: 'Truncation risk' },
            ].map((item) => (
              <div key={item.label} className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  <span className={`text-sm font-mono font-semibold ${item.color}`}>{item.value}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className={`${item.bar} h-1.5 rounded-full`} style={{ width: item.pct }} />
                </div>
                <p className="text-xs text-slate-400 mt-1.5">{item.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Non-removable elements */}
        <div className="mt-12 border border-slate-200 bg-white rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Elements ResumeGov never removes during compression</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              'Required specialized experience language',
              'Time-in-grade documentation (dates, hours/week)',
              'Mandatory certifications and clearances',
              'Competency language from the vacancy announcement',
              'GS-level qualification thresholds',
              'USAJOBS contact and employment fields',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm">
                <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
                <span className="text-slate-600">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Scoring System ───────────────────────────────────────────────────────────

function ScoringSystem() {
  const components = [
    {
      weight: '40%',
      label: 'Keyword Match',
      desc: 'Measures alignment between resume terminology and required keywords extracted from the vacancy announcement. Scores frequency, placement, and context.',
      max: 40,
    },
    {
      weight: '30%',
      label: 'Specialized Experience',
      desc: 'Evaluates whether your experience narratives satisfy the OPM-defined specialized experience threshold for the target GS level. Checks depth, not just mention.',
      max: 30,
    },
    {
      weight: '20%',
      label: 'Compliance Score',
      desc: 'Checks for mandatory federal formatting elements: month/year dates, hours per week, supervisor information, pay rate, and citizenship indicators.',
      max: 20,
    },
    {
      weight: '10%',
      label: 'Achievement Evidence',
      desc: 'Identifies quantified accomplishments — metrics, cost savings, timelines, scope indicators — that distinguish your application at competitive GS levels.',
      max: 10,
    },
  ];
  return (
    <section className="bg-white py-20 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-xs font-mono text-blue-700 uppercase tracking-widest mb-3">Scoring methodology</p>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Structured scoring. Four components.</h2>
          <p className="mt-4 text-slate-500 max-w-xl">
            The compatibility score is a weighted composite of four independently measured components, each mapped to the OPM HR evaluation process.
          </p>
          <div className="mt-4 inline-block border border-slate-200 rounded px-3 py-1.5">
            <code className="text-sm text-slate-700 font-mono">
              Score = (KW × 0.40) + (SE × 0.30) + (CO × 0.20) + (AE × 0.10)
            </code>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {components.map((c) => (
            <div key={c.label} className="border border-slate-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-slate-900">{c.label}</span>
                <span className="font-mono font-bold text-blue-700 text-lg">{c.weight}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1 mb-3">
                <div className="bg-blue-700 h-1 rounded-full" style={{ width: `${c.max}%` }} />
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Solution ─────────────────────────────────────────────────────────────────

function Solution() {
  const steps = [
    {
      step: '01',
      title: 'Upload resume + vacancy announcement',
      body: 'Paste your resume text and the full USAJOBS vacancy announcement. ResumeGov extracts qualification requirements, GS level, and required keywords automatically.',
    },
    {
      step: '02',
      title: 'Receive compatibility score',
      body: 'A 4-component score identifies exactly where your resume under-performs: missing keywords, insufficient specialized experience language, compliance gaps, or weak achievement evidence.',
    },
    {
      step: '03',
      title: 'Run two-pass compression',
      body: 'Pass 1 removes structural redundancy. Pass 2 compresses sentence-level language to the 950–1,050 word target. Required qualification language is protected throughout both passes.',
    },
    {
      step: '04',
      title: 'Review and submit',
      body: 'Every optimization is returned for human review with a qualification coverage percentage. You verify before you submit — ResumeGov does not auto-submit to USAJOBS.',
    },
  ];
  return (
    <section className="bg-slate-50 py-20 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-xs font-mono text-blue-700 uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Four steps to a compliant submission.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((s) => (
            <div key={s.step} className="bg-white border border-slate-200 rounded-lg p-6">
              <span className="font-mono text-3xl font-bold text-slate-200">{s.step}</span>
              <h3 className="font-semibold text-slate-900 mt-2 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Comparison Table ─────────────────────────────────────────────────────────

function ComparisonTable() {
  const rows: { feature: string; free: string | boolean; analyst: string | boolean; pro: string | boolean }[] = [
    { feature: 'Resume analyses', free: '3 total', analyst: '3 credits', pro: 'Unlimited' },
    { feature: 'Compatibility scoring (4-component)', free: true, analyst: true, pro: true },
    { feature: 'Keyword gap report', free: true, analyst: true, pro: true },
    { feature: 'Word count compliance check', free: true, analyst: true, pro: true },
    { feature: 'Missing elements report', free: true, analyst: true, pro: true },
    { feature: 'Two-pass resume optimization', free: false, analyst: true, pro: true },
    { feature: 'Qualification coverage %', free: false, analyst: true, pro: true },
    { feature: 'KSA statement generation', free: false, analyst: false, pro: true },
    { feature: 'Optimization history', free: false, analyst: false, pro: true },
    { feature: 'Priority support', free: false, analyst: false, pro: true },
  ];

  function Cell({ val }: { val: string | boolean }) {
    if (val === false) return <span className="text-slate-300 text-lg">—</span>;
    if (val === true) return (
      <svg className="w-5 h-5 text-green-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
    return <span className="text-sm font-medium text-slate-700">{val}</span>;
  }

  return (
    <section className="bg-white py-20 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-10">
          <p className="text-xs font-mono text-blue-700 uppercase tracking-widest mb-3">Plan comparison</p>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">What each plan includes.</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 pr-6 font-medium text-slate-500 w-1/2">Feature</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-900">Free</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-900">Analyst</th>
                <th className="text-center py-3 px-4 font-semibold text-blue-700">Professional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.feature} className="hover:bg-slate-50">
                  <td className="py-3 pr-6 text-slate-700">{row.feature}</td>
                  <td className="py-3 px-4 text-center"><Cell val={row.free} /></td>
                  <td className="py-3 px-4 text-center"><Cell val={row.analyst} /></td>
                  <td className="py-3 px-4 text-center"><Cell val={row.pro} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'For applicants exploring the tool before committing.',
      highlight: false,
      cta: 'Get started',
      ctaHref: '/start',
      features: [
        '3 resume analyses',
        '4-component compatibility score',
        'Keyword gap identification',
        'Word count compliance check',
        'Missing elements report',
      ],
      footnote: null,
    },
    {
      name: 'Analyst',
      price: '$19.99',
      period: 'one-time (3 credits)',
      description: 'For applicants targeting a specific vacancy announcement.',
      highlight: false,
      cta: 'Buy credits',
      ctaHref: '/login',
      features: [
        'Everything in Free',
        '3 optimization credits',
        'Two-pass compression engine',
        'Qualification coverage report',
        'Compliant word count guaranteed',
      ],
      footnote: 'Credits do not expire.',
    },
    {
      name: 'Professional',
      price: '$39.99',
      period: '/ month',
      description: 'For active applicants submitting multiple USAJOBS applications under the September 2025 rule.',
      highlight: true,
      cta: 'Start subscription',
      ctaHref: '/login',
      features: [
        'Everything in Analyst',
        'Unlimited analyses',
        'Unlimited optimizations',
        'KSA statement generation',
        'Optimization history',
        'Priority support',
      ],
      footnote: 'Cancel anytime.',
    },
  ];
  return (
    <section id="pricing" className="bg-slate-50 py-20 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-xs font-mono text-blue-700 uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Straightforward plans. No usage surprises.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg p-6 flex flex-col ${
                plan.highlight
                  ? 'bg-slate-900 border-2 border-slate-900 text-white'
                  : 'bg-white border border-slate-200'
              }`}
            >
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-semibold text-sm ${ plan.highlight ? 'text-slate-300' : 'text-slate-500'}`}>{plan.name}</span>
                  {plan.highlight && (
                    <span className="text-xs font-mono bg-blue-700 text-white px-2 py-0.5 rounded">Most popular</span>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-bold tracking-tight ${ plan.highlight ? 'text-white' : 'text-slate-900'}`}>{plan.price}</span>
                  <span className={`text-sm ${ plan.highlight ? 'text-slate-400' : 'text-slate-400'}`}>{plan.period}</span>
                </div>
                <p className={`text-sm mt-2 ${ plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>{plan.description}</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 ${ plan.highlight ? 'text-blue-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={plan.highlight ? 'text-slate-300' : 'text-slate-600'}>{f}</span>
                  </li>
                ))}
              </ul>
              {plan.footnote && (
                <p className={`text-xs mb-4 ${ plan.highlight ? 'text-slate-500' : 'text-slate-400'}`}>{plan.footnote}</p>
              )}
              <Link
                href={plan.ctaHref}
                className={`block text-center py-2.5 rounded font-semibold text-sm transition-colors ${
                  plan.highlight
                    ? 'bg-white text-slate-900 hover:bg-slate-100'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

function FAQ() {
  return (
    <section className="bg-white py-20 border-b border-slate-200">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-10">
          <p className="text-xs font-mono text-blue-700 uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Common questions.</h2>
        </div>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <details key={i} className="group border border-slate-200 rounded-lg">
              <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none font-medium text-slate-900 hover:bg-slate-50 transition-colors">
                <span>{item.q}</span>
                <svg
                  className="w-4 h-4 text-slate-400 flex-shrink-0 transition-transform group-open:rotate-180"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-4 pt-1 text-sm text-slate-500 leading-relaxed border-t border-slate-100">
                {item.a}
              </div>
            </details>
          ))}
        </div>
        <p className="mt-8 text-sm text-slate-400">
          More questions?{' '}
          <Link href="/blog" className="text-blue-600 hover:underline">Browse the compliance guides →</Link>
        </p>
      </div>
    </section>
  );
}

// ─── Footer CTA ───────────────────────────────────────────────────────────────

function FooterCTA() {
  return (
    <section className="bg-slate-900 py-16">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold text-white tracking-tight mb-3">
          Submit a compliant federal resume.
        </h2>
        <p className="text-slate-400 mb-8">
          Check word count, qualification language, and GS compatibility before you apply.
        </p>
        <Link
          href="/start"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-semibold rounded hover:bg-slate-100 transition-colors"
        >
          Start free — 3 analyses included
        </Link>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white tracking-tight">Resume<span className="text-blue-400">Gov</span></span>
          <span className="text-slate-600 text-xs">— Federal Resume Compliance Infrastructure</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-slate-500">
          <Link href="/blog" className="hover:text-slate-300 transition-colors">Guides</Link>
          <Link href="#pricing" className="hover:text-slate-300 transition-colors">Pricing</Link>
          <Link href="/login" className="hover:text-slate-300 transition-colors">Sign in</Link>
          <Link href="/dashboard" className="hover:text-slate-300 transition-colors">Dashboard</Link>
        </div>
        <p className="text-xs text-slate-600">
          OPM 2-page rule effective Sep 27, 2025
        </p>
      </div>
      <div className="max-w-6xl mx-auto px-6 pt-6 border-t border-slate-900">
        <p className="text-xs text-slate-700 text-center">
          ResumeGov is an independent compliance tool and is not affiliated with USAJOBS or the U.S. Office of Personnel Management (OPM).
        </p>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <FAQSchema />
      <Nav />
      <Hero />
      <Problem />
      <TwoPageRule />
      <ScoringSystem />
      <Solution />
      <ComparisonTable />
      <Pricing />
      <FAQ />
      <FooterCTA />
      <Footer />
    </>
  );
}

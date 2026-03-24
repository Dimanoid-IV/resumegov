import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Analysis Results — ResumeGov',
  description: 'Your federal resume compatibility score and qualification gap report.',
  robots: { index: false, follow: false },
};

// ─── Types ─────────────────────────────────────────────────────────────────

type FeedbackJson = {
  missing_elements?: string[];
  weak_bullets?: string[];
};

type Analysis = {
  id: string;
  user_id: string;
  compatibility_score: number | null;
  keyword_score: number | null;
  specialized_score: number | null;
  compliance_score: number | null;
  achievement_score: number | null;
  word_count: number | null;
  word_count_original: number | null;
  word_count_final: number | null;
  coverage_original: number | null;
  coverage_final: number | null;
  risk_level: string | null;
  feedback_json: FeedbackJson | null;
  created_at: string;
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function scoreColor(pct: number): string {
  if (pct >= 80) return '#16a34a';   // green-600
  if (pct >= 60) return '#d97706';   // amber-600
  return '#dc2626';                   // red-600
}

function scoreBg(pct: number): string {
  if (pct >= 80) return '#f0fdf4';
  if (pct >= 60) return '#fffbeb';
  return '#fef2f2';
}

function scoreBorder(pct: number): string {
  if (pct >= 80) return '#bbf7d0';
  if (pct >= 60) return '#fde68a';
  return '#fecaca';
}

function twoPageRisk(wordCount: number): {
  icon: string;
  label: string;
  color: string;
  bg: string;
  border: string;
} {
  if (wordCount <= 1050) return { icon: '✓', label: 'Compliant', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' };
  if (wordCount <= 1100) return { icon: '⚠', label: 'Near Limit', color: '#d97706', bg: '#fffbeb', border: '#fde68a' };
  return { icon: '✕', label: 'Over Limit — Non-Compliant', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' };
}

// ─── Sub-score bar ─────────────────────────────────────────────────────────

function SubScoreBar({
  label,
  value,
  max,
  weight,
}: {
  label: string;
  value: number;
  max: number;
  weight: string;
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const fill = scoreColor(pct);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">{weight}</span>
          <span className="text-sm font-semibold tabular-nums" style={{ color: fill }}>
            {pct}%
          </span>
        </div>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: fill }}
        />
      </div>
    </div>
  );
}

// ─── Compatibility Dial ────────────────────────────────────────────────────

function CompatibilityDial({ score }: { score: number }) {
  const color = scoreColor(score);
  const bg = scoreBg(score);
  const border = scoreBorder(score);
  const label =
    score >= 80 ? 'Strong Alignment' : score >= 60 ? 'Moderate Alignment' : 'Low Alignment';

  return (
    <div
      className="flex flex-col items-center justify-center py-8 px-6 rounded-xl border"
      style={{ backgroundColor: bg, borderColor: border }}
    >
      <div
        className="w-28 h-28 rounded-full border-8 flex items-center justify-center mb-3"
        style={{ borderColor: color }}
      >
        <span className="text-4xl font-bold tabular-nums" style={{ color }}>
          {score}
        </span>
      </div>
      <p className="text-sm font-semibold" style={{ color }}>
        {label}
      </p>
      <p className="text-xs text-slate-400 mt-1">Compatibility Score / 100</p>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ analysisId: string }>;
}) {
  const { analysisId } = await params;

  // Auth check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/start?error=${encodeURIComponent('Sign in to view your analysis results.')}`);
  }

  // Fetch analysis — verify ownership via user_id
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: raw, error } = await (supabase as any)
    .from('analyses')
    .select(
      'id, user_id, compatibility_score, keyword_score, specialized_score, compliance_score, achievement_score, word_count, feedback_json, created_at'
    )
    .eq('id', analysisId)
    .eq('user_id', user.id)
    .single();

  if (error || !raw) notFound();

  const analysis = raw as Analysis;

  const compat = analysis.compatibility_score ?? 0;
  const kwScore = analysis.keyword_score ?? 0;      // stored 0-40
  const seScore = analysis.specialized_score ?? 0;  // stored 0-30
  const coScore = analysis.compliance_score ?? 0;   // stored 0-20
  const aeScore = analysis.achievement_score ?? 0;  // stored 0-10
  const wordCount = analysis.word_count ?? 0;
  const riskLevel = (analysis.risk_level as 'Low' | 'Moderate' | 'High') ?? 'Moderate';

  const feedback = analysis.feedback_json ?? {};
  const missing: string[] = Array.isArray(feedback.missing_elements)
    ? (feedback.missing_elements as string[]).slice(0, 5)
    : [];
  const weakBullets: string[] = Array.isArray(feedback.weak_bullets)
    ? (feedback.weak_bullets as string[]).slice(0, 3)
    : [];

  const risk = twoPageRisk(wordCount);
  const optimizeHref = `/set-password?analysisId=${analysisId}`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* GA4 Event Tracking */}
      <Script id="ga4-analysis-completed" strategy="afterInteractive">
        {`
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'resume_analysis_completed', {
              event_category: 'engagement',
              value: ${compat},
              non_interaction: false
            });
          }
        `}
      </Script>
      {/* Nav */}
      <nav className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-white tracking-tight">
            Resume<span className="text-blue-400">Gov</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/upload" className="text-sm text-slate-400 hover:text-white transition-colors">
              New Analysis
            </Link>
            <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Body */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 border border-slate-200 bg-white rounded px-2.5 py-1 text-xs font-mono text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Structured Rule-Based Evaluation
            </span>
            <span className="text-xs text-slate-400">
              {new Date(analysis.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Federal Resume Compatibility Analysis
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Scored against OPM qualification standards and vacancy-specific requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left column — Compatibility dial + sub-scores */}
          <div className="lg:col-span-1 space-y-4">

            {/* Compatibility dial */}
            <CompatibilityDial score={compat} />

            {/* Sub-scores */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Score Breakdown
              </h2>
              <SubScoreBar label="Keyword Match" value={kwScore} max={40} weight="40%" />
              <SubScoreBar label="Specialized Coverage" value={seScore} max={30} weight="30%" />
              <SubScoreBar label="Compliance" value={coScore} max={20} weight="20%" />
              <SubScoreBar label="Achievement Density" value={aeScore} max={10} weight="10%" />
            </div>

            {/* Word count + 2-page risk */}
            <div
              className="bg-white border rounded-xl p-5"
              style={{ borderColor: risk.border }}
            >
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
                2-Page Compliance
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-900 tabular-nums">
                    {wordCount.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">words detected</p>
                </div>
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold"
                  style={{ backgroundColor: risk.bg, color: risk.color, border: `1px solid ${risk.border}` }}
                >
                  <span>{risk.icon}</span>
                  <span>{risk.label}</span>
                </div>
              </div>
              <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (wordCount / 1100) * 100)}%`,
                    backgroundColor: risk.color,
                  }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Target: 950–1,050 words · Hard limit: 1,100
              </p>
            </div>

            {/* Risk Level */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
                Risk Assessment
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-900">{riskLevel}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Overall risk level</p>
                </div>
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold ${
                    riskLevel === 'Low' ? 'bg-green-50 text-green-700 border border-green-200' :
                    riskLevel === 'Moderate' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {riskLevel === 'Low' ? '✓' : riskLevel === 'Moderate' ? '⚠' : '✕'}
                  {riskLevel} Risk
                </div>
              </div>
            </div>
          </div>

          {/* Right column — Gaps + weak bullets + CTA */}
          <div className="lg:col-span-2 space-y-4">

            {/* Missing qualification elements */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Top Missing Qualification Elements
                </h2>
                <span className="text-xs font-mono text-slate-400 bg-slate-50 border border-slate-200 rounded px-2 py-0.5">
                  {missing.length} identified
                </span>
              </div>
              {missing.length > 0 ? (
                <ul className="space-y-2">
                  {missing.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 w-5 h-5 rounded-full bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 text-xs font-bold text-red-600">
                        {i + 1}
                      </span>
                      <p className="text-sm text-slate-700 leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400 italic">No major gaps identified.</p>
              )}
            </div>

            {/* Weak bullet points */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Weak Bullet Points
                </h2>
                <span className="text-xs text-slate-400">Showing {weakBullets.length} of {weakBullets.length}</span>
              </div>
              {weakBullets.length > 0 ? (
                <ul className="space-y-3">
                  {weakBullets.map((bullet, i) => (
                    <li key={i} className="border border-amber-200 bg-amber-50 rounded-lg px-4 py-3">
                      <div className="flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5 flex-shrink-0 text-xs font-semibold uppercase tracking-wider">
                          Weak
                        </span>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {bullet.length > 160 ? `${bullet.slice(0, 160)}…` : bullet}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400 italic">Bullet analysis unavailable.</p>
              )}
            </div>

            {/* What's hidden (upgrade prompt) */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
                Full Optimization — Locked
              </h2>
              <ul className="space-y-2 mb-4">
                {[
                  'Compressed 2-page resume (950–1,050 word target)',
                  'Full qualification coverage mapping',
                  'KSA statement generation',
                  'Iterative word count reduction to hard limit',
                  'Protected required-qualification language report',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-slate-500">
                    <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Primary CTA */}
            <div className="bg-slate-900 rounded-xl p-6 text-center">
              <h2 className="text-lg font-bold text-white mb-2">
                Optimize to 2-Page Compliance
              </h2>
              <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                Compress your resume to 950–1,050 words while preserving all required qualification
                language. Never fabricates experience.
              </p>
              <Link
                href={optimizeHref}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 font-semibold rounded hover:bg-slate-100 transition-colors w-full sm:w-auto"
              >
                Optimize My Resume
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <p className="text-xs text-slate-500 mt-3">
                One credit required · Analyst plan from $9.99
              </p>
            </div>

            {/* Run another */}
            <div className="text-center">
              <Link
                href="/upload"
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors underline underline-offset-2"
              >
                Analyze a different resume
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import ResultsAnalytics from './ResultsAnalytics';
import OptimizedResumeDownload from '@/components/OptimizedResumeDownload';

export const metadata: Metadata = {
  title: 'Analysis Results — ResumeGov',
  description: 'Your federal resume compatibility score and qualification gap report.',
  robots: { index: false, follow: false },
};

// ─── Types ─────────────────────────────────────────────────────────────────

type FeedbackJson = {
  missing_elements?: string[];
  weak_bullets?: string[];
  compliance_issues?: string[];
  rewrite_preview?: {
    before?: string;
    after?: string;
    rationale?: string;
  } | null;
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

type OptimizationMetadata = {
  change_summary?: string[];
  matched_requirements?: string[];
  unresolved_gaps?: string[];
  questions_for_user?: string[];
};

type Optimization = {
  compressed_resume_text: string;
  final_word_count: number | null;
  qualification_coverage_percent: number | null;
  ksa_text: string | null;
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
  if (wordCount < 850) return { icon: '⚠', label: 'May Need More Detail', color: '#d97706', bg: '#fffbeb', border: '#fde68a' };
  if (wordCount <= 1050) return { icon: '✓', label: 'Planning Range', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' };
  if (wordCount <= 1100) return { icon: '⚠', label: 'Check Final Pages', color: '#d97706', bg: '#fffbeb', border: '#fde68a' };
  return { icon: '✕', label: 'High Overflow Risk', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' };
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
  const admin = createAdminClient();
  const { data: raw, error } = await admin
    .from('analyses')
    .select(
      'id, user_id, compatibility_score, keyword_score, specialized_score, compliance_score, achievement_score, word_count, feedback_json, created_at'
    )
    .eq('id', analysisId)
    .eq('user_id', user.id)
    .single();

  if (error || !raw) notFound();

  const analysis = raw as Analysis;
  const { data: profileData } = await admin
    .from('users')
    .select('plan_type, credits_remaining')
    .eq('id', user.id)
    .single();
  const profile = profileData as {
    plan_type: string;
    credits_remaining: number;
  } | null;
  const paidPlan = ['basic', 'pro', 'enterprise'].includes(profile?.plan_type ?? '');
  const hasCredits = profile?.credits_remaining === -1 || (profile?.credits_remaining ?? 0) > 0;
  const { data: optimizationData } = await admin
    .from('optimizations')
    .select('compressed_resume_text, final_word_count, qualification_coverage_percent, ksa_text')
    .eq('analysis_id', analysisId)
    .maybeSingle();
  const optimization = optimizationData as Optimization | null;
  let optimizationMetadata: OptimizationMetadata = {};
  if (optimization?.ksa_text) {
    try {
      optimizationMetadata = JSON.parse(optimization.ksa_text) as OptimizationMetadata;
    } catch {
      optimizationMetadata = {};
    }
  }

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
  const isOptimized = Boolean(optimization?.compressed_resume_text);
  const canOptimize = paidPlan && hasCredits;
  const optimizeHref = canOptimize
    ? '/dashboard'
    : `/api/checkout?plan=single&analysisId=${analysisId}`;
  const optimizeLabel = canOptimize ? 'Tailor This Resume Now' : 'Tailor This Resume — $9.99';
  const rewritePreview = feedback.rewrite_preview;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <ResultsAnalytics compatibilityScore={compat} />
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
                Length Planning
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
                Internal estimate only. Verify that the final rendered PDF is no more than 2 pages.
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
            {rewritePreview?.before && rewritePreview?.after && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h2 className="text-sm font-semibold text-blue-900 uppercase tracking-wide mb-3">
                  Safe Rewrite Preview
                </h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Before</p>
                    <p className="text-slate-700">{rewritePreview.before}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 mb-1">Vacancy-targeted</p>
                    <p className="text-slate-900 font-medium">{rewritePreview.after}</p>
                  </div>
                  {rewritePreview.rationale && <p className="text-xs text-blue-700">{rewritePreview.rationale}</p>}
                </div>
              </div>
            )}

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
                Full Optimization — {isOptimized ? 'Ready' : paidPlan && hasCredits ? 'Available' : 'Locked'}
              </h2>
              <ul className="space-y-2 mb-4">
                {[
                  'Complete resume tailored to this exact vacancy',
                  'Supported specialized experience prioritized',
                  'Truth-preserving rewrite — no invented experience',
                  'Independent factual-safety check before credit use',
                  'Editable DOCX download and unresolved-gap list',
                ].map(item => (
                  <li key={item} className={`flex items-center gap-2.5 text-sm ${isOptimized ? 'text-green-800' : 'text-slate-500'}`}>
                    {isOptimized ? (
                      <span className="w-4 h-4 text-green-600 flex-shrink-0">✓</span>
                    ) : (
                      <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Primary CTA */}
            <div className="bg-slate-900 rounded-xl p-6 text-center">
              <h2 className="text-lg font-bold text-white mb-2">
                {isOptimized ? 'Your Vacancy-Targeted Resume Is Ready' : 'Get the Vacancy-Targeted Resume'}
              </h2>
              <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                {isOptimized
                  ? `${optimization?.final_word_count ?? 0} words · ${optimization?.qualification_coverage_percent ?? 0}% supported requirement coverage · fact checked`
                  : 'Reorder and rewrite your documented experience for this vacancy, preserve required federal fields, and flag facts that only you can supply.'}
              </p>
              {isOptimized && optimization ? (
                <OptimizedResumeDownload resumeText={optimization.compressed_resume_text} analysisId={analysisId} />
              ) : (
                <Link
                  href={optimizeHref}
                  data-gtm-event="checkout_started"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 font-semibold rounded transition-colors w-full sm:w-auto hover:bg-slate-100"
                >
                  {optimizeLabel}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
              <p className="text-xs text-slate-500 mt-3">
                {isOptimized ? 'Your credit has already been applied. Download again at any time.' : 'One credit required · Failed factual-safety checks do not use a credit'}
              </p>
            </div>

            {isOptimized && (
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">What Changed</h2>
                {(optimizationMetadata.change_summary?.length ?? 0) > 0 ? (
                  <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                    {optimizationMetadata.change_summary?.slice(0, 6).map(item => <li key={item}>{item}</li>)}
                  </ul>
                ) : <p className="text-sm text-slate-500">The resume was reordered and rewritten for the selected vacancy.</p>}
                {(optimizationMetadata.unresolved_gaps?.length ?? 0) > 0 && (
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <h3 className="text-sm font-semibold text-amber-800 mb-2">Information only you can add</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                      {optimizationMetadata.unresolved_gaps?.slice(0, 5).map(item => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}

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

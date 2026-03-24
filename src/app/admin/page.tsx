export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import AdminDashboardClient, {
  type AdminStats,
  type AdminUser,
  type AdminAnalysis,
  type AdminOptimization,
  type AdminPayment,
  type AdminFlag,
} from './AdminDashboardClient';

// OpenAI cost estimates (GPT-4o pricing, all-time)
const COST_PER_ANALYSIS = 0.013;       // ~3k input + 500 output tokens
const COST_PER_OPTIMIZATION = 0.028;   // ~5k input + 1.5k output tokens

export default async function AdminPage() {
  // ── Auth check ──────────────────────────────────────────────────────────────
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profileData } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  const profile = profileData as { is_admin?: boolean } | null;
  if (!profile?.is_admin) {
    redirect('/dashboard');
  }

  // ── Admin data fetching (bypasses RLS) ────────────────────────────────────
  const admin = createAdminClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const a = admin as any;

  const [
    { data: allUsers },
    { data: allAnalyses },
    { data: allJobPosts },
    { data: allOptimizations },
    { data: allPayments },
    { data: allFlags },
    { data: dailyAnalysesData },
  ] = await Promise.all([
    a.from('users').select('*').order('created_at', { ascending: false }),
    a.from('analyses').select('*, job_posts(gs_level)').order('created_at', { ascending: false }).limit(200),
    a.from('job_posts').select('gs_level').order('created_at', { ascending: false }),
    a.from('optimizations').select('*, analyses(user_id)').order('created_at', { ascending: false }).limit(100),
    a.from('payments').select('*, users(email)').order('created_at', { ascending: false }),
    a.from('hallucination_flags').select('*, users!flagged_by(email)').order('created_at', { ascending: false }),
    a.from('analyses')
      .select('id')
      .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
  ]);

  // ── Fetch user emails for analyses and optimizations ──────────────────────
  const userEmailMap: Record<string, string> = {};
  for (const u of (allUsers || []) as { id: string; email: string }[]) {
    userEmailMap[u.id] = u.email;
  }

  // ── Stats computation ─────────────────────────────────────────────────────
  const users = (allUsers || []) as AdminUser[];
  const totalUsers = users.length;
  const paidUsers = users.filter(u => u.plan_type !== 'free').length;
  const conversionRate = totalUsers > 0 ? (paidUsers / totalUsers) * 100 : 0;

  const dailyAnalyses = (dailyAnalysesData || []).length;

  const completedPayments = ((allPayments || []) as { amount: number; status: string }[])
    .filter(p => p.status === 'completed' || p.status === 'refunded');
  const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);

  const analysisCount = (allAnalyses || []).length;
  const optimizationCount = (allOptimizations || []).length;
  const estimatedOpenAICost = analysisCount * COST_PER_ANALYSIS + optimizationCount * COST_PER_OPTIMIZATION;

  const scores = ((allAnalyses || []) as { compatibility_score: number | null }[])
    .map(a => a.compatibility_score)
    .filter((s): s is number => s !== null);
  const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

  // GS level distribution from job posts
  const gsCount: Record<string, number> = {};
  for (const jp of (allJobPosts || []) as { gs_level: string | null }[]) {
    const level = jp.gs_level || 'Unknown';
    gsCount[level] = (gsCount[level] || 0) + 1;
  }
  const gsLevelDistribution = Object.entries(gsCount)
    .map(([gs_level, count]) => ({ gs_level, count }))
    .sort((a, b) => b.count - a.count);

  // Most common missing elements from feedback_json
  const elementCount: Record<string, number> = {};
  for (const analysis of (allAnalyses || []) as { feedback_json: { missing_elements?: string[] } }[]) {
    const missing = analysis.feedback_json?.missing_elements || [];
    for (const el of missing) {
      if (el && typeof el === 'string') {
        const key = el.trim().toLowerCase();
        elementCount[key] = (elementCount[key] || 0) + 1;
      }
    }
  }
  const missingElementsTop = Object.entries(elementCount)
    .map(([element, count]) => ({ element, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const stats: AdminStats = {
    totalUsers,
    dailyAnalyses,
    conversionRate,
    totalRevenue,
    estimatedOpenAICost,
    averageScore,
    gsLevelDistribution,
    missingElementsTop,
  };

  // ── Shape data for client ─────────────────────────────────────────────────
  const shapedUsers: AdminUser[] = users;

  const shapedAnalyses: AdminAnalysis[] = ((allAnalyses || []) as {
    id: string;
    user_id: string;
    compatibility_score: number | null;
    keyword_score: number | null;
    specialized_score: number | null;
    compliance_score: number | null;
    achievement_score: number | null;
    word_count: number | null;
    feedback_json: { missing_elements?: string[]; weak_bullets?: string[] };
    created_at: string;
    job_posts?: { gs_level?: string | null };
  }[]).map(a => ({
    id: a.id,
    user_id: a.user_id,
    user_email: userEmailMap[a.user_id],
    compatibility_score: a.compatibility_score,
    keyword_score: a.keyword_score,
    specialized_score: a.specialized_score,
    compliance_score: a.compliance_score,
    achievement_score: a.achievement_score,
    word_count: a.word_count,
    gs_level: a.job_posts?.gs_level,
    feedback_json: a.feedback_json || {},
    created_at: a.created_at,
  }));

  const shapedOptimizations: AdminOptimization[] = ((allOptimizations || []) as {
    id: string;
    analysis_id: string;
    compressed_resume_text: string;
    qualification_coverage_percent: number | null;
    final_word_count: number;
    ksa_text: string | null;
    created_at: string;
    analyses?: { user_id?: string };
  }[]).map(opt => ({
    id: opt.id,
    analysis_id: opt.analysis_id,
    compressed_resume_text: opt.compressed_resume_text,
    qualification_coverage_percent: opt.qualification_coverage_percent,
    final_word_count: opt.final_word_count,
    ksa_text: opt.ksa_text,
    user_email: opt.analyses?.user_id ? userEmailMap[opt.analyses.user_id] : undefined,
    created_at: opt.created_at,
  }));

  const shapedPayments: AdminPayment[] = ((allPayments || []) as {
    id: string;
    user_id: string;
    stripe_payment_id: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    created_at: string;
    users?: { email?: string };
  }[]).map(p => ({
    id: p.id,
    user_id: p.user_id,
    user_email: p.users?.email,
    stripe_payment_id: p.stripe_payment_id,
    amount: p.amount,
    status: p.status,
    created_at: p.created_at,
  }));

  const shapedFlags: AdminFlag[] = ((allFlags || []) as {
    id: string;
    optimization_id: string | null;
    analysis_id: string | null;
    flagged_by: string;
    flag_type: string;
    notes: string | null;
    resolved: boolean;
    created_at: string;
    users?: { email?: string };
  }[]).map(f => ({
    id: f.id,
    optimization_id: f.optimization_id,
    analysis_id: f.analysis_id,
    flagged_by: f.flagged_by,
    flagged_by_email: f.users?.email,
    flag_type: f.flag_type,
    notes: f.notes,
    resolved: f.resolved,
    created_at: f.created_at,
  }));

  return (
    <AdminDashboardClient
      stats={stats}
      users={shapedUsers}
      analyses={shapedAnalyses}
      optimizations={shapedOptimizations}
      payments={shapedPayments}
      flags={shapedFlags}
    />
  );
}

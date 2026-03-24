'use client';

import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminStats {
  totalUsers: number;
  dailyAnalyses: number;
  conversionRate: number;
  totalRevenue: number;
  estimatedOpenAICost: number;
  averageScore: number;
  gsLevelDistribution: { gs_level: string; count: number }[];
  missingElementsTop: { element: string; count: number }[];
}

export interface AdminUser {
  id: string;
  email: string;
  plan_type: string;
  credits_remaining: number;
  is_admin: boolean;
  created_at: string;
}

export interface AdminAnalysis {
  id: string;
  user_id: string;
  user_email?: string;
  compatibility_score: number | null;
  keyword_score: number | null;
  specialized_score: number | null;
  compliance_score: number | null;
  achievement_score: number | null;
  word_count: number | null;
  gs_level?: string | null;
  feedback_json: { missing_elements?: string[]; weak_bullets?: string[] };
  created_at: string;
}

export interface AdminOptimization {
  id: string;
  analysis_id: string;
  compressed_resume_text: string;
  qualification_coverage_percent: number | null;
  final_word_count: number;
  ksa_text: string | null;
  user_email?: string;
  created_at: string;
}

export interface AdminPayment {
  id: string;
  user_id: string;
  user_email?: string;
  stripe_payment_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
}

export interface AdminFlag {
  id: string;
  optimization_id: string | null;
  analysis_id: string | null;
  flagged_by: string;
  flagged_by_email?: string;
  flag_type: string;
  notes: string | null;
  resolved: boolean;
  created_at: string;
}

export interface AdminDashboardProps {
  stats: AdminStats;
  users: AdminUser[];
  analyses: AdminAnalysis[];
  optimizations: AdminOptimization[];
  payments: AdminPayment[];
  flags: AdminFlag[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <span className="text-gray-400">—</span>;
  const color = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600';
  return <span className={`font-bold ${color}`}>{score}%</span>;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    completed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const colors: Record<string, string> = {
    free: 'bg-gray-100 text-gray-600',
    basic: 'bg-blue-100 text-blue-700',
    pro: 'bg-purple-100 text-purple-700',
    enterprise: 'bg-orange-100 text-orange-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${colors[plan] ?? 'bg-gray-100'}`}>
      {plan}
    </span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

// ─── Flag Form ────────────────────────────────────────────────────────────────

const FLAG_TYPES = [
  { value: 'hallucinated_job', label: 'Hallucinated Job Detail' },
  { value: 'fabricated_metric', label: 'Fabricated Metric' },
  { value: 'wrong_gs_level', label: 'Wrong GS Level' },
  { value: 'wrong_qualification', label: 'Wrong Qualification' },
  { value: 'inaccurate_score', label: 'Inaccurate Score' },
  { value: 'other', label: 'Other' },
];

function FlagForm({
  optimizationId,
  analysisId,
  onClose,
  onSuccess,
}: {
  optimizationId?: string;
  analysisId?: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [flagType, setFlagType] = useState('other');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/flag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optimizationId, analysisId, flagType, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Flag failed');
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Flag Type</label>
        <select
          value={flagType}
          onChange={e => setFlagType(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        >
          {FLAG_TYPES.map(ft => (
            <option key={ft.value} value={ft.value}>{ft.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Describe the issue..."
        />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onClose} className="px-4 py-2 border rounded text-sm">Cancel</button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded text-sm disabled:opacity-50"
        >
          {loading ? 'Flagging...' : 'Flag'}
        </button>
      </div>
    </form>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type Tab = 'overview' | 'users' | 'analyses' | 'resumes' | 'payments' | 'flags';

export default function AdminDashboardClient({
  stats,
  users,
  analyses,
  optimizations,
  payments,
  flags: initialFlags,
}: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>('overview');
  const [flags, setFlags] = useState(initialFlags);

  // Modal states
  const [resumeModal, setResumeModal] = useState<AdminOptimization | null>(null);
  const [flagModal, setFlagModal] = useState<{ optimizationId?: string; analysisId?: string } | null>(null);
  const [analysisModal, setAnalysisModal] = useState<AdminAnalysis | null>(null);

  // Refund state
  const [refundingId, setRefundingId] = useState<string | null>(null);
  const [refundedIds, setRefundedIds] = useState<Set<string>>(new Set());
  const [refundErrors, setRefundErrors] = useState<Record<string, string>>({});

  // Resolve flag state
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  async function handleRefund(paymentId: string) {
    setRefundingId(paymentId);
    setRefundErrors(prev => ({ ...prev, [paymentId]: '' }));
    try {
      const res = await fetch('/api/admin/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Refund failed');
      setRefundedIds(prev => new Set(prev).add(paymentId));
    } catch (err) {
      setRefundErrors(prev => ({
        ...prev,
        [paymentId]: err instanceof Error ? err.message : 'Error',
      }));
    } finally {
      setRefundingId(null);
    }
  }

  async function handleResolveFlag(flagId: string) {
    setResolvingId(flagId);
    try {
      const res = await fetch('/api/admin/flag', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flagId }),
      });
      if (res.ok) {
        setFlags(prev => prev.map(f => f.id === flagId ? { ...f, resolved: true } : f));
      }
    } finally {
      setResolvingId(null);
    }
  }

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users', count: users.length },
    { id: 'analyses', label: 'Analyses', count: analyses.length },
    { id: 'resumes', label: 'Resumes & Logs', count: optimizations.length },
    { id: 'payments', label: 'Payments', count: payments.length },
    { id: 'flags', label: 'Flags', count: flags.filter(f => !f.resolved).length },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">Admin</span>
      </div>

      {/* ── Stats Overview ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="Total Users" value={stats.totalUsers.toLocaleString()} />
        <StatCard label="Daily Analyses" value={stats.dailyAnalyses.toLocaleString()} sub="today" />
        <StatCard
          label="Conversion Rate"
          value={`${stats.conversionRate.toFixed(1)}%`}
          sub="free → paid"
        />
        <StatCard
          label="Total Revenue"
          value={`$${(stats.totalRevenue / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
        />
        <StatCard
          label="Est. OpenAI Cost"
          value={`$${stats.estimatedOpenAICost.toFixed(2)}`}
          sub="all time"
        />
        <StatCard
          label="Avg Score"
          value={`${stats.averageScore.toFixed(1)}%`}
          sub="compatibility"
        />
      </div>

      {/* ── Distributions Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* GS Level Distribution */}
        <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
          <h2 className="font-semibold mb-3">Most Common GS Levels</h2>
          {stats.gsLevelDistribution.length > 0 ? (
            <div className="space-y-2">
              {stats.gsLevelDistribution.slice(0, 8).map(({ gs_level, count }) => {
                const max = stats.gsLevelDistribution[0]?.count || 1;
                const pct = Math.round((count / max) * 100);
                return (
                  <div key={gs_level} className="flex items-center gap-3">
                    <span className="w-16 text-sm font-medium text-gray-700">{gs_level || 'N/A'}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-xs text-gray-500 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No job data yet.</p>
          )}
        </div>

        {/* Most Common Missing Elements */}
        <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
          <h2 className="font-semibold mb-3">Most Common Missing Elements</h2>
          {stats.missingElementsTop.length > 0 ? (
            <div className="space-y-2">
              {stats.missingElementsTop.slice(0, 8).map(({ element, count }, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 truncate flex-1 mr-4">{element}</span>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-medium whitespace-nowrap">
                    {count}×
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No analyses yet.</p>
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="bg-white rounded-lg shadow border border-gray-100">
        <div className="flex gap-0 border-b overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {t.label}
              {t.count !== undefined && (
                <span className="ml-1.5 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-4 overflow-x-auto">

          {/* ── Overview Tab ── */}
          {tab === 'overview' && (
            <div className="space-y-4 text-sm text-gray-600">
              <p>Select a tab above to drill into users, analyses, resumes, payments, or flags.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-semibold text-blue-800 mb-1">Active Users</p>
                  <p className="text-2xl font-bold text-blue-700">{users.filter(u => u.plan_type !== 'free').length}</p>
                  <p className="text-xs text-blue-600 mt-1">Paid plans</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="font-semibold text-green-800 mb-1">Optimizations</p>
                  <p className="text-2xl font-bold text-green-700">{optimizations.length}</p>
                  <p className="text-xs text-green-600 mt-1">Total compressions</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="font-semibold text-red-800 mb-1">Open Flags</p>
                  <p className="text-2xl font-bold text-red-700">{flags.filter(f => !f.resolved).length}</p>
                  <p className="text-xs text-red-600 mt-1">Pending review</p>
                </div>
              </div>
            </div>
          )}

          {/* ── Users Tab ── */}
          {tab === 'users' && (
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 font-medium">Email</th>
                  <th className="pb-2 font-medium">Plan</th>
                  <th className="pb-2 font-medium">Credits</th>
                  <th className="pb-2 font-medium">Admin</th>
                  <th className="pb-2 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 pr-4">{u.email}</td>
                    <td className="py-2 pr-4"><PlanBadge plan={u.plan_type} /></td>
                    <td className="py-2 pr-4">{u.credits_remaining === -1 ? '∞' : u.credits_remaining}</td>
                    <td className="py-2 pr-4">{u.is_admin ? '✅' : '—'}</td>
                    <td className="py-2 text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={5} className="py-4 text-center text-gray-400">No users yet.</td></tr>
                )}
              </tbody>
            </table>
          )}

          {/* ── Analyses Tab ── */}
          {tab === 'analyses' && (
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 font-medium">User</th>
                  <th className="pb-2 font-medium">Score</th>
                  <th className="pb-2 font-medium">Keyword</th>
                  <th className="pb-2 font-medium">Specialized</th>
                  <th className="pb-2 font-medium">Words</th>
                  <th className="pb-2 font-medium">GS Level</th>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {analyses.map(a => (
                  <tr key={a.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 pr-3 text-xs text-gray-500 truncate max-w-[140px]">{a.user_email || a.user_id.slice(0, 8)}</td>
                    <td className="py-2 pr-3"><ScoreBadge score={a.compatibility_score} /></td>
                    <td className="py-2 pr-3 text-gray-600">{a.keyword_score ?? '—'}</td>
                    <td className="py-2 pr-3 text-gray-600">{a.specialized_score ?? '—'}</td>
                    <td className="py-2 pr-3">{a.word_count ?? '—'}</td>
                    <td className="py-2 pr-3">{a.gs_level || '—'}</td>
                    <td className="py-2 pr-3 text-gray-500">{new Date(a.created_at).toLocaleDateString()}</td>
                    <td className="py-2">
                      <div className="flex gap-1">
                        <button
                          onClick={() => setAnalysisModal(a)}
                          className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setFlagModal({ analysisId: a.id })}
                          className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                        >
                          Flag
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {analyses.length === 0 && (
                  <tr><td colSpan={8} className="py-4 text-center text-gray-400">No analyses yet.</td></tr>
                )}
              </tbody>
            </table>
          )}

          {/* ── Resumes & Logs Tab ── */}
          {tab === 'resumes' && (
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 font-medium">User</th>
                  <th className="pb-2 font-medium">Final Words</th>
                  <th className="pb-2 font-medium">Coverage %</th>
                  <th className="pb-2 font-medium">Compliance</th>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {optimizations.map(opt => (
                  <tr key={opt.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 pr-3 text-xs text-gray-500 truncate max-w-[140px]">{opt.user_email || '—'}</td>
                    <td className="py-2 pr-3 font-medium">{opt.final_word_count}</td>
                    <td className="py-2 pr-3">{opt.qualification_coverage_percent ?? '—'}%</td>
                    <td className="py-2 pr-3">
                      {opt.final_word_count <= 1050 ? (
                        <span className="text-green-600 text-xs">✅ Optimal</span>
                      ) : opt.final_word_count <= 1100 ? (
                        <span className="text-yellow-600 text-xs">⚠ Borderline</span>
                      ) : (
                        <span className="text-red-600 text-xs">❌ Over Limit</span>
                      )}
                    </td>
                    <td className="py-2 pr-3 text-gray-500">{new Date(opt.created_at).toLocaleDateString()}</td>
                    <td className="py-2">
                      <div className="flex gap-1">
                        <button
                          onClick={() => setResumeModal(opt)}
                          className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                        >
                          View Resume
                        </button>
                        <button
                          onClick={() => setFlagModal({ optimizationId: opt.id })}
                          className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                        >
                          Flag
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {optimizations.length === 0 && (
                  <tr><td colSpan={6} className="py-4 text-center text-gray-400">No optimizations yet.</td></tr>
                )}
              </tbody>
            </table>
          )}

          {/* ── Payments Tab ── */}
          {tab === 'payments' && (
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 font-medium">User</th>
                  <th className="pb-2 font-medium">Amount</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Stripe ID</th>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => {
                  const isRefunded = p.status === 'refunded' || refundedIds.has(p.id);
                  const isRefunding = refundingId === p.id;
                  return (
                    <tr key={p.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 pr-3 text-xs text-gray-500 truncate max-w-[150px]">{p.user_email || p.user_id.slice(0, 8)}</td>
                      <td className="py-2 pr-3 font-medium">${(p.amount / 100).toFixed(2)}</td>
                      <td className="py-2 pr-3">
                        <StatusBadge status={isRefunded ? 'refunded' : p.status} />
                      </td>
                      <td className="py-2 pr-3 text-xs text-gray-400 font-mono truncate max-w-[120px]">{p.stripe_payment_id}</td>
                      <td className="py-2 pr-3 text-gray-500">{new Date(p.created_at).toLocaleDateString()}</td>
                      <td className="py-2">
                        {!isRefunded && p.status === 'completed' && (
                          <div>
                            <button
                              onClick={() => handleRefund(p.id)}
                              disabled={isRefunding}
                              className="text-xs px-2 py-1 bg-orange-50 text-orange-600 rounded hover:bg-orange-100 disabled:opacity-50"
                            >
                              {isRefunding ? 'Refunding...' : 'Refund'}
                            </button>
                            {refundErrors[p.id] && (
                              <p className="text-red-500 text-xs mt-0.5">{refundErrors[p.id]}</p>
                            )}
                          </div>
                        )}
                        {isRefunded && <span className="text-xs text-gray-400">Refunded</span>}
                      </td>
                    </tr>
                  );
                })}
                {payments.length === 0 && (
                  <tr><td colSpan={6} className="py-4 text-center text-gray-400">No payments yet.</td></tr>
                )}
              </tbody>
            </table>
          )}

          {/* ── Flags Tab ── */}
          {tab === 'flags' && (
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 font-medium">Flagged By</th>
                  <th className="pb-2 font-medium">Type</th>
                  <th className="pb-2 font-medium">Target</th>
                  <th className="pb-2 font-medium">Notes</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {flags.map(f => (
                  <tr key={f.id} className={`border-b hover:bg-gray-50 ${f.resolved ? 'opacity-50' : ''}`}>
                    <td className="py-2 pr-3 text-xs text-gray-500 truncate max-w-[140px]">{f.flagged_by_email || f.flagged_by.slice(0, 8)}</td>
                    <td className="py-2 pr-3">
                      <span className="bg-red-50 text-red-700 text-xs px-2 py-0.5 rounded">
                        {f.flag_type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-2 pr-3 text-xs text-gray-500 font-mono">
                      {f.optimization_id ? `opt:${f.optimization_id.slice(0, 8)}` : f.analysis_id ? `ana:${f.analysis_id.slice(0, 8)}` : '—'}
                    </td>
                    <td className="py-2 pr-3 text-xs text-gray-600 max-w-[200px] truncate">{f.notes || '—'}</td>
                    <td className="py-2 pr-3">
                      {f.resolved ? (
                        <span className="text-green-600 text-xs">✅ Resolved</span>
                      ) : (
                        <span className="text-red-600 text-xs">⚠ Open</span>
                      )}
                    </td>
                    <td className="py-2 pr-3 text-gray-500">{new Date(f.created_at).toLocaleDateString()}</td>
                    <td className="py-2">
                      {!f.resolved && (
                        <button
                          onClick={() => handleResolveFlag(f.id)}
                          disabled={resolvingId === f.id}
                          className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100 disabled:opacity-50"
                        >
                          {resolvingId === f.id ? '...' : 'Resolve'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {flags.length === 0 && (
                  <tr><td colSpan={7} className="py-4 text-center text-gray-400">No flags yet.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Modals ── */}

      {/* Resume / Compression Log Modal */}
      {resumeModal && (
        <Modal
          title={`Compressed Resume — ${resumeModal.final_word_count} words (${resumeModal.qualification_coverage_percent ?? '?'}% coverage)`}
          onClose={() => setResumeModal(null)}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="bg-gray-50 rounded p-3 text-center">
                <p className="text-gray-500 text-xs">Final Word Count</p>
                <p className="font-bold text-lg">{resumeModal.final_word_count}</p>
              </div>
              <div className="bg-gray-50 rounded p-3 text-center">
                <p className="text-gray-500 text-xs">Coverage %</p>
                <p className="font-bold text-lg">{resumeModal.qualification_coverage_percent ?? '—'}%</p>
              </div>
              <div className="bg-gray-50 rounded p-3 text-center">
                <p className="text-gray-500 text-xs">Compliance</p>
                <p className="font-bold text-lg">
                  {resumeModal.final_word_count <= 1050 ? '✅' : resumeModal.final_word_count <= 1100 ? '⚠' : '❌'}
                </p>
              </div>
            </div>
            {resumeModal.ksa_text && (
              <div>
                <h4 className="font-medium text-sm mb-1">KSA Text</h4>
                <pre className="bg-gray-50 rounded p-3 text-xs whitespace-pre-wrap">{resumeModal.ksa_text}</pre>
              </div>
            )}
            <div>
              <h4 className="font-medium text-sm mb-1">Compressed Resume Text</h4>
              <pre className="bg-gray-50 rounded p-3 text-xs whitespace-pre-wrap leading-relaxed">{resumeModal.compressed_resume_text}</pre>
            </div>
          </div>
        </Modal>
      )}

      {/* Analysis Detail Modal */}
      {analysisModal && (
        <Modal
          title={`Analysis Detail — Score: ${analysisModal.compatibility_score ?? '—'}%`}
          onClose={() => setAnalysisModal(null)}
        >
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Keyword', val: analysisModal.keyword_score },
                { label: 'Specialized', val: analysisModal.specialized_score },
                { label: 'Compliance', val: analysisModal.compliance_score },
                { label: 'Achievement', val: analysisModal.achievement_score },
              ].map(({ label, val }) => (
                <div key={label} className="bg-gray-50 rounded p-3 text-center">
                  <p className="text-gray-500 text-xs">{label}</p>
                  <p className="font-bold text-lg">{val ?? '—'}</p>
                </div>
              ))}
            </div>
            {analysisModal.feedback_json?.missing_elements && analysisModal.feedback_json.missing_elements.length > 0 && (
              <div>
                <h4 className="font-medium mb-1">Missing Elements</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {analysisModal.feedback_json.missing_elements.map((el, i) => (
                    <li key={i}>{el}</li>
                  ))}
                </ul>
              </div>
            )}
            {analysisModal.feedback_json?.weak_bullets && analysisModal.feedback_json.weak_bullets.length > 0 && (
              <div>
                <h4 className="font-medium mb-1">Weak Bullets</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {analysisModal.feedback_json.weak_bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Flag Modal */}
      {flagModal && (
        <Modal title="Flag for Hallucination Review" onClose={() => setFlagModal(null)}>
          <FlagForm
            optimizationId={flagModal.optimizationId}
            analysisId={flagModal.analysisId}
            onClose={() => setFlagModal(null)}
            onSuccess={() => {/* flags will refresh on next page load */}}
          />
        </Modal>
      )}
    </div>
  );
}

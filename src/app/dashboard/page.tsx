export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Database } from '@/types/database';

type UserRow = Database['public']['Tables']['users']['Row'];
type ResumeRow = Database['public']['Tables']['resumes']['Row'];
type JobPostRow = Database['public']['Tables']['job_posts']['Row'];
type AnalysisRow = Database['public']['Tables']['analyses']['Row'];
type OptimizationRow = Database['public']['Tables']['optimizations']['Row'];
type PaymentRow = Database['public']['Tables']['payments']['Row'];

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  // Fetch user profile
  const { data: userProfileData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  const userProfile = (userProfileData || {}) as UserRow | null;

  // Fetch analyses
  const { data: analysesData } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const analyses = (analysesData || []) as AnalysisRow[];

  // Calculate average compatibility score
  const avgCompatibilityScore = analyses.length > 0
    ? analyses.reduce((sum, a) => sum + (a.compatibility_score || 0), 0) / analyses.length
    : 0;

  // Fetch optimizations
  const { data: optimizationsData } = await supabase
    .from('optimizations')
    .select('*')
    .eq('analysis_id', analyses[0]?.id || '')
    .order('created_at', { ascending: false });

  const optimizations = (optimizationsData || []) as OptimizationRow[];

  // Fetch all optimizations for user
  const { data: allOptimizationsData } = await supabase
    .from('optimizations')
    .select('*, analyses(resume_id, job_post_id)')
    .order('created_at', { ascending: false });

  const allOptimizations = (allOptimizationsData || []) as (OptimizationRow & { analyses: { resume_id: string; job_post_id: string } })[];

  // Fetch payment history
  const { data: paymentsData } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const payments = (paymentsData || []) as PaymentRow[];

  // Fetch resumes
  const { data: resumesData } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const resumes = (resumesData || []) as ResumeRow[];

  // Calculate word count stats
  const wordCounts = resumes.map(r => r.original_text?.trim().split(/\s+/).filter(w => w.length > 0).length || 0);
  const currentWordCount = wordCounts[0] || 0;
  const avgWordCount = wordCounts.length > 0 ? wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Credits & Plan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-600">Plan</h2>
          <p className="text-2xl font-bold capitalize">{userProfile?.plan_type || 'free'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-600">Credits Balance</h2>
          <p className="text-2xl font-bold">
            {userProfile?.credits_remaining === -1 
              ? '∞ Unlimited' 
              : userProfile?.credits_remaining ?? 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-600">Total Analyses</h2>
          <p className="text-2xl font-bold">{analyses.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-600">Avg Compatibility</h2>
          <p className="text-2xl font-bold">{avgCompatibilityScore.toFixed(1)}%</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Word Count Stats */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Word Count History</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Current Resume</span>
              <span className="font-medium">{currentWordCount} words</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average</span>
              <span className="font-medium">{avgWordCount.toFixed(0)} words</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Target Range</span>
              <span className="font-medium">950-1050</span>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
              {currentWordCount < 950 ? (
                <span className="text-orange-600">⚠ Below target - add more detail</span>
              ) : currentWordCount <= 1050 ? (
                <span className="text-green-600">✅ Within optimal range</span>
              ) : currentWordCount <= 1100 ? (
                <span className="text-yellow-600">⚠ Borderline - consider optimization</span>
              ) : (
                <span className="text-red-600">❌ Exceeds limit - run optimization</span>
              )}
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Payment History</h2>
          {payments.length > 0 ? (
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {payments.slice(0, 10).map((payment) => (
                <li key={payment.id} className="flex justify-between text-sm border-b pb-2">
                  <span>{new Date(payment.created_at).toLocaleDateString()}</span>
                  <span className="font-medium">${(payment.amount / 100).toFixed(2)}</span>
                  <span className={`capitalize ${
                    payment.status === 'completed' ? 'text-green-600' : 
                    payment.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                  }`}>{payment.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No payment history yet.</p>
          )}
        </div>
      </div>

      {/* Optimization History */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Optimization History</h2>
          {allOptimizations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Word Count</th>
                    <th className="text-left py-2">Coverage %</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allOptimizations.slice(0, 10).map((opt) => (
                    <tr key={opt.id} className="border-b">
                      <td className="py-2">{new Date(opt.created_at).toLocaleDateString()}</td>
                      <td className="py-2">{opt.final_word_count}</td>
                      <td className="py-2">{opt.qualification_coverage_percent}%</td>
                      <td className="py-2">
                        {opt.final_word_count <= 1050 ? (
                          <span className="text-green-600">✅ Optimal</span>
                        ) : opt.final_word_count <= 1100 ? (
                          <span className="text-yellow-600">⚠ Borderline</span>
                        ) : (
                          <span className="text-red-600">❌ Over limit</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No optimizations yet. Upgrade to Pro to optimize your resume.</p>
          )}
        </div>
      </div>

      {/* Recent Analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Analyses</h2>
          {analyses.length > 0 ? (
            <ul className="space-y-2">
              {analyses.slice(0, 5).map((analysis) => (
                <li key={analysis.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">
                        {new Date(analysis.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-400">{analysis.word_count} words</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {analysis.compatibility_score}%
                      </p>
                      <p className="text-xs text-gray-500">match</p>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                    <div className="text-center">
                      <p className="font-medium">{analysis.keyword_score}</p>
                      <p className="text-gray-500">Keyword</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{analysis.specialized_score}</p>
                      <p className="text-gray-500">Specialized</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{analysis.compliance_score}</p>
                      <p className="text-gray-500">Compliance</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{analysis.achievement_score}</p>
                      <p className="text-gray-500">Achievement</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No analyses yet. Upload a resume and job posting to get started!</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Your Resumes</h2>
          {resumes.length > 0 ? (
            <ul className="space-y-2">
              {resumes.slice(0, 5).map((resume) => (
                <li key={resume.id} className="bg-white p-4 rounded-lg shadow">
                  <p className="text-sm text-gray-500">
                    Created: {new Date(resume.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {resume.original_text?.trim().split(/\s+/).filter(w => w.length > 0).length || 0} words
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No resumes yet. Upload your first resume!</p>
          )}
        </div>
      </div>
    </div>
  );
}

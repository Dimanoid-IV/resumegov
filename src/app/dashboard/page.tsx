export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Database } from '@/types/database';
import ProUpgradeCard from '@/components/ProUpgradeCard';
import SuccessBanner from '@/components/SuccessBanner';
import ImproveResume from '@/components/ImproveResume';
import AnalysisCard from '@/components/AnalysisCard';

type UserRow = Database['public']['Tables']['users']['Row'];
type ResumeRow = Database['public']['Tables']['resumes']['Row'];
type JobPostRow = Database['public']['Tables']['job_posts']['Row'];
type AnalysisRow = Database['public']['Tables']['analyses']['Row'];
type OptimizationRow = Database['public']['Tables']['optimizations']['Row'];
type PaymentRow = Database['public']['Tables']['payments']['Row'];

interface DashboardPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const supabase = await createClient();
  const params = await searchParams;
  const upgraded = params.upgraded === 'true';

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
      
      {upgraded && <SuccessBanner show={upgraded} />}
      
      {/* Credits & Plan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-600">Plan</h2>
          <div className="flex items-center justify-between mt-2">
            <p className="text-2xl font-bold capitalize">
              {userProfile?.plan_type || 'free'}
            </p>
            {userProfile?.plan_type === 'free' ? (
              <a
                href="/api/checkout?plan=analyst"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Перейти на Pro →
              </a>
            ) : userProfile?.plan_type === 'pro' || userProfile?.plan_type === 'basic' ? (
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                PRO Active
              </span>
            ) : null}
          </div>
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

      {/* Pro Upgrade Card */}
      <div className="mb-8">
        <ProUpgradeCard 
          currentPlan={userProfile?.plan_type || 'free'} 
          wordCount={currentWordCount}
        />
      </div>

      {/* Improve Resume Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <ImproveResume 
          currentPlan={userProfile?.plan_type || 'free'}
          wordCount={currentWordCount}
          creditsRemaining={userProfile?.credits_remaining}
        />

        {/* Word Count Stats */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Word Count Stats</h2>
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
                <span className="text-red-600">❌ Превышен лимит — выполните оптимизацию</span>
              )}
            </div>
            
            {/* CTA Button for Free Users */}
            {currentWordCount > 1050 && (!userProfile?.plan_type || userProfile.plan_type === 'free') && (
              <div className="mt-4 space-y-3">
                <a
                  href="/api/checkout?plan=analyst"
                  className="block w-full bg-slate-900 text-white font-medium px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-sm text-center"
                >
                  Оптимизировать резюме до 2 страниц — $19
                </a>
                
                <div className="text-xs text-slate-600 space-y-1">
                  <p className="font-medium">Оптимизация включает:</p>
                  <ul className="list-disc list-inside space-y-1 ml-1">
                    <li>Двухпроходную AI-компрессию</li>
                    <li>Сохранение квалификационного языка</li>
                    <li>Проверку соответствия требованиям OPM</li>
                    <li>Финальный compliance score</li>
                  </ul>
                </div>
              </div>
            )}
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
        <div className="bg-white p-6 rounded-lg shadow relative">
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
            <p className="text-gray-500">No optimizations yet.</p>
          )}
          
          {/* Overlay for free users */}
          {(!userProfile?.plan_type || userProfile.plan_type === 'free') && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-lg">
              <div className="text-center p-6">
                <svg className="w-12 h-12 text-slate-400 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <p className="text-slate-700 font-medium mb-2">Доступно в версии Pro</p>
                <a
                  href="/api/checkout?plan=analyst"
                  className="inline-block bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Перейти на Pro
                </a>
              </div>
            </div>
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
                <AnalysisCard
                  key={analysis.id}
                  analysis={analysis}
                  userPlan={userProfile?.plan_type || 'free'}
                  creditsRemaining={userProfile?.credits_remaining}
                />
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
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(resume.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        {resume.original_text?.trim().split(/\s+/).filter(w => w.length > 0).length || 0} words
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`/upload?resumeId=${resume.id}`}
                      className="flex-1 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700 transition-colors text-center"
                    >
                      View
                    </a>
                    <a
                      href={`/upload?resumeId=${resume.id}`}
                      className="flex-1 bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded hover:bg-slate-800 transition-colors text-center"
                    >
                      Analyze
                    </a>
                  </div>
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

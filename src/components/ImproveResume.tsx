'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ImproveResumeProps {
  currentPlan: string;
  wordCount?: number;
  creditsRemaining?: number;
}

export default function ImproveResume({ currentPlan, wordCount, creditsRemaining }: ImproveResumeProps) {
  const [loading, setLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const supabase = createClient();

  const isPro = currentPlan === 'pro' || currentPlan === 'basic' || currentPlan === 'enterprise';
  const hasCredits = creditsRemaining === -1 || (creditsRemaining !== undefined && creditsRemaining > 0);

  const handleOptimize = async () => {
    if (!isPro || !hasCredits) {
      setShowPaywall(true);
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please log in again');
        return;
      }

      const { data: resumeData, error: resumeError } = await supabase
        .from('resumes')
        .select('id, original_text')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (resumeError || !resumeData) {
        alert('No resume found. Please upload a resume first.');
        return;
      }

      const resume = resumeData as { id: string; original_text: string };

      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId: resume.id }),
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
      } else {
        alert(`Optimization complete! New word count: ${data.final_word_count} words`);
        window.location.reload();
      }
    } catch (error) {
      console.error('Optimization error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (planType: 'analyst' | 'professional') => {
    // Redirect to pricing or trigger checkout
    window.location.href = `/api/checkout?plan=${planType}`;
  };

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Improve Resume</h3>
          {!isPro && (
            <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded">
              Free Preview
            </span>
          )}
        </div>

        {/* Available for all users */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-slate-900">Compliance Score</p>
              <p className="text-xs text-slate-500">Check federal resume compliance</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-slate-900">Missing Elements</p>
              <p className="text-xs text-slate-500">Identify gaps in your resume</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-slate-900">High-Level Summary</p>
              <p className="text-xs text-slate-500">Overview of resume quality</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 my-4"></div>

        {/* Premium features */}
        <div className="space-y-4 mb-6">
          <div className={`flex items-start gap-3 ${!isPro ? 'opacity-50' : ''}`}>
            {isPro ? (
              <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            )}
            <div>
              <p className="text-sm font-medium text-slate-900">Full Rewrite & Compression</p>
              <p className="text-xs text-slate-500">AI-powered optimization to 950-1050 words</p>
            </div>
          </div>

          <div className={`flex items-start gap-3 ${!isPro ? 'opacity-50' : ''}`}>
            {isPro ? (
              <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            )}
            <div>
              <p className="text-sm font-medium text-slate-900">Detailed Keyword Alignment</p>
              <p className="text-xs text-slate-500">Match job description keywords</p>
            </div>
          </div>

          <div className={`flex items-start gap-3 ${!isPro ? 'opacity-50' : ''}`}>
            {isPro ? (
              <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            )}
            <div>
              <p className="text-sm font-medium text-slate-900">Download Optimized Resume</p>
              <p className="text-xs text-slate-500">Export in DOCX format</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        {isPro ? (
          <button
            onClick={handleOptimize}
            disabled={loading || (wordCount !== undefined && wordCount <= 1050)}
            className={`w-full font-semibold px-6 py-3 rounded-lg transition-colors ${
              wordCount !== undefined && wordCount <= 1050
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? 'Optimizing...' : wordCount !== undefined && wordCount <= 1050 
              ? 'Resume Already Optimized' 
              : 'Optimize Resume Now'}
          </button>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => handleUpgrade('analyst')}
              className="w-full bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upgrade to Analyst — $19.99
            </button>
            <button
              onClick={() => handleUpgrade('professional')}
              className="w-full bg-slate-900 text-white font-semibold px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Upgrade to Professional — $39.99
            </button>
          </div>
        )}
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <h3 className="text-xl font-bold text-slate-900">Premium Feature</h3>
            </div>
            <p className="text-slate-600 mb-5">
              AI-powered resume optimization is available for paid plans. Upgrade to unlock:
            </p>
            <ul className="space-y-2 mb-5 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-slate-700">Two-pass compression to 950-1050 words</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-slate-700">Full keyword alignment with job description</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-slate-700">Download optimized resume in DOCX format</span>
              </li>
            </ul>
            <div className="space-y-3">
              <button
                onClick={() => handleUpgrade('analyst')}
                className="w-full bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Analyst — $19.99
              </button>
              <button
                onClick={() => handleUpgrade('professional')}
                className="w-full bg-slate-900 text-white font-semibold px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Professional — $39.99
              </button>
            </div>
            <button
              onClick={() => setShowPaywall(false)}
              className="w-full mt-3 text-slate-500 hover:text-slate-700 text-sm"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
    </>
  );
}

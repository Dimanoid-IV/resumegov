'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ProUpgradeCardProps {
  currentPlan: string;
  wordCount?: number;
}

export default function ProUpgradeCard({ currentPlan, wordCount }: ProUpgradeCardProps) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const supabase = createClient();

  const isPro = currentPlan === 'pro' || currentPlan === 'basic' || currentPlan === 'enterprise';

  const handleUpgrade = async (planType: 'analyst' | 'professional') => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planType }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    if (!isPro) {
      setShowModal(true);
      return;
    }

    setLoading(true);
    try {
      // Get the first resume for optimization
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please log in again');
        return;
      }

      // Fetch the user's latest resume
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
        // Refresh the page to show updated data
        window.location.reload();
      }
    } catch (error) {
      console.error('Optimization error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isPro) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">ResumeGov Pro</h3>
            <p className="text-sm text-slate-500 mt-1">You are on Pro plan with full access.</p>
          </div>
          <div className="flex items-center gap-2 text-green-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Active</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-3">Выберите тариф</h3>
        
        <ul className="space-y-2 mb-5 text-blue-100">
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>AI-powered resume optimization</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Two-pass compression to 950–1,050 words</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Full keyword alignment analysis</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Download optimized resume</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Unlimited analyses</span>
          </li>
        </ul>

        <div className="space-y-3">
          <button
            onClick={() => handleUpgrade('analyst')}
            disabled={loading}
            className="w-full bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Analyst — $19.99'}
          </button>
          
          <button
            onClick={() => handleUpgrade('professional')}
            disabled={loading}
            className="w-full bg-slate-900 text-white font-semibold px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Professional — $39.99'}
          </button>
        </div>
      </div>

      {wordCount !== undefined && wordCount > 1050 && (
        <div className="mt-4">
          <button
            onClick={handleOptimize}
            className="bg-slate-900 text-white font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors text-sm"
          >
            Optimize Now
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-xl font-bold text-slate-900 mb-3">Pro Feature</h3>
            <p className="text-slate-600 mb-5">
              Resume optimization is available for Pro users. 
              Upgrade now to unlock AI-powered compression and full analysis features.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleUpgrade('analyst')}
                disabled={loading}
                className="w-full bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Analyst — $19.99'}
              </button>
              
              <button
                onClick={() => handleUpgrade('professional')}
                disabled={loading}
                className="w-full bg-slate-900 text-white font-semibold px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Professional — $39.99'}
              </button>
            </div>
            <button
              onClick={() => setShowModal(false)}
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
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/database';

type AnalysisRow = Database['public']['Tables']['analyses']['Row'];

interface AnalysisCardProps {
  analysis: AnalysisRow;
  userPlan: string;
  creditsRemaining?: number;
}

export default function AnalysisCard({ analysis, userPlan, creditsRemaining }: AnalysisCardProps) {
  const [loading, setLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const supabase = createClient();

  const isPro = userPlan === 'pro' || userPlan === 'basic' || userPlan === 'enterprise';
  const hasCredits = creditsRemaining === -1 || (creditsRemaining !== undefined && creditsRemaining > 0);

  const handleViewDetails = () => {
    // Free users see basic info, paid users see full details
    window.location.href = `/results?analysisId=${analysis.id}`;
  };

  const handleDownload = async () => {
    if (!isPro || !hasCredits) {
      setShowPaywall(true);
      return;
    }

    setLoading(true);
    try {
      // Fetch optimized resume if available
      const { data: optimizationData, error: optimizationError } = await supabase
        .from('optimizations')
        .select('compressed_resume_text')
        .eq('analysis_id', analysis.id)
        .single();

      if (optimizationError || !optimizationData) {
        alert('No optimized resume found. Please run optimization first.');
        return;
      }

      const optimization = optimizationData as { compressed_resume_text: string };

      if (optimization.compressed_resume_text) {
        // Create and download DOCX
        const { Document, Packer, Paragraph, TextRun } = await import('docx');
        
        const doc = new Document({
          sections: [{
            properties: {},
            children: optimization.compressed_resume_text.split('\n').map((text: string) => 
              new Paragraph({
                children: [new TextRun(text)],
              })
            ),
          }],
        });

        const blob = await Packer.toBlob(doc);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'optimized-resume.docx';
        a.click();
        URL.revokeObjectURL(url);
      } else {
        alert('No optimized resume found. Please run optimization first.');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download resume');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (planType: 'analyst' | 'professional') => {
    window.location.href = `/dashboard?upgrade=${planType}`;
  };

  return (
    <>
      <li className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-start mb-3">
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

        {/* Score breakdown */}
        <div className="mt-2 grid grid-cols-4 gap-2 text-xs mb-4">
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

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleViewDetails}
            className="flex-1 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            View Details
          </button>
          
          {isPro ? (
            <button
              onClick={handleDownload}
              disabled={loading}
              className="flex-1 bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Downloading...' : 'Download'}
            </button>
          ) : (
            <button
              onClick={() => setShowPaywall(true)}
              className="flex-1 bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Download
            </button>
          )}
        </div>
      </li>

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
              Download optimized resume is available for paid plans. Upgrade to unlock this and other features.
            </p>
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

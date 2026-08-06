'use client';

import { useState } from 'react';
import { downloadResumeDocx } from '@/lib/downloadResumeDocx';
import { trackEvent } from '@/lib/gtag';

export default function OptimizedResumeDownload({
  resumeText,
  analysisId,
}: {
  resumeText: string;
  analysisId: string;
}) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  async function handleDownload() {
    setDownloading(true);
    setError('');
    try {
      await downloadResumeDocx(resumeText);
      trackEvent({ eventName: 'optimized_resume_downloaded', analysis_id: analysisId });
    } catch (downloadError) {
      console.error('DOCX download error:', downloadError);
      setError('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        className="inline-flex items-center justify-center px-6 py-3 bg-white text-slate-900 font-semibold rounded transition-colors w-full sm:w-auto hover:bg-slate-100 disabled:opacity-60"
      >
        {downloading ? 'Preparing DOCX…' : 'Download Tailored Resume (.docx)'}
      </button>
      {error && <p className="text-sm text-red-300 mt-3" role="status">{error}</p>}
    </div>
  );
}

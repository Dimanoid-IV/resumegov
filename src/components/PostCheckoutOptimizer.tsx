'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { trackEvent } from '@/lib/gtag';

export default function PostCheckoutOptimizer({ analysisId }: { analysisId: string }) {
  const router = useRouter();
  const started = useRef(false);
  const [status, setStatus] = useState('Payment received. Preparing your tailored resume…');
  const [error, setError] = useState('');
  const [issues, setIssues] = useState<string[]>([]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    async function run() {
      trackEvent({ eventName: 'purchase_returned', analysis_id: analysisId });

      for (let attempt = 0; attempt < 10; attempt += 1) {
        const response = await fetch('/api/optimize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ analysisId }),
        });
        const data = await response.json() as {
          error?: string;
          reused?: boolean;
          verification_issues?: string[];
        };

        if (response.ok) {
          setStatus(data.reused
            ? 'Your tailored resume is ready.'
            : 'Your tailored, fact-checked resume is ready.');
          trackEvent({ eventName: 'resume_optimization_completed', analysis_id: analysisId });
          window.setTimeout(() => router.replace('/dashboard'), 900);
          return;
        }

        // Stripe can redirect before the webhook grants the credit. Retry only
        // that transient state; factual-safety and generation failures stop.
        if (response.status === 403 && attempt < 9) {
          setStatus('Payment confirmed. Activating your credit…');
          await new Promise(resolve => window.setTimeout(resolve, 1500));
          continue;
        }

        setError(data.error || 'We could not create the tailored resume. Your credit was not used.');
        setIssues(Array.isArray(data.verification_issues) ? data.verification_issues.slice(0, 2) : []);
        trackEvent({ eventName: 'resume_optimization_failed', analysis_id: analysisId });
        return;
      }
    }

    void run();
  }, [analysisId, router]);

  return (
    <div className={`rounded-xl border p-5 mb-6 ${error ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
      <p className={`font-semibold ${error ? 'text-red-900' : 'text-blue-900'}`}>
        {error || status}
      </p>
      {!error && (
        <p className="text-sm text-blue-700 mt-1">
          ResumeGov is tailoring the selected resume to its vacancy and checking the draft for unsupported facts.
        </p>
      )}
      {error && (
        <div className="text-sm text-red-700 mt-1">
          <p>You can retry with “Tailor Resume to Vacancy” below. Failed safety checks do not consume a credit.</p>
          {issues.length > 0 && (
            <ul className="mt-2 list-disc pl-5 space-y-1">
              {issues.map((issue) => <li key={issue}>{issue}</li>)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

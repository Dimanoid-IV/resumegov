'use client';

import { useSearchParams } from 'next/navigation';

interface SuccessBannerProps {
  show: boolean;
}

export default function SuccessBanner({ show }: SuccessBannerProps) {
  const searchParams = useSearchParams();
  const planType = searchParams.get('plan') ?? 'analyst';
  const planName = planType === 'professional' ? 'Professional' : 'Analyst';

  if (!show) return null;

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3">
        <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <div>
          <p className="font-medium text-green-900">
            Welcome to ResumeGov {planName}!
          </p>
          <p className="text-sm text-green-700">
            Your account has been upgraded. Your {planName} features are now available.
          </p>
        </div>
      </div>
    </div>
  );
}

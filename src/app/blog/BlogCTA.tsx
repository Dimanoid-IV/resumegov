import Link from 'next/link';

interface BlogCTAProps {
  variant?: 'inline' | 'bottom';
  headline?: string;
  subtext?: string;
  source?: string;
  buttonLabel?: string;
}

export default function BlogCTA({
  variant = 'inline',
  headline = 'Does Your Resume Prove the Vacancy Requirements?',
  subtext = 'Compare your documented experience with the announcement and find missing qualification evidence — free.',
  source = 'blog',
  buttonLabel = 'Check My Resume Free',
}: BlogCTAProps) {
  const isBottom = variant === 'bottom';
  const href = `/start?source=${encodeURIComponent(source)}`;

  return (
    <div
      className={`rounded-xl border-2 ${
        isBottom
          ? 'border-blue-600 bg-blue-600 text-white'
          : 'border-blue-100 bg-blue-50 text-gray-900'
      } p-6 my-8`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Icon */}
        <div
          className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg ${
            isBottom ? 'bg-white/20' : 'bg-blue-600'
          }`}
        >
          <svg
            className={`w-6 h-6 ${isBottom ? 'text-white' : 'text-white'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Text */}
        <div className="flex-1">
          <p className={`font-bold text-lg leading-tight ${isBottom ? 'text-white' : 'text-gray-900'}`}>
            {headline}
          </p>
          <p className={`text-sm mt-1 ${isBottom ? 'text-blue-100' : 'text-gray-600'}`}>
            {subtext}
          </p>
        </div>

        {/* Button */}
        <Link
          href={href}
          data-gtm-event="blog_cta_click"
          data-cta-context={source}
          className={`flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap ${
            isBottom
              ? 'bg-white text-blue-700 hover:bg-blue-50'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {buttonLabel}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Compliance badges */}
      <div className={`flex flex-wrap gap-3 mt-4 pt-4 border-t ${isBottom ? 'border-white/20' : 'border-blue-200'}`}>
        {[
          '✓ Two-page formatting risk',
          '✓ Qualification language check',
          '✓ GS level compatibility',
        ].map(badge => (
          <span
            key={badge}
            className={`text-xs font-medium ${isBottom ? 'text-blue-100' : 'text-blue-700'}`}
          >
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
}

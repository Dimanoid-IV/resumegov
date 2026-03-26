'use client';

import { useState, useCallback } from 'react';

function countWords(text: string): number {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).filter((w) => w.length > 0).length;
}

type Zone = 'empty' | 'thin' | 'optimal' | 'caution' | 'over';

function getZone(count: number): Zone {
  if (count === 0) return 'empty';
  if (count < 900) return 'thin';
  if (count <= 1050) return 'optimal';
  if (count <= 1100) return 'caution';
  return 'over';
}

const zoneConfig: Record<Zone, { bar: string; badge: string; label: string; sublabel: string }> = {
  empty: {
    bar: 'bg-slate-200',
    badge: 'bg-slate-100 text-slate-500 border-slate-200',
    label: 'Paste your resume text above',
    sublabel: 'Word count will appear here',
  },
  thin: {
    bar: 'bg-blue-400',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    label: 'Below optimal range',
    sublabel: 'Resume may lack required detail for OPM qualification review',
  },
  optimal: {
    bar: 'bg-green-500',
    badge: 'bg-green-50 text-green-700 border-green-200',
    label: 'Optimal range',
    sublabel: 'Fits within the 2-page evaluation window',
  },
  caution: {
    bar: 'bg-yellow-400',
    badge: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    label: 'Approaching page limit',
    sublabel: 'Check that your resume fits within two pages at standard formatting',
  },
  over: {
    bar: 'bg-red-500',
    badge: 'bg-red-50 text-red-700 border-red-200',
    label: 'Exceeds recommended limit',
    sublabel: 'Content beyond page two will not be evaluated by HR specialists',
  },
};

const MAX_BAR = 1200; // word count at which bar is full

export default function WordCountCalculator() {
  const [text, setText] = useState('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }, []);

  const wordCount = countWords(text);
  const zone = getZone(wordCount);
  const config = zoneConfig[zone];

  const barPercent = Math.min((wordCount / MAX_BAR) * 100, 100);

  const wordsToOptimal =
    zone === 'thin'
      ? 950 - wordCount
      : zone === 'optimal'
      ? null
      : zone === 'caution' || zone === 'over'
      ? wordCount - 1050
      : null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-4">
      {/* Textarea */}
      <div className="p-4 border-b border-slate-100">
        <label htmlFor="resume-text" className="block text-sm font-medium text-slate-700 mb-2">
          Paste your federal resume text
        </label>
        <textarea
          id="resume-text"
          value={text}
          onChange={handleChange}
          rows={12}
          placeholder="Paste your entire resume text here. The word count updates as you type."
          className="w-full resize-y rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          spellCheck={false}
        />
      </div>

      {/* Results panel */}
      <div className="p-5">
        {/* Word count badge + label */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span
              className={`inline-flex items-center gap-2 border rounded-full px-3 py-1 text-sm font-semibold ${config.badge}`}
            >
              {wordCount.toLocaleString()} words
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-800">{config.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{config.sublabel}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden mb-3">
          {/* Zone markers */}
          <div
            className="absolute top-0 bottom-0 w-px bg-slate-300"
            style={{ left: `${(900 / MAX_BAR) * 100}%` }}
          />
          <div
            className="absolute top-0 bottom-0 w-px bg-slate-300"
            style={{ left: `${(950 / MAX_BAR) * 100}%` }}
          />
          <div
            className="absolute top-0 bottom-0 w-px bg-slate-300"
            style={{ left: `${(1050 / MAX_BAR) * 100}%` }}
          />
          <div
            className="absolute top-0 bottom-0 w-px bg-slate-300"
            style={{ left: `${(1100 / MAX_BAR) * 100}%` }}
          />
          {/* Fill */}
          <div
            className={`h-full rounded-full transition-all duration-200 ${config.bar}`}
            style={{ width: `${barPercent}%` }}
          />
        </div>

        {/* Marker labels */}
        <div className="flex justify-between text-xs text-slate-400 mb-4 select-none">
          <span>0</span>
          <span style={{ marginLeft: `${(900 / MAX_BAR) * 100 - 4}%` }}>900</span>
          <span>950</span>
          <span>1,050</span>
          <span>1,100</span>
          <span>1,200+</span>
        </div>

        {/* Contextual hint */}
        {zone === 'thin' && wordsToOptimal !== null && (
          <p className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
            Add approximately <strong>{wordsToOptimal} more words</strong> to reach the optimal
            950-word floor. Expand work experience entries with specific duties, outcomes, and
            specialized experience language.
          </p>
        )}
        {zone === 'caution' && wordsToOptimal !== null && (
          <p className="text-sm text-yellow-800 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
            You are <strong>{wordsToOptimal} words over</strong> the 1,050-word optimal ceiling.
            Verify that your resume fits within two pages at standard formatting before submitting.
          </p>
        )}
        {zone === 'over' && wordsToOptimal !== null && (
          <p className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            You are <strong>{wordsToOptimal} words over</strong> the recommended 1,050-word limit.
            Content beyond page two will not be evaluated by HR specialists under the September
            2025 OPM policy. Consider removing non-essential content while preserving specialized
            experience language.
          </p>
        )}
        {zone === 'optimal' && (
          <p className="text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            Your word count is within the optimal range. Verify that all required OPM fields
            are present: month/year dates, hours per week, and specialized experience language
            for each position.
          </p>
        )}
      </div>
    </div>
  );
}

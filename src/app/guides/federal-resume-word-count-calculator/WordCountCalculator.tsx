'use client';

import { useMemo, useState } from 'react';

export default function WordCountCalculator() {
  const [text, setText] = useState('');
  const wordCount = useMemo(
    () => (text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0),
    [text],
  );
  const characterCount = text.length;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="p-5 border-b border-slate-100">
        <label htmlFor="resume-text" className="block text-sm font-medium text-slate-700 mb-2">
          Paste your federal resume text
        </label>
        <textarea
          id="resume-text"
          value={text}
          onChange={event => setText(event.target.value)}
          rows={13}
          placeholder="Paste your resume text here. Nothing is uploaded or stored by this counter."
          className="w-full resize-y rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          spellCheck={false}
        />
      </div>
      <div className="p-5">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Words</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{wordCount.toLocaleString()}</p>
          </div>
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Characters</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{characterCount.toLocaleString()}</p>
          </div>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 leading-relaxed">
          <strong>Word count cannot determine compliance.</strong> OPM sets a two-page limit, not a universal word limit. Paste the content into your final document, use the formatting allowed by USAJOBS, and verify the rendered PDF is two pages or less.
        </div>
      </div>
    </div>
  );
}

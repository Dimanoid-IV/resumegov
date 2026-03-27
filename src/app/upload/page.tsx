'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const FREE_LIMIT = 3;
const MIN_RESUME_WORDS = 100;
const MAX_RESUME_WORDS = 12000;
const MAX_JOB_WORDS = 6000;

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

function ProgressBar({ used, max }: { used: number; max: number }) {
  const pct = Math.min(100, (used / max) * 100);
  const remaining = max - used;
  const color = remaining === 0 ? 'bg-red-500' : remaining === 1 ? 'bg-amber-500' : 'bg-blue-600';
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-slate-100 rounded-full h-1.5">
        <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-mono font-semibold ${remaining === 0 ? 'text-red-600' : 'text-slate-500'}`}>
        {remaining} of {max} remaining
      </span>
    </div>
  );
}

export default function UploadPage() {
  const router = useRouter();
  const supabase = createClient();

  const [authChecked, setAuthChecked] = useState(false);
  const [freeCount, setFreeCount] = useState(0);
  const [planType, setPlanType] = useState<string>('free');

  const [resumeText, setResumeText] = useState('');
  const [jobText, setJobText] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth + profile check
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace('/start');
        return;
      }
      supabase
        .from('users')
        .select('free_analysis_count, plan_type')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            const d = data as { free_analysis_count?: number; plan_type?: string };
            setFreeCount(d.free_analysis_count ?? 0);
            setPlanType(d.plan_type ?? 'free');
          }
          setAuthChecked(true);
        });
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // File upload handler (.txt only client-side)
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.txt')) {
      setError('Only .txt files are supported for upload. For PDF or DOCX, copy-paste the text below.');
      e.target.value = '';
      return;
    }
    if (file.size > 500_000) {
      setError('File too large. Maximum 500 KB.');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => setResumeText((ev.target?.result as string) ?? '');
    reader.readAsText(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const rw = wordCount(resumeText);
    const jw = wordCount(jobText);

    if (rw < MIN_RESUME_WORDS) {
      setError(`Resume is too short (${rw} words). Minimum ${MIN_RESUME_WORDS} words required.`);
      return;
    }
    if (rw > MAX_RESUME_WORDS) {
      setError(`Resume exceeds maximum (${rw} words). Trim to under ${MAX_RESUME_WORDS.toLocaleString()} words.`);
      return;
    }
    if (jw < 50) {
      setError('Job announcement is too short. Paste the full vacancy announcement text.');
      return;
    }
    if (jw > MAX_JOB_WORDS) {
      setError(`Job announcement exceeds maximum (${jw} words). Trim to under ${MAX_JOB_WORDS.toLocaleString()} words.`);
      return;
    }

    setLoading(true);

    const res = await fetch('/api/free-analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resumeText: resumeText.trim(),
        jobText: jobText.trim(),
        jobUrl: jobUrl.trim() || undefined,
      }),
    });

    const data = await res.json() as { analysisId?: string; error?: string; remaining?: number };
    setLoading(false);

    if (!res.ok) {
      if (res.status === 429) {
        setFreeCount(FREE_LIMIT); // trigger upgrade UI
        return;
      }
      setError(data.error ?? 'Analysis failed. Please try again.');
      return;
    }

    router.push(`/results/${data.analysisId}`);
  }

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <svg className="animate-spin w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  const isBlocked = planType === 'free' && freeCount >= FREE_LIMIT;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Nav */}
      <nav className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-white tracking-tight">
            Resume<span className="text-blue-400">Gov</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Step indicator */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-3">
          <ol className="flex items-center gap-2 text-xs text-slate-400">
            <li className="text-slate-400">Email</li>
            <li className="text-slate-300">›</li>
            <li className="font-semibold text-slate-900">Upload</li>
            <li className="text-slate-300">›</li>
            <li className="text-slate-400">Results</li>
            <li className="text-slate-300">›</li>
            <li className="text-slate-400">Optimize</li>
          </ol>
        </div>
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10">

        {/* ── Upgrade gate ── */}
        {isBlocked ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Free analyses used</h2>
            <p className="text-slate-500 text-sm mb-6">
              You have used all {FREE_LIMIT} free analyses. Upgrade to run unlimited analyses and unlock optimization.
            </p>
            <Link
              href="/#pricing"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
            >
              View Plans
            </Link>
            <p className="text-xs text-slate-400 mt-4">
              Analyst pack from $9.99 · Pro unlimited at $29.99/month
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Analyze My Resume</h1>
              <p className="text-slate-500 text-sm">
                Paste your resume and the USAJOBS vacancy announcement to receive your compatibility score.
              </p>
              <div className="mt-3">
                <ProgressBar used={freeCount} max={FREE_LIMIT} />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Resume */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-slate-900">
                    Your Federal Resume
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Upload .txt file
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt"
                      className="hidden"
                      onChange={handleFile}
                    />
                  </div>
                </div>
                <textarea
                  required
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  rows={14}
                  placeholder="Paste your full resume text here. For PDF or Word documents, open the file and copy-paste the content."
                  className="w-full text-sm text-slate-700 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-y placeholder:text-slate-300"
                />
                <div className="flex justify-between mt-2 text-xs text-slate-400">
                  <span>
                    Target: 950–1,050 words · Hard limit: 1,100
                  </span>
                  {resumeText && (
                    <span className={
                      wordCount(resumeText) > 1100 ? 'text-red-600 font-semibold' :
                      wordCount(resumeText) > 1050 ? 'text-amber-600 font-semibold' :
                      'text-green-600'
                    }>
                      {wordCount(resumeText)} words
                    </span>
                  )}
                </div>
              </div>

              {/* Job Announcement */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  USAJOBS Vacancy Announcement
                </label>

                {/* Optional URL field */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Vacancy URL
                    <span className="ml-1 font-normal text-slate-400">(optional)</span>
                  </label>
                  <input
                    type="url"
                    value={jobUrl}
                    onChange={e => setJobUrl(e.target.value)}
                    placeholder="https://www.usajobs.gov/job/..."
                    className="w-full text-sm text-slate-700 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent placeholder:text-slate-300"
                  />
                </div>

                <textarea
                  required
                  value={jobText}
                  onChange={e => setJobText(e.target.value)}
                  rows={10}
                  placeholder="Paste the full vacancy announcement text from USAJOBS. Include the qualifications, specialized experience, and required elements sections."
                  className="w-full text-sm text-slate-700 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-y placeholder:text-slate-300"
                />
                <p className="mt-2 text-xs text-slate-400">
                  Include the &quot;Qualifications&quot; and &quot;Specialized Experience&quot; sections for accurate scoring.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Analyzing — this takes 15–30 seconds…
                  </>
                ) : 'Analyze My Resume'}
              </button>

              <p className="text-center text-xs text-slate-400">
                Analysis does not modify your resume. No data is shared externally.
              </p>
            </form>
          </>
        )}
      </main>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { loadAnalysisDraft, saveAnalysisDraft } from '@/lib/analysis-draft';
import { trackEvent } from '@/lib/gtag';

type Stage = 'documents' | 'email' | 'sent';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_RESUME_WORDS = 100;
const MAX_RESUME_WORDS = 12000;
const MIN_JOB_WORDS = 50;
const MAX_JOB_WORDS = 6000;

function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim().toLowerCase());
}

export default function StartPage() {
  const [stage, setStage] = useState<Stage>('documents');
  const [resumeText, setResumeText] = useState('');
  const [jobText, setJobText] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [source, setSource] = useState('direct');
  const startedRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resumeWords = wordCount(resumeText);
  const jobWords = wordCount(jobText);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sourceParam = params.get('source')?.slice(0, 80) || 'direct';
    const errorParam = params.get('error');
    const timer = window.setTimeout(() => {
      const existingDraft = loadAnalysisDraft();
      if (existingDraft) {
        setResumeText(existingDraft.resumeText);
        setJobText(existingDraft.jobText);
        setJobUrl(existingDraft.jobUrl ?? '');
        setUploadedFileName(existingDraft.uploadedFileName ?? '');
      }
      setSource(sourceParam);
      trackEvent({ eventName: 'start_view', source: sourceParam });
      if (errorParam) {
        setErrorMsg(decodeURIComponent(errorParam));
        setStage(existingDraft ? 'email' : 'documents');
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function markDraftStarted(input: 'resume' | 'vacancy' | 'file') {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent({ eventName: 'analysis_draft_started', input, source });
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    markDraftStarted('file');
    setErrorMsg('');
    if (!/\.(pdf|docx|txt)$/i.test(file.name)) {
      setErrorMsg('Supported formats: PDF, DOCX, and TXT.');
      event.target.value = '';
      return;
    }
    if (file.size > 6 * 1024 * 1024) {
      setErrorMsg('File too large. Maximum size is 6 MB.');
      event.target.value = '';
      return;
    }

    setExtracting(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const response = await fetch('/api/extract-resume', { method: 'POST', body: form });
      const data = await response.json() as { text?: string; wordCount?: number; error?: string };
      if (!response.ok || !data.text) {
        setErrorMsg(data.error || 'Could not extract text from this file.');
        return;
      }

      setResumeText(data.text);
      setUploadedFileName(file.name);
      trackEvent({
        eventName: 'resume_file_extracted',
        file_type: file.name.split('.').pop()?.toLowerCase(),
        word_count: data.wordCount,
        entry_point: 'start',
      });
    } catch {
      setErrorMsg('Could not read this file. Try another file or paste the text.');
    } finally {
      setExtracting(false);
      event.target.value = '';
    }
  }

  function persistDraft(): boolean {
    return saveAnalysisDraft({
      resumeText: resumeText.trim(),
      jobText: jobText.trim(),
      jobUrl: jobUrl.trim() || undefined,
      uploadedFileName: uploadedFileName || undefined,
      source,
    });
  }

  function handleDocumentsContinue(event: React.FormEvent) {
    event.preventDefault();
    setErrorMsg('');

    if (resumeWords < MIN_RESUME_WORDS) {
      setErrorMsg(`Add more of your resume before continuing (${resumeWords}/${MIN_RESUME_WORDS} minimum words).`);
      return;
    }
    if (resumeWords > MAX_RESUME_WORDS) {
      setErrorMsg(`Resume text is over ${MAX_RESUME_WORDS.toLocaleString()} words. Remove unrelated content and try again.`);
      return;
    }
    if (jobWords < MIN_JOB_WORDS) {
      setErrorMsg(`Paste the vacancy qualifications and specialized experience sections (${jobWords}/${MIN_JOB_WORDS} minimum words).`);
      return;
    }
    if (jobWords > MAX_JOB_WORDS) {
      setErrorMsg(`Vacancy text is over ${MAX_JOB_WORDS.toLocaleString()} words. Keep the qualifications and evaluation sections.`);
      return;
    }
    if (!persistDraft()) {
      setErrorMsg('This browser blocked temporary draft storage. Enable site storage or use a standard browser window.');
      return;
    }

    trackEvent({ eventName: 'analysis_draft_ready', resume_word_count: resumeWords, vacancy_word_count: jobWords, source });
    setStage('email');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleEmailSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrorMsg('');

    const normalizedEmail = email.trim().toLowerCase();
    if (!isValidEmail(normalizedEmail)) {
      setErrorMsg('Enter a valid email address.');
      return;
    }
    if (!persistDraft()) {
      setErrorMsg('This browser blocked temporary draft storage. Enable site storage and try again.');
      return;
    }

    trackEvent({ eventName: 'signup_submitted', source, entry_point: 'draft_ready' });
    setLoading(true);
    const currentOrigin = window.location.hostname === 'localhost'
      ? 'https://www.resumegov.com'
      : window.location.origin;
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: { emailRedirectTo: `${currentOrigin}/auth/callback?next=/upload?auth=success` },
    });

    setLoading(false);
    if (error) {
      trackEvent({ eventName: 'magic_link_failed', error_code: error.code || 'unknown' });
      setErrorMsg(error.message);
      return;
    }

    trackEvent({ eventName: 'magic_link_sent', source });
    setStage('sent');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-slate-950 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-white tracking-tight">Resume<span className="text-blue-400">Gov</span></Link>
          <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">Sign in</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="mb-8 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-blue-700 mb-3">Free federal resume pre-check</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight">Check the resume first. Add your email only when it is ready.</h1>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">Add your resume and one USAJOBS vacancy. We verify that there is enough information for a useful comparison before asking you to sign in.</p>
        </div>

        <ol aria-label="Analysis steps" className="mb-8 max-w-3xl mx-auto grid grid-cols-3 gap-2 text-xs">
          {[
            ['1', 'Add documents'],
            ['2', 'Secure with email'],
            ['3', 'View free report'],
          ].map(([number, label], index) => {
            const active = (stage === 'documents' && index === 0) || (stage === 'email' && index === 1) || (stage === 'sent' && index === 2);
            return <li key={number} className={`rounded-lg border px-3 py-3 ${active ? 'border-blue-500 bg-blue-50 text-blue-800' : 'border-slate-200 bg-white text-slate-500'}`}><span className="font-mono mr-1">{number}.</span> {label}</li>;
          })}
        </ol>

        {errorMsg ? <div id="start-error" role="alert" className="max-w-3xl mx-auto mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{errorMsg}</div> : null}

        {stage === 'documents' ? (
          <form onSubmit={handleDocumentsContinue} className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
            <div className="space-y-5">
              <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <label htmlFor="resume-text" className="font-semibold text-slate-900">Your federal resume</label>
                  <div>
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={extracting} className="text-sm font-medium text-blue-700 hover:underline disabled:opacity-50">{extracting ? 'Reading file…' : 'Upload PDF, DOCX, or TXT'}</button>
                    <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" className="hidden" onChange={handleFile} />
                  </div>
                </div>
                {uploadedFileName ? <p className="mb-2 text-xs font-medium text-green-700">✓ Text extracted from {uploadedFileName}</p> : null}
                <textarea id="resume-text" required rows={12} value={resumeText} onChange={event => { markDraftStarted('resume'); setResumeText(event.target.value); }} placeholder="Upload your resume or paste its text here. Remove SSNs, dates of birth, and other unnecessary identifiers." aria-describedby="resume-count" className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-slate-900 resize-y" />
                <p id="resume-count" className={`mt-2 text-xs ${resumeWords >= MIN_RESUME_WORDS ? 'text-green-700' : 'text-slate-500'}`}>{resumeWords.toLocaleString()} words detected · minimum {MIN_RESUME_WORDS}</p>
              </section>

              <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm">
                <label htmlFor="job-url" className="block font-semibold text-slate-900 mb-3">USAJOBS vacancy</label>
                <input id="job-url" type="url" value={jobUrl} onChange={event => setJobUrl(event.target.value)} placeholder="Vacancy URL (optional)" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 mb-3" />
                <textarea id="job-text" required rows={10} value={jobText} onChange={event => { markDraftStarted('vacancy'); setJobText(event.target.value); }} placeholder="Paste the Qualifications, Specialized Experience, and How You Will Be Evaluated sections." aria-describedby="job-count" className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-slate-900 resize-y" />
                <p id="job-count" className={`mt-2 text-xs ${jobWords >= MIN_JOB_WORDS ? 'text-green-700' : 'text-slate-500'}`}>{jobWords.toLocaleString()} words detected · minimum {MIN_JOB_WORDS}</p>
              </section>

              <button type="submit" className="w-full rounded-lg bg-slate-950 px-6 py-3.5 font-semibold text-white hover:bg-slate-800 transition-colors">Verify Inputs and Continue</button>
              <p className="text-center text-xs text-slate-500">Your temporary draft is available in this browser for 60 minutes and is removed after it is restored. Files are processed only to extract text. See the <Link href="/privacy" className="underline">Privacy Policy</Link>.</p>
            </div>

            <aside className="bg-slate-950 text-white rounded-xl p-6 lg:sticky lg:top-6">
              <p className="text-xs uppercase tracking-widest text-blue-300 mb-3">What the free report checks</p>
              <ul className="space-y-4 text-sm text-slate-200">
                {[
                  'Qualification and specialized-experience evidence',
                  'Vacancy-language alignment without keyword stuffing',
                  'Dates, hours per week, scope, and measurable outcomes',
                  'Two-page formatting risk and missing application details',
                ].map(item => <li key={item} className="flex gap-2"><span className="text-green-400">✓</span><span>{item}</span></li>)}
              </ul>
              <div className="mt-6 pt-5 border-t border-slate-700 text-xs text-slate-400 leading-relaxed">No payment card. ResumeGov is independent from USAJOBS, OPM, and hiring agencies. The report is decision support, not an eligibility determination.</div>
            </aside>
          </form>
        ) : null}

        {stage === 'email' ? (
          <div className="max-w-lg mx-auto bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
            <div className="rounded-lg bg-green-50 border border-green-200 p-4 mb-6">
              <p className="font-semibold text-green-900">Your inputs are ready</p>
              <p className="text-sm text-green-800 mt-1">{resumeWords.toLocaleString()} resume words and {jobWords.toLocaleString()} vacancy words detected.</p>
            </div>
            <h2 className="text-2xl font-bold text-slate-950">Where should we secure your report?</h2>
            <p className="mt-2 text-sm text-slate-600">We will send a password-free link. Return through it and your draft will be restored automatically.</p>
            <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                <input id="email" type="email" required autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" aria-describedby="email-privacy" className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
              </div>
              <button type="submit" disabled={loading} className="w-full rounded-lg bg-slate-950 px-6 py-3.5 font-semibold text-white hover:bg-slate-800 disabled:opacity-50">{loading ? 'Sending secure link…' : 'Email My Secure Link'}</button>
            </form>
            <p id="email-privacy" className="mt-4 text-xs text-slate-500 text-center">No password or payment card required.</p>
            <button type="button" onClick={() => { setErrorMsg(''); setStage('documents'); }} className="mt-5 w-full text-sm text-blue-700 hover:underline">Back to documents</button>
          </div>
        ) : null}

        {stage === 'sent' ? (
          <div className="max-w-lg mx-auto bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto text-xl">✓</div>
            <h2 className="mt-4 text-2xl font-bold text-slate-950">Check your email</h2>
            <p className="mt-3 text-sm text-slate-600">Open the secure link sent to <strong>{email}</strong>. Your prepared draft will be restored when you return.</p>
            <p className="mt-3 text-xs text-slate-500">The link expires in 60 minutes. Check spam or promotions if it does not arrive.</p>
            <button type="button" onClick={() => setStage('email')} className="mt-6 text-sm text-blue-700 hover:underline">Use a different email</button>
          </div>
        ) : null}
      </main>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Privacy Policy | ResumeGov',
  description: 'How ResumeGov collects, processes, and protects account and resume data.',
  alternates: { canonical: 'https://www.resumegov.com/privacy' },
};

const sections = [
  ['Information we process', [
    'We process the email address you use to sign in, the resume and vacancy-announcement text you submit, analysis and optimization results, and basic account and usage records.',
    'Federal resumes can contain sensitive personal information. Remove Social Security numbers, dates of birth, photographs, and any information that is not needed for the analysis before submitting text.',
  ]],
  ['How we use information', [
    'We use submitted information to authenticate you, generate the requested analysis or optimization, enforce usage limits, maintain your history, support the service, prevent abuse, and process purchases.',
    'We do not sell resume content or use it to make employment decisions. ResumeGov does not submit applications to USAJOBS.',
  ]],
  ['Service providers', [
    'ResumeGov relies on service providers to operate the product. These currently include Supabase for authentication and database services, OpenAI for AI-assisted analysis and optimization, Vercel for hosting, Stripe for payments, and Google Analytics for aggregated product analytics.',
    'Information is disclosed to these providers only as needed to deliver their respective services and is handled under their own contractual and privacy terms.',
  ]],
  ['Retention and your choices', [
    'Account records, submitted content, and generated results may be retained while your account is active and as needed for security, support, legal, and transaction-record obligations.',
    'To request access, correction, or deletion of your ResumeGov data, email privacy@resumegov.com from the address associated with your account. Some transaction or security records may need to be retained where required by law.',
  ]],
  ['Security and changes', [
    'We use reasonable technical and organizational safeguards, but no online service can guarantee absolute security. Do not submit classified information, authentication credentials, or unnecessary sensitive identifiers.',
    'We may update this policy as the service changes. Material revisions will be reflected by the effective date on this page.',
  ]],
] as const;

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteNav />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-xs font-mono text-blue-700 uppercase tracking-widest mb-3">Effective July 28, 2026</p>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-5">Privacy Policy</h1>
        <p className="text-lg text-slate-600 leading-relaxed mb-12">
          This policy explains what happens to information you provide when using ResumeGov.
        </p>
        <div className="space-y-10">
          {sections.map(([title, paragraphs]) => (
            <section key={title}>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">{title}</h2>
              <div className="space-y-3 text-slate-600 leading-relaxed">
                {paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>
          ))}
        </div>
        <p className="mt-12 text-sm text-slate-500">
          Questions? Email <a className="text-blue-700 underline" href="mailto:privacy@resumegov.com">privacy@resumegov.com</a>
          {' '}or review our <Link className="text-blue-700 underline" href="/terms">Terms of Service</Link>.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}

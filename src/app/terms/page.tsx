import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Terms of Service | ResumeGov',
  description: 'Terms governing use of ResumeGov federal resume analysis and optimization tools.',
  alternates: { canonical: 'https://www.resumegov.com/terms' },
};

const sections = [
  ['What ResumeGov provides', 'ResumeGov provides automated resume-analysis, comparison, and drafting assistance. It is an independent service and is not affiliated with USAJOBS, OPM, or any federal agency. Scores, suggestions, and generated text are informational tools, not a guarantee of eligibility, referral, interview, or employment.'],
  ['Your responsibilities', 'You are responsible for reviewing every result, confirming that all statements are accurate, following the specific vacancy announcement, and checking the final rendered document against USAJOBS requirements before submission. You must not submit unlawful content, classified information, credentials, or another person’s data without authorization.'],
  ['Accounts and acceptable use', 'Keep access to your account secure. You may not probe, disrupt, reverse engineer, scrape at unreasonable volume, bypass usage limits, or use the service to fabricate qualifications or misrepresent an applicant’s experience.'],
  ['Payments', 'Prices and included usage are displayed before purchase. Subscriptions renew at the disclosed interval until canceled. Except where required by law or expressly stated at checkout, consumed credits and completed digital services are non-refundable. Payment processing is provided by Stripe.'],
  ['Availability and liability', 'The service is provided on an “as is” and “as available” basis. We may change or discontinue features and cannot guarantee uninterrupted operation or a particular hiring outcome. To the maximum extent permitted by law, ResumeGov is not liable for indirect, incidental, or consequential losses arising from use of the service or reliance on its output.'],
] as const;

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteNav />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-xs font-mono text-blue-700 uppercase tracking-widest mb-3">Effective July 28, 2026</p>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-5">Terms of Service</h1>
        <p className="text-lg text-slate-600 leading-relaxed mb-12">By using ResumeGov, you agree to these terms.</p>
        <div className="space-y-10 text-slate-600 leading-relaxed">
          {sections.map(([title, body]) => (
            <section key={title}>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">{title}</h2>
              <p>{body}</p>
            </section>
          ))}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Contact and changes</h2>
            <p>
              We may revise these terms as the product evolves. Questions can be sent to{' '}
              <a className="text-blue-700 underline" href="mailto:support@resumegov.com">support@resumegov.com</a>.
              {' '}Please also review our <Link className="text-blue-700 underline" href="/privacy">Privacy Policy</Link>.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

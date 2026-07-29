import type { Metadata } from 'next';
import Link from 'next/link';
import SiteFooter from '@/components/SiteFooter';
import SiteNav from '@/components/SiteNav';
import ContactForm from './ContactForm';

const CONTACT_URL = 'https://www.resumegov.com/contact';
const SUPPORT_EMAIL = 'support@resumegov.com';

export const metadata: Metadata = {
  title: 'Contact ResumeGov Support',
  description:
    'Contact ResumeGov about product questions, billing, technical problems, resume-analysis feedback, privacy, or editorial corrections.',
  alternates: { canonical: CONTACT_URL },
  openGraph: {
    title: 'Contact ResumeGov Support',
    description: 'Get help with ResumeGov products, billing, technical issues, or content.',
    url: CONTACT_URL,
    type: 'website',
  },
};

export default function ContactPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact ResumeGov Support',
    url: CONTACT_URL,
    mainEntity: {
      '@type': 'Organization',
      name: 'ResumeGov',
      url: 'https://www.resumegov.com',
      email: SUPPORT_EMAIL,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: SUPPORT_EMAIL,
        availableLanguage: 'English',
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <SiteNav />

      <main className="mx-auto max-w-5xl px-6 py-14 sm:py-20">
        <nav className="mb-6 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900">Contact</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <section>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-700">
              Contact ResumeGov
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-950">
              How can we help?
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Send questions, report a problem, suggest an improvement, or tell us where an
              analysis was unclear.
            </p>

            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-slate-900">Email us directly</p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="mt-1 inline-block font-semibold text-blue-700 underline"
              >
                {SUPPORT_EMAIL}
              </a>
            </div>

            <div className="mt-6 text-sm leading-relaxed text-slate-600">
              <p className="font-semibold text-slate-900">Before sending</p>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>Do not include passwords or full payment-card details.</li>
                <li>Remove SSNs and sensitive information from resume excerpts.</li>
                <li>For billing help, include the email used for your ResumeGov account.</li>
              </ul>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">Send a message</h2>
            <p className="mb-7 mt-2 text-sm leading-relaxed text-slate-600">
              Your message is prepared locally and opens in your email app. ResumeGov does not
              store the form contents on the website.
            </p>
            <ContactForm />
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

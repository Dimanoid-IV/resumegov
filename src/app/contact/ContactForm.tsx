'use client';

import { FormEvent, useState } from 'react';

const SUPPORT_EMAIL = 'support@resumegov.com';

export default function ContactForm() {
  const [openedEmail, setOpenedEmail] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const topic = String(formData.get('topic') ?? 'General question').trim();
    const message = String(formData.get('message') ?? '').trim();

    const subject = `[ResumeGov] ${topic}`;
    const body = [
      `Name: ${name}`,
      `Reply email: ${email}`,
      '',
      message,
    ].join('\n');

    setOpenedEmail(true);
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-semibold text-slate-800 mb-2">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={100}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-semibold text-slate-800 mb-2">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-topic" className="block text-sm font-semibold text-slate-800 mb-2">
          What can we help with?
        </label>
        <select
          id="contact-topic"
          name="topic"
          defaultValue="Product question"
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option>Product question</option>
          <option>Billing or payment</option>
          <option>Technical problem</option>
          <option>Resume analysis feedback</option>
          <option>Content correction</option>
          <option>Privacy request</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-semibold text-slate-800 mb-2">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={4000}
          rows={7}
          aria-describedby="contact-message-help"
          className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="Please include the page or feature involved and what you expected to happen. Do not include passwords, payment-card details, or sensitive resume information."
        />
        <p id="contact-message-help" className="mt-2 text-xs text-slate-500">
          The button opens your email app with this message prepared. You review and send it from there.
        </p>
      </div>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
      >
        Open email to send
      </button>

      {openedEmail && (
        <p role="status" className="text-sm text-slate-600">
          If your email app did not open, email us directly at{' '}
          <a className="font-semibold text-blue-700 underline" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>.
        </p>
      )}
    </form>
  );
}

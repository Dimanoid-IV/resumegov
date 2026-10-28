const usajobsGuidance =
  "https://help.usajobs.gov/faq/application/documents/resume/what-to-include";

export function ResumeRuleNotice() {
  return (
    <aside className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-5 text-gray-800">
      <p>
        <strong>Current USAJOBS rule:</strong> Your resume must be two pages or less.
        These examples illustrate how to describe relevant experience; they are not
        ready-to-submit templates. Always follow the specific job announcement. See{" "}
        <a className="text-blue-700 underline" href={usajobsGuidance}>
          official USAJOBS resume guidance
        </a>.
      </p>
    </aside>
  );
}

export function ResumeExampleCTA({ source }: { source: string }) {
  return (
    <section className="bg-blue-600 rounded-lg shadow-lg p-8 text-center text-white">
      <h2 className="text-2xl font-bold mb-4">Check Your Resume Against a Federal Job</h2>
      <p className="text-lg mb-6 text-blue-100">
        Upload your resume and a USAJOBS announcement to see possible gaps in your
        experience and requirements before you apply. The check does not guarantee
        eligibility, referral, or an interview.
      </p>
      <a
        href={`/start?source=${encodeURIComponent(source)}`}
        data-gtm-event="examples_cta_click"
        data-cta-context={source}
        className="inline-block bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
      >
        Check My Resume Free
      </a>
    </section>
  );
}

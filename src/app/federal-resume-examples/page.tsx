import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Federal Resume Examples by GS Level & Series | ResumeGov",
  description: "Browse professional federal resume examples for GS-5 through GS-11 positions and popular job series including IT Specialist, Management Analyst, Accountant, and Administrative Officer.",
  keywords: "federal resume examples, GS resume examples, government resume samples, USAJobs resume, federal job resume template",
  alternates: {
    canonical: "https://resumegov.com/federal-resume-examples/",
  },
  openGraph: {
    title: "Federal Resume Examples by GS Level & Series | ResumeGov",
    description: "Browse professional federal resume examples for GS-5 through GS-11 positions and popular job series including IT Specialist, Management Analyst, Accountant, and Administrative Officer.",
    url: "https://resumegov.com/federal-resume-examples/",
    type: "website",
    siteName: "ResumeGov",
  },
};

export default function FederalResumeExamplesHub() {
  const gsLevels = [
    {
      level: "GS-5",
      title: "GS-5 Federal Resume Example",
      description: "Entry-level federal resume example for GS-5 positions. Ideal for recent graduates and candidates with minimal professional experience seeking federal employment.",
      url: "/federal-resume-examples/gs-5/",
    },
    {
      level: "GS-7",
      title: "GS-7 Federal Resume Example",
      description: "Federal resume example for GS-7 positions. Perfect for candidates with superior academic achievement or some specialized experience in their field.",
      url: "/federal-resume-examples/gs-7/",
    },
    {
      level: "GS-9",
      title: "GS-9 Federal Resume Example",
      description: "Federal resume example for GS-9 positions. Designed for candidates with a master's degree or equivalent combination of education and specialized experience.",
      url: "/federal-resume-examples/gs-9/",
    },
    {
      level: "GS-11",
      title: "GS-11 Federal Resume Example",
      description: "Federal resume example for GS-11 positions. Tailored for experienced professionals with advanced degrees or significant specialized experience in federal or private sector roles.",
      url: "/federal-resume-examples/gs-11/",
    },
  ];

  const jobSeries = [
    {
      series: "2210",
      title: "2210 IT Specialist Federal Resume Example",
      description: "Comprehensive federal resume example for IT Specialist (2210) positions. Includes cybersecurity, network administration, and systems analysis competencies.",
      url: "/federal-resume-examples/2210-it-specialist/",
    },
    {
      series: "0343",
      title: "0343 Management Analyst Federal Resume Example",
      description: "Professional federal resume example for Management Analyst (0343) positions. Features program analysis, process improvement, and strategic planning expertise.",
      url: "/federal-resume-examples/0343-management-analyst/",
    },
    {
      series: "0510",
      title: "0510 Accountant Federal Resume Example",
      description: "Detailed federal resume example for Accountant (0510) positions. Highlights financial analysis, auditing, budget formulation, and regulatory compliance experience.",
      url: "/federal-resume-examples/0510-accountant/",
    },
    {
      series: "0301",
      title: "0301 Administrative Officer Federal Resume Example",
      description: "Complete federal resume example for Administrative Officer (0301) positions. Showcases office management, program support, and administrative operations expertise.",
      url: "/federal-resume-examples/0301-administrative-officer/",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><a href="/" className="hover:text-blue-600 transition-colors">Home</a></li>
            <li><span className="mx-2">/</span></li>
            <li className="text-gray-900 font-medium">Federal Resume Examples</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Federal Resume Examples
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            Explore our comprehensive collection of federal resume examples tailored to specific GS levels and occupational series. Each example demonstrates the proper format, required elements, and specialized content that federal hiring managers expect. Use these templates as a foundation to craft your own winning federal resume that passes HR screening and lands you interviews.
          </p>
        </div>

        {/* GS Level Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Federal Resume Examples by GS Level
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {gsLevels.map((item) => (
              <a
                key={item.level}
                href={item.url}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="flex items-center mb-3">
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mr-3">
                    {item.level}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                </div>
                <p className="text-gray-700">{item.description}</p>
                <span className="inline-block mt-4 text-blue-600 font-medium hover:underline">
                  View Example →
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Job Series Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Federal Resume Examples by Job Series
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {jobSeries.map((item) => (
              <a
                key={item.series}
                href={item.url}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="flex items-center mb-3">
                  <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full mr-3">
                    {item.series}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                </div>
                <p className="text-gray-700">{item.description}</p>
                <span className="inline-block mt-4 text-blue-600 font-medium hover:underline">
                  View Example →
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* How to Use */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How to Use These Federal Resume Examples
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>1. Study the Format:</strong> Federal resumes differ significantly from private sector resumes. They require detailed information about your work history, education, training, and qualifications. Pay attention to the level of detail provided in each example.
            </p>
            <p>
              <strong>2. Customize for Your Position:</strong> Use the examples that match your target GS level or job series as a starting point. Adapt the language, keywords, and accomplishments to reflect your own experience and the specific requirements of the job announcement.
            </p>
            <p>
              <strong>3. Include All Required Elements:</strong> Federal resumes must include personal information, job information, work experience with specific details (hours per week, salary, supervisor contact), education, and any relevant certifications or training.
            </p>
            <p>
              <strong>4. Quantify Your Achievements:</strong> Notice how each example uses specific numbers, percentages, and measurable outcomes to demonstrate impact. Follow this pattern when describing your own accomplishments.
            </p>
            <p>
              <strong>5. Use Keywords from the Job Announcement:</strong> Federal HR specialists use keyword matching to screen resumes. Incorporate terminology and requirements directly from the USAJobs posting you're applying to.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 rounded-lg shadow-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Build Your Federal Resume?
          </h2>
          <p className="text-lg mb-6 text-blue-100">
            Use our AI-powered federal resume builder to create a professional, USAJobs-optimized resume in minutes. Our platform ensures your resume meets all federal formatting requirements and includes the keywords that get you noticed.
          </p>
          <a
            href="/builder"
            className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start Building Your Resume
          </a>
        </section>
      </div>
    </main>
  );
}

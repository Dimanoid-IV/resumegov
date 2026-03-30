// ─── Blog Post Types ──────────────────────────────────────────────────────────

export interface FAQ {
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;    // Used in <meta name="description"> and card excerpt
  date: string;           // ISO date string
  updatedDate?: string;
  readingTime: number;    // minutes
  author: string;
  tags: string[];
  content: string;        // HTML article body
  faqs: FAQ[];
  relatedSlugs: string[];
  coverImage?: string;
}

// ─── Helper ────────────────────────────────────────────────────────────────────

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find(p => p.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getRelatedPosts(slugs: string[]): BlogPost[] {
  return POSTS.filter(p => slugs.includes(p.slug));
}

// ─── Posts ────────────────────────────────────────────────────────────────────

const POSTS: BlogPost[] = [
  // ── Article 1 ──────────────────────────────────────────────────────────────
  {
    slug: 'federal-resume-2-page-limit-2025',
    title: 'Federal Resume 2-Page Limit: Everything You Need to Know for 2025',
    description:
      'The OPM 2-page federal resume rule takes effect September 27, 2025. Learn the exact word count targets, hard limits, and what happens if you exceed them on USAJOBS.',
    date: '2025-09-01',
    readingTime: 7,
    author: 'Federal Resume AI',
    tags: ['2-page limit', 'OPM regulation', 'USAJOBS', 'word count', '2025'],
    relatedSlugs: [
      'federal-resume-vs-civilian-resume',
      'top-10-federal-resume-mistakes',
      'how-to-target-gs-pay-grades',
    ],
    faqs: [
      {
        question: 'When does the 2-page federal resume rule take effect?',
        answer:
          'The Office of Personnel Management (OPM) 2-page limit rule became effective September 27, 2025. All new USAJOBS applications submitted on or after that date are subject to the requirement.',
      },
      {
        question: 'What is the exact word count target for a compliant federal resume?',
        answer:
          'The optimal range is 950–1,050 words, which corresponds to approximately 2 standard pages. The system enforces a hard limit of 1,100 words; submissions exceeding this threshold risk disqualification during initial HR screening.',
      },
      {
        question: 'Can I still include all my qualifications within 2 pages?',
        answer:
          'Yes — with careful compression. The key is prioritizing required specialized experience, mandatory qualification language from the vacancy announcement, and measurable achievements. Generic duties should be condensed without removing any federally mandated elements.',
      },
      {
        question: 'Does the 2-page limit apply to KSA statements?',
        answer:
          'KSA statements that are integrated directly into the resume body count toward the 2-page limit. Separately uploaded KSA documents — when the vacancy announcement requires them — are not subject to the 2-page resume limit.',
      },
      {
        question: 'What happens if my resume exceeds 1,100 words?',
        answer:
          'HR specialists are instructed to use only the first 2 pages for qualification determinations. Content on subsequent pages may be ignored entirely, potentially causing you to appear unqualified even if you meet all requirements.',
      },
    ],
    content: `
<h2>Why the 2-Page Federal Resume Rule Matters</h2>
<p>On September 27, 2025, the Office of Personnel Management (OPM) formalized a long-debated policy: federal job applicants must now limit their resumes to two pages. This is one of the most significant changes to the federal hiring process in decades, and millions of applicants using USAJOBS are directly affected.</p>
<p>For years, federal resumes operated in the opposite direction from civilian resumes. Where a private-sector hiring manager expects one page, federal HR specialists historically wanted <em>more</em> detail — sometimes 5–8 pages covering every position, duty, and certification going back decades. That era is over.</p>

<h2>The Exact Numbers You Need to Hit</h2>
<p>The regulation does not specify a word count directly — it specifies page count. However, based on standard government document formatting (12pt font, 1-inch margins, standard line spacing), two pages equates to approximately:</p>
<ul>
  <li><strong>Target range:</strong> 950–1,050 words</li>
  <li><strong>Hard ceiling:</strong> 1,100 words</li>
  <li><strong>Minimum floor:</strong> 900 words (below this, your resume may appear thin and uncompetitive)</li>
</ul>
<p>Exceeding 1,100 words puts you at risk of having your qualifications evaluated from only the first two pages. Content pushed to page three may be ignored entirely during HR screening, which uses a structured review checklist.</p>

<h2>What Must Stay In — The Non-Negotiables</h2>
<p>Compression does not mean deletion. Federal HR specialists are trained to look for specific language pulled directly from vacancy announcements. The following elements <strong>must never be removed</strong> from a compliant federal resume:</p>
<ul>
  <li>Required specialized experience language (verbatim or closely paraphrased)</li>
  <li>Time-in-grade indicators for GS-level positions</li>
  <li>Mandatory certifications, clearances, and licenses</li>
  <li>Specific competency language listed under "Qualifications Required"</li>
  <li>USAJOBS-required contact information and employment date ranges</li>
</ul>

<h2>What Can Be Cut</h2>
<p>Most resumes contain significant redundancy. The following categories are safe targets for compression:</p>
<ul>
  <li>Boilerplate job duty language that mirrors the position description instead of your specific contribution</li>
  <li>Repeated skill mentions across multiple positions</li>
  <li>Positions more than 15 years old that don't contribute specialized experience</li>
  <li>Objective statements or lengthy professional summaries (2–3 sentences maximum)</li>
  <li>Soft-skill adjectives ("excellent communicator," "strong team player") without supporting evidence</li>
</ul>

<h2>Two-Pass Compression: The Recommended Approach</h2>
<p>Meeting the 950–1,050 word target from an 1,800-word resume requires a disciplined two-pass compression strategy:</p>
<ol>
  <li><strong>Pass 1 — Structural reduction:</strong> Eliminate entire sections that don't contribute to the target GS level qualifications. Remove positions held before 2010 unless they establish specialized experience unavailable elsewhere in the resume.</li>
  <li><strong>Pass 2 — Sentence-level compression:</strong> Reduce passive voice, remove filler phrases ("responsible for," "tasked with"), and convert narrative descriptions to accomplishment-focused bullets with quantified outcomes.</li>
</ol>
<p>AI-assisted compression tools can automate both passes while flagging any required qualification language that would be removed, allowing human review before submission.</p>

<h2>Common Compliance Errors</h2>
<p>In early post-regulation submissions reviewed by federal HR offices, the most common compliance failures were:</p>
<ul>
  <li>Removing the exact "specialized experience" language from the vacancy announcement (triggers an "ineligible" rating)</li>
  <li>Compressing dates to the point that time-in-grade requirements cannot be verified</li>
  <li>Shrinking font or margins to fit content (automated systems can detect non-standard formatting)</li>
  <li>Treating 1,100 words as a target rather than a ceiling</li>
</ul>

<h2>How to Check Your Compliance</h2>
<p>Before submitting any federal application after September 27, 2025, run your resume through a word count check against the vacancy announcement. Verify that every required qualification phrase from the announcement appears in your resume, and that your total word count falls between 950 and 1,050.</p>
<p>Our AI-powered federal resume analyzer performs this check automatically, cross-referencing your resume against the specific vacancy announcement and flagging both word count violations and missing required qualification language.</p>
`,
  },

  // ── Article 2 ──────────────────────────────────────────────────────────────
  {
    slug: 'how-to-target-gs-pay-grades',
    title: 'How to Target GS Pay Grade Requirements in Your Federal Resume',
    description:
      'GS-5 through GS-15 each require different specialized experience. Learn how OPM evaluates your qualifications and how to write a resume that passes HR screening at every grade level.',
    date: '2025-08-15',
    readingTime: 6,
    author: 'Federal Resume AI',
    tags: ['GS levels', 'OPM qualifications', 'specialized experience', 'USAJOBS', 'pay grade'],
    relatedSlugs: [
      'federal-resume-2-page-limit-2025',
      'ksa-statements-complete-guide',
      'top-10-federal-resume-mistakes',
    ],
    faqs: [
      {
        question: 'What is specialized experience for GS federal positions?',
        answer:
          'Specialized experience is paid or unpaid work that has equipped you with the specific knowledge, skills, and abilities to perform the duties of the position being filled. OPM requires that specialized experience be described at the level at or equivalent to the next lower grade level.',
      },
      {
        question: 'How much experience do I need for a GS-13 position?',
        answer:
          'For GS-13, you need at least one year of specialized experience equivalent to GS-12. This experience must directly relate to the duties described in the vacancy announcement and cannot be substituted with education at this grade level.',
      },
      {
        question: 'Can education substitute for specialized experience?',
        answer:
          'Education can substitute for experience at GS-5 through GS-11 levels only. At GS-12 and above, there is no education substitution — you must have the required specialized experience. Check each vacancy announcement individually as substitution rules vary.',
      },
      {
        question: 'What is the "one year equivalent" rule for GS positions?',
        answer:
          'OPM requires that specialized experience be "equivalent in difficulty and responsibility" to the next lower grade for a period of at least 52 weeks (one year). Part-time experience counts on a prorated basis. The experience must be clearly documented with start/end dates and average hours per week.',
      },
    ],
    content: `
<h2>The GS Pay Scale: A Quick Orientation</h2>
<p>The General Schedule (GS) pay system covers more than 1.5 million federal white-collar positions across 15 grade levels. Your resume must demonstrate eligibility for the <em>specific</em> grade level advertised — not just general competence. This is a binary determination: you either meet the qualification standard or you don't, and HR makes this call before any hiring manager sees your application.</p>
<p>Understanding what OPM looks for at each grade level is the foundation of a successful federal application.</p>

<h2>Grade Level Breakdown: What OPM Requires</h2>
<h3>GS-5 through GS-7: Entry and Developmental Levels</h3>
<p>At these levels, education often substitutes for experience. A bachelor's degree with a 3.0 GPA or a degree in a related field may satisfy the qualification standard. Work experience requirements focus on <em>general experience</em> rather than specialized experience, though any directly relevant work should still be prominently featured.</p>

<h3>GS-9 through GS-11: Journeyman Levels</h3>
<p>These positions require either a master's degree/two years of graduate education <em>or</em> at least one year of specialized experience equivalent to the next lower grade. At GS-11, a Ph.D. or equivalent doctoral degree may substitute. Your resume must clearly show the nexus between your work and the specific duties in the vacancy announcement.</p>

<h3>GS-12 through GS-13: Full Performance Levels</h3>
<p>At GS-12 and above, <strong>no education substitution is permitted</strong>. You must demonstrate one year of specialized experience at the equivalent of GS-11 (for GS-12) or GS-12 (for GS-13). Your resume must use language that mirrors the vacancy announcement's qualification requirements.</p>

<h3>GS-14 through GS-15: Senior and Expert Levels</h3>
<p>These are highly competitive positions. Beyond meeting the technical experience threshold, resumes at these levels must demonstrate leadership, program management, or expert-level advisory experience. Quantified accomplishments with agency-wide or government-wide impact are essential.</p>

<h2>How to Write Specialized Experience That HR Will Recognize</h2>
<p>The most common reason qualified candidates fail HR screening is that their resume uses different vocabulary than the vacancy announcement. OPM HR specialists are trained to look for specific phrases. Follow this three-step approach:</p>
<ol>
  <li><strong>Extract the qualification language</strong> from the "Qualifications" section of the vacancy announcement — copy it verbatim.</li>
  <li><strong>Identify which of your positions</strong> involved work that satisfies each requirement.</li>
  <li><strong>Rewrite your bullet points</strong> using the announcement's language while describing your specific contributions and outcomes.</li>
</ol>

<h2>Time-in-Grade: The Documentation Requirement</h2>
<p>For GS positions at grade 2 or above, you must have served at least 52 weeks at the next lower grade (or equivalent) in the federal service. Your resume must include precise employment dates (month and year) and average hours per week for every position listed, or your time-in-grade cannot be verified — resulting in an ineligible rating.</p>

<h2>Competency-Based vs. Experience-Based Announcements</h2>
<p>Some vacancy announcements use a competency-based qualification standard rather than (or in addition to) the experience-based standard. In these cases, HR evaluators score your resume against a defined set of competencies (e.g., "Program Management," "Written Communication," "Technical Credibility"). Each competency must be addressed with specific examples from your experience — preferably using the CCAR (Context, Challenge, Action, Result) format.</p>

<h2>Matching Your Resume to the Specific Announcement</h2>
<p>No two vacancy announcements are identical, even for positions with the same title and grade. Always tailor your resume to the specific announcement. Our compatibility scoring engine analyzes your resume against the exact qualification requirements in a target announcement, identifying gaps and suggesting specific language improvements before you apply.</p>
`,
  },

  // ── Article 3 ──────────────────────────────────────────────────────────────
  {
    slug: 'ksa-statements-complete-guide',
    title: 'KSA Statements in Federal Resumes: The Complete 2025 Guide',
    description:
      'Knowledge, Skills, and Abilities statements have evolved — but they still matter. Learn when KSAs are required, how to write them using the CCAR method, and how to integrate them into your 2-page federal resume.',
    date: '2025-07-20',
    readingTime: 6,
    author: 'Federal Resume AI',
    tags: ['KSA', 'knowledge skills abilities', 'CCAR', 'federal resume', 'USAJOBS'],
    relatedSlugs: [
      'how-to-target-gs-pay-grades',
      'federal-resume-2-page-limit-2025',
      'federal-resume-vs-civilian-resume',
    ],
    faqs: [
      {
        question: 'Are KSA statements still required for federal jobs in 2025?',
        answer:
          'Most USAJOBS vacancy announcements no longer require separate KSA narratives. However, many agencies — especially intelligence community positions and SES applications — still require them. Always check the "How to Apply" and "Required Documents" sections of each specific announcement.',
      },
      {
        question: 'What is the CCAR method for KSA writing?',
        answer:
          'CCAR stands for Context, Challenge, Action, and Result. Context establishes the situation and your role. Challenge describes the specific problem or requirement. Action details what you specifically did (not "we"). Result quantifies the outcome in terms of time saved, cost reduced, quality improved, or mission accomplished.',
      },
      {
        question: 'How long should a KSA statement be?',
        answer:
          'Standalone KSA narratives are typically 300–500 words each. When KSAs are integrated into resume bullet points, each bullet should capture the essence of a KSA in 2–4 sentences, including a measurable result. The 2-page resume limit applies to the resume document, not to separately uploaded KSA files.',
      },
      {
        question: 'What is the difference between a KSA and a competency?',
        answer:
          'KSAs (Knowledge, Skills, Abilities) are the traditional federal HR framework for describing what a person brings to a job. Competencies are behavioral indicators of how well a person performs in specific dimensions. Most modern federal positions use competency-based assessments, but KSAs are still used to document the technical foundation underlying those competencies.',
      },
    ],
    content: `
<h2>A Brief History of KSAs in Federal Hiring</h2>
<p>For decades, federal job applications required applicants to submit lengthy Knowledge, Skills, and Abilities statements — separate narrative documents, sometimes 5–10 pages long, answering specific questions about their qualifications. OPM began phasing out mandatory KSA narratives in 2010 to streamline the hiring process. Today, most USAJOBS applications use an online questionnaire and resume-only format. However, KSA statements remain alive in several contexts — and understanding them is still critical for federal job seekers.</p>

<h2>When KSAs Are Still Required in 2025</h2>
<p>While routine GS-5 through GS-13 positions rarely require separate KSA documents, the following application types still commonly require them:</p>
<ul>
  <li><strong>Senior Executive Service (SES) applications</strong> — require Executive Core Qualifications (ECQs), which are structured KSA narratives</li>
  <li><strong>Intelligence Community positions</strong> — CIA, NSA, DIA, and related agencies often require detailed KSA documentation</li>
  <li><strong>Scientific and research positions</strong> — some STEM-focused announcements request technical KSA narratives</li>
  <li><strong>Law enforcement positions</strong> — FBI, DEA, and ATF often require KSA statements alongside the resume</li>
  <li><strong>Highly specialized technical roles</strong> — positions requiring unique expertise may request narrative justification</li>
</ul>
<p>Always read the "Required Documents" and "How to Apply" sections of each vacancy announcement carefully.</p>

<h2>Embedded KSAs: The Modern Approach</h2>
<p>Even when standalone KSA documents are not required, HR specialists score your application against a set of competencies defined in the vacancy announcement. Your resume bullets are the vehicle for demonstrating those competencies. Effective resume writing in 2025 means <em>embedding KSA evidence within your resume bullets</em> — proving each required competency with specific, quantified examples.</p>
<p>A weak resume bullet: <em>"Responsible for managing database systems."</em></p>
<p>A KSA-embedded bullet: <em>"Led migration of 14 legacy Oracle databases to cloud-based PostgreSQL infrastructure, reducing query latency by 63% and eliminating $1.2M in annual licensing costs — demonstrating technical proficiency required for GS-13 IT Systems Management positions."</em></p>

<h2>The CCAR Method: A Framework for Any KSA</h2>
<p>Whether you're writing a standalone KSA or crafting resume bullets, the CCAR framework produces clear, evaluatable evidence:</p>
<ul>
  <li><strong>Context:</strong> What was the organizational situation? What was your role? (1–2 sentences)</li>
  <li><strong>Challenge:</strong> What specific problem, requirement, or constraint did you face? (1–2 sentences)</li>
  <li><strong>Action:</strong> What did <em>you specifically</em> do? Use "I" — not "we" or "our team." (2–4 sentences)</li>
  <li><strong>Result:</strong> What measurable outcome did your actions produce? Quantify in dollars, percentages, time, or mission impact. (1–2 sentences)</li>
</ul>

<h2>Integrating KSAs Within the 2-Page Limit</h2>
<p>The September 2025 two-page limit creates a real challenge: you must demonstrate multiple competencies within approximately 1,000 words. The solution is strategic selection — don't try to address every competency in depth. Identify the <em>three most critical</em> competencies from the vacancy announcement and ensure each is supported by at least one strong, quantified CCAR example. Additional competencies can be indicated through skills lists or brief mentions.</p>

<h2>Common KSA Writing Mistakes</h2>
<ul>
  <li>Using "we" instead of "I" — HR evaluators assess <em>your</em> contribution, not your team's</li>
  <li>Describing duties rather than achievements — what you were supposed to do vs. what you actually accomplished</li>
  <li>Missing quantification — "improved efficiency" means nothing without a number</li>
  <li>Mismatching competency language — use the exact terminology from the vacancy announcement's competency definitions</li>
  <li>Exceeding word limits — standalone KSAs should be 300–500 words; embedded bullets should be 2–4 lines</li>
</ul>
`,
  },

  // ── Article 4 ──────────────────────────────────────────────────────────────
  {
    slug: 'federal-resume-vs-civilian-resume',
    title: 'Federal Resume vs. Civilian Resume: 7 Critical Differences',
    description:
      'Federal resumes and civilian resumes follow entirely different rules. Understanding the 7 key differences — length, format, content, and submission — will prevent automatic disqualification on USAJOBS.',
    date: '2025-06-30',
    readingTime: 5,
    author: 'Federal Resume AI',
    tags: ['federal resume', 'USAJOBS', 'resume format', 'OPM', 'job application'],
    relatedSlugs: [
      'federal-resume-2-page-limit-2025',
      'how-to-target-gs-pay-grades',
      'top-10-federal-resume-mistakes',
    ],
    faqs: [
      {
        question: 'Can I submit my regular resume for a federal job?',
        answer:
          'Not without significant modification. A standard one-page civilian resume will almost certainly result in an ineligible rating because it lacks required elements like employment date ranges (month/year), average hours per week, federal pay grades for prior government positions, and supervisor contact information.',
      },
      {
        question: 'Do federal resumes need to include salary information?',
        answer:
          'Yes. USAJOBS requires your salary or pay rate for each position listed. This allows HR to verify time-in-grade requirements and assess progression. For federal positions, include your GS level and step, or your annual salary and any locality pay.',
      },
      {
        question: 'Should I include a photo on my federal resume?',
        answer:
          'Never include a photo on a federal resume. OPM strictly prohibits photos on federal resumes to prevent discrimination in the hiring process. Including a photo may cause your application to be flagged or removed from consideration.',
      },
      {
        question: 'How far back should a federal resume go?',
        answer:
          'Under the 2-page rule (effective September 27, 2025), include only the experience most relevant to the target position. Generally, focus on the last 10–15 years. Include older experience only if it provides unique specialized experience required by the vacancy announcement and unavailable from more recent positions.',
      },
    ],
    content: `
<h2>Why Using a Civilian Resume for Federal Jobs Fails</h2>
<p>Thousands of highly qualified candidates are rejected from federal positions every year — not because they lack the required skills, but because their resumes don't meet the specific format and content requirements that federal HR specialists are trained to evaluate. A civilian hiring manager uses judgment and context. Federal HR uses a structured checklist. If required fields are missing, the application is rated ineligible before a hiring manager ever sees it.</p>
<p>Here are the seven most critical differences between federal and civilian resumes.</p>

<h2>Difference 1: Length (The Biggest Change for 2025)</h2>
<p><strong>Civilian:</strong> 1–2 pages maximum; anything longer signals poor judgment.</p>
<p><strong>Federal (2025):</strong> Exactly 2 pages — 950–1,050 words. The September 27, 2025 OPM rule caps federal resumes at a 2-page limit with a hard ceiling of 1,100 words. This is a significant departure from the previous norm of 4–8 page federal resumes.</p>

<h2>Difference 2: Employment Date Requirements</h2>
<p><strong>Civilian:</strong> Month/year for start and end dates is standard, but year-only is acceptable.</p>
<p><strong>Federal:</strong> Month <em>and</em> year are required for every position. Additionally, you must list <em>average hours worked per week</em>. Missing hours-per-week data prevents HR from calculating whether you meet the 52-week time-in-grade requirement, resulting in an ineligible rating.</p>

<h2>Difference 3: Supervisor Information</h2>
<p><strong>Civilian:</strong> References are listed separately, not in the resume.</p>
<p><strong>Federal:</strong> Each position entry must include your supervisor's name, phone number, and whether they may be contacted. This is not optional — USAJOBS positions frequently include this as a required field in the online application form.</p>

<h2>Difference 4: Pay and Grade Information</h2>
<p><strong>Civilian:</strong> Salary is never included in the resume (and rarely disclosed even in interviews).</p>
<p><strong>Federal:</strong> Your salary or pay rate must be listed for every position. For prior federal positions, include your GS level and step. This information is used for pay-setting and time-in-grade verification.</p>

<h2>Difference 5: Qualification Language Precision</h2>
<p><strong>Civilian:</strong> Hiring managers read holistically and infer how your experience relates to the role.</p>
<p><strong>Federal:</strong> HR specialists look for specific qualification language from the vacancy announcement. If the announcement says "experience developing and implementing enterprise-wide IT security policies," your resume must contain language that matches that description. Paraphrasing too liberally risks an ineligible determination.</p>

<h2>Difference 6: Security Clearance and Citizenship</h2>
<p><strong>Civilian:</strong> Security clearances are mentioned but rarely required upfront.</p>
<p><strong>Federal:</strong> Many positions require proof of U.S. citizenship and existing clearance level. Your resume should explicitly state your citizenship status and current clearance level (Confidential, Secret, Top Secret, TS/SCI) if applicable. This information is evaluated during HR screening.</p>

<h2>Difference 7: Submission Platform Requirements</h2>
<p><strong>Civilian:</strong> Email, company ATS portal, or in-person submission.</p>
<p><strong>Federal:</strong> All applications go through USAJOBS. The platform has specific file format requirements (PDF or Word), size limits, and requires completion of an online questionnaire in addition to the resume. The resume must match your USAJOBS profile data — discrepancies between the two can trigger an ineligible rating.</p>
`,
  },

  // ── Article 5 ──────────────────────────────────────────────────────────────
  {
    slug: 'top-10-federal-resume-mistakes',
    title: 'Top 10 Federal Resume Mistakes That Lead to Automatic USAJOBS Rejection',
    description:
      'These 10 federal resume mistakes cause automatic ineligible ratings on USAJOBS — and most applicants make at least three of them. Learn how to identify and fix every one before you apply.',
    date: '2025-06-01',
    readingTime: 8,
    author: 'Federal Resume AI',
    tags: ['federal resume', 'USAJOBS mistakes', 'ineligible rating', 'OPM', 'HR screening'],
    relatedSlugs: [
      'federal-resume-2-page-limit-2025',
      'federal-resume-vs-civilian-resume',
      'how-to-target-gs-pay-grades',
    ],
    faqs: [
      {
        question: 'What does "ineligible" mean on USAJOBS?',
        answer:
          'An ineligible rating means HR has determined you do not meet the minimum qualification requirements for the position. This happens before a hiring manager sees your application. Common causes include missing required elements, not meeting time-in-grade requirements, or failing to demonstrate specialized experience using the required language.',
      },
      {
        question: 'Can I appeal an ineligible rating on USAJOBS?',
        answer:
          'Yes. You can request reconsideration from the hiring agency within 15 calendar days of receiving notification. However, the process is time-consuming and rarely changes the outcome unless there was a clear administrative error. Prevention is far more effective than appeal.',
      },
      {
        question: 'How do I know if my resume was actually read by a human?',
        answer:
          'Most federal agencies use automated screening for minimum qualification determinations before a human HR specialist reviews the application. Some agencies use USA Staffing or other ATS platforms that score resumes based on keyword matching before human review occurs.',
      },
      {
        question: 'Is it safe to use an AI tool to optimize a federal resume?',
        answer:
          'Yes, provided the tool is designed with federal compliance in mind. A compliant AI optimization tool will flag — but never remove — required qualification language, enforce the 950–1,050 word target, and never fabricate experience or achievements. Always review AI-generated content before submitting.',
      },
    ],
    content: `
<h2>Why Federal Resumes Fail at a Higher Rate Than You'd Expect</h2>
<p>The U.S. federal government receives millions of USAJOBS applications annually. Studies and agency reports consistently show that 30–50% of applicants who apply for positions they are objectively qualified for receive ineligible ratings. The most frequent cause? Resume errors that are entirely preventable. Here are the ten mistakes that most often trigger automatic rejection.</p>

<h2>Mistake 1: Missing Employment Date Precision</h2>
<p>Listing "2019–2023" instead of "January 2019 – March 2023" prevents HR from calculating time-in-grade. This single formatting error can make a fully qualified candidate appear ineligible. Every position must include month, year, and average hours per week.</p>

<h2>Mistake 2: Not Using the Vacancy Announcement's Exact Language</h2>
<p>The qualification section of every vacancy announcement contains specific language that HR uses as a screening checklist. If your resume says "managed database systems" but the announcement requires "administered and maintained enterprise relational database management systems," you may be scored as not meeting the requirement. Copy the key phrases from the announcement and weave them into your bullets.</p>

<h2>Mistake 3: Exceeding the 2-Page / 1,100-Word Hard Limit</h2>
<p>Effective September 27, 2025, OPM enforces a 2-page federal resume limit. Resumes that run long cause HR to evaluate only the first two pages. If your most critical qualifications are buried on page three, they don't exist from a screening perspective. Target 950–1,050 words.</p>

<h2>Mistake 4: Omitting the "Average Hours Per Week" Field</h2>
<p>This is the most overlooked required element. Every position listed must include the average number of hours worked per week. Without it, full-time employment cannot be assumed, and your specialized experience may be downgraded or disqualified.</p>

<h2>Mistake 5: Describing Duties Instead of Accomplishments</h2>
<p>"Responsible for managing project budgets" is a duty description. "Managed $4.2M project budget across 7 contractors with zero cost overruns over 18 months, saving $340K through renegotiated vendor contracts" is an accomplishment. Federal HR scoring systems favor demonstrated achievement over passive duty lists, and hiring managers at higher GS levels expect quantified results.</p>

<h2>Mistake 6: Using a Civilian Resume Without Federal-Specific Elements</h2>
<p>Federal resumes require supervisor contact information, pay rates, federal grade levels for prior government positions, and explicit citizenship status. Submitting a civilian resume — no matter how strong — typically results in an ineligible rating due to missing required fields.</p>

<h2>Mistake 7: Applying to Positions You're Not Grade-Eligible For</h2>
<p>Many applicants apply to GS-13 positions with only GS-11 equivalent experience. No amount of resume polish overcomes a genuine qualification gap. Before applying, verify that you have at least 52 weeks of experience at the next lower GS equivalent, using the specific specialized experience language from the vacancy announcement.</p>

<h2>Mistake 8: Generic Objective Statements and Profile Summaries</h2>
<p>"Seeking a challenging position where I can leverage my skills" wastes precious words under the 2-page limit and provides zero qualifying information. Replace generic summaries with a targeted 2–3 sentence professional summary that explicitly references the position title and key qualifications from the announcement.</p>

<h2>Mistake 9: Fabricating or Inflating Experience</h2>
<p>Federal agencies conduct thorough background investigations. Fabricated experience, inflated titles, or exaggerated accomplishments are discovered during suitability investigations, often after a conditional offer has been made. The consequences include rescinded job offers, permanent debarment from federal employment, and potential criminal charges for positions requiring background investigations.</p>

<h2>Mistake 10: Not Tailoring the Resume Per Application</h2>
<p>Using one generic federal resume across all applications is a major competitive disadvantage. Each vacancy announcement has different required specializations, competency priorities, and qualification language. Our compatibility scoring tool analyzes your resume against a specific announcement and generates a targeted compatibility score with actionable suggestions — so every application is precisely calibrated to that position.</p>
`,
  },

  // ── Article: How HR Screens Federal Resumes ─────────────────────────────────
  {
    slug: 'how-hr-screens-federal-resumes',
    title: 'How HR Reviews Federal Resumes on USAJOBS (2026 Guide)',
    description:
      'Learn how HR specialists evaluate federal resumes, determine eligibility, verify time-in-grade, and decide referral status on USAJOBS.',
    date: '2026-04-06',
    readingTime: 10,
    author: 'ResumeGov Editorial Team',
    tags: ['HR screening', 'USAJOBS', 'eligibility', 'category rating', 'time-in-grade', 'ineligible rating', 'best qualified'],
    relatedSlugs: [
      'federal-resume-2-page-limit-2025',
      'top-10-federal-resume-mistakes-that-lead-to-automatic-usajobs-rejection',
      'how-to-target-gs-pay-grades',
    ],
    faqs: [
      {
        question: 'How does HR determine federal resume eligibility?',
        answer:
          'HR specialists apply OPM qualification standards to each application. They verify minimum education or experience requirements, confirm that the resume contains specialized experience language matching the vacancy announcement, validate time-in-grade for competitive service promotions, and check that all mandatory documentation fields are present. If any required element is absent or insufficient, the applicant receives an Ineligible rating before the hiring manager is ever involved.',
      },
      {
        question: 'What does Best Qualified mean on USAJOBS?',
        answer:
          'Best Qualified is the highest quality tier under the federal category rating system. After passing minimum qualification review, eligible applicants are grouped into tiers — typically Best Qualified, Well Qualified, and Qualified. Only applicants in the Best Qualified tier are placed on the referral certificate sent to the selecting official. Placement depends on the depth of specialized experience in the resume, self-assessment questionnaire responses, and alignment with the competencies defined in the vacancy announcement.',
      },
      {
        question: 'What does Referred status mean on USAJOBS?',
        answer:
          'Referred status means your application was forwarded to the selecting official — the hiring manager — for review. It confirms you were rated Eligible and placed in the Best Qualified category. Referred status does not guarantee an interview, a selection, or any further contact. The selecting official independently determines which referred applicants to interview.',
      },
      {
        question: 'Why was I rated Ineligible on a federal application?',
        answer:
          'The most common causes of Ineligible ratings are: incomplete employment dates (year-only instead of MM/YYYY), omitted hours-per-week documentation, specialized experience language that does not match the vacancy announcement requirements, failure to meet the 52-week time-in-grade threshold, or submission of a private-sector resume format that lacks required federal documentation elements such as pay rate, supervisor information, and position grade.',
      },
      {
        question: 'Can HR assume I meet qualifications if I do not state them clearly?',
        answer:
          'No. HR specialists are not permitted to infer, assume, or extrapolate qualifications that are not explicitly documented in the resume. If a required competency is not traceable to a specific position, date range, and duty description in the submitted resume, it is treated as unmet. The federal qualification determination is a documentation review, not a judgment call. Qualification claims must be self-evident within the application package.',
      },
    ],
    content: `
<h2>Overview of the Federal Resume Screening Process</h2>
<p>Federal resume evaluation is not a holistic reading exercise. It is a structured compliance review conducted by trained HR specialists who apply OPM-prescribed qualification standards for each occupational series and grade level. No element of discretion or benefit of the doubt enters the process until the hiring manager receives a referral certificate — and by that point, the HR review is already complete.</p>
<p>The review occurs in a fixed sequence: minimum qualification verification, specialized experience matching, time-in-grade validation, and category rating assignment. Each stage is a discrete pass/fail gate. Failure at any stage results in an Ineligible determination regardless of the applicant\'s actual capability or seniority. No supplementary materials submitted after the announcement closes are considered. No phone calls are made to request clarification.</p>
<p>Unlike private-sector hiring, where a recruiter may contact a candidate to fill in missing information, federal HR specialists evaluate only what is present in the submitted application package at the time of review. The resume must be entirely self-sufficient as a compliance document.</p>

<h2>Step 1 — Minimum Qualification Review</h2>
<p>The first screening pass confirms that the applicant meets the basic OPM qualification standard for the target position. These standards are published in the OPM Qualification Standards for General Schedule Positions and specify the minimum education, experience, or combination thereof required for each occupational series and grade level.</p>
<p>For most professional and administrative series at GS-5 through GS-15, the minimum standard requires a specified amount of general or specialized experience at the next lower grade equivalent. For some positions at GS-5 through GS-11, a relevant academic degree may substitute for experience requirements. At GS-12 and above, no education substitution is permitted — only qualifying experience satisfies the standard.</p>
<p>Some vacancy announcements include Selective Placement Factors: specific qualifications that are mandatory and cannot be substituted. These are separate from the general qualification standard and appear in a distinct section of the announcement. Failure to address a Selective Placement Factor in the resume results in an Ineligible determination regardless of whether all other qualifications are satisfied.</p>
<p>HR specialists do not estimate or infer experience levels. If the resume does not explicitly state employment dates in MM/YYYY format, hours worked per week, and a clear description of duties, the applicant is rated Ineligible without further review. The burden of documentation is entirely on the applicant.</p>

<h2>Step 2 — Specialized Experience Matching</h2>
<p>After confirming minimum qualifications, HR specialists conduct a vocabulary-level alignment between the resume and the vacancy announcement. They verify that the applicant\'s documented experience satisfies the Required Specialized Experience statement published in the announcement\'s Qualifications section.</p>
<p>Specialized experience is defined as experience that equipped the applicant with the particular knowledge, skills, and abilities to perform successfully in the duties of the target position at the required grade level. This is not a general assessment of capability — it is a documentation review. The resume must contain language that explicitly demonstrates the required experience using terminology traceable to the announcement.</p>
<p>A common failure pattern: a financial analyst who managed agency budgets may possess the requisite skills for a GS-12 Budget Analyst position yet receive an Ineligible rating because the resume states “monitored spending” while the vacancy announcement requires “experience analyzing financial data using automated accounting systems to support budget formulation and justification.” The connection is not traceable. The requirement is treated as unmet.</p>
<p>Grade-level equivalency is also a factor. The resume must demonstrate that the documented experience was performed at a complexity and scope consistent with the next lower GS grade. A GS-11 experience claim requires evidence of independent judgment, cross-organizational scope, and substantive technical output — not entry-level or developmental work supervised by a higher-grade employee.</p>
<p>For practical guidance on structuring resume bullets to align with grade-level qualification language, see our article on <a href="/blog/how-to-target-gs-pay-grade-requirements-in-your-federal-resume">How to Target GS Pay Grade Requirements in Your Federal Resume</a>.</p>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:28px 24px;margin:36px 0;text-align:center">
  <p style="font-size:1.05rem;font-weight:700;color:#0f172a;margin:0 0 8px">Check Your Resume Before HR Does</p>
  <p style="color:#64748b;font-size:0.9rem;margin:0 0 20px">ResumeGov analyzes compliance signals including word count limits, qualification alignment, and GS-level compatibility.</p>
  <a href="/" style="display:inline-block;background:#0f172a;color:#fff;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:0.9rem">Analyze My Resume — Free</a>
</div>

<h2>Step 3 — 52-Week Time-in-Grade Verification</h2>
<p>For competitive service positions at GS-2 and above, current federal employees and former federal employees seeking reinstatement at a higher grade must demonstrate that they have served at least 52 weeks at the next lower grade level. This requirement is codified under 5 CFR Part 300, Subpart F, and applies to non-temporary appointments in the competitive service.</p>
<p>HR specialists verify time-in-grade using the employment dates in the resume and SF-50 (Notification of Personnel Action) forms submitted as part of the application package. Month and year precision is required for every position. If a resume lists only years without months, HR cannot calculate whether the 52-week threshold has been met. The application is rated Ineligible on this basis, even if the applicant has clearly served the required period.</p>
<p>Applicants are typically required to submit their most recent SF-50 and a second SF-50 from at least one year prior to document continuous service at the qualifying grade. An SF-50 reflecting a within-grade step increase is generally more useful than a promotion SF-50 for establishing time-in-grade start dates, because the within-grade increase confirms the applicant was already at the stated grade one year before the issuance date.</p>
<p>For a full explanation of this requirement including common documentation errors, see our guide on <a href="/blog/federal-time-in-grade-rules">Federal Time-in-Grade Rules Explained</a>.</p>

<h2>Step 4 — Category Rating and Best Qualified Determination</h2>
<p>Applicants who pass all three initial screening stages are rated Eligible and assigned to a quality category under the category rating system, which replaced the traditional numerical ranking system for most federal competitive service positions.</p>
<p>Most agencies use a three-tier structure:</p>
<ul>
  <li><strong>Best Qualified:</strong> Applicants who fully satisfy all qualification requirements and whose specialized experience narratives, self-assessment responses, and documentation demonstrate superior alignment with the position\'s competency requirements.</li>
  <li><strong>Well Qualified:</strong> Applicants who meet all minimum requirements but whose documentation does not demonstrate the depth of experience or competency alignment needed for the Best Qualified tier.</li>
  <li><strong>Qualified:</strong> Applicants who meet minimum requirements with limited evidence of specialized competency depth or breadth.</li>
</ul>
<p>Category placement is determined by multiple factors working together: the structured self-assessment questionnaire completed during application, the specificity and scope of the resume\'s specialized experience narratives, and in some positions the results of occupational knowledge tests or structured job-related assessments administered through USA Hire or similar platforms.</p>
<p>Only applicants in the Best Qualified category are placed on the referral certificate transmitted to the selecting official. Being rated Eligible but placed in Well Qualified or Qualified is functionally equivalent to non-selection for most competitive announcements with large applicant pools, because hiring managers typically select from among referred candidates only.</p>
<p>Veteran preference applies within category rating. Veterans who meet the Best Qualified threshold must be listed ahead of non-veterans in that category on the referral certificate.</p>

<h2>Referred vs Not Referred — What It Actually Means</h2>
<p>After category rating, HR issues a certificate of eligibles to the selecting official. This certificate lists the Best Qualified applicants whose applications are being referred for hiring consideration. Three outcome statuses are relevant here:</p>
<p><strong>Ineligible</strong> means the application failed at Step 1, Step 2, or Step 3. The applicant did not satisfy the basic qualification standard, specialized experience requirement, or time-in-grade threshold. The application was never forwarded to the hiring manager.</p>
<p><strong>Not Referred</strong> means the applicant was rated Eligible but was placed in the Well Qualified or Qualified category rather than Best Qualified. The application was not included on the referral certificate. The hiring manager never saw the application.</p>
<p><strong>Referred</strong> means the applicant was rated Eligible, placed in the Best Qualified category, and appears on the referral certificate transmitted to the selecting official. Referred status does not guarantee an interview, a selection, or any further contact. The selecting official independently determines which referred applicants to interview and ultimately select based on the application package, any required assessments, and interviews.</p>
<p>Applicants who receive Not Referred status are sometimes confused because they believe they are clearly qualified for the position. In many cases they are qualified in the substantive sense — but the documentation of that qualification in the resume did not meet the evidentiary threshold required for Best Qualified placement. Qualification that exists but is not documented does not count.</p>

<h2>Common Reasons Applicants Are Rated Ineligible</h2>
<p>The following conditions consistently produce Ineligible determinations across federal agencies:</p>
<ul>
  <li><strong>Incomplete or imprecise employment dates.</strong> Year-only dates prevent time-in-grade calculation and are treated as non-compliant. Every position must list the start and end month and year.</li>
  <li><strong>Omitted hours-per-week documentation.</strong> OPM qualification standards prorate part-time experience. Without hours-per-week data for each position, HR cannot verify whether the experience threshold has been met.</li>
  <li><strong>Insufficient specialized experience language.</strong> General duty descriptions that do not mirror the vocabulary of the vacancy announcement fail the specialized experience matching review. The connection between the resume and the required competencies must be traceable.</li>
  <li><strong>Resume content exceeds the evaluation threshold.</strong> Under the OPM 2-page rule effective September 2025, content beyond the first two pages is not evaluated. Experience buried on page three is invisible to the HR specialist regardless of its substance.</li>
  <li><strong>Private-sector resume format.</strong> Resumes submitted without required federal elements — pay rate, supervisor contact information, hours-per-week, and GS grade for prior federal positions — do not satisfy USAJOBS documentation requirements.</li>
  <li><strong>Self-assessment scores unsupported by resume content.</strong> Federal applications include structured self-assessments where applicants rate their own proficiency on listed competencies. HR cross-references these ratings against the resume. Applicants who claim Expert proficiency on a competency but whose resume does not document corresponding experience are downgraded or rated Ineligible.</li>
  <li><strong>Missing Selective Placement Factor documentation.</strong> When a vacancy announcement includes Selective Placement Factors as mandatory requirements, failure to address each one explicitly in the resume results in an Ineligible determination.</li>
</ul>
<p>For a comprehensive breakdown of application errors, see our analysis of <a href="/blog/top-10-federal-resume-mistakes-that-lead-to-automatic-usajobs-rejection">top federal resume mistakes that lead to automatic rejection</a> and the documentation requirements under the <a href="/blog/federal-resume-2-page-limit-2025">OPM 2-page federal resume rule</a>.</p>

<h2>Conclusion</h2>
<p>The federal resume screening process is not a subjective evaluation. It is a rule-based compliance review in which documentation clarity determines the outcome at every stage. An applicant who possesses the required experience but fails to document it in the specific terms the vacancy announcement requires will receive the same Ineligible or Not Referred outcome as an applicant who lacks the experience entirely.</p>
<p>Federal resumes are compliance documents. Every position entry must include the dates, hours, grade level, and duty descriptions that allow an HR specialist to independently verify qualification against the OPM standard and the vacancy announcement language. Experience that is real but undocumented does not exist in the federal hiring process.</p>
<p>The practical implication is direct: before submitting any federal application, the resume must be reviewed against the specific vacancy announcement to confirm that each required competency is explicitly addressed, that employment dates are complete, and that the word count complies with the current OPM page limit. Documentation precision is not a competitive advantage — it is the minimum threshold for eligibility.</p>

<hr style="border:none;border-top:1px solid #e2e8f0;margin:40px 0 24px" />
<p style="font-size:0.8rem;color:#94a3b8">ResumeGov is an independent compliance tool and is not affiliated with USAJOBS or the U.S. Office of Personnel Management (OPM).</p>
`,
  },

  // ── Article: Federal Time-in-Grade Rules ─────────────────────────────────
  {
    slug: 'federal-time-in-grade-rules',
    title: 'Federal Time-in-Grade Rules Explained (52-Week Requirement Guide)',
    description:
      'Understand the 52-week federal time-in-grade requirement, GS promotion rules, and how HR verifies eligibility on USAJOBS.',
    date: '2026-01-20',
    readingTime: 8,
    author: 'ResumeGov Editorial Team',
    tags: ['time-in-grade', 'GS promotion', 'competitive service', 'USAJOBS', '52-week rule'],
    relatedSlugs: [
      'how-hr-screens-federal-resumes',
      'federal-resume-2-page-limit-2025',
      'how-to-target-gs-pay-grades',
    ],
    faqs: [
      {
        question: 'What is the 52-week rule in federal jobs?',
        answer:
          'The 52-week time-in-grade rule requires that competitive service federal employees must have served at least 52 weeks at the next lower grade level before they are eligible for promotion to the next higher grade. For example, an employee at GS-9 must have completed 52 weeks in a GS-9 or higher position before being eligible for a GS-11 promotion. This requirement applies to non-temporary appointments in the competitive service.',
      },
      {
        question: 'Does time-in-grade apply to excepted service employees?',
        answer:
          'Time-in-grade restrictions generally do not apply to positions in the excepted service. However, when excepted service employees apply for competitive service positions, their prior excepted service time may or may not count toward time-in-grade depending on the nature of the position, the pay plan, and whether the excepted service appointment was equivalent in grade to a General Schedule position. HR specialists make this determination on a case-by-case basis.',
      },
      {
        question: 'Can you skip from GS-7 to GS-11?',
        answer:
          'Under standard competitive service promotion rules, skipping two or more grade intervals is not permitted without serving the required time at each intervening grade. A GS-7 employee must typically serve 52 weeks at GS-9 before being eligible for GS-11. However, two-grade interval positions — such as GS-5/7/9/11 career ladders — are an exception: they allow progression through defined grade intervals without additional time-in-grade waiting periods beyond what the career ladder specifies.',
      },
      {
        question: 'Does military service count toward time-in-grade?',
        answer:
          'Active duty military service does not directly count toward civilian federal time-in-grade requirements. Time-in-grade is calculated based on service in a General Schedule or equivalent civilian position. However, veterans may receive preference in hiring and may qualify for non-competitive appointment authorities that bypass certain competitive service eligibility requirements. OPM regulations and the specific vacancy announcement govern how prior military service is treated for each position.',
      },
      {
        question: 'What happens if I apply for a federal position before meeting the 52-week requirement?',
        answer:
          'If an applicant does not meet the time-in-grade requirement at the time the application closes, HR will rate the application Ineligible during the qualification determination phase. The applicant will not be referred to the selecting official regardless of the quality of their resume or self-assessment responses. Some announcements specify a future effective date for the requirement, allowing applicants who will satisfy the 52-week threshold by a defined date to be considered — but this is explicitly stated in the vacancy announcement when applicable.',
      },
    ],
    content: `
<h2>What Is the 52-Week Time-in-Grade Requirement?</h2>
<p>Time-in-grade is a federal civilian employment regulation that restricts how quickly a General Schedule (GS) employee can advance to a higher grade level. Under 5 CFR Part 300, Subpart F, most competitive service employees must serve a minimum of 52 weeks (one year) at the next lower grade before becoming eligible for promotion to the next higher grade.</p>
<p>This requirement exists to ensure that employees have adequate time to develop the knowledge, skills, and abilities associated with their current grade level before assuming the responsibilities of a higher grade. It is a structural constraint embedded in the federal competitive service framework, not a policy that individual agencies can waive at will.</p>
<p>The 52-week clock runs from the effective date of the employee\'s last qualifying appointment or promotion, not from the date of any particular job offer or announcement application. An employee who was promoted to GS-9 on March 1, 2025 becomes time-in-grade eligible for GS-11 on March 1, 2026.</p>

<h2>Who Must Meet Time-in-Grade Requirements?</h2>
<p>Time-in-grade requirements apply specifically to competitive service employees appointed to non-temporary GS positions at GS-2 and above. The requirement does not apply uniformly across all federal employment categories.</p>

<table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:0.875rem">
  <thead>
    <tr style="background:#0f172a;color:#fff">
      <th style="padding:10px 14px;text-align:left">Characteristic</th>
      <th style="padding:10px 14px;text-align:left">Competitive Service</th>
      <th style="padding:10px 14px;text-align:left">Excepted Service</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background:#f8fafc">
      <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0">Time-in-grade applies</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0">Yes — 52 weeks required</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0">Generally no</td>
    </tr>
    <tr>
      <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0">Examples</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0">Most GS positions at civilian agencies</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0">Intelligence agencies, SES, some Schedule A</td>
    </tr>
    <tr style="background:#f8fafc">
      <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0">Promotion restrictions</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0">Subject to OPM 52-week rule</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0">Agency-specific rules apply</td>
    </tr>
    <tr>
      <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0">Prior time counts when moving to competitive service</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0">N/A</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0">Case-by-case — HR determination required</td>
    </tr>
    <tr style="background:#f8fafc">
      <td style="padding:10px 14px">Hiring authority</td>
      <td style="padding:10px 14px">Open competitive examination</td>
      <td style="padding:10px 14px">Direct hire, Schedule A, special authorities</td>
    </tr>
  </tbody>
</table>

<p>Temporary appointments, term appointments shorter than one year, and excepted service positions are generally not subject to time-in-grade restrictions. Veterans appointed under Veterans\' Recruitment Appointment (VRA) or 30% or more disabled veteran authorities may also be exempt from certain time-in-grade requirements depending on the specific announcement.</p>

<h2>How HR Verifies Time-in-Grade Eligibility</h2>
<p>During the qualification determination review, HR specialists verify time-in-grade by examining two primary documents: the resume and, for current federal employees, the SF-50 (Notification of Personnel Action) forms included in the application package.</p>
<p>The resume must list employment dates in MM/YYYY format for every position held. Year-only dates are insufficient for this calculation. If a resume states that an applicant worked as a GS-9 Analyst from "2023 to 2025," HR cannot determine whether the full 52-week threshold was met. The application will be rated Ineligible on time-in-grade grounds regardless of actual service duration.</p>
<p>SF-50 forms serve as the authoritative record of grade, step, and effective dates for federal employees. Applicants are typically required to submit their most recent SF-50, plus a second SF-50 from one year prior, to document continuous service at the qualifying grade. An SF-50 reflecting a within-grade increase at the current grade is often more useful than a promotion SF-50 for establishing time-in-grade starting dates.</p>
<p>For a complete overview of how HR conducts this and other stages of the eligibility review, see our guide on <a href="/blog/how-hr-screens-federal-resumes">how HR reviews federal resumes</a> on USAJOBS.</p>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:28px 24px;margin:36px 0;text-align:center">
  <p style="font-size:1.05rem;font-weight:700;color:#0f172a;margin:0 0 8px">Verify Your Time-in-Grade Compliance</p>
  <p style="color:#64748b;font-size:0.9rem;margin:0 0 20px">Confirm that your resume contains the date format and employment documentation required for time-in-grade verification before HR reviews your application.</p>
  <a href="/" style="display:inline-block;background:#0f172a;color:#fff;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:0.9rem">Run Compliance Check — Free</a>
</div>

<h2>What Happens If You Don\'t Meet the 52-Week Requirement?</h2>
<p>An applicant who does not satisfy the time-in-grade requirement at the time the vacancy announcement closes will receive an Ineligible rating during the initial qualification determination phase. This outcome is non-negotiable: the HR specialist applies the standard and issues the determination without discretion.</p>
<p>The Ineligible rating is issued before any evaluation of the quality of the application. A well-written resume, high self-assessment scores, and strong specialized experience language cannot compensate for a time-in-grade deficiency. The application is effectively removed from consideration at the first screening gate.</p>
<p>In some cases, a vacancy announcement will specify that applicants must meet time-in-grade requirements by a future date rather than the closing date of the announcement. When this exception is included, it will be explicitly stated in the "Qualifications" section of the vacancy announcement. Applicants should not assume this exception applies unless it is specifically documented.</p>
<p>If an application is rated Ineligible due to time-in-grade, the applicant will typically receive notification through the USAJOBS application status tracker. Some agencies provide reason codes; others provide only the Ineligible status without elaboration.</p>

<h2>Can You Skip GS Grades?</h2>
<p>Grade skipping — advancing from GS-7 to GS-11 without serving time at GS-9, for example — is not permitted under standard competitive service promotion rules. Each grade interval requires the full 52-week service period.</p>
<p>However, there are two legitimate pathways that applicants sometimes confuse with grade skipping:</p>
<p><strong>Two-grade interval career ladders.</strong> Many federal positions are established with structured career ladders that span two grades per interval: GS-5/7, GS-7/9, GS-9/11, and GS-11/13. An employee hired at the GS-5 level and promoted through the career ladder to GS-7 then GS-9 is not skipping grades — they are advancing through the defined intervals. Non-competitive promotions within a career ladder do not bypass time-in-grade; the 52-week requirement still applies at each level.</p>
<p><strong>Applying to a higher-graded position from outside the agency.</strong> An applicant who is currently at GS-9 and applies to a GS-12 position at a different agency is not subject to the same step-by-step promotion restriction that applies to internal promotions. However, the applicant must have served 52 weeks at GS-11 or equivalent, or demonstrate qualifying experience that meets the OPM qualification standard for the GS-12 level. The distinction is between promotion (internal, subject to 52-week rule) and competitive appointment (open to all, governed by minimum qualification standards and specialized experience).</p>
<p>A common error is applying for competitive service positions two or three grades above the current grade and assuming that civilian-equivalent work experience substitutes for time-in-grade service. It does not. The OPM qualification standard and the time-in-grade requirement are separate gates that must both be satisfied.</p>

<h2>Common Time-in-Grade Mistakes on Federal Resumes</h2>
<p>The following resume documentation errors prevent HR from verifying time-in-grade and result in Ineligible ratings:</p>
<ul>
  <li><strong>Year-only employment dates.</strong> Listing "2022–2024" instead of "01/2022–06/2024" makes precise 52-week calculation impossible. HR cannot infer or approximate dates not explicitly documented.</li>
  <li><strong>Missing GS grade or pay plan information.</strong> Resumes that list federal positions without specifying the GS grade or equivalent pay plan prevent HR from establishing the starting grade for time-in-grade calculations.</li>
  <li><strong>Omitting SF-50 when required.</strong> Many federal vacancy announcements require current and recent federal employees to submit SF-50 forms. The SF-50 is the authoritative record of grade and effective dates. Submitting a resume without the required SF-50 documentation often results in an Ineligible determination.</li>
  <li><strong>Using a promotion SF-50 as the sole time-in-grade document.</strong> A promotion SF-50 establishes the start date at the new grade. To document time already served at that grade, a within-grade increase SF-50 or a second SF-50 from one year prior is typically needed.</li>
  <li><strong>Part-time experience without hours-per-week documentation.</strong> Part-time service may or may not satisfy time-in-grade depending on the specific OPM standard and the nature of the position. Without documented hours-per-week, HR cannot make this determination.</li>
</ul>

<hr style="border:none;border-top:1px solid #e2e8f0;margin:40px 0 24px" />
<p style="font-size:0.8rem;color:#94a3b8">ResumeGov is an independent compliance tool and is not affiliated with USAJOBS or the U.S. Office of Personnel Management (OPM).</p>
`,
  },

  // ── Article: Specialized Experience Examples ───────────────────────────
  {
    slug: 'specialized-experience-examples-federal-resume',
    title: 'Specialized Experience Examples for GS-7, GS-9, and GS-12 Federal Resumes',
    description:
      'See real examples of specialized experience for GS-7, GS-9, and GS-12 roles and learn how HR evaluates qualification language.',
    date: '2026-01-25',
    readingTime: 9,
    author: 'ResumeGov Editorial Team',
    tags: ['specialized experience', 'GS-7', 'GS-9', 'GS-12', 'federal resume examples', 'OPM qualifications'],
    relatedSlugs: [
      'how-hr-screens-federal-resumes',
      'federal-time-in-grade-rules',
      'how-to-target-gs-pay-grades',
    ],
    faqs: [
      {
        question: 'What qualifies as specialized experience for a federal position?',
        answer:
          'Specialized experience is paid or unpaid work that has equipped the applicant with the specific knowledge, skills, and abilities to perform successfully in the duties of the target position at the required grade level. It must be described in the resume at a level of detail that allows HR to verify it meets the vacancy announcement\'s qualification requirements. General experience, academic coursework, and volunteer work may count depending on the position, but must be documented with the same specificity as paid employment.',
      },
      {
        question: 'How detailed should specialized experience descriptions be on a federal resume?',
        answer:
          'Federal resume specialized experience descriptions must be specific enough that HR can independently verify the nature, complexity, and duration of the work performed. Each position entry should include the exact start and end dates in MM/YYYY format, average hours per week, a description of duties that mirrors the competency language in the target vacancy announcement, and quantified outcomes where available. Generic statements such as \'managed projects\' or \'analyzed data\' are insufficient — the description must document what type of projects, at what scale, using what methods, and with what results.',
      },
      {
        question: 'Do I need to copy the exact language from the vacancy announcement?',
        answer:
          'You do not need to reproduce the vacancy announcement verbatim, but your resume must contain language that is traceable to the required competencies. HR specialists match the resume against the qualification requirements using keyword-level alignment. If the announcement requires \'experience coordinating interagency working groups\' and your resume states only that you \'worked with multiple stakeholders,\' the connection may not be recognized. Use the announcement\'s terminology as a guide and document your experience using equivalent or identical phrasing.',
      },
      {
        question: 'What if I don\'t meet every requirement listed in the vacancy announcement?',
        answer:
          'Vacancy announcements distinguish between required qualifications and preferred qualifications (often labeled \'Selective Placement Factors\' or \'Highly Desirable\'). Failure to meet a required qualification results in an Ineligible rating. Failure to meet a preferred qualification may reduce your competitive standing but does not disqualify you. Read the announcement carefully to identify which requirements are mandatory and which are desirable, then tailor your resume accordingly.',
      },
      {
        question: 'Can education substitute for specialized experience on a federal resume?',
        answer:
          'Education can substitute for specialized experience at GS-5 through GS-11 levels only, and only in occupational series that permit substitution. At GS-12 and above, there is no education substitution — the full one year of specialized experience at the equivalent of the next lower grade is required. The specific substitution rules vary by occupational series and are published in the OPM Qualification Standards. Always verify the substitution provision in the individual vacancy announcement.',
      },
    ],
    content: `
<h2>What Counts as Specialized Experience Under OPM Rules?</h2>
<p>Specialized experience is the cornerstone of federal qualification determinations. Under OPM qualification standards, it is defined as experience that has equipped the applicant with the particular knowledge, skills, and abilities to perform the specific duties of the target position successfully. This definition has two critical implications: the experience must be relevant to the <em>specific position</em>, and its documentation in the resume must be explicit enough to allow independent verification by an HR specialist.</p>
<p>OPM requires that specialized experience be at a level equivalent to the next lower grade. For a GS-9 position, one year of qualifying experience at GS-7 equivalent is required. For GS-12, one year at GS-11 equivalent. For GS-13 and above, no education substitution is permitted — the experience must be present and documented.</p>
<p>Several categories of experience can satisfy the specialized experience requirement:</p>
<ul>
  <li><strong>Direct federal civilian employment</strong> in a position with duties equivalent to the required grade</li>
  <li><strong>Federal contractor or grantee work</strong> performing the same functional duties as a federal GS employee</li>
  <li><strong>Private sector or nonprofit employment</strong> where the nature, complexity, and scope of duties is equivalent to the federal GS standard</li>
  <li><strong>Military service</strong> in an occupational specialty with equivalent duties (subject to HR determination)</li>
  <li><strong>Unpaid or volunteer work</strong> in some occupational series, when documented with sufficient specificity</li>
</ul>
<p>The key principle is documentation. Experience that is not described in the resume does not exist from an HR screening perspective. The burden of proof is on the applicant to make the qualification traceable within the resume text.</p>

<h2>GS-7 Specialized Experience Example</h2>
<p>GS-7 is a developmental grade level. Education may substitute for experience in many series, but when experience is documented, it must demonstrate at least one year at the GS-5 equivalent. Below is a comparison of a weak versus a strong specialized experience statement for a GS-7 Program Analyst position.</p>

<p><strong>Vacancy Announcement Language (Required Qualification):</strong><br />
<em>One year of specialized experience equivalent to GS-5 that includes: analyzing administrative processes and procedures to identify inefficiencies; preparing written reports or briefings for management; and coordinating work assignments with internal and external stakeholders.</em></p>

<div style="background:#fef2f2;border-left:4px solid #ef4444;padding:16px 20px;margin:20px 0;border-radius:0 8px 8px 0">
  <p style="font-weight:700;color:#991b1b;margin:0 0 8px;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em">Weak Statement</p>
  <p style="margin:0;color:#374151;font-size:0.9rem">Assisted with administrative tasks, helped prepare reports, and worked with team members on various assignments. Supported the department in day-to-day operations.</p>
  <p style="margin:8px 0 0;font-size:0.8rem;color:#6b7280">Why it fails: No specific duties are described. \'Assisted\' and \'helped\' do not demonstrate the applicant performed the required functions. No scope, method, or outcome is documented. HR cannot verify any of the three required competencies.</p>
</div>

<div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:16px 20px;margin:20px 0;border-radius:0 8px 8px 0">
  <p style="font-weight:700;color:#15803d;margin:0 0 8px;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em">Strong Statement</p>
  <p style="margin:0;color:#374151;font-size:0.9rem">Analyzed 14 administrative workflows across 3 divisions to identify processing bottlenecks, producing a written findings report presented to senior management that resulted in a 22% reduction in manual processing time. Coordinated weekly task assignments among 6 internal staff and 2 contractor teams, tracking deliverable status using SharePoint and escalating delays to supervisors through formal briefing memoranda.</p>
  <p style="margin:8px 0 0;font-size:0.8rem;color:#6b7280">Why it works: All three required competencies are explicitly addressed. Scope is quantified (14 workflows, 3 divisions, 6 staff, 2 contractor teams). The output format (written report, briefing memoranda) matches the announcement language. The outcome is measurable (22% reduction).</p>
</div>

<h2>GS-9 Specialized Experience Example</h2>
<p>At GS-9, the applicant must demonstrate one year of specialized experience at GS-7 equivalent, or possess a master\'s degree or two full years of graduate education in a closely related field. When experience is the qualifying basis, the resume must document independent performance of substantive analytical or technical work — not supervised or developmental-level duties.</p>

<p><strong>Vacancy Announcement Language (Required Qualification):</strong><br />
<em>One year of specialized experience equivalent to GS-7 that includes: independently conducting data analysis to evaluate program performance metrics; developing recommendations for program improvements; and drafting policy documents, standard operating procedures, or technical reports for management review.</em></p>

<div style="background:#fef2f2;border-left:4px solid #ef4444;padding:16px 20px;margin:20px 0;border-radius:0 8px 8px 0">
  <p style="font-weight:700;color:#991b1b;margin:0 0 8px;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em">Weak Statement</p>
  <p style="margin:0;color:#374151;font-size:0.9rem">Performed data analysis and contributed to policy development. Worked on improving program processes and wrote reports as needed.</p>
  <p style="margin:8px 0 0;font-size:0.8rem;color:#6b7280">Why it fails: \'Performed\' and \'contributed\' are vague. No data sources, analytical methods, or output formats are specified. \'As needed\' implies reactive, non-independent work. No quantification of scope or impact.</p>
</div>

<div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:16px 20px;margin:20px 0;border-radius:0 8px 8px 0">
  <p style="font-weight:700;color:#15803d;margin:0 0 8px;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em">Strong Statement</p>
  <p style="margin:0;color:#374151;font-size:0.9rem">Independently conducted quarterly performance metric analysis for a $12M grant program using Excel pivot tables and PowerBI dashboards, identifying a 31% variance in grant expenditure rates across 8 recipient organizations. Drafted 3 standard operating procedures and 2 policy guidance memoranda adopted agency-wide, reducing inconsistent application of program requirements by field staff. Developed written recommendations presented to the Deputy Director that led to revised monitoring protocols for 40 active grants.</p>
  <p style="margin:8px 0 0;font-size:0.8rem;color:#6b7280">Why it works: \'Independently\' directly addresses the requirement for independent performance. All three competency areas are substantiated with specific tools, outputs, and outcomes. The scope (12M program, 8 organizations, 40 grants) documents GS-7 equivalent complexity.</p>
</div>

<h2>GS-12 Specialized Experience Example</h2>
<p>GS-12 is a full performance level in most occupational series. No education substitution is permitted. The applicant must have one year of specialized experience equivalent to GS-11, demonstrating expert-level performance, independent judgment on complex matters, and program-wide or cross-organizational impact. Developmental or supporting language is disqualifying at this grade.</p>

<p><strong>Vacancy Announcement Language (Required Qualification):</strong><br />
<em>One year of specialized experience equivalent to GS-11 that includes: leading or directing analysis of complex program or policy issues with government-wide or multi-organizational impact; providing written or oral briefings to senior leadership on findings and recommendations; and developing or revising agency policies, directives, or regulations.</em></p>

<div style="background:#fef2f2;border-left:4px solid #ef4444;padding:16px 20px;margin:20px 0;border-radius:0 8px 8px 0">
  <p style="font-weight:700;color:#991b1b;margin:0 0 8px;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em">Weak Statement</p>
  <p style="margin:0;color:#374151;font-size:0.9rem">Analyzed policy issues and provided recommendations to management. Participated in briefings and contributed to policy development projects across several departments.</p>
  <p style="margin:8px 0 0;font-size:0.8rem;color:#6b7280">Why it fails: \'Participated\' and \'contributed\' are supporting-role language, incompatible with GS-12 leading/directing requirements. No scope of impact (government-wide or multi-organizational) is documented. Briefings were provided \'to management\'— not senior leadership. No policies are identified.</p>
</div>

<div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:16px 20px;margin:20px 0;border-radius:0 8px 8px 0">
  <p style="font-weight:700;color:#15803d;margin:0 0 8px;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em">Strong Statement</p>
  <p style="margin:0;color:#374151;font-size:0.9rem">Led cross-agency analysis of procurement policy compliance across 12 federal agencies, identifying $4.7M in systemic billing irregularities and drafting a corrective action framework adopted by OMB as government-wide guidance. Briefed the Assistant Secretary and Inspector General on findings quarterly, producing executive summary packages and presentation materials reviewed by senior career officials. Authored 4 agency directives and one regulatory revision to 48 CFR Part 15 governing competitive negotiation procedures, coordinating clearance through legal counsel and 6 stakeholder offices.</p>
  <p style="margin:8px 0 0;font-size:0.8rem;color:#6b7280">Why it works: \'Led\' and \'Authored\' establish independent, lead-level performance. Scope is explicitly government-wide (12 agencies, OMB adoption). Senior leadership briefings are documented (Assistant Secretary, IG). Specific policy outputs are named (4 directives, one CFR revision). Financial impact is quantified.</p>
</div>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:28px 24px;margin:36px 0;text-align:center">
  <p style="font-size:1.05rem;font-weight:700;color:#0f172a;margin:0 0 8px">Check If Your Specialized Experience Meets GS Standards</p>
  <p style="color:#64748b;font-size:0.9rem;margin:0 0 20px">Upload your resume and target vacancy announcement to verify that your specialized experience language satisfies the qualification requirements at your target grade level.</p>
  <a href="/" style="display:inline-block;background:#0f172a;color:#fff;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:0.9rem">Analyze My Resume — Free</a>
</div>

<h2>How to Align Your Experience with Vacancy Language</h2>
<p>The most effective method for writing specialized experience is direct alignment with the Required Qualifications section of the vacancy announcement. This is a structured, repeatable process:</p>
<ol>
  <li><strong>Extract each required competency phrase</strong> from the vacancy announcement\'s Qualifications section. List them separately.</li>
  <li><strong>Identify which of your positions</strong> involved work that satisfies each competency. Map each competency to a specific position and date range.</li>
  <li><strong>Draft experience bullets</strong> using the announcement\'s terminology, documenting the specific nature of the work, the tools or methods used, the scope of responsibility, and the measurable outcome.</li>
  <li><strong>Verify coverage</strong>: every required competency must be traceable to at least one specific bullet in the resume. If any required competency is not documented, the application is at risk of an Ineligible rating regardless of whether the experience technically exists.</li>
</ol>
<p>For guidance on the broader qualification framework that governs grade-level targeting, see our article on <a href="/blog/how-to-target-gs-pay-grade-requirements-in-your-federal-resume">targeting GS pay grade requirements in your federal resume</a>.</p>

<h2>How HR Interprets Specialized Experience</h2>
<p>Understanding the HR review process is essential context for writing effective specialized experience statements. HR specialists do not evaluate resumes holistically. They apply a structured qualification standard to each application, comparing the resume\'s documented experience against a defined checklist of required competencies.</p>
<p>Two factors determine whether a specialized experience statement passes HR review:</p>
<p><strong>Language alignment.</strong> The resume must use vocabulary that maps to the vacancy announcement\'s competency language. HR specialists are not required to infer equivalence — if the connection between the resume and the qualification requirement is not explicit, the requirement is treated as unmet. This is not bureaucratic rigidity; it is a compliance function designed to ensure consistent, defensible hiring decisions.</p>
<p><strong>Scope and complexity documentation.</strong> The resume must demonstrate that the experience was performed at the appropriate grade-level equivalent. A GS-11 experience claim requires documented evidence of independent judgment, cross-organizational impact, and substantive technical output — not developmental or supporting work supervised by a higher-grade employee. The grade equivalency is inferred from the complexity indicators in the resume: dollar amounts, organizational scope, number of subordinates, policy-level versus operational work.</p>
<p>For a detailed breakdown of each stage of the HR review — from minimum qualification verification through category rating — see our guide on <a href="/blog/how-hr-screens-federal-resumes">how HR reviews federal resumes</a> on USAJOBS.</p>
<p>Additionally, for positions requiring time-in-grade documentation alongside specialized experience, review our analysis of <a href="/blog/federal-time-in-grade-rules">federal time-in-grade rules</a> to ensure your resume satisfies both qualification gates simultaneously.</p>

<hr style="border:none;border-top:1px solid #e2e8f0;margin:40px 0 24px" />
<p style="font-size:0.8rem;color:#94a3b8">ResumeGov is an independent compliance tool and is not affiliated with USAJOBS or the U.S. Office of Personnel Management (OPM).</p>
`,
  },

  // ── Article 9 ────────────────────────────────────────────────────────
  {
    slug: 'veterans-preference-usajobs',
    title: 'Veterans Preference on USAJOBS: 5-Point vs 10-Point Explained (2026 Guide)',
    description:
      'Learn how 5-point and 10-point veterans preference works on USAJOBS, how HR applies category rating, and what documentation is required.',
    date: '2026-04-15',
    readingTime: 10,
    author: 'ResumeGov Editorial Team',
    tags: ['veterans preference', '5-point preference', '10-point preference', 'USAJOBS', 'category rating', 'DD-214', 'SF-15'],
    relatedSlugs: [
      'how-hr-screens-federal-resumes',
      'federal-time-in-grade-rules',
      'specialized-experience-examples-federal-resume',
    ],
    faqs: [
      {
        question: 'What is the difference between 5-point and 10-point veterans preference?',
        answer: '5-point preference (TP) applies to veterans who served on active duty and received an honorable or general discharge, typically documented with a DD-214. 10-point preference applies to veterans with a service-connected disability, Purple Heart recipients, and certain other qualifying categories. The points affect placement within category rating — 10-point preference categories, particularly CPS (30% or more disability), carry the strongest statutory protections including priority referral rights.',
      },
      {
        question: 'Does veterans preference guarantee a federal job?',
        answer: 'No. Veterans preference improves ranking within the category rating system but does not waive minimum qualifications or specialized experience requirements. An applicant who does not meet the basic qualification standard for the position will be rated Ineligible regardless of preference eligibility. Preference operates only among candidates who have first been determined to meet all qualification requirements.',
      },
      {
        question: 'What documents are required for 10-point preference?',
        answer: 'Applicants claiming 10-point preference must submit the DD-214 (Certificate of Release or Discharge from Active Duty) showing character of discharge, the SF-15 (Application for 10-Point Veteran Preference), and a letter from the Department of Veterans Affairs confirming the service-connected disability rating and percentage. Failure to submit any of these documents may result in the preference claim being disallowed.',
      },
      {
        question: 'Does veterans preference apply to excepted service?',
        answer: 'Veterans preference is mandated by statute for competitive service appointments. In the excepted service, application of preference varies by agency and appointing authority. Some excepted service positions apply preference voluntarily; others do not. Veterans should verify preference applicability in the specific vacancy announcement and consult the agency human resources office if unclear.',
      },
      {
        question: 'Can veterans preference override specialized experience requirements?',
        answer: 'No. Veterans preference does not waive or substitute for any qualification requirement, including specialized experience. Title 5 regulations require that all candidates — including preference eligibles — meet the minimum qualification standards established for the position before preference points are applied. Preference affects ranking among qualified candidates only; it has no bearing on the qualification determination itself.',
      },
    ],
    content: `
<h2>What Is Veterans Preference in Federal Hiring?</h2>
<p>Veterans preference is a statutory benefit established under Title 5 of the United States Code that provides eligible veterans with advantages in the federal competitive hiring process. Its legal foundation reflects congressional intent to recognize military service and ease the transition to civilian federal employment.</p>
<p>Several foundational principles govern how veterans preference operates:</p>
<ul>
  <li><strong>Scope of application.</strong> Veterans preference applies primarily to competitive service appointments. Its application in the excepted service varies by agency and appointing authority.</li>
  <li><strong>Role in category rating.</strong> Under the category rating system, preference eligibles are placed ahead of non-preference eligibles within the same quality category. Certain 10-point preference eligibles receive additional statutory protections affecting referral order.</li>
  <li><strong>Qualification threshold not waived.</strong> Veterans preference does not waive minimum qualifications. A preference-eligible applicant must first meet all qualification requirements — including education, specialized experience, and any selective placement factors — before preference points are applied.</li>
  <li><strong>Specialized experience not substituted.</strong> Preference cannot replace the specialized experience requirements specified in the vacancy announcement. These requirements must be met independently of preference status.</li>
</ul>
<p>For a detailed overview of how HR specialists apply qualification standards before preference is considered, see our guide on <a href="/blog/how-hr-screens-federal-resumes">How HR Reviews Federal Resumes on USAJOBS</a>.</p>

<h2>Who Qualifies for Veterans Preference?</h2>

<h3>5-Point Preference (TP)</h3>
<p>Five-point preference applies to veterans who meet all of the following criteria:</p>
<ul>
  <li>Served on active duty in the armed forces of the United States</li>
  <li>Were released under honorable conditions (honorable or general discharge)</li>
  <li>Served during a qualifying period or campaign, or received an Armed Forces Expeditionary Medal or other qualifying campaign or expeditionary badge</li>
</ul>
<p>The primary documentation required is the <strong>DD-214 (Certificate of Release or Discharge from Active Duty)</strong>, which must show the character of discharge and the period of service. Without a DD-214 reflecting qualifying service and an eligible discharge characterization, the 5-point preference claim cannot be verified.</p>

<h3>10-Point Preference Categories (CP, CPS, XP)</h3>
<p>Ten-point preference applies to a broader set of qualifying circumstances and carries stronger statutory protections than 5-point preference. The three primary 10-point categories are:</p>
<ul>
  <li><strong>CP — Compensable Disability (less than 30%).</strong> Veterans with a service-connected disability of at least 10% but less than 30%, as rated by the Department of Veterans Affairs.</li>
  <li><strong>CPS — Compensable Disability (30% or more).</strong> Veterans with a service-connected disability rated at 30% or more. This category carries the highest level of statutory protection, including priority placement rights in the referral process.</li>
  <li><strong>XP — Other 10-Point Preference.</strong> Includes Purple Heart recipients, veterans with a non-compensable service-connected disability, and certain surviving spouses, widows, and mothers of veterans under specific qualifying conditions.</li>
</ul>
<p>Documentation requirements for 10-point preference are more extensive than for 5-point preference. Applicants must submit:</p>
<ul>
  <li>DD-214 showing character of discharge and period of service</li>
  <li><strong>SF-15 (Application for 10-Point Veteran Preference)</strong> — the official OPM form used to claim 10-point preference</li>
  <li>A letter from the Department of Veterans Affairs confirming the service-connected disability rating and percentage</li>
</ul>
<p>Failure to submit any of these documents may result in the preference claim being disallowed, even if the underlying eligibility exists.</p>

<h2>5-Point vs 10-Point Preference — What Is the Difference?</h2>
<p>The distinction between preference categories has direct consequences for how an applicant is ranked and referred under the category rating system.</p>

<table style="width:100%;border-collapse:collapse;font-size:0.9rem;margin:24px 0">
  <thead>
    <tr style="background:#f1f5f9">
      <th style="border:1px solid #cbd5e1;padding:10px 14px;text-align:left">Category</th>
      <th style="border:1px solid #cbd5e1;padding:10px 14px;text-align:left">Points Added</th>
      <th style="border:1px solid #cbd5e1;padding:10px 14px;text-align:left">Disability Required</th>
      <th style="border:1px solid #cbd5e1;padding:10px 14px;text-align:left">Referral Impact</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border:1px solid #cbd5e1;padding:10px 14px">TP (5-Point)</td>
      <td style="border:1px solid #cbd5e1;padding:10px 14px">5</td>
      <td style="border:1px solid #cbd5e1;padding:10px 14px">No</td>
      <td style="border:1px solid #cbd5e1;padding:10px 14px">Listed ahead of non-preference eligibles within category</td>
    </tr>
    <tr style="background:#f8fafc">
      <td style="border:1px solid #cbd5e1;padding:10px 14px">CP (10-Point)</td>
      <td style="border:1px solid #cbd5e1;padding:10px 14px">10</td>
      <td style="border:1px solid #cbd5e1;padding:10px 14px">Yes (10–29%)</td>
      <td style="border:1px solid #cbd5e1;padding:10px 14px">Listed ahead of non-preference eligibles within category</td>
    </tr>
    <tr>
      <td style="border:1px solid #cbd5e1;padding:10px 14px">CPS (10-Point)</td>
      <td style="border:1px solid #cbd5e1;padding:10px 14px">10</td>
      <td style="border:1px solid #cbd5e1;padding:10px 14px">Yes (30%+)</td>
      <td style="border:1px solid #cbd5e1;padding:10px 14px">Priority referral; placed at top of Best Qualified</td>
    </tr>
    <tr style="background:#f8fafc">
      <td style="border:1px solid #cbd5e1;padding:10px 14px">XP (10-Point)</td>
      <td style="border:1px solid #cbd5e1;padding:10px 14px">10</td>
      <td style="border:1px solid #cbd5e1;padding:10px 14px">Varies (Purple Heart, etc.)</td>
      <td style="border:1px solid #cbd5e1;padding:10px 14px">Listed ahead of non-preference eligibles within category</td>
    </tr>
  </tbody>
</table>

<p>The additional points associated with 10-point preference do not generate a numerical score in modern category rating systems. Instead, preference status determines the <em>order within a quality category</em>. Veterans are listed ahead of non-veterans within the same category regardless of point value. The critical distinction of CPS preference is that applicants in this category are placed at the top of the Best Qualified list and referred before non-preference eligibles in that category — a statutory protection that significantly affects hiring outcomes in competitive announcements.</p>

<h2>How Veterans Preference Affects Category Rating</h2>
<p>The category rating system replaced the traditional numerical ranking system for most competitive service positions. Under category rating, applicants are assessed and placed into defined quality groups — typically Best Qualified, Well Qualified, and Qualified — based on their qualifications, competencies, and experience.</p>
<p>Veterans preference interacts with this system in the following way:</p>
<ul>
  <li><strong>Within-category ordering.</strong> Preference eligibles are listed ahead of non-preference eligibles within the same quality category. A veteran rated as Well Qualified will appear before a non-veteran also rated as Well Qualified.</li>
  <li><strong>30%+ disabled veteran protection.</strong> Veterans in the CPS category must be placed at the top of the highest quality category. This means they are referred to the selecting official before other Best Qualified applicants, including other preference eligibles.</li>
  <li><strong>Best Qualified category referral.</strong> Hiring managers may only select from candidates referred on the certificate. Preference improves competitive position but does not guarantee placement in the Best Qualified category — that determination is based on qualification and competency scoring.</li>
</ul>
<p>For current federal employees, understanding how time-in-grade requirements interact with category placement is also important when applying for promotion-level positions. See our analysis of <a href="/blog/federal-time-in-grade-rules">Federal Time-in-Grade Rules Explained</a> for a detailed breakdown of that qualification gate.</p>

<h2>Does Veterans Preference Guarantee a Federal Job?</h2>
<p>No. Veterans preference does not guarantee selection for a federal position. This is one of the most frequently misunderstood aspects of the federal hiring process.</p>
<p>Preference improves competitive ranking among qualified applicants; it does not alter the qualification determination. The following conditions must all be satisfied before preference has any effect:</p>
<ul>
  <li><strong>Basic qualifications must be met.</strong> Every applicant — including preference eligibles — must meet the minimum qualification requirements for the position, including education and experience thresholds established by OPM qualification standards.</li>
  <li><strong>Specialized experience must be documented.</strong> The resume must demonstrate specialized experience at the appropriate grade level equivalent, fully described in sufficient detail for HR to make a determination. Preference does not substitute for this documentation. See our article on <a href="/blog/specialized-experience-examples-federal-resume">Specialized Experience Examples for Federal Resumes</a> for structured guidance on meeting this requirement.</li>
  <li><strong>Resume must pass HR screening.</strong> The resume must satisfy all HR review criteria before the applicant is rated and placed in a quality category. Common documentation errors — including missing qualifications language or insufficient experience detail — result in an Ineligible rating that preference cannot overcome. For a breakdown of common errors, see our guide on <a href="/blog/top-10-federal-resume-mistakes-that-lead-to-automatic-usajobs-rejection">Top Federal Resume Mistakes That Lead to Ineligible Ratings</a>.</li>
  <li><strong>Hiring manager retains selection authority.</strong> Even after referral, the selecting official retains discretion to select any candidate on the certificate, pass over a preference eligible, or request a new certificate. Pass-over of a 30%+ disabled veteran requires OPM approval, but selection among other preference eligibles is at the manager\'s discretion.</li>
</ul>

<h2>Veterans Preference in Competitive vs Excepted Service</h2>
<p><strong>Competitive service.</strong> Veterans preference is mandated by statute for all competitive service appointments. HR specialists are required to apply the preference rules established under Title 5 to every applicable announcement. There is no agency discretion to waive or modify these requirements in competitive service hiring.</p>
<p><strong>Excepted service.</strong> In the excepted service, veterans preference requirements vary by agency, appointing authority, and position type. Some excepted service agencies apply preference voluntarily and consistently; others apply it selectively based on the nature of the appointment. Veterans applying for excepted service positions should review the specific vacancy announcement carefully and may contact the agency HR office to confirm how preference will be applied.</p>
<p><strong>Senior Executive Service (SES).</strong> Veterans preference does not apply to SES appointments. SES positions are filled through a separate executive selection process that is not subject to the preference requirements governing General Schedule competitive service positions.</p>

<h2>Veterans Preference for Current Federal Employees</h2>
<p><strong>External competitive announcements.</strong> Veterans preference applies when a current federal employee applies for a position through an external competitive announcement open to all U.S. citizens. In this context, the employee\'s veteran status is evaluated the same way as any other applicant\'s.</p>
<p><strong>Internal merit promotion procedures.</strong> Merit promotion procedures — used for internal advancement within the federal government — are generally not subject to veterans preference requirements. Preference is a feature of competitive hiring from outside the agency, not of promotion from within. Employees seeking advancement through merit promotion cannot invoke veterans preference to improve their standing on internal referral certificates.</p>
<p><strong>Cross-agency applications.</strong> A current federal employee who applies to a position at a different agency through an external competitive announcement may claim veterans preference if otherwise eligible. The preference applies to the competitive process, not to the employee\'s current employment status.</p>

<h2>Common Veterans Preference Documentation Mistakes</h2>
<ul>
  <li><strong>Missing DD-214.</strong> Failure to submit the DD-214 is the most common error. Without it, HR cannot verify service dates, discharge characterization, or qualifying campaign participation.</li>
  <li><strong>Incorrect discharge characterization.</strong> Only honorable and general discharges qualify for preference. Other than honorable, bad conduct, and dishonorable discharges do not qualify. Applicants must ensure the DD-214 reflects a qualifying discharge type.</li>
  <li><strong>Failure to submit SF-15.</strong> Applicants claiming 10-point preference must submit the SF-15 in addition to the DD-214. Omitting the SF-15 results in the 10-point claim being disallowed, even if the disability is documented elsewhere.</li>
  <li><strong>Missing VA disability letter.</strong> For disability-based 10-point preference, the VA letter confirming the service-connected disability rating and percentage is required. A benefits summary or general medical letter is not a substitute.</li>
  <li><strong>Assuming preference replaces qualification.</strong> Some applicants incorrectly assume that preference status reduces or eliminates qualification requirements. It does not. An Ineligible rating is final regardless of preference category.</li>
</ul>

<h2>How HR Verifies Veterans Preference</h2>
<p>HR specialists follow a structured process for verifying and applying veterans preference claims:</p>
<ul>
  <li><strong>Document review.</strong> HR reviews submitted documentation — DD-214, SF-15, VA letter — against the claimed preference category. Missing or insufficient documents result in the claim being disallowed without further recourse during the current announcement cycle.</li>
  <li><strong>Disability percentage validation.</strong> For CPS claims, HR verifies the disability percentage from the VA letter to confirm the 30% threshold is met. Applicants below this threshold may still qualify for CP preference if the disability is at least 10% compensable.</li>
  <li><strong>Category placement adjustment.</strong> Once preference is verified, HR adjusts the applicant\'s placement within the quality category. Preference eligibles are reordered ahead of non-preference eligibles within the same category; CPS-eligible applicants are placed at the top of the highest quality category.</li>
  <li><strong>Referral certificate implications.</strong> The adjusted ordering determines which candidates appear on the referral certificate sent to the selecting official. Candidates not on the certificate are not considered for selection regardless of their qualifications or preference status.</li>
</ul>
<p>For a complete overview of the HR review process from minimum qualification verification through referral, see our guide on <a href="/blog/how-hr-screens-federal-resumes">How HR Reviews Federal Resumes</a>.</p>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:28px 32px;margin:40px 0">
  <p style="font-size:0.75rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;margin:0 0 8px">ResumeGov Compliance Tool</p>
  <h3 style="font-size:1.25rem;font-weight:700;color:#0f172a;margin:0 0 12px">Verify Your Federal Resume Before HR Reviews It</h3>
  <p style="color:#475569;margin:0 0 20px;font-size:0.95rem">ResumeGov analyzes compliance signals including qualification alignment, documentation readiness, and GS-level compatibility.</p>
  <a href="https://www.resumegov.com/" style="display:inline-block;background:#0f172a;color:#fff;font-weight:600;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:0.95rem">Analyze My Resume — Free</a>
</div>

<h2>Conclusion</h2>
<p>Veterans preference is a statutory mechanism that improves competitive ranking within the federal hiring process. It does not guarantee selection, waive qualification requirements, or substitute for specialized experience documentation. Understanding its precise function — and the documentation standards required to invoke it — is essential for preference-eligible applicants seeking federal employment.</p>
<ul>
  <li>Preference increases ranking within category rating; it does not affect the qualification determination.</li>
  <li>Documentation accuracy — DD-214, SF-15, and VA disability letter — determines whether the preference claim is applied.</li>
  <li>CPS preference (30%+ disability) carries the strongest statutory protections, including priority placement in the Best Qualified category.</li>
  <li>Preference operates within the competitive service framework; its application in the excepted service and SES is limited or absent.</li>
  <li>Compliance with all qualification and documentation requirements determines referral outcome — preference amplifies a qualified application; it cannot repair a disqualified one.</li>
</ul>

<hr style="border:none;border-top:1px solid #e2e8f0;margin:40px 0 24px" />
<p style="font-size:0.8rem;color:#94a3b8">ResumeGov is an independent compliance tool and is not affiliated with USAJOBS or the U.S. Office of Personnel Management (OPM).</p>
`,
  },
];

export default POSTS;

import { callOpenAI } from './client';
import type { AIResponse, ParsedJobData } from './types';

export interface TailoredResume {
  tailored_resume_text: string;
  original_word_count: number;
  final_word_count: number;
  change_summary: string[];
  matched_requirements: string[];
  unresolved_gaps: string[];
  questions_for_user: string[];
}

export interface TailoringVerification {
  safe: boolean;
  unsupported_claims: string[];
  lost_critical_facts: string[];
  notes: string[];
}

export interface TailorResumeInput {
  resumeText: string;
  jobText: string;
  parsedJob: ParsedJobData;
}

export interface RepairTailoredResumeInput extends TailorResumeInput {
  draft: TailoredResume;
  verification: TailoringVerification;
}

const TAILORING_PROMPT = `You are a careful federal resume editor. Create a vacancy-targeted federal resume using only facts explicitly present in the source resume.

NON-NEGOTIABLE TRUTH RULES:
1. Never invent or infer an employer, title, date, hours per week, GS grade, duty, tool, metric, budget, team size, credential, clearance, education, result, or level of responsibility.
2. Never copy a vacancy requirement into the resume unless the source resume contains evidence that the applicant performed it.
3. You may reorder, condense, clarify, and combine source facts. You may use vacancy terminology only when it accurately describes a source fact.
4. Preserve contact details, job titles, employers, dates, hours per week, education, credentials, and quantified achievements that appear in the source.
5. If important evidence is missing, list a question for the applicant instead of filling the gap.
6. Do not claim that the resume is eligible, qualified, referred, or guaranteed to fit two pages.

OUTPUT GOAL:
- Produce a complete, readable, plain-text federal resume targeted to this exact vacancy.
- Prioritize supported specialized-experience evidence and measurable achievements.
- Use concise headings and bullets suitable for export to DOCX.
- Aim for a practical two-page content budget, but do not add filler to reach a word target and do not remove qualification evidence merely to shorten the document.
- Return valid JSON only.`;

const VERIFICATION_PROMPT = `You are an independent factual verifier. Compare a tailored federal resume with its source resume.

EVIDENCE STANDARD:
1. Mark a claim unsupported only when it adds a materially new fact: a metric, tool, duty, scope, credential, date, hours, grade, employer, result, or responsibility that the source does not support.
2. Treat a faithful paraphrase as supported when a reasonable reader can trace its full meaning to one or more source statements. Exact wording is not required.
3. Vacancy terminology is allowed only when it is a plain-language label for work actually described in the source. It must not imply a new tool, method, authority, scope, or result.
4. Do not reject grammar changes, reordered facts, shortened wording, headings, or combined bullets that preserve the source meaning.
5. Identify critical source facts that disappeared, especially employers, titles, dates, hours, education, credentials, and quantified achievements.
6. Quote or closely identify each genuinely unsupported passage and briefly state which new fact it adds. Do not list mere wording differences.

Return valid JSON only. Protect factual accuracy without requiring verbatim copying.`;

const REPAIR_PROMPT = `You are a factual-safety editor. Repair a vacancy-targeted federal resume after an independent review.

NON-NEGOTIABLE RULES:
1. Use only facts present in the source resume. Never infer or invent details.
2. For every unsupported passage named by the verifier, either replace it with the closest source-supported wording or remove it.
3. Restore every genuinely critical source fact named by the verifier.
4. Preserve the useful vacancy targeting, readable structure, and all supported achievements.
5. Do not answer missing-information questions on the applicant's behalf.
6. Return the complete repaired resume and valid JSON only.`;

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export async function tailorResume(
  input: TailorResumeInput
): Promise<AIResponse<TailoredResume>> {
  const { resumeText, jobText, parsedJob } = input;
  const originalWordCount = wordCount(resumeText);
  const userPrompt = `SOURCE RESUME (${originalWordCount} words):\n${resumeText}\n\n` +
    `TARGET VACANCY:\n${jobText}\n\n` +
    `PARSED REQUIREMENTS:\n${JSON.stringify({
      title: parsedJob.title,
      gs_level: parsedJob.gs_level,
      required_qualifications: parsedJob.required_qualifications,
      specialized_experience: parsedJob.specialized_experience,
      keywords: parsedJob.keywords,
      duties: parsedJob.duties,
    })}\n\n` +
    `Return this JSON shape:\n` +
    `{"tailored_resume_text":"complete resume","original_word_count":${originalWordCount},` +
    `"final_word_count":0,"change_summary":[],"matched_requirements":[],` +
    `"unresolved_gaps":[],"questions_for_user":[]}`;

  const result = await callOpenAI<TailoredResume>(TAILORING_PROMPT, userPrompt, {
    temperature: 0.1,
    maxTokens: 6000,
  });

  if (!result.data) {
    return {
      success: false,
      data: null,
      error: result.error || 'Tailoring returned no data.',
      tokens_used: result.tokensUsed,
      model: 'gpt-4o-mini',
    };
  }

  const text = result.data.tailored_resume_text?.trim();
  if (!text || text.length < 200) {
    return {
      success: false,
      data: null,
      error: 'The tailoring engine did not return a complete resume.',
      tokens_used: result.tokensUsed,
      model: 'gpt-4o-mini',
    };
  }

  return {
    success: result.error === null,
    data: {
      ...result.data,
      original_word_count: originalWordCount,
      final_word_count: wordCount(text),
      tailored_resume_text: text,
      change_summary: Array.isArray(result.data.change_summary) ? result.data.change_summary : [],
      matched_requirements: Array.isArray(result.data.matched_requirements) ? result.data.matched_requirements : [],
      unresolved_gaps: Array.isArray(result.data.unresolved_gaps) ? result.data.unresolved_gaps : [],
      questions_for_user: Array.isArray(result.data.questions_for_user) ? result.data.questions_for_user : [],
    },
    error: result.error,
    tokens_used: result.tokensUsed,
    model: 'gpt-4o-mini',
  };
}

export async function verifyTailoredResume(params: {
  originalResume: string;
  tailoredResume: string;
}): Promise<AIResponse<TailoringVerification>> {
  const userPrompt = `SOURCE RESUME:\n${params.originalResume}\n\n` +
    `TAILORED RESUME:\n${params.tailoredResume}\n\n` +
    `Return: {"safe":true,"unsupported_claims":[],"lost_critical_facts":[],"notes":[]}`;

  const result = await callOpenAI<TailoringVerification>(VERIFICATION_PROMPT, userPrompt, {
    temperature: 0,
    maxTokens: 1800,
  });

  if (!result.data) {
    return {
      success: false,
      data: null,
      error: result.error || 'Verification returned no data.',
      tokens_used: result.tokensUsed,
      model: 'gpt-4o-mini',
    };
  }
  const unsupported = Array.isArray(result.data.unsupported_claims)
    ? result.data.unsupported_claims.filter(Boolean)
    : [];
  const lostCriticalFacts = Array.isArray(result.data.lost_critical_facts)
    ? result.data.lost_critical_facts.filter(Boolean)
    : [];

  return {
    success: result.error === null,
    data: {
      safe: result.data.safe === true && unsupported.length === 0 && lostCriticalFacts.length === 0,
      unsupported_claims: unsupported,
      lost_critical_facts: lostCriticalFacts,
      notes: Array.isArray(result.data.notes) ? result.data.notes.filter(Boolean) : [],
    },
    error: result.error,
    tokens_used: result.tokensUsed,
    model: 'gpt-4o-mini',
  };
}

export async function repairTailoredResume(
  input: RepairTailoredResumeInput
): Promise<AIResponse<TailoredResume>> {
  const originalWordCount = wordCount(input.resumeText);
  const userPrompt = `SOURCE RESUME:\n${input.resumeText}\n\n` +
    `TARGET VACANCY:\n${input.jobText}\n\n` +
    `CURRENT DRAFT:\n${input.draft.tailored_resume_text}\n\n` +
    `VERIFIER FINDINGS:\n${JSON.stringify({
      unsupported_claims: input.verification.unsupported_claims,
      lost_critical_facts: input.verification.lost_critical_facts,
      notes: input.verification.notes,
    })}\n\n` +
    `Return this JSON shape:\n` +
    `{"tailored_resume_text":"complete repaired resume","original_word_count":${originalWordCount},` +
    `"final_word_count":0,"change_summary":[],"matched_requirements":[],` +
    `"unresolved_gaps":[],"questions_for_user":[]}`;

  const result = await callOpenAI<TailoredResume>(REPAIR_PROMPT, userPrompt, {
    temperature: 0,
    maxTokens: 6000,
  });

  const text = result.data?.tailored_resume_text?.trim();
  if (!result.data || !text || text.length < 200) {
    return {
      success: false,
      data: null,
      error: result.error || 'The safety repair did not return a complete resume.',
      tokens_used: result.tokensUsed,
      model: 'gpt-4o-mini',
    };
  }

  return {
    success: result.error === null,
    data: {
      ...result.data,
      original_word_count: originalWordCount,
      final_word_count: wordCount(text),
      tailored_resume_text: text,
      change_summary: Array.isArray(result.data.change_summary) ? result.data.change_summary : [],
      matched_requirements: Array.isArray(result.data.matched_requirements) ? result.data.matched_requirements : [],
      unresolved_gaps: Array.isArray(result.data.unresolved_gaps) ? result.data.unresolved_gaps : [],
      questions_for_user: Array.isArray(result.data.questions_for_user) ? result.data.questions_for_user : [],
    },
    error: result.error,
    tokens_used: result.tokensUsed,
    model: 'gpt-4o-mini',
  };
}

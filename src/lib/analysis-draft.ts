export const ANALYSIS_DRAFT_STORAGE_KEY = 'resumegov.analysis-draft.v1';
export const ANALYSIS_DRAFT_TTL_MS = 60 * 60 * 1000;

export type AnalysisDraft = {
  resumeText: string;
  jobText: string;
  jobUrl?: string;
  uploadedFileName?: string;
  source?: string;
  expiresAt: number;
};

export function saveAnalysisDraft(
  draft: Omit<AnalysisDraft, 'expiresAt'>,
): boolean {
  if (typeof window === 'undefined') return false;

  try {
    window.localStorage.setItem(
      ANALYSIS_DRAFT_STORAGE_KEY,
      JSON.stringify({ ...draft, expiresAt: Date.now() + ANALYSIS_DRAFT_TTL_MS }),
    );
    return true;
  } catch {
    return false;
  }
}

export function loadAnalysisDraft(): AnalysisDraft | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(ANALYSIS_DRAFT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<AnalysisDraft>;
    if (
      typeof parsed.resumeText !== 'string' ||
      typeof parsed.jobText !== 'string' ||
      typeof parsed.expiresAt !== 'number' ||
      parsed.expiresAt <= Date.now()
    ) {
      clearAnalysisDraft();
      return null;
    }

    return parsed as AnalysisDraft;
  } catch {
    clearAnalysisDraft();
    return null;
  }
}

export function clearAnalysisDraft(): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(ANALYSIS_DRAFT_STORAGE_KEY);
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }
}

import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// TODO: Implement AI modules:
// - analyzeResume(resumeText: string, jobText: string): AnalysisResult
// - optimizeResume(resumeText: string, analysis: Analysis): OptimizedResume
// - parseJobPost(jobText: string): ParsedJobPost
// - generateKSA(resumeText: string, jobRequirements: string[]): string

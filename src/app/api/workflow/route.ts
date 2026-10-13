import { NextRequest, NextResponse } from 'next/server';
import { POST as analyze } from '@/app/api/free-analyze/route';
import { POST as optimize } from '@/app/api/optimize/route';

// Retain the old entry point while using the same limits, ownership checks,
// factual review, and atomic credit spending as the current application.
export async function POST(request: NextRequest) {
  let body: { step?: string; analysisId?: string; resumeId?: string; jobPostId?: string };
  try { body = await request.clone().json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }); }
  if (body.step === 'optimize') {
    if (!body.analysisId) {
      return NextResponse.json({ error: 'Analyze your resume first, then provide analysisId to optimize it.' }, { status: 400 });
    }
    return optimize(request);
  }
  if (body.resumeId || body.jobPostId) {
    return NextResponse.json({ error: 'Submit resumeText and jobText through the current analysis form.' }, { status: 400 });
  }
  return analyze(request);
}

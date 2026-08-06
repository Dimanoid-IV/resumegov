import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Database } from '@/types/database';
import type { ParsedJobData } from '@/lib/ai/types';
import { repairTailoredResume, tailorResume, verifyTailoredResume } from '@/lib/ai';
import { calculateKeywordCoverage } from '@/lib/scoring';

type UserRow = Database['public']['Tables']['users']['Row'];

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createAdminClient();
  // Server-side ownership checks are explicit below. The service client is
  // intentionally untyped here because the generated schema lags nested JSON.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = admin as any;

  try {
    const body = await request.json() as { analysisId?: string };
    const analysisId = body.analysisId;
    if (!analysisId) {
      return NextResponse.json({ error: 'Missing required field: analysisId' }, { status: 400 });
    }

    const { data: existing } = await db
      .from('optimizations')
      .select('compressed_resume_text, final_word_count, qualification_coverage_percent')
      .eq('analysis_id', analysisId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        tailored_resume_text: existing.compressed_resume_text,
        compressed_resume_text: existing.compressed_resume_text,
        final_word_count: existing.final_word_count,
        qualification_coverage_percent: existing.qualification_coverage_percent,
        reused: true,
      });
    }

    const { data: profileData, error: profileError } = await db
      .from('users')
      .select('plan_type, credits_remaining')
      .eq('id', user.id)
      .single();

    if (profileError || !profileData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const profile = profileData as Pick<UserRow, 'plan_type' | 'credits_remaining'>;
    const paidPlan = ['basic', 'pro', 'enterprise'].includes(profile.plan_type);
    const hasCredits = profile.credits_remaining === -1 || profile.credits_remaining > 0;
    if (!paidPlan || !hasCredits) {
      return NextResponse.json({ error: 'No optimization credits available.' }, { status: 403 });
    }

    const { data: analysis, error: analysisError } = await db
      .from('analyses')
      .select('resume_id, job_post_id')
      .eq('id', analysisId)
      .eq('user_id', user.id)
      .single();

    if (analysisError || !analysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
    }

    const [{ data: resume }, { data: jobPost }] = await Promise.all([
      db.from('resumes').select('original_text').eq('id', analysis.resume_id).eq('user_id', user.id).single(),
      db.from('job_posts').select('original_text, parsed_json').eq('id', analysis.job_post_id).eq('user_id', user.id).single(),
    ]);

    if (!resume?.original_text || !jobPost?.original_text) {
      return NextResponse.json({ error: 'Resume or vacancy data is missing.' }, { status: 422 });
    }

    const parsedJob = jobPost.parsed_json as unknown as ParsedJobData;
    let tailored = await tailorResume({
      resumeText: resume.original_text,
      jobText: jobPost.original_text,
      parsedJob,
    });
    let totalTokens = tailored.tokens_used;
    let repairedAfterReview = false;

    if (!tailored.success || !tailored.data) {
      return NextResponse.json(
        { error: tailored.error || 'Resume tailoring failed. No credit was used.' },
        { status: 422 }
      );
    }

    let verification = await verifyTailoredResume({
      originalResume: resume.original_text,
      tailoredResume: tailored.data.tailored_resume_text,
    });
    totalTokens += verification.tokens_used;

    if (verification.success && verification.data && !verification.data.safe) {
      const repaired = await repairTailoredResume({
        resumeText: resume.original_text,
        jobText: jobPost.original_text,
        parsedJob,
        draft: tailored.data,
        verification: verification.data,
      });
      totalTokens += repaired.tokens_used;

      if (repaired.success && repaired.data) {
        const repairedData = repaired.data;
        tailored = repaired;
        repairedAfterReview = true;
        verification = await verifyTailoredResume({
          originalResume: resume.original_text,
          tailoredResume: repairedData.tailored_resume_text,
        });
        totalTokens += verification.tokens_used;
      }
    }

    if (!verification.success || !verification.data?.safe) {
      await db.from('ai_usage_logs').insert({
        user_id: user.id,
        model: verification.model || tailored.model,
        tokens_used: totalTokens,
        latency_ms: Date.now() - startedAt,
        success: false,
        error_message: 'Factual verification rejected tailored output',
      });
      return NextResponse.json(
        {
          error: 'The draft failed the factual-safety check. No credit was used.',
          verification_issues: verification.data?.unsupported_claims?.slice(0, 5) || [],
        },
        { status: 422 }
      );
    }

    const finalTailored = tailored.data;
    if (!finalTailored) {
      return NextResponse.json(
        { error: 'Resume tailoring returned no usable draft. No credit was used.' },
        { status: 422 }
      );
    }

    if (finalTailored.tailored_resume_text.trim() === resume.original_text.trim()) {
      return NextResponse.json(
        { error: 'No meaningful safe improvement could be produced. No credit was used.' },
        { status: 422 }
      );
    }

    const coverageRequirements = [
      ...(parsedJob.required_qualifications || []),
      ...(parsedJob.specialized_experience || []),
      ...(parsedJob.keywords || []),
    ];
    const coverage = calculateKeywordCoverage(
      finalTailored.tailored_resume_text,
      coverageRequirements
    );

    const { error: insertError } = await db.from('optimizations').insert({
      analysis_id: analysisId,
      compressed_resume_text: finalTailored.tailored_resume_text,
      qualification_coverage_percent: coverage,
      final_word_count: finalTailored.final_word_count,
      ksa_text: JSON.stringify({
        change_summary: finalTailored.change_summary,
        matched_requirements: finalTailored.matched_requirements,
        unresolved_gaps: finalTailored.unresolved_gaps,
        questions_for_user: finalTailored.questions_for_user,
        verification_notes: verification.data.notes,
        lost_critical_facts: verification.data.lost_critical_facts,
        repaired_after_review: repairedAfterReview,
      }),
    });

    if (insertError) {
      throw insertError;
    }

    if (profile.credits_remaining > 0) {
      await db
        .from('users')
        .update({ credits_remaining: profile.credits_remaining - 1 })
        .eq('id', user.id);
    }

    await db.from('ai_usage_logs').insert({
      user_id: user.id,
      model: tailored.model,
      tokens_used: totalTokens,
      latency_ms: Date.now() - startedAt,
      success: true,
      error_message: null,
    });

    return NextResponse.json({
      tailored_resume_text: finalTailored.tailored_resume_text,
      compressed_resume_text: finalTailored.tailored_resume_text,
      original_word_count: finalTailored.original_word_count,
      final_word_count: finalTailored.final_word_count,
      qualification_coverage_percent: coverage,
      change_summary: finalTailored.change_summary,
      matched_requirements: finalTailored.matched_requirements,
      unresolved_gaps: finalTailored.unresolved_gaps,
      questions_for_user: finalTailored.questions_for_user,
      fact_checked: true,
      repaired_after_review: repairedAfterReview,
    });
  } catch (error) {
    console.error('Optimize API error:', error);
    return NextResponse.json(
      { error: 'Resume tailoring failed. No credit was used.' },
      { status: 500 }
    );
  }
}

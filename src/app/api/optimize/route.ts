import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database';
import { compressResume, compressResumeIterative } from '@/lib/ai';
import { event } from '@/lib/gtag';

type UserRow = Database['public']['Tables']['users']['Row'];

// Constants for federal resume compliance
const TARGET_MIN = 950;
const TARGET_MAX = 1050;
const HARD_LIMIT = 1100;

// Output interface
interface OptimizeOutput {
  compressed_resume_text: string;
  final_word_count: number;
  qualification_coverage_percent: number;
}

/**
 * POST /api/optimize
 * Optimizes resume for federal compliance (2-page limit, 950-1050 words)
 * Body: { analysisId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check user credits and plan
    const { data: userProfileData, error: userError } = await supabase
      .from('users')
      .select('plan_type, credits_remaining')
      .eq('id', user.id)
      .single();

    if (userError || !userProfileData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userProfile = userProfileData as Pick<UserRow, 'plan_type' | 'credits_remaining'>;
    const userPlan = userProfile.plan_type;
    const creditsRemaining = userProfile.credits_remaining;

    // Check if user has access
    const isPro = userPlan === 'pro' || userPlan === 'basic' || userPlan === 'enterprise';
    const hasCredits = creditsRemaining === -1 || (creditsRemaining !== undefined && creditsRemaining > 0);

    if (!isPro || !hasCredits) {
      return NextResponse.json(
        { error: 'No credits remaining. Please upgrade your plan.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { analysisId, resumeId } = body;

    if (!analysisId && !resumeId) {
      return NextResponse.json(
        { error: 'Missing required field: analysisId or resumeId' },
        { status: 400 }
      );
    }

    // Fetch resume
    let resumeText: string;
    let jobPostId: string | null = null;

    if (resumeId) {
      const { data: resumeData, error: resumeError } = await supabase
        .from('resumes')
        .select('original_text')
        .eq('id', resumeId)
        .single();

      if (resumeError || !resumeData) {
        return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
      }

      resumeText = (resumeData as { original_text: string }).original_text;
    } else {
      // Get resume from analysis
      const { data: analysisData, error: analysisError } = await supabase
        .from('analyses')
        .select('resume_id, job_post_id')
        .eq('id', analysisId)
        .single();

      if (analysisError || !analysisData) {
        return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
      }

      const analysis = analysisData as { resume_id: string; job_post_id: string };
      jobPostId = analysis.job_post_id;

      const { data: resumeData, error: resumeError } = await supabase
        .from('resumes')
        .select('original_text')
        .eq('id', analysis.resume_id)
        .single();

      if (resumeError || !resumeData) {
        return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
      }

      resumeText = (resumeData as { original_text: string }).original_text;
    }

    // Get required qualifications from job post if available
    let requiredQualifications: string[] = [];
    
    if (jobPostId) {
      const { data: jobData } = await supabase
        .from('job_posts')
        .select('parsed_json')
        .eq('id', jobPostId)
        .single();

      if (jobData) {
        const parsed = (jobData as { parsed_json: Record<string, unknown> }).parsed_json;
        requiredQualifications = (parsed?.mandatory_elements as string[]) || 
                               (parsed?.required_qualifications as string[]) || [];
      }
    }

    // Check initial word count
    const initialWordCount = resumeText.trim().split(/\s+/).filter(w => w.length > 0).length;

    let result;
    let compressionPass = 1;

    // First compression pass
    const firstResult = await compressResume({
      resumeText,
      targetWordCount: TARGET_MAX,
      hardWordLimit: HARD_LIMIT,
      requiredQualifications,
    });

    if (!firstResult.success || !firstResult.data) {
      return NextResponse.json(
        { error: firstResult.error || 'Compression failed' },
        { status: 422 }
      );
    }

    result = firstResult;

    // If still over hard limit, run second pass
    if (result.data && result.data.final_word_count > HARD_LIMIT) {
      compressionPass = 2;
      const secondResult = await compressResumeIterative({
        resumeText: result.data.compressed_text,
        targetWordCount: TARGET_MAX,
        hardWordLimit: HARD_LIMIT,
        requiredQualifications,
      });

      if (secondResult.success && secondResult.data) {
        result = secondResult;
      }
    }

    if (!result.data) {
      return NextResponse.json(
        { error: 'Compression failed after attempts' },
        { status: 422 }
      );
    }

    const output: OptimizeOutput = {
      compressed_resume_text: result.data.compressed_text,
      final_word_count: result.data.final_word_count,
      qualification_coverage_percent: result.data.qualification_coverage_percent,
    };

    // Track GA4 event
    event({
      eventName: 'optimization_run',
      value: compressionPass,
      optimization_passes: compressionPass,
      word_count_reduction: initialWordCount - output.final_word_count,
    });

    // Store optimization result if analysisId provided
    if (analysisId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('optimizations')
        .insert({
          analysis_id: analysisId,
          compressed_resume_text: output.compressed_resume_text,
          qualification_coverage_percent: output.qualification_coverage_percent,
          final_word_count: output.final_word_count,
          ksa_text: '', // KSA generation is separate endpoint
        });
    }

    // Decrement credits if not unlimited
    if (creditsRemaining > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('users')
        .update({
          credits_remaining: creditsRemaining - 1,
        })
        .eq('id', user.id);
    }

    return NextResponse.json({
      ...output,
      meta: {
        original_word_count: initialWordCount,
        compression_pass: compressionPass,
        target_range: `${TARGET_MIN}-${TARGET_MAX}`,
        hard_limit: HARD_LIMIT,
        compliance: {
          within_target: output.final_word_count >= TARGET_MIN && output.final_word_count <= TARGET_MAX,
          within_hard_limit: output.final_word_count <= HARD_LIMIT,
          all_qualifications_preserved: result.data.compliance_status?.all_qualifications_preserved ?? true,
        },
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Optimize API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

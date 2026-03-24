import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parseJobPosting } from '@/lib/ai/jobParser';
import { analyzeResume } from '@/lib/ai/resumeAnalyzer';
import { filterRelevance } from '@/lib/ai/relevanceFilter';
import { compressResume, compressResumeIterative } from '@/lib/ai/compressionEngine';
import { generateResumeBase64 } from '@/lib/docs/resumeGenerator';

// Constants
const TARGET_MIN = 950;
const TARGET_MAX = 1050;
const HARD_LIMIT = 1100;

/**
 * POST /api/workflow
 * Main workflow connecting all modules:
 * 1. User uploads resume
 * 2. User pastes job announcement
 * 3. Run Job Parser
 * 4. Run Resume Analyzer
 * 5. Show free results
 * 
 * After Stripe payment:
 * 6. Run Relevance Filter
 * 7. Run Compression Engine
 * 8. Run Validator
 * 9. Store optimization results
 * 10. Allow DOCX download
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      resumeText, 
      jobText, 
      resumeId, 
      jobPostId,
      step // 'analyze' (free) or 'optimize' (paid)
    } = body;

    // Validate input
    if (!resumeText && !resumeId) {
      return NextResponse.json(
        { error: 'Missing resume text or resumeId' },
        { status: 400 }
      );
    }

    if (!jobText && !jobPostId) {
      return NextResponse.json(
        { error: 'Missing job text or jobPostId' },
        { status: 400 }
      );
    }

    // ==================== STEP 1 & 2: Get Resume & Job ====================
    let finalResumeText = resumeText || '';
    let finalJobText = jobText || '';
    let storedResumeId = resumeId;
    let storedJobPostId = jobPostId;

    // Fetch resume from DB if ID provided
    if (resumeId && !resumeText) {
      const { data: resumeData } = await supabase
        .from('resumes')
        .select('id, original_text')
        .eq('id', resumeId)
        .single();
      
      if (resumeData) {
        finalResumeText = (resumeData as { original_text: string }).original_text;
        storedResumeId = (resumeData as { id: string }).id;
      }
    }

    // Fetch job post from DB if ID provided
    if (jobPostId && !jobText) {
      const { data: jobData } = await supabase
        .from('job_posts')
        .select('id, original_text, parsed_json')
        .eq('id', jobPostId)
        .single();
      
      if (jobData) {
        finalJobText = (jobData as { original_text: string }).original_text;
        storedJobPostId = (jobData as { id: string }).id;
      }
    }

    // ==================== STEP 3: Job Parser ====================
    const parseResult = await parseJobPosting(finalJobText);
    
    if (!parseResult.success || !parseResult.data) {
      return NextResponse.json(
        { error: 'Failed to parse job posting', details: parseResult.error },
        { status: 422 }
      );
    }

    const parsedJob = parseResult.data;

    // Store job post if not already stored
    if (!storedJobPostId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: newJobPost } = await (supabase as any)
        .from('job_posts')
        .insert({
          user_id: user.id,
          original_text: finalJobText,
          parsed_json: parsedJob,
          gs_level: parsedJob.gs_level,
        })
        .select('id')
        .single();
      
      if (newJobPost) {
        storedJobPostId = (newJobPost as { id: string }).id;
      }
    }

    // Store resume if not already stored
    if (!storedResumeId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: newResume } = await (supabase as any)
        .from('resumes')
        .insert({
          user_id: user.id,
          original_text: finalResumeText,
        })
        .select('id')
        .single();
      
      if (newResume) {
        storedResumeId = (newResume as { id: string }).id;
      }
    }

    // ==================== STEP 4: Resume Analyzer ====================
    const analysisResult = await analyzeResume({
      resumeText: finalResumeText,
      jobText: finalJobText,
      parsedJobData: {
        required_qualifications: parsedJob.required_qualifications || [],
        specialized_experience: parsedJob.specialized_experience || [],
        keywords: parsedJob.keywords || [],
      },
    });

    let analysisRecord: Record<string, unknown> | null = null;
    let analysisId: string | null = null;

    if (analysisResult.success && analysisResult.data) {
      const aiData = analysisResult.data;
      
      // Calculate scores with formula
      const keywordScore = Math.min(40, aiData.keyword_score * 0.4);
      const specializedScore = Math.min(30, aiData.specialized_score * 0.3);
      const complianceScore = Math.min(20, aiData.compliance_score * 0.2);
      const achievementScore = Math.min(10, aiData.achievement_score * 0.1);
      
      const compatibilityScore = Math.round(
        keywordScore + specializedScore + complianceScore + achievementScore
      );

      // Store analysis
      const wordCount = finalResumeText.trim().split(/\s+/).filter((w: string) => w.length > 0).length;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: newAnalysis } = await (supabase as any)
        .from('analyses')
        .insert({
          user_id: user.id,
          resume_id: storedResumeId,
          job_post_id: storedJobPostId,
          compatibility_score: Math.min(100, compatibilityScore),
          keyword_score: Math.round(keywordScore * 10) / 10,
          specialized_score: Math.round(specializedScore * 10) / 10,
          compliance_score: Math.round(complianceScore * 10) / 10,
          achievement_score: Math.round(achievementScore * 10) / 10,
          word_count: wordCount,
          feedback_json: {
            missing_elements: aiData.feedback?.qualification_gaps || [],
            weak_bullets: aiData.feedback?.improvements || [],
          },
        })
        .select('id')
        .single();

      if (newAnalysis) {
        analysisId = (newAnalysis as { id: string }).id;
        analysisRecord = {
          id: analysisId,
          compatibility_score: Math.min(100, compatibilityScore),
          keyword_score: Math.round(keywordScore * 10) / 10,
          specialized_score: Math.round(specializedScore * 10) / 10,
          compliance_score: Math.round(complianceScore * 10) / 10,
          achievement_score: Math.round(achievementScore * 10) / 10,
          word_count: wordCount,
        };
      }
    }

    // ==================== STEP 5: Return Free Results ====================
    const freeResult = {
      step: 'analyze',
      resume_id: storedResumeId,
      job_post_id: storedJobPostId,
      analysis: analysisRecord,
      job_parsed: {
        gs_level: parsedJob.gs_level,
        title: parsedJob.title,
        agency: parsedJob.agency,
        required_qualifications: parsedJob.required_qualifications?.slice(0, 3),
        keywords: parsedJob.keywords?.slice(0, 10),
      },
      message: 'Analysis complete. Upgrade to Pro for optimization.',
    };

    // Return free results if not paid
    if (step !== 'optimize') {
      return NextResponse.json(freeResult, { status: 200 });
    }

    // ==================== PAID FLOW: STEPS 6-10 ====================
    
    // ==================== STEP 6: Relevance Filter ====================
    const relevanceResult = await filterRelevance({
      resumeText: finalResumeText,
      requiredQualifications: parsedJob.required_qualifications || [],
      specializedExperience: parsedJob.specialized_experience || [],
    });

    // ==================== STEP 7: Compression Engine ====================
    let compressionResult = await compressResume({
      resumeText: finalResumeText,
      targetWordCount: TARGET_MAX,
      hardWordLimit: HARD_LIMIT,
      requiredQualifications: parsedJob.required_qualifications || [],
    });

    // Second pass if needed
    if (compressionResult.success && compressionResult.data) {
      if (compressionResult.data.final_word_count > HARD_LIMIT) {
        compressionResult = await compressResumeIterative({
          resumeText: compressionResult.data.compressed_text,
          targetWordCount: TARGET_MAX,
          hardWordLimit: HARD_LIMIT,
          requiredQualifications: parsedJob.required_qualifications || [],
        });
      }
    }

    if (!compressionResult.success || !compressionResult.data) {
      return NextResponse.json(
        { error: 'Compression failed', details: compressionResult.error },
        { status: 422 }
      );
    }

    const compressed = compressionResult.data;
    const finalWordCount = compressed.final_word_count;

    // ==================== STEP 8: Validator ====================
    const withinTarget = finalWordCount >= TARGET_MIN && finalWordCount <= TARGET_MAX;
    const withinHardLimit = finalWordCount <= HARD_LIMIT;

    // ==================== STEP 9: Store Optimization Results ====================
    let optimizationId: string | null = null;

    if (analysisId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: optimization } = await (supabase as any)
        .from('optimizations')
        .insert({
          analysis_id: analysisId,
          compressed_resume_text: compressed.compressed_text,
          qualification_coverage_percent: compressed.qualification_coverage_percent,
          final_word_count: finalWordCount,
          ksa_text: '',
        })
        .select('id')
        .single();

      if (optimization) {
        optimizationId = (optimization as { id: string }).id;
      }
    }

    // ==================== STEP 10: DOCX Download ====================
    const docxBase64 = await generateResumeBase64({
      content: compressed.compressed_text,
      fileName: 'optimized-federal-resume.docx',
    });

    // Return full optimization results
    return NextResponse.json({
      step: 'optimize',
      resume_id: storedResumeId,
      job_post_id: storedJobPostId,
      analysis: analysisRecord,
      optimization: {
        id: optimizationId,
        compressed_resume_text: compressed.compressed_text,
        final_word_count: finalWordCount,
        qualification_coverage_percent: compressed.qualification_coverage_percent,
        compliance: {
          within_target: withinTarget,
          within_hard_limit: withinHardLimit,
          all_qualifications_preserved: compressed.compliance_status?.all_qualifications_preserved ?? true,
        },
        removed_content: compressed.removed_content_summary,
      },
      download: {
        docx_base64: docxBase64,
        file_name: 'optimized-federal-resume.docx',
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Workflow API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

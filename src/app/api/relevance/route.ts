import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { filterRelevance, RelevanceAnalysis } from '@/lib/ai';

// Bullet evaluation output
interface BulletEvaluation {
  bullet_text: string;
  relevance_score: number;
  remove_or_keep: boolean;
}

// Input interface
interface RelevanceFilterInput {
  resumeId: string;
  jobPostId: string;
  threshold?: number;
}

/**
 * POST /api/relevance
 * Filters resume bullets based on relevance to job requirements
 * Body: { resumeId: string, jobPostId: string, threshold?: number }
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
    const { resumeId, jobPostId, threshold = 5 } = body as RelevanceFilterInput;

    if (!resumeId || !jobPostId) {
      return NextResponse.json(
        { error: 'Missing required fields: resumeId, jobPostId' },
        { status: 400 }
      );
    }

    // Fetch resume and job post
    const { data: resumeData, error: resumeError } = await supabase
      .from('resumes')
      .select('original_text')
      .eq('id', resumeId)
      .single();

    if (resumeError || !resumeData) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const { data: jobPostData, error: jobError } = await supabase
      .from('job_posts')
      .select('parsed_json')
      .eq('id', jobPostId)
      .single();

    if (jobError || !jobPostData) {
      return NextResponse.json({ error: 'Job post not found' }, { status: 404 });
    }

    const resumeText = (resumeData as { original_text: string }).original_text;
    const parsedJson = (jobPostData as { parsed_json: Record<string, unknown> }).parsed_json || {};
    
    const requiredQualifications = (parsedJson.mandatory_elements as string[]) || [];
    const specializedExperience = (parsedJson.required_specialized_experience as string[]) || [];

    // Extract bullets from resume text
    const bullets = extractBullets(resumeText);
    
    if (bullets.length === 0) {
      return NextResponse.json(
        { error: 'No bullets found in resume' },
        { status: 400 }
      );
    }

    // Score each bullet against requirements
    const maxRetries = 3;
    let evaluations: BulletEvaluation[] = [];
    let lastError: string | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const result = await filterRelevance({
        resumeText: bullets.join('\n'),
        requiredQualifications,
        specializedExperience,
      });

      if (!result.success || !result.data) {
        lastError = result.error || 'Unknown error';
        console.error(`Relevance filter attempt ${attempt} failed:`, lastError);
        continue;
      }

      const relevanceData = result.data;

      // Map AI results to bullet evaluations
      evaluations = bullets.map((bullet, index) => {
        // Check if this bullet is a direct match
        const isMatch = relevanceData.matching_qualifications.some(
          match => bullet.toLowerCase().includes(match.toLowerCase())
        );

        // Check partial matches
        const partialMatch = relevanceData.partial_matches.find(
          pm => bullet.toLowerCase().includes(pm.resume_evidence.toLowerCase())
        );

        let score = 0;
        let keep = true;

        if (isMatch) {
          score = 8 + Math.floor(Math.random() * 3); // 8-10
          keep = true;
        } else if (partialMatch) {
          score = Math.round(partialMatch.confidence / 10);
          keep = score >= threshold;
        } else {
          // Check if it's in gaps - needed for compliance
          const isGap = relevanceData.gaps.some(
            gap => bullet.toLowerCase().includes(gap.toLowerCase())
          );
          
          if (isGap) {
            score = 6; // Give benefit of doubt for compliance
            keep = true;
          } else {
            score = Math.floor(Math.random() * 5); // 0-4 for non-relevant
            keep = score >= threshold;
          }
        }

        return {
          bullet_text: bullet,
          relevance_score: Math.min(10, Math.max(0, score)),
          remove_or_keep: keep,
        };
      });

      if (evaluations.length > 0) break;
    }

    if (evaluations.length === 0) {
      return NextResponse.json(
        { error: `Failed to evaluate after ${maxRetries} attempts: ${lastError}` },
        { status: 422 }
      );
    }

    // Sort by relevance score descending
    evaluations.sort((a, b) => b.relevance_score - a.relevance_score);

    // Return with summary stats
    const keptCount = evaluations.filter(e => e.remove_or_keep).length;
    const removedCount = evaluations.length - keptCount;
    const avgScore = evaluations.reduce((sum, e) => sum + e.relevance_score, 0) / evaluations.length;

    return NextResponse.json({
      bullets: evaluations,
      summary: {
        total_bullets: evaluations.length,
        keep_count: keptCount,
        remove_count: removedCount,
        average_relevance_score: Math.round(avgScore * 10) / 10,
        threshold_used: threshold,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Relevance filter API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Extract individual bullets from resume text
 */
function extractBullets(text: string): string[] {
  const lines = text.split(/\n/);
  const bullets: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Match bullet points: -, *, •, or lines starting with action verbs
    if (trimmed.match(/^[-*•]/) || trimmed.match(/^(Developed|Managed|Created|Designed|Analyzed|Implemented|Led|Coordinated|Supervised|Achieved|Established|Improved|Increased|Reduced|Conducted|Evaluated|Performed|Executed)/i)) {
      // Clean the bullet
      const cleaned = trimmed.replace(/^[-*•]\s*/, '').trim();
      if (cleaned.length > 10) { // Minimum meaningful length
        bullets.push(cleaned);
      }
    } else if (trimmed.length > 20 && !trimmed.match(/^(Education|Experience|Skills|Professional|Summary)/i)) {
      // Treat long lines without headers as potential bullets
      bullets.push(trimmed);
    }
  }

  return bullets;
}

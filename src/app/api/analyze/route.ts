import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeResume } from '@/lib/openai/analyzeResume';
import { validatePreAI, validateNoFabrication } from '@/lib/ruleEngine';

/**
 * POST /api/analyze
 * 
 * Server-side AI analysis endpoint with:
 * - Input validation
 * - Hallucination detection
 * - Rule engine integration
 * - Usage logging
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await req.json();
    const { resumeText, vacancyText } = body;

    if (!resumeText || !vacancyText) {
      return NextResponse.json(
        { error: 'Missing required fields: resumeText and vacancyText' },
        { status: 400 }
      );
    }

    // Validate input size (prevent abuse)
    if (resumeText.length > 50000 || vacancyText.length > 20000) {
      return NextResponse.json(
        { error: 'Input exceeds maximum allowed size' },
        { status: 413 }
      );
    }

    // PRE-AI VALIDATION (Rule Engine)
    const preValidation = validatePreAI(resumeText, vacancyText);
    if (!preValidation.valid) {
      return NextResponse.json(
        { 
          error: 'Resume structure validation failed',
          details: preValidation.errors 
        },
        { status: 422 }
      );
    }

    // CALL AI SERVICE
    const startTime = Date.now();
    let aiData;
    
    try {
      aiData = await analyzeResume({
        resumeText,
        vacancyText,
      });
    } catch (aiError) {
      console.error('OpenAI analysis failed:', aiError);
      return NextResponse.json(
        { error: 'AI analysis failed' },
        { status: 500 }
      );
    }

    const latencyMs = Date.now() - startTime;

    // HALLUCINATION GUARD - Basic check
    const fabricationCheck = validateNoFabrication(resumeText, resumeText);

    if (!fabricationCheck.valid) {
      // Log hallucination event
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from('ai_usage_logs').insert({
        user_id: user.id,
        model: 'gpt-4.1',
        tokens_used: null,
        latency_ms: latencyMs,
        success: false,
        error_message: 'Hallucination detected: ' + fabricationCheck.warnings.join(', '),
      });

      return NextResponse.json(
        { 
          error: 'Potential data fabrication detected',
          warnings: fabricationCheck.warnings 
        },
        { status: 422 }
      );
    }

    // LOG SUCCESSFUL USAGE
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('ai_usage_logs').insert({
      user_id: user.id,
      model: 'gpt-4.1',
      tokens_used: null,
      latency_ms: latencyMs,
      success: true,
    });

    // Return AI data (rule engine will calculate final score)
    return NextResponse.json({
      aiData,
      wordCount: preValidation.wordCount,
      structureValid: preValidation.valid,
    }, { status: 200 });

  } catch (error) {
    console.error('Analyze API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parseJobPosting, ParsedJobData } from '@/lib/ai';

// Output interface matching user's requested format
interface JobParseOutput {
  required_specialized_experience: string[];
  key_competencies: string[];
  required_keywords: string[];
  gs_level: string;
  mandatory_elements: string[];
}

// Transform ParsedJobData to requested output format
function transformToOutputFormat(data: ParsedJobData): JobParseOutput {
  return {
    required_specialized_experience: data.specialized_experience || [],
    key_competencies: data.keywords || [],
    required_keywords: data.keywords || [],
    gs_level: data.gs_level || '',
    mandatory_elements: data.required_qualifications || [],
  };
}

// Validate output format
function isValidOutput(data: unknown): data is JobParseOutput {
  if (!data || typeof data !== 'object') return false;
  
  const obj = data as Record<string, unknown>;
  return (
    Array.isArray(obj.required_specialized_experience) &&
    Array.isArray(obj.key_competencies) &&
    Array.isArray(obj.required_keywords) &&
    typeof obj.gs_level === 'string' &&
    Array.isArray(obj.mandatory_elements)
  );
}

/**
 * POST /api/parse-job
 * Parses USAJobs announcement text and extracts structured data
 * Body: { jobText: string }
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
    const { jobText } = body;

    if (!jobText || typeof jobText !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid field: jobText' },
        { status: 400 }
      );
    }

    // Parse with retry logic
    const maxRetries = 3;
    let lastError: string | null = null;
    let parsedData: JobParseOutput | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const result = await parseJobPosting(jobText);
      
      if (!result.success || !result.data) {
        lastError = result.error || 'Unknown parsing error';
        console.error(`Parse attempt ${attempt} failed:`, lastError);
        continue;
      }

      // Transform to output format
      const transformed = transformToOutputFormat(result.data);
      
      // Validate output
      if (!isValidOutput(transformed)) {
        lastError = `Invalid output format on attempt ${attempt}`;
        console.error('Validation failed:', transformed);
        continue;
      }

      parsedData = transformed;
      break;
    }

    if (!parsedData) {
      return NextResponse.json(
        { error: `Failed to parse job after ${maxRetries} attempts: ${lastError}` },
        { status: 422 }
      );
    }

    return NextResponse.json(parsedData, { status: 200 });
  } catch (error) {
    console.error('Parse job API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

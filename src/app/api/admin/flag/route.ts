import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

type FlagType =
  | 'hallucinated_job'
  | 'fabricated_metric'
  | 'wrong_gs_level'
  | 'wrong_qualification'
  | 'inaccurate_score'
  | 'other';

const VALID_FLAG_TYPES: FlagType[] = [
  'hallucinated_job',
  'fabricated_metric',
  'wrong_gs_level',
  'wrong_qualification',
  'inaccurate_score',
  'other',
];

/**
 * POST /api/admin/flag
 * Flags an optimization or analysis for hallucination review.
 * Body: { optimizationId?: string, analysisId?: string, flagType: FlagType, notes?: string }
 * Requires: is_admin = true
 *
 * PATCH /api/admin/flag
 * Marks a flag as resolved.
 * Body: { flagId: string }
 * Requires: is_admin = true
 */
async function verifyAdmin(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) return { user: null, admin: null, error: 'Unauthorized' };

  const { data: profile } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  const p = profile as { is_admin?: boolean } | null;
  if (!p?.is_admin) return { user: null, admin: null, error: 'Forbidden' };

  return { user, admin: createAdminClient(), error: null };
}

export async function POST(request: NextRequest) {
  try {
    const { user, admin, error: authErr } = await verifyAdmin(request);
    if (authErr || !user || !admin) {
      return NextResponse.json(
        { error: authErr },
        { status: authErr === 'Forbidden' ? 403 : 401 }
      );
    }

    const body = await request.json();
    const { optimizationId, analysisId, flagType, notes } = body;

    if (!flagType || !VALID_FLAG_TYPES.includes(flagType)) {
      return NextResponse.json(
        { error: `Invalid flagType. Must be one of: ${VALID_FLAG_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    if (!optimizationId && !analysisId) {
      return NextResponse.json(
        { error: 'Must provide optimizationId or analysisId' },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: flag, error: insertError } = await (admin as any)
      .from('hallucination_flags')
      .insert({
        optimization_id: optimizationId || null,
        analysis_id: analysisId || null,
        flagged_by: user.id,
        flag_type: flagType,
        notes: notes || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Flag insert error:', insertError);
      return NextResponse.json({ error: 'Failed to create flag' }, { status: 500 });
    }

    return NextResponse.json({ success: true, flag }, { status: 201 });
  } catch (error) {
    console.error('Admin flag POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { user, admin, error: authErr } = await verifyAdmin(request);
    if (authErr || !user || !admin) {
      return NextResponse.json(
        { error: authErr },
        { status: authErr === 'Forbidden' ? 403 : 401 }
      );
    }

    const body = await request.json();
    const { flagId } = body;

    if (!flagId) {
      return NextResponse.json({ error: 'Missing flagId' }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (admin as any)
      .from('hallucination_flags')
      .update({
        resolved: true,
        resolved_by: user.id,
        resolved_at: new Date().toISOString(),
      })
      .eq('id', flagId);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to resolve flag' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin flag PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

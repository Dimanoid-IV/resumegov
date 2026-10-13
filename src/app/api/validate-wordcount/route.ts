import {NextRequest,NextResponse} from 'next/server';
import {createClient} from '@/lib/supabase/server';

/** Word-count planning only. Page compliance requires rendering the document. */
export async function POST(request: NextRequest) {
  try {
    const db=await createClient();
    const {data:{user},error}=await db.auth.getUser();
    if(error || !user) return NextResponse.json({error:'Unauthorized'},{status:401});
    const body=await request.json();
    let text=typeof body.text==='string'?body.text:'';
    if(body.resumeId && !text) {
      const saved=await db.from('resumes').select('original_text').eq('id',body.resumeId).eq('user_id',user.id).single();
      const resume=saved.data as {original_text:string}|null;
      if(saved.error || !resume) return NextResponse.json({error:'Resume not found'},{status:404});
      text=resume.original_text;
    }
    if(!text.trim()) return NextResponse.json({error:'Provide resumeId or text'},{status:400});
    if(text.length>80000) return NextResponse.json({error:'Resume is too large'},{status:413});
    const words=text.trim().split(/\s+/).length;
    return NextResponse.json({
      word_count:words,page_estimate:Math.round(words/500*10)/10,
      status:'Estimate only — verify the exported document',status_code:'estimate_only',
      is_compliant:null,hard_limit:null,target_range:'No universal word-count requirement',
      page_limit:2,
      recommendations:[
        'Check the actual rendered page count and the specific vacancy announcement.',
        'Preserve required experience, employment dates, hours per week and supported achievements.',
        'Do not add filler or remove qualification evidence merely to meet a word target.',
      ],
    });
  } catch {
    return NextResponse.json({error:'Unable to check word count'},{status:400});
  }
}

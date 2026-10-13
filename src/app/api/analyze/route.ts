import {NextRequest,NextResponse} from 'next/server';
import {POST as analyze} from '@/app/api/free-analyze/route';

// Backward-compatible input field, canonical authentication and quota enforcement.
export async function POST(request: NextRequest) {
  try {
    const body=await request.json();
    const canonical=new NextRequest(request.url,{method:'POST',headers:request.headers,body:JSON.stringify({...body,jobText:body.jobText ?? body.vacancyText})});
    return analyze(canonical);
  } catch {
    return NextResponse.json({error:'Invalid JSON body'},{status:400});
  }
}

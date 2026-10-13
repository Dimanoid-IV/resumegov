// Manual integration test: synthetic QA account only. Never charge Stripe or use customer records.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { createResumeDocxBlob } from '../../src/lib/downloadResumeDocx';

async function main() {
  const base = process.env.QA_BASE_URL || 'http://localhost:3107';
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{persistSession:false}});
  const email=`qa-${randomUUID()}@resumegov.com`;
  const password=randomUUID()+randomUUID();
  const created=await admin.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{qa:true}});
  assert.ifError(created.error); const userId=created.data.user!.id;
  let cookies: {name:string;value:string}[]=[];
  try {
    const auth=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{cookies:{getAll:()=>cookies,setAll:values=>{cookies=values;}}});
    const signed=await auth.auth.signInWithPassword({email,password}); assert.ifError(signed.error);
    const cookie=cookies.map(c=>`${c.name}=${c.value}`).join('; ');
    const call=async(path:string,body:unknown,authenticated=true)=>{
      const res=await fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json',...(authenticated?{cookie}:{})},body:JSON.stringify(body)});
      return {status:res.status,data:await res.json()};
    };
    assert.equal((await call('/api/optimize',{analysisId:randomUUID()},false)).status,401);
    assert.equal((await call('/api/free-analyze',{})).status,400);
    const resumeText=await readFile('tests/fixtures/resume.txt','utf8');
    const jobText=await readFile('tests/fixtures/vacancy.txt','utf8');
    const checked=await call('/api/free-analyze',{resumeText,jobText});
    assert.equal(checked.status,200,JSON.stringify(checked.data));
    const analysisId=checked.data.analysisId; assert.ok(analysisId);
    assert.equal((await call('/api/optimize',{analysisId})).status,403,'free account cannot spend analysis credits as rewrite credits');
    const upgrade=await admin.from('users').update({plan_type:'basic',credits_remaining:1}).eq('id',userId); assert.ifError(upgrade.error);
    const optimized=await call('/api/optimize',{analysisId});
    assert.equal(optimized.status,200,JSON.stringify(optimized.data));
    const text=optimized.data.tailored_resume_text; assert.ok(text.length>200);
    for(const fact of ['20%','15%','30%','2015','2021','Northstar Services','Lakeside Community Center']) assert.ok(text.includes(fact),`lost fact ${fact}`);
    assert.ok(/five|5/.test(text),'lost quantified training evidence');
    assert.ok(/spending authority/i.test(text),'lost limitation on spending authority');
    assert.ok(optimized.data.change_summary.length>0,'missing explanation of paid edits');
    const profile=await admin.from('users').select('credits_remaining').eq('id',userId).single(); assert.ifError(profile.error); assert.equal(profile.data!.credits_remaining,0);
    const again=await call('/api/optimize',{analysisId}); assert.equal(again.status,200); assert.equal(again.data.reused,true); assert.equal(again.data.tailored_resume_text,text);
    assert.equal((await call('/api/optimize',{analysisId:randomUUID()})).status,404);
    const page=await fetch(base+'/results/'+analysisId,{headers:{cookie}}); assert.equal(page.status,200);
    const html=await page.text(); assert.ok(html.includes('Northstar Services')); assert.ok(html.includes('requirement keyword coverage'));
    const blob=await createResumeDocxBlob(text);
    await mkdir('.qa-output',{recursive:true}); await writeFile('.qa-output/customer-resume.docx',Buffer.from(await blob.arrayBuffer()));
    await writeFile('.qa-output/customer-resume.txt',text);
    for(const [name,bytes] of [['resume.txt',Buffer.from(resumeText)],['resume.docx',Buffer.from(await blob.arrayBuffer())]] as const) {
      const form=new FormData(); form.set('file',new File([bytes],name));
      const extracted=await fetch(base+'/api/extract-resume',{method:'POST',body:form}); assert.equal(extracted.status,200); const content=await extracted.json(); assert.ok(content.text.includes('20%'));
    }
    const bad=new FormData(); bad.set('file',new File(['broken'],'broken.pdf'));
    assert.equal((await fetch(base+'/api/extract-resume',{method:'POST',body:bad})).status,422);
    // Two simultaneous persistence calls must share the same result and one credit.
    const original=await admin.from('analyses').select('resume_id,job_post_id').eq('id',analysisId).single(); assert.ifError(original.error);
    const second=await admin.from('analyses').insert({user_id:userId,...original.data}).select('id').single(); assert.ifError(second.error);
    assert.ifError((await admin.from('users').update({credits_remaining:1}).eq('id',userId)).error);
    const args={p_user_id:userId,p_analysis_id:second.data!.id,p_text:text,p_word_count:text.split(/\s+/).length,p_coverage:50,p_details:'{}'};
    const concurrent=await Promise.all([admin.rpc('save_optimization_and_charge',args),admin.rpc('save_optimization_and_charge',args)]);
    for(const result of concurrent) assert.ifError(result.error);
    assert.equal(concurrent[0].data.id,concurrent[1].data.id);
    assert.equal(concurrent.filter(x=>x.data.reused===false).length,1);
    const after=await admin.from('users').select('credits_remaining').eq('id',userId).single(); assert.equal(after.data!.credits_remaining,0);
    console.log(JSON.stringify({success:true,checks:['auth','analysis','free-plan-block','AI-rewrite','single-credit','idempotent-retry','ownership','results-page','DOCX','TXT-extraction','DOCX-extraction','malformed-PDF','concurrent-credit'],words:text.split(/\s+/).length,base}));
  } finally {
    // This UUID was created above for this run, never selected from existing customers.
    const deleted=await admin.auth.admin.deleteUser(userId); assert.ifError(deleted.error);
    console.log('Synthetic QA account removed; customer accounts untouched.');
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});

import {mock,test} from 'node:test';
import assert from 'node:assert/strict';
let aiInput;
const db={auth:{getUser:async()=>({data:{user:{id:'qa'}},error:null})},from(table){const q={select(){return q;},eq(){return q;},single:async()=>({data:table==='resumes'?{original_text:'- Prepared reports for management using program evidence.'}:{parsed_json:{required_qualifications:['Program reporting'],specialized_experience:['Written reports']}},error:null})};return q;}};
mock.module('../../src/lib/supabase/server.ts',{namedExports:{createClient:async()=>db}});
mock.module('../../src/lib/ai/index.ts',{namedExports:{filterRelevance:async(input)=>{aiInput=input;return {success:true,data:{matching_qualifications:['Prepared reports'],partial_matches:[],gaps:[]}};}}});
mock.module('../../src/app/api/free-analyze/route.ts',{namedExports:{POST:async(request)=>{const body=await request.json();assert.equal(body.jobText,'vacancy');return Response.json({code:'FREE_LIMIT_EXCEEDED'},{status:429});}}});
const {POST:legacy}=await import('../../src/app/api/analyze/route.ts');
const {POST:relevance}=await import('../../src/app/api/relevance/route.ts');
const req=(path,body)=>new Request('http://localhost'+path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
test('old analysis applies the same free limit and accepts the old vacancy field',async()=>{
  const r=await legacy(req('/api/analyze',{resumeText:'source',vacancyText:'vacancy'}));assert.equal(r.status,429);
});
test('bullet evaluation uses the stored requirements and deterministic scores',async()=>{
  mock.method(Math,'random',()=>0);
  const r=await relevance(req('/api/relevance',{resumeId:'r',jobPostId:'j'}));
  assert.equal(r.status,200); assert.deepEqual(aiInput.requiredQualifications,['Program reporting']);
  assert.equal((await r.json()).bullets[0].relevance_score,9);
  mock.restoreAll();
});

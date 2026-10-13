import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
mock.module('../../src/lib/supabase/server.ts',{namedExports:{createClient:async()=>({auth:{getUser:async()=>({data:{user:{id:'qa'}},error:null})}})}});
mock.module('../../src/app/api/free-analyze/route.ts',{namedExports:{POST:async()=>Response.json({code:'FREE_LIMIT_EXCEEDED'},{status:429})}});
mock.module('../../src/app/api/optimize/route.ts',{namedExports:{POST:async()=>Response.json({reused:true})}});
const {POST}=await import('../../src/app/api/workflow/route.ts');
const request=body=>new Request('http://localhost/api/workflow',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
test('legacy analysis cannot bypass the canonical free limit',async()=>{
  const r=await POST(request({step:'analyze',resumeText:'source resume',jobText:'vacancy'}));
  assert.equal(r.status,429);
  assert.equal((await r.json()).code,'FREE_LIMIT_EXCEEDED');
});
test('legacy optimization delegates to the owned paid analysis flow',async()=>{
  const r=await POST(request({step:'optimize',analysisId:'60b8e85b-8b3a-466d-a46c-c437ac346c41'}));
  assert.equal(r.status,200);
  assert.equal((await r.json()).reused,true);
});

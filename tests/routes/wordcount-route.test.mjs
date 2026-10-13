import {mock,test} from 'node:test';
import assert from 'node:assert/strict';
mock.module('../../src/lib/supabase/server.ts',{namedExports:{createClient:async()=>({auth:{getUser:async()=>({data:{user:{id:'qa'}},error:null})}})}});
const {POST}=await import('../../src/app/api/validate-wordcount/route.ts');
test('word count cannot certify the rendered page limit',async()=>{
  const r=await POST(new Request('http://localhost/api/validate-wordcount',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text:'word '.repeat(1200)})}));
  assert.equal(r.status,200); const body=await r.json();assert.equal(body.is_compliant,null);assert.equal(body.hard_limit,null);assert.equal(body.word_count,1200);
});

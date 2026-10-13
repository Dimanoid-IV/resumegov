import {mock,test} from 'node:test';
import assert from 'node:assert/strict';
let options;
mock.module('../../src/lib/ai/client.ts',{namedExports:{callOpenAI:async(_system,_user,opts)=>{options=opts;return {data:{safe:false,unsupported_claims:[{claim:'Invented clearance',new_fact:'No source evidence'}],lost_critical_facts:[],notes:[]},error:null,tokensUsed:10};}}});
const {verifyTailoredResume,tailorResume}=await import('../../src/lib/ai/tailoringEngine.ts');
test('paid editing uses the quality model rather than the lightweight analyzer',async()=>{
  await tailorResume({resumeText:'Source facts',jobText:'Vacancy',parsedJob:{}});
  assert.equal(options.model,'gpt-4.1');
});
test('factual review uses the stronger reviewer and returns readable safety findings',async()=>{
  const result=await verifyTailoredResume({originalResume:'Original facts',tailoredResume:'Invented clearance'});
  assert.equal(options.model,'gpt-4.1');
  assert.equal(result.data.safe,false);
  assert.equal(typeof result.data.unsupported_claims[0],'string');
  assert.ok(result.data.unsupported_claims[0].includes('Invented clearance'));
});

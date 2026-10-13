import test from 'node:test';
import assert from 'node:assert/strict';
import { analysisRisk } from '../src/lib/analysis-risk.ts';
import { validatePreAI } from '../src/lib/ruleEngine.ts';
test('risk reflects evidence gaps and compliance, not arbitrary word minimums',()=>{
  assert.equal(analysisRisk({gaps:[],complianceScore:18,specializedScore:27}),'Low');
  assert.equal(analysisRisk({gaps:['Required experience not demonstrated'],complianceScore:18,specializedScore:27}),'High');
  assert.equal(analysisRisk({gaps:[],complianceScore:9,specializedScore:27}),'Moderate');
  assert.equal(analysisRisk({gaps:[],complianceScore:18,specializedScore:12}),'High');
});
test('word count is a layout estimate, not an official minimum or maximum',()=>{
  for(const words of [400,1200]) {
    const result=validatePreAI('word '.repeat(words),'job');
    assert.ok(!result.warnings.some(w=>/hard limit|minimum 850/i.test(w)));
  }
});

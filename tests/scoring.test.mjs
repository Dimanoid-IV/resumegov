import test from 'node:test';
import assert from 'node:assert/strict';
import {scoreResumeEvidence} from '../src/lib/scoring.ts';
test('a concise resume with required evidence is not automatically high-risk',()=>{
  const result=scoreResumeEvidence({resumeText:'program reporting 20% budget tracking',keywords:['program reporting'],specializedExperience:['budget tracking'],aiAnalysis:{specialized_score:90,feedback:{qualification_gaps:[]}},preValidation:{wordCount:400,structure:{hasJobTitle:true,hasEmployer:true,hasEmploymentDates:true,hasHoursPerWeek:true,hasDutiesDescription:true,achievementCount:3}}});
  assert.equal(result.specializedScore,27);
  assert.equal(result.confidenceCap,100);
});

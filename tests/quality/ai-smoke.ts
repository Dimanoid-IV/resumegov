import { readFile, mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { parseJobPosting } from '../../src/lib/ai/jobParser';
import { analyzeResume } from '../../src/lib/ai/resumeAnalyzer';
import { tailorResume, verifyTailoredResume, repairTailoredResume } from '../../src/lib/ai/tailoringEngine';

async function main() {
  const resumeText = await readFile('tests/fixtures/resume.txt','utf8');
  const jobText = await readFile('tests/fixtures/vacancy.txt','utf8');
  const started = Date.now();
  const parsed = await parseJobPosting(jobText);
  assert.equal(parsed.success,true,parsed.error || 'job parsing failed');
  assert.ok(parsed.data);
  assert.ok(parsed.data.specialized_experience.length > 0);
  const analysis = await analyzeResume({resumeText,jobText,parsedJobData:parsed.data});
  assert.equal(analysis.success,true,analysis.error || 'analysis failed');
  assert.ok(analysis.data?.feedback?.qualification_gaps);
  const input = {resumeText,jobText,parsedJob:parsed.data};
  let tailored = await tailorResume(input);
  assert.equal(tailored.success,true,tailored.error || 'tailoring failed');
  assert.ok(tailored.data);
  let review = await verifyTailoredResume({originalResume:resumeText,tailoredResume:tailored.data.tailored_resume_text});
  if (review.success && review.data && !review.data.safe) {
    tailored = await repairTailoredResume({...input,draft:tailored.data,verification:review.data});
    assert.ok(tailored.success && tailored.data);
    review = await verifyTailoredResume({originalResume:resumeText,tailoredResume:tailored.data.tailored_resume_text});
  }
  assert.ok(review.success && review.data?.safe, JSON.stringify(review.data));
  const output = tailored.data!.tailored_resume_text;
  for (const fact of ['Northstar Services','Lakeside Community Center','20%','15%','30%','250,000','2015','2021','2017','2020','alex.morgan@example.com']) {
    assert.ok(output.includes(fact),`critical fact lost: ${fact}`);
  }
  assert.ok(!/Secret clearance|GS-09 Program Analyst|managed SQL databases|formulated federal budget requests/i.test(output),'unsupported vacancy requirements copied into resume');
  await mkdir('.qa-output',{recursive:true});
  await writeFile('.qa-output/ai-smoke.json',JSON.stringify({parsed:parsed.data,analysis:analysis.data,tailored:tailored.data,review:review.data},null,2));
  await writeFile('.qa-output/tailored-resume.txt',output);
  console.log(JSON.stringify({success:true,elapsedSeconds:Math.round((Date.now()-started)/1000),words:tailored.data?.final_word_count,verifiedSafe:review.data?.safe,output:'.qa-output/ai-smoke.json'}));
}
main().catch(error=>{console.error(error);process.exitCode=1;});

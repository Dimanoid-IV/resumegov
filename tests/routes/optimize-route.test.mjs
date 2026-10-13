import assert from 'node:assert/strict';
import { mock, test } from 'node:test';

const buyer = '03fc12f7-f4b1-4d4f-98aa-59d502870db5';
const analysisId = '60b8e85b-8b3a-466d-a46c-c437ac346c41';
let state;
const text = 'Supported federal resume evidence with the original employer, employment dates, hours per week, and quantified achievements. '.repeat(4);
const draft = {
  tailored_resume_text: text,
  original_word_count: 100,
  final_word_count: 80,
  change_summary: [], matched_requirements: [], unresolved_gaps: [], questions_for_user: [],
};
const db = {
  from(table) {
    const filters = {};
    const query = {
      select() { return query; },
      eq(key, value) { filters[key] = value; return query; },
      async single() {
        state.reads.push(table);
        if (table === 'users') return { data: { plan_type: 'basic', credits_remaining: 1 }, error: null };
        if (table === 'analyses') return {
          data: state.owned && filters.user_id === buyer ? { resume_id: 'resume', job_post_id: 'job' } : null,
          error: state.owned ? null : { code: 'PGRST116' },
        };
        if (table === 'resumes') return { data: { original_text: 'Original source facts. '.repeat(20) }, error: null };
        if (table === 'job_posts') return { data: { original_text: 'Job requirements', parsed_json: {} }, error: null };
        throw new Error(`unexpected single query: ${table}`);
      },
      async maybeSingle() { state.reads.push(table); return { data: state.cached ? draft : null, error: null }; },
      async insert() { state.writes.push(table); return { error: null }; },
      update() { state.writes.push(table); return query; },
      then(resolve) { resolve({ error: null }); },
    };
    return query;
  },
  async rpc(name, params) {
    state.rpc.push({ name, params });
    return { data: { ...draft, compressed_resume_text: text, qualification_coverage_percent: 0, reused: false }, error: null };
  },
};

mock.module('../../src/lib/supabase/server.ts', { namedExports: {
  createClient: async () => ({ auth: { getUser: async () => ({ data: { user: { id: buyer } }, error: null }) } }),
} });
mock.module('../../src/lib/supabase/admin.ts', { namedExports: { createAdminClient: () => db } });
mock.module('../../src/lib/ai/index.ts', { namedExports: {
  tailorResume: async () => ({ success: true, data: draft, tokens_used: 1, model: 'fixture' }),
  verifyTailoredResume: async () => ({ success: true, data: { safe: true, notes: [], lost_critical_facts: [] }, tokens_used: 1, model: 'fixture' }),
  repairTailoredResume: async () => { throw new Error('unexpected repair'); },
} });
const { POST } = await import('../../src/app/api/optimize/route.ts');
function reset(values = {}) { state = { owned: true, cached: false, reads: [], writes: [], rpc: [], ...values }; }
function request() { return new Request('http://localhost/api/optimize', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ analysisId }) }); }

test('never returns a cached resume belonging to another user', async () => {
  reset({ owned: false, cached: true });
  const response = await POST(request());
  assert.equal(response.status, 404);
  assert.equal(state.reads.includes('optimizations'), false);
  assert.deepEqual(state.writes, []);
});

test('saves the verified draft and charges a credit in one database operation', async () => {
  reset();
  const response = await POST(request());
  assert.equal(response.status, 200);
  assert.equal(state.rpc.length, 1);
  assert.equal(state.rpc[0].name, 'save_optimization_and_charge');
  assert.equal(state.rpc[0].params.p_user_id, buyer);
  assert.equal(state.rpc[0].params.p_analysis_id, analysisId);
  assert.equal(state.writes.includes('users'), false);
  assert.equal(state.writes.includes('optimizations'), false);
});

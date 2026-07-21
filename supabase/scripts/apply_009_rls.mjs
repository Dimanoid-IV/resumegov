/**
 * Apply migration 009 (enable RLS) to production.
 *
 * Usage:
 *   DATABASE_URL='postgresql://postgres....' node supabase/scripts/apply_009_rls.mjs
 * or:
 *   SUPABASE_ACCESS_TOKEN='sbp_...' node supabase/scripts/apply_009_rls.mjs
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(
  resolve(__dirname, '../migrations/009_enable_rls_security_advisor.sql'),
  'utf8'
);
const PROJECT_REF = 'dehaqpjkklsbxupsdcze';

async function viaAccessToken(token) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    }
  );
  const text = await res.text();
  if (!res.ok) throw new Error(`Management API ${res.status}: ${text}`);
  console.log('Applied via Management API:', text.slice(0, 300));
}

async function viaDatabaseUrl(url) {
  const { default: pg } = await import('pg');
  const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query(sql);
    console.log('Applied via DATABASE_URL');
  } finally {
    await client.end();
  }
}

const token = process.env.SUPABASE_ACCESS_TOKEN;
const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

if (token) {
  await viaAccessToken(token);
} else if (dbUrl) {
  await viaDatabaseUrl(dbUrl);
} else {
  console.error(
    'Set SUPABASE_ACCESS_TOKEN (Dashboard → Account → Access Tokens)\n' +
      'or DATABASE_URL (Dashboard → Project Settings → Database → URI)'
  );
  process.exit(1);
}

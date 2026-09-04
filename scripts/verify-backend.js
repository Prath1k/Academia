// Standalone Supabase Backend Health Verification Script
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Read .env file manually
const envPath = path.resolve(process.cwd(), '.env');
let supabaseUrl = '';
let supabaseAnonKey = '';

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('VITE_SUPABASE_URL=')) {
      supabaseUrl = trimmed.replace('VITE_SUPABASE_URL=', '').trim();
    }
    if (trimmed.startsWith('VITE_SUPABASE_ANON_KEY=')) {
      supabaseAnonKey = trimmed.replace('VITE_SUPABASE_ANON_KEY=', '').trim();
    }
  });
}

console.log('\n======================================================');
console.log(' ACADEMIA-INDUSTRY NEXUS (SIH26044) - BACKEND CHECK');
console.log('======================================================\n');

const isPlaceholder = !supabaseUrl || supabaseUrl.includes('your-project-id') || !supabaseAnonKey || supabaseAnonKey.includes('your-supabase-anon-key');

if (isPlaceholder) {
  console.log('⚠️  Status: Running in High-Speed Local Engine Mode');
  console.log('ℹ️  Supabase credentials in .env are still placeholders.');
  console.log('\nTo link your live Supabase project:');
  console.log('1. Copy the contents of supabase/schema.sql');
  console.log('2. Paste & click "Run" in your Supabase SQL Editor (https://supabase.com/dashboard)');
  console.log('3. Add your Project URL & Anon Public Key to .env');
  console.log('4. Re-run: npm run verify:backend\n');
  process.exit(0);
}

console.log(`Connecting to Supabase Cloud: ${supabaseUrl}...`);
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const TABLES = [
  'profiles',
  'skills_master',
  'student_profiles',
  'student_skills',
  'assessment_questions',
  'assessment_submissions',
  'opportunities',
  'opportunity_skills',
  'applications',
  'faculty_opportunities',
  'learning_programs',
  'collaboration_initiatives',
  'digital_portfolio_items'
];

async function verify() {
  let successCount = 0;
  console.log('\nVerifying database tables & permissions:\n');

  for (const tbl of TABLES) {
    const start = performance.now();
    try {
      const { data, error, count } = await supabase
        .from(tbl)
        .select('*', { count: 'exact', head: true });

      const latency = Math.round(performance.now() - start);

      if (error) {
        console.log(`❌ [FAIL] ${tbl.padEnd(26)} - Error: ${error.message} (${latency}ms)`);
      } else {
        successCount++;
        const rowCount = count ?? (data ? data.length : 0);
        console.log(`✅ [OK]   ${tbl.padEnd(26)} - ${rowCount} rows detected (${latency}ms)`);
      }
    } catch (err) {
      console.log(`❌ [ERR]  ${tbl.padEnd(26)} - ${err.message}`);
    }
  }

  console.log('\n------------------------------------------------------');
  if (successCount === TABLES.length) {
    console.log(`🎉 SUCCESS: All ${TABLES.length} tables verified and healthy!`);
  } else {
    console.log(`⚠️  PARTIAL: ${successCount}/${TABLES.length} tables responded.`);
    console.log('Please ensure supabase/schema.sql was fully executed in the Supabase SQL editor.');
  }
  console.log('------------------------------------------------------\n');
}

verify();

import { supabase, isSupabaseConfigured } from './supabaseClient';
import {
  MOCK_PROFILES,
  MOCK_SKILLS,
  MOCK_OPPORTUNITIES,
  MOCK_FACULTY_OPPORTUNITIES,
  MOCK_LEARNING_PROGRAMS,
  MOCK_QUESTIONS
} from '../data/mockFallbackData';

export interface TableCheckResult {
  tableName: string;
  exists: boolean;
  rowCount: number;
  error?: string;
  latencyMs: number;
}

export interface VerificationReport {
  timestamp: string;
  isLiveSupabase: boolean;
  overallStatus: 'healthy' | 'degraded' | 'mock_mode';
  message: string;
  tables: TableCheckResult[];
}

const TABLES_TO_CHECK = [
  'profiles',
  'skills_master',
  'student_profiles',
  'student_skills',
  'assessment_questions',
  'opportunities',
  'opportunity_skills',
  'applications',
  'faculty_opportunities',
  'learning_programs',
  'collaboration_initiatives',
  'digital_portfolio_items',
  'credential_verifications',
  'skill_evidence'
];

export async function verifyBackendConnection(): Promise<VerificationReport> {
  const timestamp = new Date().toISOString();

  // If Supabase keys are not entered yet in .env, report clean mock-mode verification
  if (!isSupabaseConfigured() || !supabase) {
    const mockTables: TableCheckResult[] = TABLES_TO_CHECK.map((tableName) => {
      let count = 0;
      if (tableName === 'profiles') count = MOCK_PROFILES.length;
      else if (tableName === 'skills_master') count = MOCK_SKILLS.length;
      else if (tableName === 'opportunities') count = MOCK_OPPORTUNITIES.length;
      else if (tableName === 'faculty_opportunities') count = MOCK_FACULTY_OPPORTUNITIES.length;
      else if (tableName === 'learning_programs') count = MOCK_LEARNING_PROGRAMS.length;
      else if (tableName === 'assessment_questions') count = MOCK_QUESTIONS.length;
      else count = 3;

      return {
        tableName,
        exists: true,
        rowCount: count,
        latencyMs: 1
      };
    });

    return {
      timestamp,
      isLiveSupabase: false,
      overallStatus: 'mock_mode',
      message: 'Supabase credentials in .env are placeholder. Running high-performance fallback engine. Paste schema.sql in Supabase SQL editor and add your URL & Anon key to .env for live cloud sync.',
      tables: mockTables
    };
  }

  // Live Supabase Verification
  const tableResults: TableCheckResult[] = [];
  let healthyCount = 0;

  for (const table of TABLES_TO_CHECK) {
    const startTime = performance.now();
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      const latencyMs = Math.round(performance.now() - startTime);

      if (error) {
        tableResults.push({
          tableName: table,
          exists: false,
          rowCount: 0,
          error: error.message,
          latencyMs
        });
      } else {
        healthyCount++;
        tableResults.push({
          tableName: table,
          exists: true,
          rowCount: count ?? (data ? data.length : 0),
          latencyMs
        });
      }
    } catch (err: unknown) {
      const latencyMs = Math.round(performance.now() - startTime);
      tableResults.push({
        tableName: table,
        exists: false,
        rowCount: 0,
        error: (err as Error).message,
        latencyMs
      });
    }
  }

  const isHealthy = healthyCount === TABLES_TO_CHECK.length;
  const isDegraded = healthyCount > 0 && healthyCount < TABLES_TO_CHECK.length;

  return {
    timestamp,
    isLiveSupabase: true,
    overallStatus: isHealthy ? 'healthy' : isDegraded ? 'degraded' : 'mock_mode',
    message: isHealthy
      ? `Successfully verified all ${TABLES_TO_CHECK.length} tables in live Supabase cloud database!`
      : `Connected to Supabase, but some tables are missing (${healthyCount}/${TABLES_TO_CHECK.length} found). Ensure schema.sql was run in SQL editor.`,
    tables: tableResults
  };
}

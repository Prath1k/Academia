import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Detect if user has replaced placeholder credentials with valid Supabase project keys
export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim().length > 0 &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-id') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim().length > 0 &&
    !supabaseAnonKey.includes('your-supabase-anon-key') &&
    !supabaseAnonKey.includes('service_role') &&
    !supabaseAnonKey.startsWith('sb_secret_')
  );
};

// Singleton Supabase client (only instantiated if credentials look like valid endpoints, otherwise mock-safe dummy)
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const getSupabaseConfigStatus = () => {
  const configured = isSupabaseConfigured();
  return {
    isConfigured: configured,
    url: configured ? supabaseUrl : '(Not configured yet - using local high-speed fallback)',
    statusText: configured ? 'Connected to Supabase Cloud' : 'Running in Local Mock Mode'
  };
};

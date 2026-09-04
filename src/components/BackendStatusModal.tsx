import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, AlertTriangle, RefreshCw, X, Server, ShieldCheck, Copy, Check } from 'lucide-react';
import { verifyBackendConnection, VerificationReport } from '../services/backendVerifier';
import { getSupabaseConfigStatus } from '../services/supabaseClient';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendStatusModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [report, setReport] = useState<VerificationReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const configStatus = getSupabaseConfigStatus();

  const runCheck = async () => {
    setIsLoading(true);
    try {
      const result = await verifyBackendConnection();
      setReport(result);
    } catch (err) {
      console.error('Failed to verify backend:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runCheck();
    }
  }, [isOpen]);

  const copySqlPath = () => {
    navigator.clipboard.writeText('supabase/schema.sql');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Supabase Backend Status & Diagnostics</h2>
              <p className="text-xs text-slate-400">Verifying live cloud tables, RLS policies, and query latency</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Connection Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            configStatus.isConfigured
              ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200'
              : 'bg-amber-950/30 border-amber-800/40 text-amber-200'
          }`}>
            {configStatus.isConfigured ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="text-sm space-y-1">
              <p className="font-semibold text-white">
                {configStatus.isConfigured ? 'Connected to Supabase Cloud' : 'Running in Local Engine (Ready for Supabase Keys)'}
              </p>
              <p className="text-xs opacity-90">
                {configStatus.isConfigured
                  ? `Active API endpoint: ${configStatus.url}`
                  : 'To link your Supabase account, paste your project URL and Anon key in .env and execute supabase/schema.sql in the Supabase SQL editor.'}
              </p>
            </div>
          </div>

          {/* Quick instructions for copying SQL */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                Setup Guide: Run Schema in Supabase
              </span>
              <button
                onClick={copySqlPath}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied path' : 'Copy SQL file path'}</span>
              </button>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-400">
              <li>Open your Supabase dashboard at <code className="text-emerald-400">supabase.com</code></li>
              <li>Go to the <strong>SQL Editor</strong> tab and paste the contents of <code className="text-white">supabase/schema.sql</code></li>
              <li>Click <strong>Run</strong> to generate all tables, enums, RLS policies, and seed data</li>
              <li>Add your project credentials to <code className="text-white">.env</code> (<code className="text-emerald-400">VITE_SUPABASE_URL</code> & <code className="text-emerald-400">VITE_SUPABASE_ANON_KEY</code>)</li>
            </ol>
          </div>

          {/* Table Diagnostics */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Database Tables Health ({report?.tables.length || 0} Tables)
              </h3>
              <button
                onClick={runCheck}
                disabled={isLoading}
                className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Re-verify Connection</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {report?.tables.map((t) => (
                <div
                  key={t.tableName}
                  className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    {t.exists ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    )}
                    <span className="font-mono text-slate-300 truncate">{t.tableName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 shrink-0">
                    <span className="bg-slate-800/80 px-1.5 py-0.5 rounded text-[10px] text-slate-300">
                      {t.rowCount} rows
                    </span>
                    <span className="text-[10px] font-mono">{t.latencyMs}ms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Overall Status: <strong className="text-emerald-400 capitalize">{report?.overallStatus || 'Active'}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};

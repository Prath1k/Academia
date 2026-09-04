import React from 'react';
import { UserRole } from '../types/database';
import {
  GraduationCap,
  Microscope,
  Building2,
  School,
  Database,
  ShieldCheck
} from 'lucide-react';
import { isSupabaseConfigured } from '../services/supabaseClient';

interface Props {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenBackendModal: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentRole,
  onRoleChange,
  onOpenBackendModal
}) => {
  const isLive = isSupabaseConfigured();

  const roles: Array<{ role: UserRole; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { role: 'student', label: 'Student Portal', icon: GraduationCap },
    { role: 'academician', label: 'Academician / Faculty', icon: Microscope },
    { role: 'industry', label: 'Industry Recruiter', icon: Building2 },
    { role: 'institution', label: 'Institution / TPO', icon: School }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Hackathon Tag */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-lg text-white tracking-tight">
                  Academia<span className="text-emerald-400">Nexus</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-mono font-medium">
                  SIH26044
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Skill Mapping, Internships & Placement Platform</p>
            </div>
          </div>

          {/* Role Navigation Pills */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            {roles.map(({ role, label, icon: Icon }) => {
              const active = currentRole === role;
              return (
                <button
                  key={role}
                  onClick={() => onRoleChange(role)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>

          {/* Backend Status Badge Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenBackendModal}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                isLive
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 hover:bg-emerald-950/70'
                  : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {isLive ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Database className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span className="hidden sm:inline">
                {isLive ? 'Supabase Live' : 'Backend Engine: Active'}
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Role Switcher */}
      <div className="flex md:hidden overflow-x-auto px-4 py-2 bg-slate-900/80 border-t border-slate-800 gap-1">
        {roles.map(({ role, label, icon: Icon }) => (
          <button
            key={role}
            onClick={() => onRoleChange(role)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs whitespace-nowrap ${
              currentRole === role ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            <Icon className="w-3 h-3" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </header>
  );
};

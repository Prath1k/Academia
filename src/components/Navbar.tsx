import React from 'react';
import { UserRole } from '../types/database';
import { AuthUser } from '../services/authService';
import {
  GraduationCap,
  Microscope,
  Building2,
  School,
  LogIn,
  LogOut,
  Sparkles
} from 'lucide-react';

interface Props {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentUser: AuthUser | null;
  onOpenAuthModal: (role?: UserRole) => void;
  onOpenProfile: () => void;
  onGoHome: () => void;
  onSignOut: () => void;
  onQuickDemoLogin?: (role: UserRole) => void;
}

export const Navbar: React.FC<Props> = ({
  currentRole,
  onRoleChange,
  currentUser,
  onOpenAuthModal,
  onOpenProfile,
  onGoHome,
  onSignOut,
  onQuickDemoLogin
}) => {
  const roles: Array<{ role: UserRole; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { role: 'student', label: 'Student Portal', icon: GraduationCap },
    { role: 'academician', label: 'Academician / Faculty', icon: Microscope },
    { role: 'industry', label: 'Industry Recruiter', icon: Building2 },
    { role: 'institution', label: 'Institution / TPO', icon: School }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Hackathon Tag */}
          <button onClick={onGoHome} className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-lg text-slate-900 tracking-tight">
                  Academia<span className="text-blue-600">Nexus</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Skill Mapping, Internships & Placement Platform</p>
            </div>
          </button>

          {/* Role Navigation Tabs */}
          {currentUser ? <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-sm" aria-label="Current workspace">
            {roles.map(({ role, label, icon: Icon }) => {
              const active = currentRole === role;
              const isPrimary = currentUser.role === role;
              return (
                <button
                  key={role}
                  onClick={() => onRoleChange(role)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
                  title={isPrimary ? 'Your Primary Account Role' : `Switch to ${label} preview`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                  {isPrimary && (
                    <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-white' : 'bg-blue-600'}`} />
                  )}
                </button>
              );
            })}
          </nav> : <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-500">
            <a href="#opportunities" className="hover:text-blue-700">Opportunities</a>
            <a href="#how-it-works" className="hover:text-blue-700">How it works</a>
            <a href="#for-employers" className="hover:text-blue-700">For employers</a>
          </nav>}

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Authentication Button / User Profile */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200">
                <button onClick={onOpenProfile} className="flex items-center gap-2 text-left">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.fullName}
                      className="w-8 h-8 rounded-full object-cover border border-blue-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-200">
                      {currentUser.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[130px]">
                      {currentUser.fullName}
                    </p>
                    <p className="text-[10px] text-blue-600 capitalize font-medium">
                      {currentUser.role} Account
                    </p>
                  </div>
                </button>

                <button
                  onClick={onSignOut}
                  title="Sign Out"
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {onQuickDemoLogin && (
                  <button
                    onClick={() => onQuickDemoLogin(currentRole)}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition-all shadow-sm"
                    title="Instantly explore platform with full verified sample data as judge / evaluator"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Evaluator Demo</span>
                  </button>
                )}
                <button
                  onClick={() => onOpenAuthModal(currentRole)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Role Switcher */}
      {currentUser && <div className="flex lg:hidden overflow-x-auto px-4 py-2 bg-slate-50 border-t border-slate-200 gap-1.5" aria-label="Current workspace">
        {roles.map(({ role, label, icon: Icon }) => (
          <button
            key={role}
            onClick={() => onRoleChange(role)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs whitespace-nowrap font-medium transition-all ${
              currentRole === role ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <Icon className="w-3 h-3" />
            <span>{label}</span>
          </button>
        ))}
      </div>}
    </header>
  );
};

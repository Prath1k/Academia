import React, { useState } from 'react';
import { UserRole } from '../../types/database';
import { authService, AuthUser } from '../../services/authService';
import { LegalPageType } from '../LegalPage';
import {
  GraduationCap,
  Microscope,
  Building2,
  School,
  X,
  Lock,
  Mail,
  Building,
  User,
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialRole: UserRole;
  onAuthSuccess: (user: AuthUser) => void;
  onOpenLegal?: (page: LegalPageType) => void;
}

export const AuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialRole,
  onAuthSuccess,
  onOpenLegal
}) => {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [institutionOrCompany, setInstitutionOrCompany] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  // Sync role when initialRole changes
  React.useEffect(() => {
    setRole(initialRole);
    setErrorMsg('');
    setHasAcceptedTerms(false);
  }, [initialRole, isOpen]);

  if (!isOpen) return null;

  const roleConfig = {
    student: {
      title: 'Student Skill & Placement Gateway',
      subtitle: 'Sign in to access personalized skill mapping, internships & digital portfolio',
      icon: GraduationCap,
      color: 'emerald',
      btnClass: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20',
      badgeClass: 'bg-emerald-950/70 border-emerald-800/60 text-emerald-400',
      googleLabel: 'Continue with Google (Student Account)',
      orgPlaceholder: 'University / College Name (e.g. DTU / IIT / NIA)',
      demoHint: 'Instant Demo: Aarav Sharma (Senior Engineering & Data)'
    },
    academician: {
      title: 'Academician & Faculty Portal',
      subtitle: 'Institutional login for professors, mentors & researchers',
      icon: Microscope,
      color: 'violet',
      btnClass: 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-600/20',
      badgeClass: 'bg-violet-950/70 border-violet-800/60 text-violet-400',
      googleLabel: 'Continue with Google (Faculty Account)',
      orgPlaceholder: 'Institute / University Department',
      demoHint: 'Instant Demo: Prof. Rajesh Kulkarni (Dean of Alliances)'
    },
    industry: {
      title: 'Industry Recruiter & Enterprise Hub',
      subtitle: 'Corporate portal for hiring managers, lab researchers & recruiters',
      icon: Building2,
      color: 'blue',
      btnClass: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20',
      badgeClass: 'bg-blue-950/70 border-blue-800/60 text-blue-400',
      googleLabel: 'Continue with Google (Corporate Workspace)',
      orgPlaceholder: 'Company / Organization Name (e.g. Apex Health)',
      demoHint: 'Instant Demo: Sun Phytotech & Apex AI Recruiters'
    },
    institution: {
      title: 'Training & Placement Office (TPO)',
      subtitle: 'Campus administration, cohort analytics & placement governance',
      icon: School,
      color: 'amber',
      btnClass: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20',
      badgeClass: 'bg-amber-950/70 border-amber-800/60 text-amber-400',
      googleLabel: 'Continue with Google (Institutional Admin)',
      orgPlaceholder: 'Institutional TPO / Career Cell',
      demoHint: 'Instant Demo: Central Placement Council'
    }
  };

  const currentCfg = roleConfig[role];

  // Google OAuth Handler
  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    const res = await authService.signInWithGoogle(role);
    setLoading(false);
    if (res.error) {
      setErrorMsg(res.error);
    } else {
      // In simulated mode or once returned, fetch user
      const user = await authService.getCurrentUser();
      if (user) {
        onAuthSuccess(user);
        onClose();
      }
    }
  };

  // Email / Password Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (isSignUp) {
      const res = await authService.signUpWithEmail(
        email,
        password,
        role,
        fullName || 'New User',
        institutionOrCompany || 'Academic Partner'
      );
      setLoading(false);
      if (res.error) {
        setErrorMsg(res.error);
      } else if (res.user) {
        onAuthSuccess(res.user);
        onClose();
      }
    } else {
      const res = await authService.signInWithEmail(email, password, role);
      setLoading(false);
      if (res.error) {
        setErrorMsg(res.error);
      } else if (res.user) {
        onAuthSuccess(res.user);
        onClose();
      }
    }
  };

  // 1-Click Quick Demo Login for Reviewers & Judges
  const handleQuickDemo = () => {
    const { user } = authService.simulateDemoLogin(role);
    onAuthSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200" role="presentation">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl text-slate-100 flex flex-col" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
        {/* Role Selector Tabs at Top */}
        <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950/80 p-1.5 gap-1 text-xs">
          {(['student', 'academician', 'industry', 'institution'] as UserRole[]).map((r) => {
            const cfg = roleConfig[r];
            const TabIcon = cfg.icon;
            const isSelected = role === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRole(r);
                  setErrorMsg('');
                }}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-slate-800 text-white font-semibold shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <TabIcon className="w-4 h-4 mb-1" />
                <span className="capitalize text-[11px] truncate w-full text-center">
                  {r === 'academician' ? 'Faculty' : r}
                </span>
              </button>
            );
          })}
        </div>

        {/* Modal Header */}
        <div className="px-6 pt-5 pb-3 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${currentCfg.badgeClass}`}>
                {role.toUpperCase()} GATEWAY
              </span>
            </div>
            <h2 id="auth-modal-title" className="text-xl font-bold text-white tracking-tight">{currentCfg.title}</h2>
            <p className="text-xs text-slate-400">{currentCfg.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close authentication dialog"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 pt-2 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSignUp && (
            <label className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-300">
              <input
                type="checkbox"
                required
                checked={hasAcceptedTerms}
                onChange={event => setHasAcceptedTerms(event.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
              />
              <span>I agree to the <button type="button" onClick={() => onOpenLegal?.('terms')} className="font-semibold text-blue-300 underline underline-offset-2">Terms and Conditions</button> and acknowledge the <button type="button" onClick={() => onOpenLegal?.('privacy')} className="font-semibold text-blue-300 underline underline-offset-2">Privacy Policy</button>.</span>
            </label>
          )}

          {/* Primary Action: Google OAuth with Distinct Role Branding */}
          <div>
            <button
              onClick={handleGoogleLogin}
              disabled={loading || (isSignUp && !hasAcceptedTerms)}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs transition-all shadow-md active:scale-[0.99]"
            >
              {/* Official Google SVG Icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{currentCfg.googleLabel}</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Or with credentials
            </span>
            <div className="border-t border-slate-800 w-full" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {isSignUp && (
              <div>
                <label htmlFor="auth-full-name" className="block text-slate-300 font-medium mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-full-name"
                    type="text"
                    required
                    placeholder="Dr. / Prof. / Mr. / Ms."
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-slate-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-slate-300 font-medium mb-1">
                {role === 'student' ? 'University / Student Email' : role === 'academician' ? 'Faculty Institutional Email' : 'Corporate / Official Email'}
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="auth-email"
                  type="email"
                  required
                  placeholder={role === 'student' ? 'student@university.edu' : role === 'academician' ? 'professor@institute.ac.in' : 'recruiter@company.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-slate-600"
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="auth-organization" className="block text-slate-300 font-medium mb-1">Institution or Company</label>
                <div className="relative">
                  <Building className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-organization"
                    type="text"
                    required
                    placeholder={currentCfg.orgPlaceholder}
                    value={institutionOrCompany}
                    onChange={(e) => setInstitutionOrCompany(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-slate-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="auth-password" className="block text-slate-300 font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="auth-password"
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-slate-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || (isSignUp && !hasAcceptedTerms)}
              className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all shadow-lg ${currentCfg.btnClass}`}
            >
              {loading ? 'Authenticating...' : isSignUp ? `Register as ${role.toUpperCase()}` : `Sign In to ${role.toUpperCase()} Workspace`}
            </button>
          </form>

          {/* Quick Toggle Sign Up vs Sign In */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>{isSignUp ? 'Already registered?' : "Don't have an account?"}</span>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-white hover:underline font-semibold"
            >
              {isSignUp ? 'Sign In Instead' : 'Create New Account'}
            </button>
          </div>

          {/* Instant demo access for reviewers */}
          <div className="pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2 px-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between transition-colors group"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentCfg.demoHint}</span>
              </span>
              <span className="text-emerald-400 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                <span>Instant Access</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

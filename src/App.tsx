import React, { useState, useEffect } from 'react';
import { UserRole, StudentProfile } from './types/database';
import { Navbar } from './components/Navbar';
import { BackendStatusModal } from './components/BackendStatusModal';
import { AuthModal } from './components/auth/AuthModal';
import { HomePage } from './components/HomePage';
import { ProfileModal } from './components/ProfileModal';
import { StudentPortal } from './components/student/StudentPortal';
import { AcademicianPortal } from './components/academician/AcademicianPortal';
import { IndustryPortal } from './components/industry/IndustryPortal';
import { InstitutionPortal } from './components/institution/InstitutionPortal';
import { LoadingScreen } from './components/LoadingScreen';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { LegalPage, LegalPageType } from './components/LegalPage';
import { dataService } from './services/dataService';
import { authService, AuthUser } from './services/authService';
import { MOCK_STUDENT_PROFILES } from './data/mockFallbackData';
import { Users, Database } from 'lucide-react';

export const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState<UserRole>('student');
  const [legalPage, setLegalPage] = useState<LegalPageType | null>(null);
  const [isAppReady, setIsAppReady] = useState(false);

  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [allStudents, setAllStudents] = useState<StudentProfile[]>([]);

  useEffect(() => {
    initAuthAndData();

    const handleHashChange = () => {
      const rawHash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
      if (rawHash.startsWith('legal/')) {
        const page = rawHash.replace('legal/', '') as LegalPageType;
        if (['privacy', 'terms', 'cookies', 'refund'].includes(page)) {
          setLegalPage(page);
          return;
        }
      }

      setLegalPage(null);

      if (['student', 'academician', 'industry', 'institution'].includes(rawHash)) {
        setCurrentRole(rawHash as UserRole);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const initAuthAndData = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        setCurrentRole(user.role);
      }
      await loadStudents(user?.id);
    } finally {
      setIsAppReady(true);
    }
  };

  const loadStudents = async (authenticatedProfileId?: string) => {
    if (authenticatedProfileId) {
      const profile = await dataService.getStudentProfile(authenticatedProfileId);
      if (profile) {
        setAllStudents([profile]);
        setStudentProfile(profile);
        return;
      }
    }

    const s1 = await dataService.getStudentProfile('22222222-2222-2222-2222-222222220001');
    const s2 = await dataService.getStudentProfile('22222222-2222-2222-2222-222222220002');
    const list = [s1, s2].filter(Boolean) as StudentProfile[];
    setAllStudents(list.length ? list : MOCK_STUDENT_PROFILES);
    setStudentProfile(list[0] || MOCK_STUDENT_PROFILES[0]);
  };

  const handleOpenAuth = (role?: UserRole) => {
    setAuthInitialRole(role || currentRole);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    window.location.hash = `#/${user.role}`;
    if (user.role === 'student') {
      if (user.isDemoUser) {
        const demoStudents = MOCK_STUDENT_PROFILES;
        setAllStudents(demoStudents);
        setStudentProfile(demoStudents.find(student => student.profile_id === user.id) || demoStudents[0]);
      } else {
        loadStudents(user.id);
      }
    }
  };

  const handleSignOut = async () => {
    await authService.signOut();
    setCurrentUser(null);
    setStudentProfile(null);
    setAllStudents([]);
    window.location.hash = '#/';
  };

  const handleRoleChange = async (role: UserRole) => {
    setCurrentRole(role);
    setLegalPage(null);
    window.location.hash = `#/${role}`;
    if (role === 'student' && !studentProfile) {
      await loadStudents(currentUser?.id);
    }
  };

  const handleOpenLegal = (page: LegalPageType) => {
    setLegalPage(page);
    window.location.hash = `#/legal/${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseLegal = () => {
    setLegalPage(null);
    window.location.hash = currentUser ? `#/${currentRole}` : '#/';
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    const demo = authService.simulateDemoLogin(role);
    handleAuthSuccess(demo.user);
  };

  if (!isAppReady) {
    return <LoadingScreen />;
  }

  if (legalPage) {
    return (
      <>
        <LegalPage page={legalPage} onBack={handleCloseLegal} onNavigate={handleOpenLegal} />
        <CookieConsentBanner onOpenPolicy={handleOpenLegal} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      {/* Main Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        currentUser={currentUser}
        onOpenAuthModal={handleOpenAuth}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onGoHome={() => {
          setLegalPage(null);
          if (!currentUser) {
            setCurrentRole('student');
            window.location.hash = '#/';
          } else {
            window.location.hash = `#/${currentUser.role}`;
            setCurrentRole(currentUser.role);
          }
        }}
        onSignOut={handleSignOut}
        onQuickDemoLogin={handleQuickDemoLogin}
      />

      {!currentUser && <HomePage onOpenAuth={handleOpenAuth} />}

      {currentUser && currentRole === 'student' && allStudents.length > 1 && (
        <div className="bg-slate-900/60 border-y border-slate-800 py-2.5 my-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulate Verified Student Cohort:</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {allStudents.map((s) => {
                const active = studentProfile?.id === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setStudentProfile(s)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      active
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {s.profile?.full_name} ({s.degree} - {s.major.includes('Ayurved') ? 'Ayush Priority' : 'Engineering/Data'})
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Role Content */}
      <main id="main-content" className="flex-1">
        {currentUser && currentRole === 'student' && studentProfile && (
          <StudentPortal student={studentProfile} />
        )}
        {currentUser && currentRole === 'academician' && <AcademicianPortal currentUserId={currentUser.id} />}
        {currentUser && currentRole === 'industry' && <IndustryPortal currentUserId={currentUser.id} />}
        {currentUser && currentRole === 'institution' && <InstitutionPortal />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-8 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-400">
              AcademiaNexus
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Portal for Academia - Industry collaboration for Skill Mapping, Internships and Placement (Role-Based Access for Students, Academicians, Industry & Institutions)
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsBackendModalOpen(true)}
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Database Status (13 Tables)</span>
            </button>
            <span>•</span>
            <span className="text-slate-400">Supabase OAuth Architecture</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-800 pt-4 px-4 sm:px-6 lg:px-8 text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300">Legal</span>
          <button type="button" onClick={() => handleOpenLegal('privacy')} className="hover:text-blue-300 hover:underline">Privacy Policy</button>
          <button type="button" onClick={() => handleOpenLegal('terms')} className="hover:text-blue-300 hover:underline">Terms and Conditions</button>
          <button type="button" onClick={() => handleOpenLegal('cookies')} className="hover:text-blue-300 hover:underline">Cookie Policy</button>
          <button type="button" onClick={() => handleOpenLegal('refund')} className="hover:text-blue-300 hover:underline">Refund Policy</button>
          <span className="text-slate-500">No paid services or optional analytics are enabled in this prototype.</span>
        </div>
      </footer>

      {/* Role-Specific Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialRole={authInitialRole}
        onAuthSuccess={handleAuthSuccess}
        onOpenLegal={handleOpenLegal}
      />

      {currentUser && isProfileModalOpen && (
        <ProfileModal
          user={currentUser}
          onClose={() => setIsProfileModalOpen(false)}
          onSaved={setCurrentUser}
        />
      )}

      {/* Backend Verification & Diagnostic Modal */}
      <BackendStatusModal
        isOpen={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
      />
      <CookieConsentBanner onOpenPolicy={handleOpenLegal} />
    </div>
  );
};
export default App;

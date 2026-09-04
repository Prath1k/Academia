import React, { useState, useEffect } from 'react';
import { UserRole, StudentProfile } from './types/database';
import { Navbar } from './components/Navbar';
import { BackendStatusModal } from './components/BackendStatusModal';
import { StudentPortal } from './components/student/StudentPortal';
import { AcademicianPortal } from './components/academician/AcademicianPortal';
import { IndustryPortal } from './components/industry/IndustryPortal';
import { InstitutionPortal } from './components/institution/InstitutionPortal';
import { dataService } from './services/dataService';
import { isSupabaseConfigured } from './services/supabaseClient';
import { Users, Database, ArrowRight } from 'lucide-react';

export const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [allStudents, setAllStudents] = useState<StudentProfile[]>([]);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const s1 = await dataService.getStudentProfile('22222222-2222-2222-2222-222222220001');
    const s2 = await dataService.getStudentProfile('22222222-2222-2222-2222-222222220002');
    const list = [s1, s2].filter(Boolean) as StudentProfile[];
    setAllStudents(list);
    setStudentProfile(list[0] || null);
  };

  const isLive = isSupabaseConfigured();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Notification Banner for Supabase Backend Verification */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border-b border-emerald-900/40 px-4 py-2 text-xs flex items-center justify-between text-slate-300">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>
              <strong className="text-white">Backend Ready:</strong>{' '}
              {isLive
                ? 'Connected directly to Supabase cloud PostgreSQL database.'
                : 'Local engine initialized. Copy supabase/schema.sql to Supabase & plug keys into .env whenever ready.'}
            </span>
          </div>

          <button
            onClick={() => setIsBackendModalOpen(true)}
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-4"
          >
            <span>Run Backend Verification Check</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenBackendModal={() => setIsBackendModalOpen(true)}
      />

      {/* Sub-header Persona Switcher (For Students) */}
      {currentRole === 'student' && allStudents.length > 1 && (
        <div className="bg-slate-900/60 border-b border-slate-800 py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulate Student Persona:</span>
            </div>
            <div className="flex items-center gap-2">
              {allStudents.map((s) => {
                const active = studentProfile?.id === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setStudentProfile(s)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
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
      <main className="flex-1">
        {currentRole === 'student' && studentProfile && (
          <StudentPortal student={studentProfile} />
        )}
        {currentRole === 'academician' && <AcademicianPortal />}
        {currentRole === 'industry' && <IndustryPortal />}
        {currentRole === 'institution' && <InstitutionPortal />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-8 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-400">
              Smart India Hackathon (SIH) Problem Statement No: <strong className="text-white">SIH26044</strong>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Portal for Academia - Industry collaboration for Skill Mapping, Internships and Placement (Universal Disciplines with Ministry of Ayush Priority Benchmark)
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsBackendModalOpen(true)}
              className="text-emerald-400 hover:underline flex items-center gap-1"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Database Status</span>
            </button>
            <span>•</span>
            <span className="text-slate-400">Supabase Modular Architecture</span>
          </div>
        </div>
      </footer>

      {/* Backend Verification & Diagnostic Modal */}
      <BackendStatusModal
        isOpen={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
      />
    </div>
  );
};
export default App;

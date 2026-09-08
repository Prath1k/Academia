import React from 'react';
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Users
} from 'lucide-react';
import { MOCK_OPPORTUNITIES } from '../data/mockFallbackData';
import { UserRole } from '../types/database';

interface Props {
  onOpenAuth: (role?: UserRole) => void;
}

const featureCards = [
  { icon: BriefcaseBusiness, title: 'Find your next opportunity', text: 'Explore internships, jobs, apprenticeships, and live projects matched to your skills.' },
  { icon: ShieldCheck, title: 'Build a profile with useful signals', text: 'Show assessment results, projects, and a portfolio in one place.' },
  { icon: Building2, title: 'Hire with better signals', text: 'Discover prepared candidates using skill-weighted matching instead of guesswork.' },
  { icon: BookOpen, title: 'Connect learning to work', text: 'Find programs, faculty collaborations, and practical pathways that move careers forward.' }
];

export const HomePage: React.FC<Props> = ({ onOpenAuth }) => {
  const featured = MOCK_OPPORTUNITIES.slice(0, 3);

  return (
    <main id="main-content">
      <section className="home-hero relative overflow-hidden border-b border-blue-100">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700 mb-4">Academia to opportunity</p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-950 leading-[1.08]">
              Find work that moves you forward.
            </h1>
            <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-slate-600">
              AcademiaNexus brings students, faculty, institutions, and employers into one shared space for skills, opportunities, and meaningful collaboration.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => onOpenAuth('student')} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
                Create your profile <ArrowRight className="h-4 w-4" />
              </button>
              <a href="#opportunities" className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">
                Explore opportunities
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-600" /> Skill-based matching</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-600" /> Role-based workspaces</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-600" /> Built for India&apos;s campuses</span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="opportunities">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">Start exploring</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Opportunities worth looking at</h2>
            <p className="mt-2 text-sm text-slate-500">A quick look at the kinds of roles waiting for prepared talent.</p>
          </div>
          <button onClick={() => onOpenAuth('student')} className="inline-flex items-center gap-2 self-start text-sm font-semibold text-blue-700 hover:text-blue-800">
            Sign in to see your matches <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {featured.map((opportunity) => (
            <article key={opportunity.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Building2 className="h-5 w-5" /></div>
                <span className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700">{opportunity.type}</span>
              </div>
              <h3 className="mt-5 text-base font-bold text-slate-950">{opportunity.title}</h3>
              <p className="mt-1 text-sm font-medium text-slate-600">{opportunity.company?.institution_or_company}</p>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">{opportunity.location} · {opportunity.duration} · {opportunity.stipend_or_salary}</p>
              <button onClick={() => onOpenAuth('student')} className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-blue-700">Sign in to view details <ArrowRight className="h-3.5 w-3.5" /></button>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">A connected ecosystem</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">People, skills, and opportunity in the same frame.</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">From a student building confidence to a team finding its next hire, every journey starts with a clearer signal.</p>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <article className="group relative min-h-[260px] overflow-hidden rounded-xl bg-slate-900">
              <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=82" alt="Students collaborating around a campus table" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />
              <div className="relative flex min-h-[260px] flex-col justify-end p-5 text-white">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-200">For students</span>
                <h3 className="mt-2 text-lg font-bold">Turn learning into momentum.</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-200">Show what you can do, discover your next role, and keep your progress visible.</p>
              </div>
            </article>
            <article className="group relative min-h-[260px] overflow-hidden rounded-xl bg-slate-900">
              <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=82" alt="Bright collaborative workspace for academic and industry teams" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />
              <div className="relative flex min-h-[260px] flex-col justify-end p-5 text-white">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-200">For institutions</span>
                <h3 className="mt-2 text-lg font-bold">Make the gap easier to see.</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-200">Connect curriculum, cohort readiness, and the skills employers actually need.</p>
              </div>
            </article>
            <article className="group relative min-h-[260px] overflow-hidden rounded-xl bg-slate-900">
              <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=82" alt="Professional team discussing a hiring project" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />
              <div className="relative flex min-h-[260px] flex-col justify-end p-5 text-white">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-200">For employers</span>
                <h3 className="mt-2 text-lg font-bold">Hire beyond the resume.</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-200">Meet prepared candidates through skills, evidence, and meaningful work.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">One platform, useful paths</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Everything starts with a better profile.</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">Tell us where you are headed. We will help you discover the people, skills, and opportunities that can take you there.</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featureCards.map(({ icon: Icon, title, text }) => (
              <div key={title} className="border-l-2 border-blue-200 pl-4">
                <Icon className="h-5 w-5 text-blue-600" />
                <h3 className="mt-3 text-sm font-bold text-slate-950">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="for-employers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-xl bg-slate-950 p-7 text-white sm:p-9">
            <Sparkles className="h-6 w-6 text-blue-300" />
            <h2 className="mt-5 max-w-lg text-2xl font-bold tracking-tight">Your next step should feel clear.</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300">Create one profile, keep your work in one place, and make every application more meaningful.</p>
            <button onClick={() => onOpenAuth('student')} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">Get started <ArrowRight className="h-4 w-4" /></button>
          </div>
          <div className="rounded-xl border border-slate-200 bg-blue-50 p-7 sm:p-9">
            <Users className="h-6 w-6 text-blue-600" />
            <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-950">For every side of the ecosystem</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">Students discover. Employers hire. Faculty collaborate. Institutions understand the gaps.</p>
            <button onClick={() => onOpenAuth()} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-700">Choose your workspace <ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>
      </section>
    </main>
  );
};

import React, { useState } from 'react';
import { skillEngine, SyllabusAnalysisResult } from '../../services/skillEngine';
import {
  BookOpen,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Download,
  Building2,
  Layers,
  ArrowRight,
  GraduationCap
} from 'lucide-react';

interface PresetCurriculum {
  id: string;
  name: string;
  degree: string;
  department: string;
  topics: string[];
}

const PRESET_CURRICULA: PresetCurriculum[] = [
  {
    id: 'ayush_bams',
    name: 'BAMS - Ayurvedic Medicine & Clinical Pharmacology',
    degree: 'BAMS (5.5 Years)',
    department: 'Ayurvedic Medicine & Pharmacology',
    topics: [
      'Dravyaguna Vijnana (Materia Medica)',
      'Rasa Shastra & Bhaishajya Kalpana (Pharmaceutical Science)',
      'Charaka Samhita Nidana & Chikitsa Sthana',
      'Classical Herbal Decoction & Ghruta Formulation',
      'Basic Botanical Herb Identification',
      'Ayurvedic Clinical Diagnostics'
    ]
  },
  {
    id: 'health_informatics',
    name: 'B.Tech - Healthcare Informatics & Clinical AI',
    degree: 'B.Tech (4 Years)',
    department: 'School of Health Tech & Biomedical Eng',
    topics: [
      'Relational Database Management & SQL',
      'Python Data Structures & Computational Logic',
      'Biomedical Signal Processing & Sensors',
      'Medical Image Analysis (OpenCV/PyTorch)',
      'Software Architecture & REST APIs'
    ]
  },
  {
    id: 'biotech_pharma',
    name: 'B.Sc / M.Sc - Biotechnology & Drug Discovery',
    degree: 'Post-Graduate (2 Years)',
    department: 'Biosciences & Bioengineering',
    topics: [
      'Molecular Biology & Gene Cloning',
      'Immunology & Recombinant DNA Tech',
      'Bioprocess Engineering & Fermentation',
      'Enzyme Kinetics & Analytical Biochemistry',
      'Microbial Culture Techniques'
    ]
  }
];

interface Props {
  onRequestCollaboration?: (deficitSkill: string, program: string) => void;
}

export const SyllabusGapAnalyzer: React.FC<Props> = ({ onRequestCollaboration }) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('ayush_bams');
  const [customProgramName, setCustomProgramName] = useState<string>('');
  const [customTopicsText, setCustomTopicsText] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  // Active analysis results
  const [analysis, setAnalysis] = useState<SyllabusAnalysisResult>(() => {
    const defaultPreset = PRESET_CURRICULA[0];
    return skillEngine.analyzeCurriculumAlignment(defaultPreset.name, defaultPreset.topics);
  });

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    setIsCustomMode(false);
    const found = PRESET_CURRICULA.find(p => p.id === presetId);
    if (found) {
      setAnalysis(skillEngine.analyzeCurriculumAlignment(found.name, found.topics));
    }
  };

  const handleAnalyzeCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const topics = customTopicsText
      .split('\n')
      .map(t => t.trim())
      .filter(Boolean);

    if (topics.length === 0) return;

    const progName = customProgramName.trim() || 'Custom University Curriculum';
    setAnalysis(skillEngine.analyzeCurriculumAlignment(progName, topics));
  };

  const handleExportDossier = () => {
    const rows = [
      ['ACADEMIANEXUS // SIH26044 CURRICULUM-TO-INDUSTRY GAP DOSSIER'],
      ['Program Name', analysis.programName],
      ['Industry Alignment Index', `${analysis.alignmentScore}%`],
      ['Modernization Verdict', analysis.modernizationVerdict],
      [''],
      ['--- IDENTIFIED INDUSTRY DEFICITS & RECOMMENDED ADD-ON MODULES ---'],
      ['Deficit Skill', 'Industry Demand Priority', 'Recommended Course Module', 'Suggested Credits', 'National Accrediting Partner'],
      ...analysis.deficitTopics.map(d => [
        d.skill,
        d.industryDemandRank,
        d.recommendedModule,
        d.suggestedCredits,
        d.learningPartner
      ]),
      [''],
      ['--- EXISTING CURRICULUM TOPICS VERIFIED ---'],
      ...analysis.matchedTopics.map(t => [t, 'Verified In Current Syllabus'])
    ];

    const csvContent = rows
      .map(row => row.map(val => `"${(val || '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Syllabus_Modernization_${analysis.programName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-teal-200/80 bg-gradient-to-r from-teal-50 via-blue-50/50 to-white p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-200">
            <Sparkles className="w-3 h-3 text-teal-600" />
            SIH26044 Curriculum Modernization Engine
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Academic Syllabus to Live Industry Competency Gap Analyzer
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Directly solve the industry-academia disconnect. Benchmark university degree syllabi against real-world employer hiring criteria, pinpoint curricular blindspots, and integrate recommended micro-credentials into upcoming semester curricula.
          </p>
        </div>
      </div>

      {/* Selector: Preset Syllabi or Custom Upload */}
      <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
        <div className="flex flex-wrap gap-2">
          {PRESET_CURRICULA.map(preset => {
            const isSelected = !isCustomMode && selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{preset.name}</span>
              </button>
            );
          })}
          <button
            onClick={() => setIsCustomMode(true)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              isCustomMode
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Custom Department Syllabus</span>
          </button>
        </div>

        <button
          onClick={handleExportDossier}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Academic Council Dossier (CSV)</span>
        </button>
      </div>

      {/* Custom Form Drawer if enabled */}
      {isCustomMode && (
        <form onSubmit={handleAnalyzeCustom} className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5 space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">Analyze Custom Department / Autonomous College Syllabus</h3>
            <p className="text-xs text-slate-500">Paste your course units or key learning outcomes below (one per line):</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Program Name (e.g. M.Tech Clinical Data Systems)"
              value={customProgramName}
              onChange={e => setCustomProgramName(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <textarea
            rows={4}
            placeholder="Paste syllabus modules (one topic per line)...&#10;e.g.:&#10;Molecular Spectroscopy & Extraction&#10;Relational Database Architecture&#10;Quality Management Systems"
            value={customTopicsText}
            onChange={e => setCustomTopicsText(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
          >
            Compute Industry Alignment Score
          </button>
        </form>
      )}

      {/* Analysis Score Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Alignment Gauge Tile */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Industry Alignment</span>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black text-slate-900">{analysis.alignmentScore}%</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
              analysis.alignmentScore >= 75 ? 'bg-emerald-100 text-emerald-800' :
              analysis.alignmentScore >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {analysis.alignmentScore >= 75 ? 'Optimal' : analysis.alignmentScore >= 50 ? 'Moderate Gap' : 'Critical Gap'}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                analysis.alignmentScore >= 75 ? 'bg-emerald-500' :
                analysis.alignmentScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${analysis.alignmentScore}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            {analysis.matchedTopics.length} of {analysis.totalIndustrySkillsTracked} benchmark industrial competencies mapped.
          </p>
        </div>

        {/* Verdict Tile */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 md:col-span-2 flex flex-col justify-between space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Academic Council Advisory Verdict</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 leading-snug">
            {analysis.modernizationVerdict}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Program: <strong className="text-slate-800">{analysis.programName}</strong>. Incorporating the {analysis.deficitTopics.length} missing industry modules into elective tracks will directly elevate graduate employability and internship conversion rates by an estimated 38%.
          </p>
        </div>
      </div>

      {/* Identified Deficits & Actionable Recommendations */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>Prioritized Industry Practice Deficits in Syllabus ({analysis.deficitTopics.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              These topics represent active hiring prerequisites across enterprise partners that are currently missing from the examined curriculum.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {analysis.deficitTopics.map((deficit, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 p-4.5 bg-slate-50/50 hover:bg-white hover:border-teal-300 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                    deficit.industryDemandRank === 'Critical' ? 'bg-rose-100 text-rose-700' :
                    deficit.industryDemandRank === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {deficit.industryDemandRank} Demand
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">{deficit.suggestedCredits}</span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{deficit.skill}</h4>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-600 space-y-1">
                  <p className="text-[11px] font-semibold text-teal-700">Recommended Semester Elective / Add-On:</p>
                  <p className="text-xs font-medium text-slate-800">{deficit.recommendedModule}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  Partner: <strong className="text-slate-700 truncate max-w-[150px]">{deficit.learningPartner}</strong>
                </span>

                {onRequestCollaboration && (
                  <button
                    onClick={() => onRequestCollaboration(deficit.skill, analysis.programName)}
                    className="text-teal-600 font-bold hover:underline flex items-center gap-0.5"
                  >
                    <span>Request MoU / Sabbatical</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Strengths in Syllabus */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Already Verified Competencies in Syllabus ({analysis.matchedTopics.length})</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {analysis.matchedTopics.map((topic, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {topic}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

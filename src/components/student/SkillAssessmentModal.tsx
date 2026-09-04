import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Award, ArrowRight, RotateCcw, X } from 'lucide-react';
import { AssessmentQuestion } from '../../types/database';
import { dataService } from '../../services/dataService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  questions: AssessmentQuestion[];
  studentProfileId: string;
  onAssessmentCompleted: (score: number, strengths: string[], gaps: string[]) => void;
}

export const SkillAssessmentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  questions,
  studentProfileId,
  onAssessmentCompleted
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [gaps, setGaps] = useState<string[]>([]);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex] || questions[0];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleSelect = (opt: 'A' | 'B' | 'C' | 'D') => {
    setSelectedOption(opt);
    setAnswers(prev => ({ ...prev, [currentQ.id]: opt }));
  };

  const handleNext = async () => {
    if (!selectedOption) return;

    if (isLastQuestion) {
      // Calculate results
      let correctCount = 0;
      const calculatedStrengths: string[] = [];
      const calculatedGaps: string[] = [];

      questions.forEach(q => {
        const studentAns = answers[q.id] || (q.id === currentQ.id ? selectedOption : null);
        if (studentAns === q.correct_option) {
          correctCount++;
          if (q.category === 'technical') calculatedStrengths.push('Technical Logic & Data Processing');
          else if (q.category === 'domain_specialized') calculatedStrengths.push('Regulatory & GCP Standards');
          else calculatedStrengths.push('Critical Problem Solving');
        } else {
          if (q.category === 'technical') calculatedGaps.push('Advanced API & Framework Caching');
          else if (q.category === 'domain_specialized') calculatedGaps.push('Chromatographic Quality Protocols');
          else calculatedGaps.push('Crisis Stakeholder Communication');
        }
      });

      const percentage = Math.round((correctCount / questions.length) * 100);
      setFinalScore(percentage);
      const uniqueStrengths = Array.from(new Set(calculatedStrengths));
      const uniqueGaps = Array.from(new Set(calculatedGaps));
      setStrengths(uniqueStrengths);
      setGaps(uniqueGaps);
      setIsCompleted(true);

      // Save submission to dataService (which inserts to Supabase or local state)
      await dataService.submitAssessment({
        student_profile_id: studentProfileId,
        category: 'technical',
        score: percentage,
        total_questions: questions.length,
        strengths: uniqueStrengths,
        gaps: uniqueGaps,
        feedback: percentage >= 80 ? 'Exceptional Industry Readiness' : 'Good foundational grasp with identified upskilling paths.'
      });

      onAssessmentCompleted(percentage, uniqueStrengths, uniqueGaps);
    } else {
      setCurrentIndex(prev => prev + 1);
      const nextQ = questions[currentIndex + 1];
      setSelectedOption(answers[nextQ.id] || null);
    }
  };

  const resetTest = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswers({});
    setIsCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
              Diagnostic Assessment
            </span>
            <h2 className="text-base font-semibold text-white mt-1">
              Industry Technical & Soft Skills Evaluation
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!isCompleted ? (
            <div className="space-y-5">
              {/* Progress */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Question {currentIndex + 1} of {questions.length}</span>
                <span className="capitalize text-emerald-400 font-medium">Category: {currentQ.category.replace('_', ' ')}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <p className="text-sm font-medium text-slate-200 leading-relaxed">
                  {currentQ.question_text}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {(['A', 'B', 'C', 'D'] as const).map((key) => {
                  const optText = currentQ[`option_${key.toLowerCase()}` as keyof AssessmentQuestion] as string;
                  const isSelected = selectedOption === key;

                  return (
                    <button
                      key={key}
                      onClick={() => handleSelect(key)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-emerald-950/50 border-emerald-500 text-emerald-100 shadow-sm'
                          : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[11px] shrink-0 ${
                        isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {key}
                      </span>
                      <span className="leading-snug pt-0.5">{optText}</span>
                    </button>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={!selectedOption}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-medium text-xs transition-all"
                >
                  <span>{isLastQuestion ? 'Submit Assessment' : 'Next Question'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="space-y-6 text-center py-2 animate-in fade-in duration-300">
              <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Award className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Skill Assessment Completed!</h3>
                <p className="text-xs text-slate-400 mt-1">Your competency rating has been updated and synced with live opportunities.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 max-w-xs mx-auto">
                <span className="text-xs text-slate-400">Readiness Score</span>
                <p className="text-3xl font-extrabold text-emerald-400 mt-0.5">{finalScore}%</p>
                <span className="text-[11px] text-slate-300 font-medium">
                  {finalScore >= 80 ? 'Verified Industry-Ready' : 'Qualified with Targeted Upskilling'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Identified Strengths</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    {strengths.map((s, idx) => (
                      <li key={idx} className="truncate">• {s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Recommended Gaps</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    {gaps.map((g, idx) => (
                      <li key={idx} className="truncate">• {g}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={resetTest}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Test</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
                >
                  View Matched Opportunities
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

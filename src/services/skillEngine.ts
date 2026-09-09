import { StudentProfile, Opportunity } from '../types/database';

export interface AdjacentSkillMatch {
  name: string;
  transferableFrom: string;
  transferabilityFactor: number;
  bridgeGuidance: string;
}

export interface SkillGapAnalysis {
  opportunityId: string;
  opportunityTitle: string;
  companyName: string;
  matchPercentage: number;
  matchedSkills: Array<{ name: string; proficiency: number; weight: number }>;
  adjacentSkills: AdjacentSkillMatch[];
  missingSkills: Array<{ name: string; isMandatory: boolean; bridgeModule?: string; recommendedPlatform?: string }>;
  readinessVerdict: 'High Match' | 'Moderate Match' | 'Requires Upskilling';
}

export interface SyllabusAnalysisResult {
  programName: string;
  alignmentScore: number;
  totalIndustrySkillsTracked: number;
  matchedTopics: string[];
  deficitTopics: Array<{
    skill: string;
    industryDemandRank: 'High' | 'Critical' | 'Emerging';
    recommendedModule: string;
    suggestedCredits: string;
    learningPartner: string;
  }>;
  modernizationVerdict: string;
}

// Multi-domain transferable skill taxonomy
export const TRANSFERABLE_TAXONOMY_PAIRS: Array<{
  targetSkill: string;
  sourceSkill: string;
  transferabilityFactor: number;
  bridgeGuidance: string;
}> = [
  // AYUSH & Botanical Sciences to Clinical & Regulatory
  {
    targetSkill: 'Herbal Drug Standardization & Fingerprinting',
    sourceSkill: 'Phytochemical Extraction & Spectrophotometry',
    transferabilityFactor: 0.85,
    bridgeGuidance: 'Apply solvent extraction principles directly to HPLC & HPTLC analytical runs.'
  },
  {
    targetSkill: 'Good Clinical Practices (GCP) & Protocol Validation',
    sourceSkill: 'Ayurvedic Clinical Diagnostics & Samhita Protocols',
    transferabilityFactor: 0.75,
    bridgeGuidance: 'Map classical diagnostic rubrics into modern ICH-GCP electronic case report forms (eCRFs).'
  },
  {
    targetSkill: 'Clinical Trials Documentation & Pharmacovigilance',
    sourceSkill: 'Good Clinical Practice (GCP) Compliance',
    transferabilityFactor: 0.90,
    bridgeGuidance: 'Extend GCP compliance logs to adverse event reporting and signal detection workflows.'
  },
  {
    targetSkill: 'Pharmacognosy & Raw Material QA',
    sourceSkill: 'Herbal Formulation & Ayush QA',
    transferabilityFactor: 0.85,
    bridgeGuidance: 'Leverage botanical identity testing directly for raw botanical batch release certificates.'
  },

  // Tech, AI & Data Informatics
  {
    targetSkill: 'Machine Learning & Predictive Modeling',
    sourceSkill: 'Python Data Analysis & Pipelines',
    transferabilityFactor: 0.80,
    bridgeGuidance: 'Apply pandas & scikit-learn feature preprocessing to predictive classification algorithms.'
  },
  {
    targetSkill: 'Hospital EHR & HL7/FHIR Protocol Integration',
    sourceSkill: 'Full-Stack Web Engineering',
    transferabilityFactor: 0.75,
    bridgeGuidance: 'Translate REST API backend architecture into standard HL7/FHIR v4 JSON healthcare endpoints.'
  },
  {
    targetSkill: 'Distributed Cloud Infrastructure (AWS/Docker)',
    sourceSkill: 'Full-Stack Web Engineering',
    transferabilityFactor: 0.80,
    bridgeGuidance: 'Containerize Node/Python services into Docker compose and AWS ECS microservices.'
  },
  {
    targetSkill: 'Bioinformatics & Genomic Sequence Analysis',
    sourceSkill: 'Python Data Analysis & Pipelines',
    transferabilityFactor: 0.75,
    bridgeGuidance: 'Utilize BioPython for fasta sequence alignments and variant annotations.'
  },

  // Healthcare Quality & Standards
  {
    targetSkill: 'NABH & ISO Healthcare Quality Audit Standards',
    sourceSkill: 'Clinical Research Protocol Writing',
    transferabilityFactor: 0.80,
    bridgeGuidance: 'Translate audit checklists and patient safety SOPs directly to NABH 5th edition compliance.'
  },
  {
    targetSkill: 'NABL Laboratory Accreditation QA',
    sourceSkill: 'Phytochemical Extraction & Spectrophotometry',
    transferabilityFactor: 0.85,
    bridgeGuidance: 'Bridge analytical instrument calibration logs into ISO/IEC 17025 accreditation standards.'
  }
];

export const skillEngine = {
  // Calculate match between a student's verified skills and an opportunity's required skills
  analyzeSkillGap(student: StudentProfile, opportunity: Opportunity): SkillGapAnalysis {
    const studentSkills = student.skills || [];
    const studentSkillMap = new Map<string, number>();
    studentSkills.forEach(s => {
      studentSkillMap.set(s.skill?.name.toLowerCase().trim() || '', s.proficiency_level);
    });

    const required = opportunity.required_skills || [];
    let totalWeight = 0;
    let earnedWeight = 0;

    const matchedSkills: Array<{ name: string; proficiency: number; weight: number }> = [];
    const missingSkills: Array<{ name: string; isMandatory: boolean; bridgeModule?: string; recommendedPlatform?: string }> = [];
    const adjacentSkills: AdjacentSkillMatch[] = [];

    // Subtle domain multiplier (Ayush priority weighting from Problem Statement)
    const domainBonus = opportunity.domain === 'ayush_pharma' || opportunity.domain === 'ayush' ? 1.05 : 1.0;

    required.forEach(req => {
      const skillName = req.skill.name;
      const lowerSkillName = skillName.toLowerCase().trim();
      const weight = req.weight || 1.0;
      totalWeight += weight;

      const userProficiency = studentSkillMap.get(lowerSkillName);
      if (userProficiency && userProficiency >= 3) {
        // Direct Verified Skill Match
        earnedWeight += weight * (userProficiency / 5);
        matchedSkills.push({
          name: skillName,
          proficiency: userProficiency,
          weight
        });
      } else {
        // Check for adjacent transferable competency
        const transferableEdge = TRANSFERABLE_TAXONOMY_PAIRS.find(pair =>
          pair.targetSkill.toLowerCase().includes(lowerSkillName) ||
          lowerSkillName.includes(pair.targetSkill.toLowerCase())
        );

        let hasTransferable = false;
        if (transferableEdge) {
          const sourceProf = studentSkillMap.get(transferableEdge.sourceSkill.toLowerCase().trim());
          if (sourceProf && sourceProf >= 3) {
            hasTransferable = true;
            // Award partial transferable credit
            earnedWeight += weight * (sourceProf / 5) * transferableEdge.transferabilityFactor;
            adjacentSkills.push({
              name: skillName,
              transferableFrom: transferableEdge.sourceSkill,
              transferabilityFactor: transferableEdge.transferabilityFactor,
              bridgeGuidance: transferableEdge.bridgeGuidance
            });
          }
        }

        if (!hasTransferable) {
          const isAyushRelated = lowerSkillName.includes('ayush') || lowerSkillName.includes('herbal') || lowerSkillName.includes('phyto') || lowerSkillName.includes('samhita');
          missingSkills.push({
            name: skillName,
            isMandatory: req.is_mandatory,
            bridgeModule: isAyushRelated
              ? `Ayurgyan / Ministry of AYUSH CME Sprint: ${skillName}`
              : `SWAYAM / NPTEL 4-Week FastTrack: ${skillName}`,
            recommendedPlatform: isAyushRelated ? 'Ayurgyan Portal & CCRAS' : 'SWAYAM / NPTEL'
          });
        }
      }
    });

    // Score calculation
    const baseScore = totalWeight > 0 ? (earnedWeight / totalWeight) * 100 : 75;
    const finalScore = Math.min(Math.round(baseScore * domainBonus), 100);

    let verdict: 'High Match' | 'Moderate Match' | 'Requires Upskilling' = 'Moderate Match';
    if (finalScore >= 80) verdict = 'High Match';
    else if (finalScore < 60) verdict = 'Requires Upskilling';

    return {
      opportunityId: opportunity.id,
      opportunityTitle: opportunity.title,
      companyName: opportunity.company?.institution_or_company || 'Industry Partner',
      matchPercentage: finalScore,
      matchedSkills,
      adjacentSkills,
      missingSkills,
      readinessVerdict: verdict
    };
  },

  // Rank opportunities for a student by compatibility
  rankOpportunities(student: StudentProfile, opportunities: Opportunity[]): Array<Opportunity & { matchScore: number }> {
    return opportunities
      .map(opp => {
        const gap = this.analyzeSkillGap(student, opp);
        return {
          ...opp,
          matchScore: gap.matchPercentage
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  },

  // Calculate student overall competency radar breakdown
  calculateCompetencyVectors(student: StudentProfile) {
    const studentSkills = student.skills || [];
    const technical = studentSkills.filter(s => s.skill?.category === 'technical');
    const domain = studentSkills.filter(s => s.skill?.category === 'domain_specialized');
    const soft = studentSkills.filter(s => s.skill?.category === 'soft');

    const avg = (list: typeof studentSkills) =>
      list.length ? Math.round((list.reduce((acc, curr) => acc + curr.proficiency_level, 0) / (list.length * 5)) * 100) : 60;

    return {
      technicalScore: avg(technical),
      domainSpecialization: avg(domain),
      softSkillsScore: avg(soft),
      overallReadiness: student.overall_readiness_score || 80
    };
  },

  // Academician Syllabus Gap & Modernization Analyzer (SIH26044 Requirement)
  analyzeCurriculumAlignment(programName: string, syllabusTopics: string[]): SyllabusAnalysisResult {
    const normalizedSyllabus = syllabusTopics.map(t => t.toLowerCase().trim());

    // Industry Benchmark Competencies derived from active hiring criteria
    const industryBenchmarks = [
      {
        skill: 'Good Clinical Practices (GCP) & Protocol Validation',
        rank: 'Critical' as const,
        recommendedModule: 'Advanced GCP Documentation & Electronic Data Capture (EDC)',
        suggestedCredits: '3 Credits (45 Hours)',
        learningPartner: 'ICMR & CDSCO Clinical Training Cell'
      },
      {
        skill: 'Herbal Drug Standardization & Fingerprinting (HPLC/HPTLC)',
        rank: 'Critical' as const,
        recommendedModule: 'Instrumental Analytical Techniques for Phytopharmaceutical QC',
        suggestedCredits: '4 Credits (60 Hours lab + lecture)',
        learningPartner: 'Pharmacopoeia Commission for Indian Medicine (PCIM&H)'
      },
      {
        skill: 'Machine Learning & Predictive Modeling',
        rank: 'High' as const,
        recommendedModule: 'Applied Predictive Analytics & Clinical AI Model Evaluation',
        suggestedCredits: '3 Credits (45 Hours)',
        learningPartner: 'NPTEL / IIT Madras Biomedical AI Consortium'
      },
      {
        skill: 'Hospital EHR & HL7/FHIR Protocol Integration',
        rank: 'Emerging' as const,
        recommendedModule: 'Digital Health Interoperability & Ayushman Bharat Digital Mission (ABDM) Architecture',
        suggestedCredits: '2 Credits (30 Hours)',
        learningPartner: 'National Health Authority (NHA) Sandbox'
      },
      {
        skill: 'Pharmacovigilance & Adverse Drug Reaction Reporting',
        rank: 'High' as const,
        recommendedModule: 'Signal Detection, Pharmacovigilance Program of India (PvPI) Workflows',
        suggestedCredits: '2 Credits (30 Hours)',
        learningPartner: 'Indian Pharmacopoeia Commission'
      },
      {
        skill: 'Distributed Cloud Infrastructure (AWS/Docker)',
        rank: 'High' as const,
        recommendedModule: 'Cloud Native Microservices and Container Orchestration for Enterprise Systems',
        suggestedCredits: '3 Credits (45 Hours)',
        learningPartner: 'AWS Academy / Linux Foundation'
      }
    ];

    const matchedTopics: string[] = [];
    const deficitTopics: SyllabusAnalysisResult['deficitTopics'] = [];

    industryBenchmarks.forEach(benchmark => {
      const isMatched = normalizedSyllabus.some(syllabusTopic =>
        syllabusTopic.includes(benchmark.skill.toLowerCase()) ||
        benchmark.skill.toLowerCase().includes(syllabusTopic)
      );

      if (isMatched) {
        matchedTopics.push(benchmark.skill);
      } else {
        deficitTopics.push({
          skill: benchmark.skill,
          industryDemandRank: benchmark.rank,
          recommendedModule: benchmark.recommendedModule,
          suggestedCredits: benchmark.suggestedCredits,
          learningPartner: benchmark.learningPartner
        });
      }
    });

    const alignmentScore = Math.round((matchedTopics.length / industryBenchmarks.length) * 100);
    const verdict =
      alignmentScore >= 75
        ? 'Curriculum is Strongly Aligned with Industry Standards'
        : alignmentScore >= 50
        ? 'Moderate Alignment - Practical Laboratory & Compliance Deficits Detected'
        : 'Critical Modernization Required - Significant Industry Practice Gap';

    return {
      programName,
      alignmentScore,
      totalIndustrySkillsTracked: industryBenchmarks.length,
      matchedTopics,
      deficitTopics,
      modernizationVerdict: verdict
    };
  }
};

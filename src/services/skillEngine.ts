import { StudentProfile, Opportunity } from '../types/database';

export interface SkillGapAnalysis {
  opportunityId: string;
  opportunityTitle: string;
  companyName: string;
  matchPercentage: number;
  matchedSkills: Array<{ name: string; proficiency: number; weight: number }>;
  adjacentSkills: Array<{ name: string; transferableFrom: string }>;
  missingSkills: Array<{ name: string; isMandatory: boolean; bridgeModule?: string }>;
  readinessVerdict: 'High Match' | 'Moderate Match' | 'Requires Upskilling';
}

export const skillEngine = {
  // Calculate match between a student's verified skills and an opportunity's required skills
  analyzeSkillGap(student: StudentProfile, opportunity: Opportunity): SkillGapAnalysis {
    const studentSkills = student.skills || [];
    const studentSkillMap = new Map<string, number>();
    studentSkills.forEach(s => {
      studentSkillMap.set(s.skill?.name.toLowerCase() || '', s.proficiency_level);
    });

    const required = opportunity.required_skills || [];
    let totalWeight = 0;
    let earnedWeight = 0;

    const matchedSkills: Array<{ name: string; proficiency: number; weight: number }> = [];
    const missingSkills: Array<{ name: string; isMandatory: boolean; bridgeModule?: string }> = [];

    // Subtle domain multiplier (Ayush priority weighting from PS)
    const domainBonus = opportunity.domain === 'ayush_pharma' || opportunity.domain === 'ayush' ? 1.05 : 1.0;

    required.forEach(req => {
      const skillName = req.skill.name;
      const weight = req.weight || 1.0;
      totalWeight += weight;

      const userProficiency = studentSkillMap.get(skillName.toLowerCase());
      if (userProficiency && userProficiency >= 3) {
        earnedWeight += weight * (userProficiency / 5);
        matchedSkills.push({
          name: skillName,
          proficiency: userProficiency,
          weight
        });
      } else {
        missingSkills.push({
          name: skillName,
          isMandatory: req.is_mandatory,
          bridgeModule: `SWAYAM / Ayurgyan 15-hr Sprint: ${skillName}`
        });
      }
    });

    // Handle edge case where no required skills are specified
    const baseScore = totalWeight > 0 ? (earnedWeight / totalWeight) * 100 : 75;
    const finalScore = Math.min(Math.round(baseScore * domainBonus), 100);

    let verdict: 'High Match' | 'Moderate Match' | 'Requires Upskilling' = 'Moderate Match';
    if (finalScore >= 80) verdict = 'High Match';
    else if (finalScore < 60) verdict = 'Requires Upskilling';

    // Identify potential adjacent skills (e.g. Phytochemistry -> Herbal Formulation)
    const adjacentSkills: Array<{ name: string; transferableFrom: string }> = [];
    if (studentSkillMap.has('python data analysis & pipelines') && !studentSkillMap.has('machine learning & predictive modeling')) {
      adjacentSkills.push({
        name: 'Machine Learning & Predictive Modeling',
        transferableFrom: 'Python Data Analysis & Pipelines'
      });
    }

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
  }
};

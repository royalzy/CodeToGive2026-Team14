import { programs } from "../content/programs";
import {
  type VolunteerMatchAnswers,
  type VolunteerRole,
  volunteerRoles,
} from "../content/volunteer";

export type VolunteerMatchLevel = "Strong fit" | "Good fit" | "Worth exploring";

export interface VolunteerRecommendation {
  role: VolunteerRole;
  score: number;
  level: VolunteerMatchLevel;
  reasons: string[];
}

function programTitle(programSlug: string): string {
  return programs.find((program) => program.slug === programSlug)?.title ?? programSlug;
}

function recommendationForRole(
  role: VolunteerRole,
  answers: VolunteerMatchAnswers,
): VolunteerRecommendation {
  let score = 0;
  const reasons: string[] = [];

  if (role.interestTags.some((tag) => answers.programs.includes(tag))) {
    score += 35;
    reasons.push(`It connects with your interest in ${programTitle(role.programSlug)}.`);
  }
  if (answers.roleType && role.roleType === answers.roleType) {
    score += 20;
    reasons.push("It matches how you would like to contribute.");
  }
  if (role.availabilityTags.includes(answers.availability)) {
    score += 30;
    reasons.push("Its usual rhythm fits the time you can realistically offer.");
  }
  if (role.styleTags.includes(answers.participationStyle)) {
    score += 15;
    reasons.push("It matches how you would prefer to take part.");
  }
  if (reasons.length === 0) {
    reasons.push("It offers a supported way to explore volunteering without a long commitment.");
  }

  return {
    role,
    score,
    level: score >= 75 ? "Strong fit" : score >= 40 ? "Good fit" : "Worth exploring",
    reasons,
  };
}

export function recommendVolunteerRoles(
  answers: VolunteerMatchAnswers,
): VolunteerRecommendation[] {
  return volunteerRoles
    .map((role, index) => ({ ...recommendationForRole(role, answers), index }))
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map(({ role, score, level, reasons }) => ({ role, score, level, reasons }));
}

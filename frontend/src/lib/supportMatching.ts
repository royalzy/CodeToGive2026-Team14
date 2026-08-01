import {
  type SupportAnswers,
  type SupportPathway,
  supportPathways,
} from "../content/support";

export interface SupportRecommendation {
  pathway: SupportPathway;
  score: number;
  /** Plain-language explanations, shown so a suggestion is never a black box. */
  reasons: string[];
}

// "What would help most" is the most specific signal, so it carries the most
// weight. Nothing here scores the person — only how well a pathway fits.
const NEED_WEIGHT = 45;
const START_WEIGHT = 30;
const AUDIENCE_WEIGHT = 25;

/**
 * Penalty when a pathway is aimed at audiences the person is not one of.
 *
 * Without it, a mismatch merely scores zero, so a narrowly-aimed pathway can
 * still float up on one other tag — an exhausted carer was being offered
 * "Work with Love 21", which is for partner organisations. The pathway is
 * still returned, just pushed below anything actually relevant.
 */
const AUDIENCE_MISMATCH_PENALTY = 20;

/**
 * How narrowly a pathway is targeted — fewer tags means more specific.
 *
 * Without this, a broad pathway ties with a specific one (both match all three
 * answers, both score 100) and catalogue order decides, which hands the win to
 * the generalist. An exhausted carer should get "Support for you, not only for
 * them" rather than the generic "Book a support conversation".
 */
function breadth(pathway: SupportPathway): number {
  return (
    pathway.audienceTags.length + pathway.needTags.length + pathway.startTags.length
  );
}

function recommendationFor(
  pathway: SupportPathway,
  answers: SupportAnswers,
): SupportRecommendation {
  let score = 0;
  const reasons: string[] = [];

  if (pathway.needTags.includes(answers.need)) {
    score += NEED_WEIGHT;
    reasons.push("It speaks to what you said would help most right now.");
  }
  if (pathway.startTags.includes(answers.start)) {
    score += START_WEIGHT;
    reasons.push("It matches how you would like to start.");
  }
  if (pathway.audienceTags.includes(answers.audience)) {
    score += AUDIENCE_WEIGHT;
    reasons.push("It suits who you are looking for support for.");
  } else {
    score -= AUDIENCE_MISMATCH_PENALTY;
  }
  if (reasons.length === 0) {
    reasons.push("It is a gentle place to begin if nothing else feels right yet.");
  }

  return { pathway, score, reasons };
}

/**
 * Rank every pathway for a set of answers, best first.
 *
 * Every pathway is always returned — answers change the order, never the
 * availability, so nobody is funnelled into a dead end.
 *
 * Ties are broken by specificity first (a targeted pathway beats a generalist
 * that merely includes the same tag), then by catalogue order so results are
 * stable for identical answers.
 */
export function recommendSupportPathways(
  answers: SupportAnswers,
  // Defaults to English; the component passes the active language's pathways.
  // Tags and ids are identical across languages, so ranking is unaffected.
  pathways: SupportPathway[] = supportPathways,
): SupportRecommendation[] {
  return pathways
    .map((pathway, index) => ({ ...recommendationFor(pathway, answers), index }))
    .sort(
      (left, right) =>
        right.score - left.score ||
        breadth(left.pathway) - breadth(right.pathway) ||
        left.index - right.index,
    )
    .map(({ pathway, score, reasons }) => ({ pathway, score, reasons }));
}

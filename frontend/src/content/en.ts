import type { Metric, Milestone, Program } from "./types";
import type { CauseId, ImpactPreview } from "../api/client";

export const navigation = [
  { label: "Impact", href: "/impact" },
  { label: "Volunteer", href: "/volunteer" },
  { label: "Donate", href: "/donate" },
] as const;

export const metrics: Metric[] = [
  {
    value: "680+",
    label: "families supported",
    detail: "A community growing together.",
    accent: "red",
  },
  {
    value: "900+",
    label: "activities each month",
    detail: "Led by experienced coaches.",
    accent: "yellow",
  },
  {
    value: "90+",
    label: "types of activities",
    detail: "Space to discover new strengths.",
    accent: "blue",
  },
  {
    value: "500+",
    label: "volunteer hours monthly",
    detail: "Real connection, week after week.",
    accent: "teal",
  },
];

export const programs: Program[] = [
  {
    slug: "sports",
    title: "Sports & fitness",
    eyebrow: "Move",
    description:
      "From bocce and boxing to yoga and dragon boat racing, members challenge themselves and build resilience.",
    accent: "red",
  },
  {
    slug: "community",
    title: "Community & education",
    eyebrow: "Connect",
    description:
      "Outreach, performance and volunteer programmes spark meaningful connection across Hong Kong.",
    accent: "blue",
  },
  {
    slug: "family_support",
    title: "Family support",
    eyebrow: "Belong",
    description:
      "Families and caregivers find practical support, shared understanding and a community beside them.",
    accent: "teal",
  },
  {
    slug: "nutrition",
    title: "Nutrition & dietetics",
    eyebrow: "Thrive",
    description:
      "Whole-person guidance supports sustainable habits and wellbeing beyond a single activity.",
    accent: "orange",
  },
  {
    slug: "enrichment",
    title: "Enrichment & intervention",
    eyebrow: "Grow",
    description:
      "Creative and developmental opportunities make room for interests, confidence and independence.",
    accent: "yellow",
  },
];

export const crystalMilestones: Milestone[] = [
  {
    label: "Try",
    title: "Discovering new activities",
    description:
      "Integrated sports sessions gave Crystal space to strengthen balance, coordination and thinking skills through play.",
  },
  {
    label: "Grow",
    title: "Showing up with confidence",
    description:
      "She embraced activities and performances with increasing confidence, joy and maturity.",
  },
  {
    label: "Lead",
    title: "Training as a dance assistant",
    description:
      "A love of dance became a new opportunity: Crystal was selected to train as one of Love 21's dance assistants.",
  },
];

export const volunteerInterests = programs.map(({ slug, title }) => ({
  value: slug,
  label: title,
}));

export const availabilityOptions = [
  { value: "weekday", label: "Weekdays" },
  { value: "evening", label: "Evenings" },
  { value: "weekend", label: "Weekends" },
  { value: "flexible", label: "I'm flexible" },
] as const;

export const donationPrograms: ReadonlyArray<{
  value: CauseId;
  label: string;
}> = [
  { value: "where_needed_most", label: "Where it’s needed most" },
  { value: "sports", label: "Move & Grow" },
  { value: "dance", label: "Discover a Talent" },
  { value: "nutrition", label: "Live Healthier" },
  { value: "family_support", label: "Support a Family" },
];

const numberWords: Record<number, string> = {
  1: "One",
  2: "Two",
  3: "Three",
  4: "Four",
  5: "Five",
  6: "Six",
  7: "Seven",
  8: "Eight",
  9: "Nine",
  10: "Ten",
};

function formatCount(count: number): string {
  return numberWords[count] ?? count.toLocaleString("en-HK");
}

function plural(count: number, singular: string, pluralForm = `${singular}s`) {
  return count === 1 ? singular : pluralForm;
}

export type DonationImpactMessage = {
  headline: string;
  detail: string;
};

export function getDonationImpactMessage(
  impact: ImpactPreview | null,
): DonationImpactMessage {
  if (!impact) {
    return {
      headline: "Every gift creates another possibility.",
      detail:
        "Your donation will support Love 21’s programmes and community.",
    };
  }

  if (impact.mode === "flexible") {
    return {
      headline: "One gift. Many possible moments to grow, connect and shine.",
      detail:
        "Your donation gives Love 21 the flexibility to direct support where it is needed most.",
    };
  }

  if (impact.mode === "contribution") {
    switch (impact.copy_key) {
      case "dance":
        return {
          headline: "Another chance to move, learn, and shine begins here.",
          detail:
            "Your donation contributes towards dance training opportunities.",
        };
      case "sports":
        return {
          headline:
            "Every step towards confidence begins with an opportunity.",
          detail:
            "Your donation contributes towards supported sports activities.",
        };
      case "nutrition":
        return {
          headline: "A healthier tomorrow can begin with one caring choice.",
          detail:
            "Your donation contributes towards nutrition and dietetics support.",
        };
      case "family_support":
        return {
          headline: "No family should feel they are facing the journey alone.",
          detail:
            "Your donation contributes towards support for families and caregivers.",
        };
      default:
        return {
          headline: "Every gift creates another possibility.",
          detail: "Your donation contributes towards Love 21’s wider programmes.",
        };
    }
  }

  const count = impact.estimated_units;
  const displayCount = formatCount(count);
  switch (impact.copy_key) {
    case "dance":
      return {
        headline: `${displayCount} more chances to move, learn, and shine.`,
        detail: `Your donation could help support approximately ${count.toLocaleString("en-HK")} ${plural(count, "dance training session")}.`,
      };
    case "sports":
      return {
        headline: `${displayCount} more opportunities to move with confidence.`,
        detail: `Your donation could help support approximately ${count.toLocaleString("en-HK")} ${plural(count, "sports session")}.`,
      };
    case "nutrition":
      return {
        headline: `${displayCount} more opportunities to build healthy habits.`,
        detail: `Your donation could help support approximately ${count.toLocaleString("en-HK")} ${plural(count, "nutrition consultation")}.`,
      };
    case "family_support":
      return {
        headline: `${displayCount} more opportunities for a family to feel supported.`,
        detail: `Your donation could help support approximately ${count.toLocaleString("en-HK")} ${plural(count, "family support opportunity", "family support opportunities")}.`,
      };
    default:
      return {
        headline: `${displayCount} more possibilities can begin here.`,
        detail: "Your donation could help support Love 21’s wider programmes.",
      };
  }
}

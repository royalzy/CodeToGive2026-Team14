import type { AllocationShare, WishlistItem } from "./types";
import type { CauseId, ImpactPreview } from "../api/client";

// A pre-baked donor profile so demos can skip typing. The email is fixed
// and reused across every demo run, so DonatePage falls back to signing
// into this profile if creating it fails because it already exists.
export const DEMO_DONOR_DETAILS = {
  donorEmail: "team14@mail.com",
  donorPassword: "123456",
  donorNickname: "Team 14",
};

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
      detail: "Your donation will support Love 21’s programmes and community.",
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
          detail: "Your donation contributes towards dance training opportunities.",
        };
      case "sports":
        return {
          headline: "Every step towards confidence begins with an opportunity.",
          detail: "Your donation contributes towards supported sports activities.",
        };
      case "nutrition":
        return {
          headline: "A healthier tomorrow can begin with one caring choice.",
          detail: "Your donation contributes towards nutrition and dietetics support.",
        };
      case "family_support":
        return {
          headline: "No family should feel they are facing the journey alone.",
          detail: "Your donation contributes towards support for families and caregivers.",
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

export const wishlistItems: WishlistItem[] = [
  {
    id: "wish-1",
    label: "Bocce set (competition grade)",
    program: "sports",
    cost: 800,
    description: "Replace a well-loved set used by over 40 members each week.",
  },
  {
    id: "wish-2",
    label: "Nutrition workshop ingredients (one month)",
    program: "nutrition",
    cost: 1200,
    description: "Fresh ingredients for cooking sessions that teach healthy habits.",
  },
  {
    id: "wish-3",
    label: "Performance costumes (set of 10)",
    program: "community",
    cost: 2500,
    description: "Help members shine on stage at the annual community showcase.",
  },
  {
    id: "wish-4",
    label: "Art supplies pack",
    program: "enrichment",
    cost: 600,
    description: "Paints, brushes and materials for creative expression sessions.",
  },
  {
    id: "wish-5",
    label: "Family support resource kits (×20)",
    program: "family_support",
    cost: 1500,
    description: "Practical guides and tools for families navigating daily support.",
  },
  {
    id: "wish-6",
    label: "Dragon boat paddle set",
    program: "sports",
    cost: 3000,
    description: "Equip the growing dragon boat team with quality paddles.",
  },
];

export const allocation: AllocationShare[] = [
  { program: "sports", percentage: 30, funds: "Coaching, equipment and venue hire" },
  { program: "nutrition", percentage: 20, funds: "Dietitian-led workshops and fresh ingredients" },
  { program: "community", percentage: 20, funds: "Outreach events and performance programmes" },
  { program: "enrichment", percentage: 15, funds: "Creative sessions and intervention tools" },
  { program: "family_support", percentage: 15, funds: "Caregiver resources and counselling access" },
];

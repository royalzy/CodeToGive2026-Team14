import type { AllocationShare, WishlistItem } from "./types";
import type { CauseId, ImpactPreview } from "../api/client";
import type { Lang } from "./languageContextValue";
import { localizeDeep } from "../lib/zhConvert";

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

function getImpactMessageEn(
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

function getImpactMessageZh(impact: ImpactPreview | null): DonationImpactMessage {
  if (!impact) {
    return {
      headline: "每一份禮物，都能創造多一種可能。",
      detail: "你的捐款將支持 Love 21 的服務項目和社群。",
    };
  }

  if (impact.mode === "flexible") {
    return {
      headline: "一份禮物，成就許多成長、連繫和發光的時刻。",
      detail: "你的捐款讓 Love 21 能靈活地把支援投放到最需要的地方。",
    };
  }

  if (impact.mode === "contribution") {
    switch (impact.copy_key) {
      case "dance":
        return {
          headline: "又一次移動、學習和發光的機會，由此開始。",
          detail: "你的捐款有助支持舞蹈訓練機會。",
        };
      case "sports":
        return {
          headline: "每一步邁向自信，都始於一個機會。",
          detail: "你的捐款有助支持有支援的體育活動。",
        };
      case "nutrition":
        return {
          headline: "美好的明天，可以由一個關懷的選擇開始。",
          detail: "你的捐款有助支持營養及飲食指導服務。",
        };
      case "family_support":
        return {
          headline: "沒有一個家庭應該獨自面對這段旅程。",
          detail: "你的捐款有助支持家庭與照顧者。",
        };
      default:
        return {
          headline: "每一份禮物，都能創造多一種可能。",
          detail: "你的捐款有助支持 Love 21 更廣泛的服務項目。",
        };
    }
  }

  const count = impact.estimated_units;
  const displayCount = count.toLocaleString("en-HK");
  switch (impact.copy_key) {
    case "dance":
      return {
        headline: `多 ${displayCount} 次移動、學習和發光的機會。`,
        detail: `你的捐款有助支持大約 ${displayCount} 節舞蹈訓練課堂。`,
      };
    case "sports":
      return {
        headline: `多 ${displayCount} 次自信邁步的機會。`,
        detail: `你的捐款有助支持大約 ${displayCount} 節體育活動。`,
      };
    case "nutrition":
      return {
        headline: `多 ${displayCount} 次建立健康習慣的機會。`,
        detail: `你的捐款有助支持大約 ${displayCount} 次營養諮詢。`,
      };
    case "family_support":
      return {
        headline: `多 ${displayCount} 次讓家庭感到被支持的機會。`,
        detail: `你的捐款有助支持大約 ${displayCount} 次家庭支援機會。`,
      };
    default:
      return {
        headline: `多 ${displayCount} 種可能，由此展開。`,
        detail: "你的捐款有助支持 Love 21 更廣泛的服務項目。",
      };
  }
}

export function getLocalizedImpactMessage(
  impact: ImpactPreview | null,
  lang: Lang,
): DonationImpactMessage {
  return lang === "en"
    ? getImpactMessageEn(impact)
    : localizeDeep(getImpactMessageZh(impact), lang);
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

import type { AllocationShare, WishlistItem } from "./types";
import { programs } from "./programs";

export const donationPrograms = [
  { value: "general", label: "Where it is most useful" },
  ...programs.map(({ slug, title }) => ({ value: slug, label: title })),
];

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

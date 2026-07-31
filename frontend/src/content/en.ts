import type { Metric, Milestone, Program } from "./types";

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

export const availabilityOptions = [
  { value: "weekday", label: "Weekdays" },
  { value: "evening", label: "Evenings" },
  { value: "weekend", label: "Weekends" },
  { value: "flexible", label: "I'm flexible" },
] as const;

export const donationPrograms = [
  { value: "general", label: "Where it is most useful" },
  ...programs.map(({ slug, title }) => ({ value: slug, label: title })),
] as const;

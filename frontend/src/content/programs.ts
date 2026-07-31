import type { Metric, Program } from "./types";

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
    outcomes: [
      { label: "Coordination", detail: "Balance, motor skills and physical confidence" },
      { label: "Teamwork", detail: "Collaboration, trust and shared goals" },
    ],
  },
  {
    slug: "community",
    title: "Community & education",
    eyebrow: "Connect",
    description:
      "Outreach, performance and volunteer programmes spark meaningful connection across Hong Kong.",
    accent: "blue",
    outcomes: [
      { label: "Belonging", detail: "Meaningful relationships and community presence" },
      { label: "Advocacy", detail: "Public understanding and inclusion" },
    ],
  },
  {
    slug: "family_support",
    title: "Family support",
    eyebrow: "Belong",
    description:
      "Families and caregivers find practical support, shared understanding and a community beside them.",
    accent: "teal",
    outcomes: [
      { label: "Resilience", detail: "Practical guidance and emotional support" },
      { label: "Connection", detail: "Peer networks and shared experience" },
    ],
  },
  {
    slug: "nutrition",
    title: "Nutrition & dietetics",
    eyebrow: "Thrive",
    description:
      "Whole-person guidance supports sustainable habits and wellbeing beyond a single activity.",
    accent: "orange",
    outcomes: [
      { label: "Wellbeing", detail: "Healthy routines and informed choices" },
      { label: "Growth", detail: "Physical development and energy" },
    ],
  },
  {
    slug: "enrichment",
    title: "Enrichment & intervention",
    eyebrow: "Grow",
    description:
      "Creative and developmental opportunities make room for interests, confidence and independence.",
    accent: "yellow",
    outcomes: [
      { label: "Creativity", detail: "Self-expression through arts and exploration" },
      { label: "Independence", detail: "Confidence to try, lead and grow" },
    ],
  },
];

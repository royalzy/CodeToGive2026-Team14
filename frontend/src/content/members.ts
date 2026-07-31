import type { Member, Milestone, Moment } from "./types";

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

export const memberProfiles: Member[] = [
  {
    slug: "crystal",
    name: "Crystal",
    bio: "Crystal found her rhythm through sports and dance. Today, she trains as a dance assistant and inspires everyone around her with her energy, confidence and willingness to try anything.",
    photo: "/images/crystal-performing.jpg",
    accent: "red",
    milestones: crystalMilestones,
  },
  {
    slug: "ka-wai",
    name: "Ka Wai",
    bio: "Ka Wai started with nutrition workshops and discovered a love for cooking. He now helps prepare healthy meals for community events and shares recipes with other families.",
    photo: "/images/community-performance.jpg",
    accent: "orange",
    milestones: [
      {
        label: "Explore",
        title: "Finding confidence in the kitchen",
        description:
          "Nutrition workshops gave Ka Wai a structured, hands-on way to learn about food and wellbeing.",
      },
      {
        label: "Share",
        title: "Cooking for the community",
        description:
          "He began contributing to community meals, sharing recipes and building pride in his work.",
      },
      {
        label: "Teach",
        title: "Leading nutrition sessions",
        description:
          "Ka Wai now co-leads introductory cooking sessions for new members and their families.",
      },
    ],
  },
  {
    slug: "mei-ling",
    name: "Mei Ling",
    bio: "Mei Ling joined community programmes shy and quiet. Through performance and outreach, she found her voice and now speaks at public events about what inclusion means to her.",
    photo: "/images/sports-session.jpg",
    accent: "blue",
    milestones: [
      {
        label: "Arrive",
        title: "A quiet beginning",
        description:
          "Mei Ling joined community sessions with hesitation, observing from the edge.",
      },
      {
        label: "Perform",
        title: "Stepping onto the stage",
        description:
          "She participated in her first community performance and discovered a love for being seen.",
      },
      {
        label: "Speak",
        title: "Finding her public voice",
        description:
          "Mei Ling now shares her story at events, helping others understand the power of belonging.",
      },
    ],
  },
];

export const moments: Moment[] = [
  { member: "Crystal", activity: "Led a dance warm-up for 20 members", date: "This week" },
  { member: "Ka Wai", activity: "Shared a new recipe at nutrition club", date: "3 days ago" },
  { member: "Mei Ling", activity: "Spoke at a community inclusion forum", date: "Last week" },
  { member: "Crystal", activity: "Completed 50th dance session", date: "2 weeks ago" },
  { member: "Ka Wai", activity: "Earned Healthy Cooking badge", date: "Last month" },
  { member: "Mei Ling", activity: "Performed at the annual showcase", date: "Last month" },
];

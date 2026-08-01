export type Accent = "red" | "yellow" | "blue" | "teal" | "orange";

export interface Metric {
  value: string;
  label: string;
  detail: string;
  accent: Accent;
}

export interface Program {
  slug:
  | "sports"
  | "community"
  | "family_support"
  | "nutrition"
  | "enrichment";
  title: string;
  eyebrow: string;
  description: string;
  accent: Accent;
  outcomes: Outcome[];
}

export interface Milestone {
  label: string;
  title: string;
  description: string;
}

export interface Outcome {
  label: string;
  detail: string;
}

export interface Member {
  slug: string;
  name: string;
  bio: string;
  photo: string;
  accent: Accent;
  milestones: Milestone[];
}

export interface Moment {
  member: string;
  activity: string;
  date: string;
}

export interface VolunteerOpportunity {
  id: string;
  title: string;
  program: Program["slug"];
  date: string;
  time: string;
  spots: number;
  role: string;
  accent: Accent;
}

export interface WishlistItem {
  id: string;
  label: string;
  program: Program["slug"];
  cost: number;
  description: string;
}

export interface AllocationShare {
  program: Program["slug"];
  percentage: number;
  funds: string;
}

export interface Level {
  name: string;
  minPoints: number;
}

export interface Badge {
  id: string;
  label: string;
  description: string;
  threshold: number;
}

export interface BookableEvent {
  id: string;
  title: string;
  program: Program["slug"];
  date: string;
  time: string;
  spots: number;
  location: string;
  ageRange: string;
  accent: Accent;
}

export interface Booking {
  id: string;
  memberSlug: string;
  eventId: string;
  status: "confirmed";
  bookedAt: string;
}

export interface FamilyAccount {
  id: string;
  name: string;
  memberSlugs: string[];
}

// ── Landing page types ─────────────────────────────────────────────────────

export interface LandingStat {
  value: string;
  label: string;
}

export interface LandingHeroImage {
  src: string;
  alt: string;
}

export interface LandingPillar {
  id: string;
  icon: string;
  title: string;
  description: string;
  image: string;
}

export interface AutismFactStat {
  label: string;
  value: string;
}

export interface AutismFact {
  title: string;
  icon: string;
  accent: Accent;
  short: string;
  detail: string;
  stats: AutismFactStat[];
  note?: string;
}

export interface DSFact {
  title: string;
  icon: string;
  accent: Accent;
  short: string;
  detail: string;
  stats: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  fact: string;
  topic: string;
}

export interface QuizResult {
  threshold: number;
  icon: string;
  title: string;
  message: string;
}

export interface ImpactStat {
  icon: string;
  value: string;
  label: string;
}

export interface MissionPillar {
  icon: string;
  title: string;
  description: string;
}

export interface LearnTopic {
  id: "autism" | "ds";
  icon: string;
  title: string;
}

export interface LandingContent {
  hero: {
    tagline: string;
    titleLine1: string;
    titleAccent: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: LandingStat[];
    images: LandingHeroImage[];
  };
  whatWeDo: {
    eyebrow: string;
    title: string;
    description: string;
    pillars: LandingPillar[];
  };
  learn: {
    eyebrow: string;
    title: string;
    description: string;
    topics: LearnTopic[];
  };
  autismSection: {
    eyebrow: string;
    title: string;
    description: string;
    mythBust: { title: string; body: string };
    facts: AutismFact[];
  };
  dsSection: {
    eyebrow: string;
    title: string;
    description: string;
    why21: { title: string; body: string };
    facts: DSFact[];
  };
  quiz: {
    eyebrow: string;
    title: string;
    description: string;
    questions: QuizQuestion[];
    results: QuizResult[];
  };
  impact: {
    eyebrow: string;
    title: string;
    stats: ImpactStat[];
    mission: {
      eyebrow: string;
      title: string;
      description: string;
      pillars: MissionPillar[];
    };
  };
  cta: {
    eyebrow: string;
    title: string;
    description: string;
    volunteer: {
      icon: string;
      title: string;
      description: string;
      roles: string[];
      cta: string;
      route: string;
    };
    donate: {
      icon: string;
      title: string;
      description: string;
      amounts: string[];
      cta: string;
      route: string;
    };
    tertiary: {
      text: string;
      label: string;
      href: string;
    };
  };
}


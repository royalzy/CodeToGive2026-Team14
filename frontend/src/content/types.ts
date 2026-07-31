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


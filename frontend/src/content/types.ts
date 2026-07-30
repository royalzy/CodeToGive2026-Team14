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
}

export interface Milestone {
  label: string;
  title: string;
  description: string;
}


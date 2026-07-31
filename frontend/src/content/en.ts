// Content barrel — re-exports all domain content modules so existing imports
// like `import { programs } from "../content/en"` keep working.

export * from "./navigation";
export * from "./programs";
export * from "./members";
export * from "./volunteering";
export * from "./donations";
export * from "./gamification-data";
export * from "./booking-data";

export type {
  Accent,
  AllocationShare,
  Badge,
  BookableEvent,
  Booking,
  FamilyAccount,
  Level,
  Member,
  Metric,
  Milestone,
  Moment,
  Outcome,
  Program,
  VolunteerOpportunity,
  WishlistItem,
} from "./types";


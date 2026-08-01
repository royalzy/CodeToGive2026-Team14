// Content barrel — re-exports all domain content modules so existing imports
// like `import { programs } from "../content/en"` keep working.

export * from "./navigation";
export * from "./programs";
export * from "./members";
export * from "./volunteering";
export { allocation, donationPrograms, wishlistItems } from "./donations";
export * from "./gamification-data";
export * from "./booking-data";
// Named rather than `export *`: only the display content belongs on `t`, so
// zh.ts has an exact list to mirror. Types and helpers are imported directly.
export {
  audienceOptions,
  needOptions,
  startOptions,
  supportPathways,
  supportQuestions,
} from "./support";
export * from "./landing";

export type {
  Accent,
  AllocationShare,
  Badge,
  BookableEvent,
  Booking,
  FamilyAccount,
  LandingContent,
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

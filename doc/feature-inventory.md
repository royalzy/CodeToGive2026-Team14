# Feature Update — `royal-test-branch`

Comprehensive inventory of everything delivered on this branch, layered on top of the backbone (FastAPI + React scaffold by Steven).

---

## New pages

| Route | Page | Purpose |
|---|---|---|
| `/help` | HelpPage | Support guidance for families and carers, plus an interactive support booking form |
| `/resources` | ResourcesPage | Educational content: neurodiversity, inclusion tips, FAQs |
| `/members` | MembersPage | Portal home listing member profiles |
| `/members/:slug` | MemberProfilePage | Individual member journey with milestones, gamification, and interactive activity logging |
| `/login` | LoginPage | Mock family sign-in (two demo accounts) |
| `/dashboard` | DashboardPage | Family dashboard: member overview, bookable sessions grid, per-member sign-up with fairness limits (max 4/week, 2/day), confirmed-bookings calendar |
| `/partners` | PartnersPage | Corporate partnership tiers (Community Partner, Programme Sponsor, Strategic Partner) |
| `/admin` | AdminPage | Static demo dashboard: traffic, volunteer sign-ups, scheduled social posts |

---

## Deepened existing pages

| Page | What was added |
|---|---|
| HomePage (`/`) | Persona cards section — five entry points for five audiences (Volunteer, Donor, Member/Family, Corporate Partner, Learn More) |
| ImpactPage (`/impact`) | Program outcome tags on each programme card, "Moments that matter" achievement feed linking to member portal |
| VolunteerPage (`/volunteer`) | Volunteer opportunity calendar grid (6 upcoming sessions with dates, spots, roles) |
| DonatePage (`/donate`) | Donation wishlist grid (6 specific items), transparent allocation bars showing where donations go per programme |
| HelpPage (`/help`) | Interactive support booking form (RHF + Zod + StatusPanel) under existing static sections |

---

## New components (Cards.tsx)

- **LevelBar** — Duolingo-style level progress with name, track, and fill animation
- **AchievementBadge** — earned/locked badge with star icon
- **MemberCard** — photo + name + level + points, links to member profile
- **OpportunityCard** — date, title, role, time, spots remaining
- **WishlistCard** — item label, description, cost, program tag
- **AllocationBar** — horizontal percentage bars per programme with funding detail
- **PersonaCard** — icon + label + description, links to target page

---

## Gamification module (`content/gamification.ts`)

Pure, unit-testable functions:
- `calculateLevel(points)` — returns current level, next level, and progress percentage
- `awardPoints(activity)` — session (+20), event (+50), share (+10), lead (+80)
- `earnedBadges(totalSessions, eventsHelped)` — filters badge list by thresholds

---

## Booking system (`content/booking.ts`)

Pure, unit-testable functions:
- `canBookMember(memberSlug, eventDate, bookings)` — enforces weekly (4) and daily (2) limits
- `addBooking(memberSlug, eventId, bookings)` — appends a confirmed booking
- `isAlreadyBooked(memberSlug, eventId, bookings)` — duplicate check

---

## Auth mock (`content/auth.tsx`, `content/authContext.ts`, `hooks/useAuth.ts`)

- `AuthProvider` — React context holding the logged-in family
- `useAuth` hook — exposes `family`, `login(familyId)`, `logout()`
- Two demo accounts: Sarah's family (Crystal & Ka Wai) and Mr. Chan's family (Mei Ling)

---

## i18n scaffold

- `LanguageProvider` + `useLanguage` hook + EN / 繁 toggle in header
- Mobile menu includes auth state and language switch
- `content/zh.ts` slot ready for Traditional Chinese translations

---

## Content layer (`content/en.ts`)

New fixture arrays: `memberProfiles`, `moments`, `opportunities`, `wishlistItems`, `allocation`, `levels`, `badges`, `personas`, `bookableEvents`, `demoFamilies`.

New types (`content/types.ts`): `Outcome`, `Member`, `Moment`, `VolunteerOpportunity`, `WishlistItem`, `AllocationShare`, `Level`, `Badge`, `BookableEvent`, `Booking`, `FamilyAccount`. Updated `Program` to include `outcomes`.

---

## Design system

- Added `--surface` token (was missing, broke card backgrounds)
- `StatusPanel` "notice" tone styled (yellow background, dark mark)
- Responsive breakpoints for `.profile-layout`, `.help-layout`, `.persona-grid`, `.header-actions`
- Mobile menu extended with auth, sign-out, and language toggle
- `.lang-toggle` constrained with `width: fit-content` (Tailwind reset was stretching it full-width)
- Navigation compacted for 7 links

---


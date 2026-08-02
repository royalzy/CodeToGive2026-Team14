# Love 21: Ability in Action

## Challenge Statement

**Context:** Love 21 Foundation empowers the Down syndrome, autistic, and neurodiverse community through sports, nutrition, and holistic support programs, offering nearly 1,000 healthy activities to support 600+ members and families each month. While their programs are deep and impactful, the current website does not convey the breadth of their work or guide supporters toward meaningful involvement. Love 21 believes that seeing ability in action, participating as a volunteer, and understanding the impact of giving are the strongest ways to build community, reduce stigma, and grow long-term support.

**Problem Statement:** How might Love 21 redesign their website to transform passive visitors into an engaged community — by celebrating ability, motivating volunteering, and making donating more meaningful?

---

## Our Narrative

Most nonprofit websites tell you what an organisation does. Love 21's website should make you *feel* why it matters.

We built a unified website that turns three separate intentions — seeing impact, giving time, and giving money — into a single, connected experience. The site does not ask visitors to care. It shows them reasons to, then makes it easy to act.

A parent lands on the homepage and sees their child's diagnosis represented with dignity, not pity. A potential volunteer discovers a role that fits their schedule and personality in 60 seconds. A donor selects a cause and immediately sees what their contribution could make possible — not in abstract percentages, but in training sessions, nutrition consultations, and moments of genuine human connection.

Every pathway on the site is designed to answer one question: **"What can I do right now?"**

---

## What We Built

### Pillar 1: Showcase Impact & Celebrate Ability

**The homepage is not a brochure. It is an invitation.**

The redesigned landing page (`/`) opens with a full-viewport hero that centres ability, not diagnosis. Below it, five programme pillars — Sports, Nutrition, Dance & Arts, Community, and Holistic Development — each expand into real outcomes: nearly 1,000 activities monthly, 600+ members supported, and the specific programmes that make it happen.

The **Learn Section** lets visitors explore Autism and Down Syndrome through fact cards that prioritise understanding over stigma. Each topic includes myth-busting content and a clear explanation of what Down syndrome and autism actually are, grounded in medical and community knowledge.

The **Impact Page** (`/impact`) goes deeper: programme outcome tags on every card, a "Moments that matter" achievement feed that links directly to member profiles, and Crystal's story — a real journey from participant to advocate — that grounds the data in humanity.

**The Member Portal** (`/members/:slug`) is the centrepiece of ability-first storytelling. Each member has a profile with a Duolingo-style gamification system: levels, points, badges, and milestones. Families can track session attendance, log activities, and see their child's growth over time. This is not a case management system. It is a celebration of what each person achieves.

### Pillar 2: Educate and Drive Volunteering

**Volunteer Launchpad** transforms "I'm interested but unsure" into "I'm ready to take the first step."

Most volunteer websites stop at an application form. We start with a 60-second role-matching journey that helps prospective volunteers discover where they fit — not by testing them, but by understanding their interests, availability, and preferred participation style.

The journey offers two clear paths:

- **Guided path:** A three-question match that recommends one role with clear reasoning — why this role fits, what you will actually do, and what you are *not* expected to do.
- **Quick path:** Browse all roles and sessions directly for visitors who already know what they want.

**Three volunteer roles** are fully defined: Dance Activity Buddy, Sports Activity Buddy, and Community Event Volunteer. Each role page includes responsibilities, boundaries, time commitment, support provided by Love 21, and an optional volunteer story video that answers the question every first-time volunteer asks: *"What will it actually feel like?"*

The **Commitment Ladder** — Observe first, Try once, Participate occasionally, Participate regularly — removes the pressure of long-term commitment. The core message: *"You are not committing forever. You are taking one first step."*

After submission, a **First-Session Plan** provides a provisional schedule, what to bring, a small first-session task, and a clear status — never implying a confirmed booking when one has not been made.

### Pillar 3: Make Donating Engaging and Meaningful

**The donor does not guess where their money goes. The site shows them.**

The **Donate Page** (`/donate`) replaces the standard form with a cause-driven experience. Donors select from five areas — Where It's Needed Most, Move & Grow, Discover a Talent, Live Healthier, Support a Family — then choose an amount.

The **Impact Card** updates in real time. A HK$600 donation to Dance shows:

> *Four more chances to move, learn, and shine.*
> *Your donation could help support approximately four dance training sessions.*

A smaller donation shows contribution copy, never "0 sessions." A flexible donation to "Where Needed Most" avoids false precision entirely.

The backend recalculates every impact server-side. The frontend never determines the final result — it displays what the API returns, ensuring accuracy and preventing manipulation.

After submission, the **Thank-you Page** uses backend-confirmed impact data and offers a single transition: "Stay part of the journey" — connecting the donor to the Impact page where they can see the broader picture.

The **Community Page** builds social proof through a supporter mosaic, a donor wall with personal messages, and a CEO thank-you. The emphasis is on people, not amounts: *"Already 1,284 supporters and 10 organisations have joined. Every number represents someone who believes this is worth doing."*

---

## Technical Architecture

### Stack

- **Frontend:** Vite, React, TypeScript, React Router, Tailwind CSS
- **Backend:** FastAPI, Pydantic, Python 3.12
- **Database:** SQLite (donor profiles, donations, bookings)
- **Testing:** Vitest, Testing Library, pytest, Playwright, axe
- **i18n:** English / Traditional Chinese

### Key Design Decisions

| Decision | Rationale |
| --- | --- |
| Content-driven pages | All copy lives in `content/` modules, not embedded in components. This lets content editors review and adjust language without touching logic, and simplifies Chinese localisation. |
| Backend-calculated impact | The donation impact is recalculated server-side on every submission. The frontend previews but never determines the final result. |
| No false precision | Contribution copy avoids "0 sessions." Flexible donations avoid specific unit counts. Matching uses labels like "Strong fit," not "93.7% match." |
| Simulation-first | No payment processing. No personal data persisted beyond non-essential fields. Every submission is clearly labelled as a prototype demonstration. |
| Accessibility | axe checks run across every route. Semantic HTML. Keyboard navigation. Colour contrast validated. |

### File Structure (Key Modules)

```
frontend/src/
├── pages/           # 15+ page components
├── components/
│   ├── cards/       # ImpactCards, MemberCards, EngagementCards
│   └── donate/      # CauseSelector, AmountSelector, ImpactCard, etc.
├── content/         # Domain-split content (landing, volunteer, donations, etc.)
├── lib/             # Matching algorithms, analytics, booking logic
└── api/             # API client with timeout, abort, sequence guards

backend/app/
├── api/routes/      # donations, volunteers, bookings, social, media
├── schemas/         # Pydantic models with strict validation
├── services/        # Donation impact calculation, Meta API, Cloudinary
└── data/            # Impact rules, role configurations
```

---

## What Makes This Different

1. **Ability-first framing.** Every page centres what members *can* do, not what they cannot. The member portal gamifies growth. The impact page links to real journeys.

2. **Confidence-building, not application-building.** The volunteer journey is designed to reduce uncertainty before asking for a name and email. People explore, learn, and only apply when they feel ready.

3. **Transparent, calculated impact.** Donors see exactly what their contribution supports — calculated server-side, never hardcoded. The language is specific ("four dance training sessions") without overpromising.

4. **Connected pathways.** The homepage connects to volunteer and donate. The donation thank-you connects to impact. The impact page links to member stories. Nothing is siloed.

5. **Real i18n.** Traditional Chinese support is wired in from the start, not bolted on. Content modules mirror across languages.

---

## What We Did Not Build (And Why)

| Excluded | Reason |
| --- | --- |
| Real payment processing | Out of scope for a prototype; all donations are simulated |
| Background checks | Requires legal infrastructure, not a hackathon feature |
| AI-generated training | Would need content review by Love 21 staff |
| Automatic email/WhatsApp | Requires production infrastructure and consent frameworks |
| CRM integration | Out of scope; identity is kept minimal by design |

---

## Impact Potential

If deployed, this prototype provides Love 21 with:

- A **unified web presence** that replaces fragmented pages with a single, cohesive experience
- A **volunteer pipeline** that reduces drop-off by meeting people where they are
- A **donor experience** that builds trust through transparency and emotional connection
- A **member portal** that families can use to track and celebrate growth
- A **content management workflow** through the admin social composer, with website publishing that requires no external credentials
- **Bilingual support** that makes the site accessible to Hong Kong's Chinese-speaking community

---

## Demo Data Notice

All impact estimates, programme costs, member profiles, volunteer sessions, and donation figures shown in this prototype are demonstration data. They are clearly labelled throughout the interface. Actual figures must be confirmed by Love 21 Foundation before deployment.

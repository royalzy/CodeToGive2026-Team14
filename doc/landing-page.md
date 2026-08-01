# Landing Page Improvements

The homepage (`/`) was rebuilt into a content-driven, brand-consistent landing
page. This document records what changed and why, so the work can be reviewed
and extended without surprises.

Implementation status: **Implemented on 2026-08-01.**

---

## 1. Redesigned homepage (new layout + content)

The homepage was replaced with a modular landing page driven entirely by
content in `frontend/src/content/landing.ts`. All copy lives in that file and
flows through the `t.landingContent` object, so the page logic stays separate
from the words — and the Chinese mirror (`content/zh.ts`) re-exports the same
content automatically.

### Page structure (`frontend/src/pages/HomePage.tsx`)

The page is composed of six focused sections, each rendered by its own
component:

```
HomePage
├─ Hero          — full-viewport image carousel + headline + CTAs + stats
├─ WhatWeDo      — five programme "pillars" with tabbed image detail panel
├─ Impact        — stat cards + mission statement + mission pillars
├─ LearnSection  — combined "Learn" section (Autism + Down Syndrome) with a
│                  table-of-contents switcher; fact-card tabs, detail panel,
│                  and a topic-specific banner (myth-bust or "Why 21")
├─ Quiz          — interactive 6-question knowledge quiz with results
└─ CallToAction  — volunteer / donate cards + tertiary link
```

### Combined "Learn" section (Autism + Down Syndrome)

The two learn topics were merged into one section (`LearnSection`) with a
table-of-contents switcher at the top:

- A shared intro (`c.learn`) explains the section, then two TOC buttons let
  the visitor pick **Autism** or **Down Syndrome** (styled by
  `.landing-learn-toc` / `.landing-learn-toc-btn`).
- Switching topics resets to the first fact card; the active topic's
  description, fact cards, detail panel, and topic-specific banner
  (Autism → myth-bust, DS → "Why 21") render underneath.
- The topic data (`id`, `icon`, `title`) is content-driven via
  `c.learn.topics` so new topics can be added without touching the component.

### Content model

- `frontend/src/content/landing.ts` — English copy for every section
  (hero, pillars, learn TOC, autism facts, DS facts, quiz, impact, CTA).
- `frontend/src/content/types.ts` — new `LandingContent` type plus supporting
  interfaces (`LandingStat`, `LandingPillar`, `LearnTopic`, `AutismFact`,
  `DSFact`, `QuizQuestion`, `QuizResult`, `ImpactStat`, `MissionPillar`, ...).
- `frontend/src/content/en.ts` — barrel now exports `landing.ts` and the
  `LandingContent` type.

### Interactivity

- Hero: auto-rotating background images with manual dot navigation.
- What We Do / facts: tabbed cards switch the visible detail panel.
- Learn section: TOC buttons switch between the Autism and Down Syndrome
  topics; fact cards switch the visible detail panel within each topic.
- Quiz: progress bar, per-question feedback, "Did You Know?" fact, and a
  score-based result (Champion / Growing / Getting Started).

---

## 2. Brand refresh (white + Love 21 palette)

The initial AI-generated design was dark and yellow-heavy. It was restyled to
fit the Love 21 Foundation look:

- **White background** — all landing sections moved from the dark `--ink`
  theme to a clean white surface, with a soft `#f7f9fc` used on alternating
  sections.
- **Reduced yellow** — the yellow typography was replaced with the brand
  accents: **Love 21 red** (`#e9003f`) for headings, eyebrows, highlights, and
  primary CTAs; **teal** and **blue** kept for secondary accents; **orange**
  used for the Down Syndrome topic chip.
- **Cards, borders, and shadows** — every section card, stat panel, quiz
  option, and CTA card was re-skinned onto white cards with subtle
  `rgb(12 22 38 / …)` borders and soft shadows so content reads clearly on a
  light background.
- All changes are confined to `frontend/src/styles.css` (landing block) and
  the accent map in `HomePage.tsx`; the layout and content were preserved.

---

## 3. Logo integration

The text wordmark in the shared header and footer
(`frontend/src/components/Layout.tsx`) was replaced with the official logo
image added to the repo:

- Asset: `frontend/public/images/love21_logo.png`
- The `Wordmark` component now renders `<img src="/images/love21_logo.png">`
  wrapped in a `wordmark-image` class (sized to ~2.75rem, auto width).

---

## 4. Consistency fixes

Two layout inconsistencies were corrected:

1. **Autism and Down Syndrome tabs now match — and are merged.** The DS
   section used horizontal pill tabs while the Autism section used a grid of
   fact cards. The two "learn" sections were later merged into one
   `LearnSection` (see above), so they share one visual language throughout:
   the same `.landing-fact-cards` / `.landing-fact-card` grid (icon, title,
   short description, accent-coloured active state) plus a TOC switcher.
2. **"What We Do" subtitle position.** The description ("Five pillars of
   support…") was pushed to the far right by a row layout with
   `justify-content: space-between`. The header was changed to a column layout
   so the subtitle sits directly below the title in the natural reading order.

---

## 5. Icon system (`lucide-react`)

All emoji icons were replaced with real SVG icons from **lucide-react**
(dependency added to `frontend/package.json`).

- `frontend/src/content/landing.ts` — icon fields now store Lucide icon names
  (e.g. `"Medal"`, `"Dna"`, `"Sparkles"`) instead of emoji strings.
- `frontend/src/pages/HomePage.tsx` — a small reusable `Icon` component maps a
  name to its Lucide component via an `ICON_MAP` record, with a plain-text
  fallback if a name is unknown.
- `QuizResult.emoji` was renamed to `QuizResult.icon` for consistency.

### Icon mapping

| Emoji (before) | Lucide icon (after) | Used for |
|---|---|---|
| 🏅 | `Medal` | Sport pillar / impact stat |
| 🥗 | `Apple` | Nutrition pillar / mission |
| 🎭 | `Drama` | Arts pillar |
| 🤝 | `Handshake` | Community pillar / volunteer stat |
| 🌱 | `Sprout` | Holistic pillar / quiz result |
| 🧩 | `Puzzle` | "What is Autism?" fact |
| ✨ | `Sparkles` | Sensory experience fact |
| 🌟 | `Star` | Strengths fact / quiz result |
| 💜 ❤️ | `Heart` | Support fact / donation / stat |
| 🧬 | `Dna` | "What is Down Syndrome?" fact |
| 🏥 | `Stethoscope` | Health & development fact |
| 🚀 | `Rocket` | Abilities & potential fact |
| 🗓️ | `Calendar` | Programmes stat |
| 🏆 | `Trophy` | Sports stat |
| 🌍 | `Globe` | Pillars stat |
| 🎨 | `Palette` | Arts mission pillar |
| 🙌 | `HeartHandshake` | Volunteer CTA |
| 💡 | `Lightbulb` | Quiz "Did You Know?" label |
| 🚫 | `Ban` | Myth-bust banner |

---

## Verification

- `pnpm build` — TypeScript + Vite build passes.
- `pnpm test -- --run` — 30 frontend tests pass.
- The `/` route heading expectation in `src/test/App.test.tsx` was updated to
  the new hero copy ("Every Life is …").

# Analytics Plan (Love 21 web platform)

Status: planning + incremental implementation (branch `ben-analytics`).
Goal: understand the website audience without re-engineering an analytics platform,
and without breaking the existing prototype or causing merge conflicts.

## 1. Tool decision: Umami (self-hosted, MIT license)

We adopt **Umami** as the analytics platform.

Why Umami over the alternatives:

| Criterion | Umami (chosen) | Plausible CE | Matomo |
|---|---|---|---|
| License | MIT (no copyleft) | AGPL | GPL |
| Runtime footprint | ~256MB–1GB | 3GB+ (ClickHouse) | 2GB+ (PHP/MySQL) |
| Deploy | 1 container + Postgres | Multi-service stack | PHP + MySQL, cron jobs |
| Cookieless by default | Yes | Yes | No (configurable) |
| Funnels ("exit before donating") | Built-in | Cloud-only | Yes (advanced) |
| Dashboard | Clean, beginner-friendly | Prettiest | Dense/expert |
| PII storage | None by design | None by design | Possible (needs care) |
| Heatmaps / session replay | No | No | Paid plugin (not needed) |

- Umami is the lightest, most permissive, and simplest to operate for a hackathon
  prototype, and its dashboard is usable by non-technical admins.
- It is deliberately **privacy-first**: cookieless tracking (hashed daily-rotating
  identifiers), no consent banner required, GDPR-friendly by default. This matters
  for a charity audience (families with children) — no cookie popups on the site.
- The REST API lets our FastAPI backend query metrics later for the automated
  monthly reports the admin section wants.

Rejected:
- **Plausible CE** — prettier UI and Google Search Console integration, but funnels
  are cloud-only and ClickHouse is heavy for a hackathon deploy.
- **Matomo** — full GA replacement but overkill; heatmaps/session replay are paid
  plugins; dashboard is expert-oriented.
- **PostHog** — product analytics, huge footprint (~12GB), wrong fit for a
  marketing-style site.
- **Building our own** — unnecessary; audience metrics are a solved problem.

## 2. Data model: what goes where (the PII split)

Two data stores, one principle: **personal data lives in our own backend, only
anonymized events go to Umami.**

| Data | Where it lives | Notes |
|---|---|---|
| Pageviews, referrers, devices, geo (aggregate) | Umami | Automatic via the ~2KB script; cookieless |
| Conversions: donation intent, volunteer signup, booking, questionnaire completion | Umami (custom events) | Sent server-side or client-side, **no PII** in event names/props |
| Donation intents (anonymized subset) | SQLite (existing) | Already implemented |
| Questionnaire answers with personal info (name, contact, needs) | SQLite via FastAPI (new endpoint) | System of record; never sent to Umami |
| Member profiles, gamification | SQLite (existing) | Already in the prototype |

Anonymized event props may include non-identifying context only, e.g.
`{ program: "sports", path: "adult" }` — never name, email, or contact details.

Funnel we want (Umami funnel report):
`visit site → questionnaire completed → donation intent created → (mock) donate`

## 3. Architecture / integration

```
Browser ──► Umami script (pageviews, referrers) ──► Umami (Postgres)
Browser ──► FastAPI routes (donation, volunteer, questionnaire)
FastAPI ──► Umami API /api/send  (anonymized custom events, fire-and-forget)
Admin    ──► Umami shareable dashboard (embedded in Admin page, optional)
FastAPI ──► Umami REST API      (later: monthly report automation)
```

- Umami is deployed via Docker Compose (app + Postgres), or the free Umami Cloud
  tier can be used for a quick start (1M events/month).
- Tracking snippet is served first-party (reverse proxy) so ad blockers don't
  strip it.

## 4. Implementation chunks (each independently testable + committed)

1. **Planning doc** — this file. `[committed]`
2. **Backend Umami client** — `backend/app/services/umami.py`, new config fields
   (`UMAMI_ENABLED`, `UMAMI_HOST`, `UMAMI_WEBSITE_ID`), `.env.example`, unit tests.
   No-op by default (`UMAMI_ENABLED=false`) so existing behavior/tests unchanged.
3. **Wire donation conversion event** — 2-line change in
   `backend/app/api/routes/donations.py` via FastAPI `BackgroundTasks` +
   `app/services/umami.py::track_event`.
4. **Frontend snippet + typed wrapper** — `frontend/src/analytics/umami.ts`
   (guarded by `VITE_UMAMI_HOST` / `VITE_UMAMI_WEBSITE_ID`, no-op when unset),
   one-line init in `main.tsx`, vitest tests.
5. **(planned)** Questionnaire endpoint + anonymized `questionnaire_completed`
   event; conversion events on volunteer/booking flows; admin dashboard embed.

## 5. Configuration

Backend (`.env`):

```
UMAMI_ENABLED=false
UMAMI_HOST=https://analytics.example.org
UMAMI_WEBSITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

Frontend (`VITE_` vars, Vite loads them at build time):

```
VITE_UMAMI_HOST=https://analytics.example.org
VITE_UMAMI_WEBSITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

No cookies are set by the analytics script; no consent banner is required for
the cookieless deployment. If we ever opt into cookie-based tracking, a consent
flow must be added — out of scope for the prototype.

## 6. Open questions

- Self-host vs Umami Cloud free tier (needs a decision on hosting/ops capacity).
- Questionnaire: confirm it is optional and that answers are persisted only
  locally (never to Umami).
- Whether admins want the Umami dashboard embedded inside the React Admin page
  (iframe of the shareable dashboard) or a separate tab.

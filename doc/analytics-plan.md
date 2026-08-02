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
- The shareable dashboard URL lets admins embed live analytics in the React
  Admin page without any API access. (Note: Umami Cloud's REST API is a **Pro
  plan** feature — free tier only gets the share URL + tracker. Monthly report
  automation would need Pro or a self-hosted instance.)

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
| Conversions: donation intent, volunteer signup, booking, questionnaire completion | Umami (custom events) | Sent client-side, **no PII** in event names/props |
| Donation intents + separate donor profile links | SQLite (existing) | Already implemented |
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
   `app/services/umami.py::track_event`. *(Removed in review: server-side
   duplicates of client-side events double-counted in Umami; conversion
   events are now client-only, except `questionnaire_completed`.)*
4. **Frontend snippet + typed wrapper** — `frontend/src/analytics/umami.ts`
   (guarded by `VITE_UMAMI_HOST` / `VITE_UMAMI_WEBSITE_ID`, no-op when unset),
   one-line init in `main.tsx`, vitest tests.
5. Questionnaire endpoint + anonymized `questionnaire_completed` event;
   conversion events on volunteer/booking flows; admin dashboard embed.
   **Done** — remaining planned items: frontend questionnaire form, and the
   Umami deployment (Docker Compose or Cloud).
6. **Tracking enrichment** — `frontend/src/analytics/umami.ts` auto-merges
   `lang` into every event; `trackFormStarted()` (fires `<form>_form_started`
   once); delegated `data-cta` click listener (`cta_click`); `accessibility_pref`
   event when the visitor prefers reduced motion / high contrast.

## 4b. Event inventory

| Event | When | Client / Server | Data (anonymized) |
|---|---|---|---|
| pageview | every navigation | client (script) | auto |
| `donation_intent` | donate form submitted | client | program, amount, lang |
| `volunteer_application` | volunteer form submitted | client | interests, availability, lang |
| `questionnaire_completed` | questionnaire submitted (API) | server | path |
| `donation_form_started` / `volunteer_form_started` | first focus in form | client | lang |
| `cta_click` | any element with `data-cta` clicked | client | cta, lang |
| `accessibility_pref` | on load, only when set | client | reduced_motion, high_contrast |
| `smoke_test*` | manual verification | CLI | — |

Funnel "support journey": `/` → `questionnaire_completed` → `donation_intent`.
Abandonment funnel: `donation_form_started` → `donation_intent` (drop-off = how
many start but never submit).

UTM: no code needed — the Umami script auto-parses `?utm_source/medium/
campaign` from URL params. Tag social links with `utm_source=facebook&
utm_campaign=august-drive` and filter the dashboard by UTM to see which post
brought donors.

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
VITE_UMAMI_DASHBOARD_URL=https://cloud.umami.is/share/XXXX/love-21
```

No cookies are set by the analytics script; no consent banner is required for
the cookieless deployment. If we ever opt into cookie-based tracking, a consent
flow must be added — out of scope for the prototype.

## 6. Demo runbook (Umami Cloud free tier)

### Setup (one time)

1. Sign up at https://umami.is (Cloud free tier: 1M events/month).
2. **Websites → Add website** — Name `Love 21`, Domain `localhost:5173`.
3. **Edit** the website → **Tracking code**: `Website ID` = `data-website-id`,
   `Host` = `data-host-url` origin (e.g. `https://cloud.umami.is`).
4. Backend `backend/.env`:

   ```
   UMAMI_ENABLED=true
   UMAMI_HOST=https://cloud.umami.is
   UMAMI_WEBSITE_ID=<website-id>
   ```

5. Frontend `frontend/.env.local` (gitignored, never commit):

   ```
   VITE_UMAMI_HOST=https://cloud.umami.is
   VITE_UMAMI_WEBSITE_ID=<website-id>
   ```

6. **Restart both servers** — env vars are only read at startup.

### Verify the pipeline

1. Open `http://localhost:5173` and click around → Umami dashboard **Live**
   view shows pageviews immediately.
2. Submit a donation on `/donate` → **Events** tab shows `donation_intent`
   (fired client-side from the same browser session, so it chains into
   funnels).
3. Server-side smoke test: `uv run python -c "from app.services.umami import
   track_event; print(track_event('smoke_test'))"` (run from `backend/`) →
   the event appears in **Events**.
4. Funnel: build it in Umami (see below), then in the browser walk
   `/` → `/donate` → submit → the funnel counts 1 conversion.

### Funnel ("exit before donating")

1. In Umami: website → **Funnels** → **Add funnel**.
2. Name `Support journey`, **Window** 60 minutes.
3. Steps: 1) **Viewed page** `/` · 2) **Triggered event** `questionnaire_completed`
   · 3) **Triggered event** `donation_intent`. Save and run.
4. `questionnaire_completed` stays 0 until a frontend form exists; a 2-step
   `/` → `donation_intent` funnel is the live-demo one.
5. Funnels need ordered steps **within one visitor session** — this is why
   conversion events are fired client-side (`src/analytics/umami.ts::track` in
   the form submit handlers). Pure server-side events create their own session
   and never chain.

### Admin dashboard embed

1. Umami: website → **Edit** → **Share URL** → **Add**, pick views
   (Overview, Events, Funnels), save, copy the share link.
2. `frontend/.env.local`: `VITE_UMAMI_DASHBOARD_URL=<share-link>`.
3. Restart the frontend → `http://localhost:5173/admin` shows the live
   dashboard in an iframe (no login needed by viewers).

### Troubleshooting

- **Server-side events missing from Events tab**: `/api/send` silently drops
  requests without a parseable browser **User-Agent**. Our client sends a
  Chrome UA (`BROWSER_USER_AGENT` in `backend/app/services/umami.py`); a custom
  UA string like `love21-backend/0.1` will NOT be registered.
- **Pageviews missing**: ad blockers commonly block `cloud.umami.is` — check
  the browser Network tab for `script.js` / `api/send` requests and disable
  the blocker for the demo browser.
- **Env changes not taking effect**: restart both dev servers; `uvicorn
  --reload` does not re-read `.env`, and Vite reads env at startup.
- **Hackathon fallback**: screenshot the dashboard + funnel views for the deck
  in case the venue WiFi blocks `cloud.umami.is`. The site itself degrades
  gracefully — analytics off = no errors.

## 7. Open questions

- Self-host vs Umami Cloud free tier (needs a decision on hosting/ops capacity).
- Questionnaire: confirm it is optional and that answers are persisted only
  locally (never to Umami).
- Whether admins want the Umami dashboard embedded inside the React Admin page
  (iframe of the shareable dashboard) or a separate tab.

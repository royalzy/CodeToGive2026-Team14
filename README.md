# Love 21 Hackathon Backbone

An ability-first website prototype for Love 21 Foundation. The repository is
structured for a five-person team where anyone can claim a feature, content task,
experiment, fix, or piece of infrastructure and deliver it on a short-lived branch.

## Stack

- Frontend: Vite, React, TypeScript, React Router, Tailwind CSS
- Backend: FastAPI, Pydantic, Python 3.12
- Tests: Vitest, Testing Library, pytest, Playwright, axe
- Package managers: pnpm and uv

No volunteer application data is persisted. Donor profiles, donation intents,
private pending wall previews, and bookings are stored in a local SQLite
database. Donations are clearly labelled simulations, passwords are stored as
Argon2 hashes, identity is kept separate from donation records, and payment
card information is never collected.

## Quick start

Prerequisites: Node 22, pnpm, Python 3.12, and uv.

```bash
make setup
make dev
```

`make dev` checks port 8000 and `/api/health` before starting. It stops with a
diagnostic if an old process owns the port, including the case where the port is
open but the API no longer responds.

For demos or long review sessions, use the stable backend without file reloads:

```bash
make demo
```

- Website: http://localhost:5173
- API: http://localhost:8000
- API docs: http://localhost:8000/docs

Copy the example environment files only when you need to override the defaults:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

For local development, leave `VITE_API_BASE_URL` empty. The frontend will use
the current page hostname on port 8000, keeping donor session cookies same-site
whether the site is opened through `localhost` or `127.0.0.1`.

## Useful commands

```bash
make test        # backend and frontend unit tests
make lint        # Ruff, ESLint, and TypeScript checks
make demo        # stable frontend + backend, without backend auto-reload
make api-types   # regenerate TypeScript types from FastAPI OpenAPI
make test-e2e    # run browser journeys; install Chromium once if prompted
```

## Five-person team workflow

There are no permanent module owners and no formal task-assignment process.
Anyone can choose a feature, fix, content change, experiment, or piece of
infrastructure to work on.

1. Tell the team what you plan to build so nobody starts the same work.
   Add one line to [WORKBOARD.md](WORKBOARD.md).
2. Pull the latest `main` and create a branch such as
   `feat/volunteer-calendar` or `fix/mobile-nav`.
3. Build and test the change on your own branch.
4. At the nightly meeting, each person explains or demos what they built.
5. The team discusses integration questions and merges the branches into `main`
   together, one at a time.
6. Everyone pulls the updated `main` before starting or continuing work.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the short version of the commands and
nightly routine.

The backbone already registers independent page and API route modules to reduce
conflicts. Regenerate API types whenever a Pydantic request or response model
changes.

## API contracts

`POST /api/v1/volunteer-applications`

- Accepts name, email, a reviewed role ID, an optional demo session ID, a
  first-step preference, and demo consent.
- Validates that a selected session belongs to the selected role, then discards
  the complete request without logging or persistence.
- Returns `simulation: true`, `persistence: "none"`, either
  `interest_submitted` or `pending_confirmation`, and non-personal next steps.
- Volunteer roles, demo sessions, the shared volunteer-story video, and deterministic matching
  are static frontend content so the exploration journey works without an API.

`POST /api/v1/donation-intents`

- Accepts an HKD amount, impact cause, and anonymous choice. Identified gifts
  require an active donor session and are linked to that donor profile.
- Recalculates the final impact server-side and always returns
  `simulation: true` with `persistence: "stored"`; no money moves.
- Stores cause, amount, currency, and anonymous flag in the donation record;
  donor identity remains in a separate profile table connected by a link row.

`POST /api/v1/donor-profiles` and `POST /api/v1/donor-sessions`

- Create or authenticate a donor profile and issue a 30-day HttpOnly session.
- Email and nickname are unique case-insensitively; passwords are never stored
  in plaintext.

`GET /api/v1/donor-profiles/me` and `GET /api/v1/donor-wall/me`

- Return only the authenticated donor's donation history and pending wall
  previews. Pending posts are not exposed publicly in this prototype.

`GET /api/v1/donation-impact/options`

- Returns the ordered impact causes and suggested HKD amounts.

`POST /api/v1/donation-impact/preview`

- Converts an HKD amount and cause into a counted, contribution, or flexible
  demonstration estimate based on average programme costs.

# Love 21 Hackathon Backbone

An ability-first website prototype for Love 21 Foundation. The repository is
structured for a five-person team where anyone can claim a feature, content task,
experiment, fix, or piece of infrastructure and deliver it on a short-lived branch.

## Stack

- Frontend: Vite, React, TypeScript, React Router, Tailwind CSS
- Backend: FastAPI, Pydantic, Python 3.12
- Tests: Vitest, Testing Library, pytest, Playwright, axe
- Package managers: pnpm and uv

No application form data is persisted. Donation intents and bookings are stored
in a local SQLite database: donations are clearly labelled simulations, only
the anonymized subset of an intent (program, amount, currency, anonymous flag)
is kept, and payment card information is never collected.

## Quick start

Prerequisites: Node 22, pnpm, Python 3.12, and uv.

```bash
make setup
make dev
```

- Website: http://localhost:5173
- API: http://localhost:8000
- API docs: http://localhost:8000/docs

Copy the example environment files only when you need to override the defaults:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

## Useful commands

```bash
make test        # backend and frontend unit tests
make lint        # Ruff, ESLint, and TypeScript checks
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

## Content and privacy rules

- Use ability-first language and only facts supplied or approved by Love 21.
- Do not infer diagnoses, outcomes, costs, or donation-to-service conversions.
- Do not add personal information to fixtures, logs, screenshots, or commits.
- Confirm usage rights before adding new member photography or testimonials.
- Keep the simulation notice visible anywhere a donation can be submitted.

## API contracts

`POST /api/v1/volunteer-applications`

- Accepts name, email, interests, availability, optional message, and consent.
- Returns a generated reference, submission status, and next steps.

`POST /api/v1/donation-intents`

- Accepts an HKD amount, support preference, anonymous choice, and optional contact details.
- Always returns `simulation: true`; no money moves.
- Stores only the anonymized subset (program, amount, currency, anonymous flag); donor name and email are never written.

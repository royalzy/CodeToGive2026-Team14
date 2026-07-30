# Backbone Implementation

This backbone provides a shared starting point for the Love 21 hackathon. It is
a small monorepo with a React frontend and a FastAPI backend.

## Structure

```text
.
├── frontend/
│   ├── src/
│   │   ├── api/          # API client and generated TypeScript types
│   │   ├── components/   # Shared layout, cards, and form controls
│   │   ├── content/      # English copy and content models
│   │   ├── pages/        # Home, Impact, Volunteer, and Donate pages
│   │   └── test/         # Frontend unit tests
│   └── e2e/              # Playwright user-journey tests
├── backend/
│   ├── app/
│   │   ├── api/routes/   # FastAPI route modules
│   │   ├── core/         # Configuration and CORS settings
│   │   └── schemas/      # Pydantic request and response models
│   └── tests/            # Backend API tests
├── doc/                  # Challenge material and project notes
├── Makefile              # Shared development commands
└── WORKBOARD.md          # Simple record of current work
```

## Frontend

The frontend uses Vite, React, TypeScript, React Router, Tailwind CSS, React Hook
Form, and Zod.

The registered routes are:

- `/` — homepage and overview of the three pathways
- `/impact` — programmes, metrics, and Crystal's story
- `/volunteer` — volunteer information and expression-of-interest form
- `/donate` — simulated donation journey

Shared visual components live in `frontend/src/components`. Page-specific work
should normally stay inside the matching file in `frontend/src/pages`.

Website copy is kept in `frontend/src/content/en.ts` so content can be edited
without changing page logic and another language can be added later.

## Backend

The backend uses FastAPI and Pydantic. It exposes:

- `GET /api/health`
- `POST /api/v1/volunteer-applications`
- `POST /api/v1/donation-intents`

Each feature has a separate route module and schema module. New backend features
should follow the same pattern instead of adding all logic to `app/main.py`.

The current APIs are intentionally non-persistent:

- volunteer details are validated and discarded;
- donation intentions are simulations;
- no payment information is accepted;
- no database, authentication, email, or CRM integration is included.

FastAPI is the source of truth for API contracts. Run `make api-types` after
changing a Pydantic model to regenerate `frontend/src/api/schema.d.ts`.

## Running the project

Install dependencies once:

```bash
make setup
```

Start the frontend and backend:

```bash
make dev
```

Local services:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- API documentation: `http://localhost:8000/docs`

## Checks

```bash
make lint       # Python, TypeScript, and ESLint checks
make test       # Backend and frontend unit tests
make test-e2e   # Browser journeys and accessibility checks
```

When adding a feature, keep it on its own branch, add tests relevant to the
change, and tell the team which area you are editing before you begin.

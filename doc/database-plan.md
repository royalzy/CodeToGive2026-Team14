# Database Layer — `feat/db-persistence`

# Summary

| Item | Status |
|---|---|
| Donation intents persisted (anonymized) — **first delivered** | `Done` |
| `donation_intents` table added to the simple schema in `app/db.py` | `Done` |
| Volunteer applications persistence | `Planned` |
| Events catalog + seeding (`bev-*`, `opp-*`) | `Planned` |
| Gamification (`member_progress`) persistence | `Planned` |
| Insights (`page_views`, `GET /api/v1/stats`) | `Planned` |
| Content CMS (`campaigns`, `content`) | `Planned` |

---

## Decisions (locked)

- **Persist both** volunteer applications (consent-gated) and donation intents (anonymized) — changes the old README "no data stored" contract.
- **Stack:** Python stdlib `sqlite3`, no ORM, no migration tooling. Keeps the existing backbone pattern exactly: schema in `app/db.py`, direct SQL in the route module (same as `bookings.py`). Minimal diff, PR-friendly.
- **Identifier compatibility:** member slugs (`crystal`, `ka-wai`, `mei-ling`) and event ids (`bev-1`…`bev-8`, `opp-1`…`opp-6`) match `frontend/src/content/*` exactly, so the UI needs no changes.

---

## Backend

### `app/db.py`

- One `SCHEMA` string with `CREATE TABLE IF NOT EXISTS` for `bookings` (unchanged) and the new `donation_intents`; `init_db()` runs on import as before.
- DB path overridable via `LOVE21_DB_PATH` (tests use a temp file).

Donation record shape (headline deliverable):

```sql
CREATE TABLE IF NOT EXISTS donation_intents (
    id         TEXT PRIMARY KEY,            -- DON-XXXXXXXX
    reference  TEXT NOT NULL UNIQUE,
    program    TEXT NOT NULL,
    amount     INTEGER NOT NULL,
    currency   TEXT NOT NULL DEFAULT 'HKD',
    anonymous  INTEGER NOT NULL,
    created_at TEXT NOT NULL
);
```

### `app/api/routes/donations.py`

- One `INSERT` via `get_connection()` in the existing handler — same style as `bookings.py`, no new layers.
- Stores only the anonymized subset (program, amount, currency, anonymous flag). Donor name and email are never written.

### API contract changes

| Endpoint | Before | After |
|---|---|---|
| `POST /api/v1/donation-intents` | validated and discarded, `persistence: "none"` | persisted anonymized, `persistence: "stored"`, stored `reference` returned |
| `POST /api/v1/volunteer-applications` | validated and discarded | `Planned` — persist with consent, optional `newsletter` flag |
| `POST`/`GET /api/v1/bookings` | persisted | unchanged |

Regenerate types with `make api-types` after any Pydantic change (`frontend/src/api/schema.d.ts`).

---

## Testing

- `tests/conftest.py` — unchanged (temp DB path per run).
- `tests/test_api.py` — donation intent persisted (row present, queried by reference), anonymization verified (`donor_name`/`email` never in DB), `persistence == "stored"`, existing 422 validations kept.
- Full suite green: 10 pytest, 13 vitest, ruff, ESLint, `tsc -b`.

---

## Docs

- `README.md` — donation contract now documents anonymized persistence; privacy note updated (no application data persisted, donations are simulations).
- `WORKBOARD.md` — row added for this branch.

---

## Next steps

1. **Volunteer persistence** — same pattern: table + `INSERT` in the route, plus a `newsletter` flag.
2. **Seeding** — `backend/scripts/seed.py` mirroring frontend fixtures (families, members, `bev-*`, `opp-*`) so bookings can reference events.
3. **Gamification** — `member_progress` + activity log persistence.
4. **Insights** — `page_views` + `GET /api/v1/stats` for the admin dashboard.
5. **CMS (future)** — `campaigns`, `content` (en / zh-Hant / zh-Hans rows) for non-technical staff.

---

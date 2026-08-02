# Myth-Buster Hero Plan ("Spot the Myth")

Status: planning (branch `ben-analytics`). Goal: a landing-page hero interaction
that is captivating enough to carry the whole demo narrative, is education-first
("ability, not disability"), and is backed by **verifiable, sourced** facts —
no fabrication, because a judge can Google it in seconds.

Part of the education loop (`doc/education-loop-plan.md`); the myth rounds
become the `rounds` schema in `backend/app/data/question_bank.json`.

## 1. The hook

A "spot the myth" prompt with a twist. The first iteration read as:
"2 facts, 1 myth — can you spot it?" with **all three actually myths** — a
wake-up call that stigma is so normalized you cannot even pick it out.

Refinement from research (see §3): the **stronger** twist is the reverse —
**"2 facts, 1 myth" where *none* of the three are myths** — i.e. every card
"reads like a myth" but is **true**, and all of it was unguessable. That
flips the game from "catch the fake" to "the fake is your own assumption."

Current recommended framing (still open to the previous "all three are myths"
variant — see §6):

```
2 FACTS, 1 MYTH — and actually, all of them are TRUE.

「No Olympic medallist has ever been diagnosed on the autism spectrum」
「People with Down syndrome rarely live beyond their 30s」
「An Oscar-winning actor has said his diagnosis aided his work」
   [ tap which one is the "myth" ]  →  "None of them. All verified."
```

## 2. Presentation (already decided)

Inline interactive hero component (not a popup/modal):
- No modal infrastructure exists in the codebase and an existing test asserts
  `role="dialog"` is absent.
- Inline avoids ad-like feel, keeps a11y, works offline on venue WiFi.
- One component, reading from a content array (`rounds`), reused on the hero.
- Placement decided by frontend owner (above the fold on the landing hero, or
  directly below the existing `#quiz` section).

## 3. Fact bank (from research; all must pass the Google check)

Each candidate carries `status`: `verified` (source cited), `needs-verify`
(verify number/name against primary source), or `dropped`.

| Statement | Status | Source | Notes |
|---|---|---|---|
| **Chris Morgan** — London 2012 Olympics, rowing, **bronze** (quad scull), diagnosed autism at 28. Publicly: "Autism made me successful." | `verified` | Olympedia #118026; ABC News (4/2021); AOC | **Not** Paralympics — call him Olympic medalist precisely. |
| Paralympic autistic golds are numerous: Michael Brannigan (1500m), Nicholas Bennett (100m breaststroke), Breana Clark (400m), Jordan Catchpole (swim) | `verified` | Paralympic.org, Polio; CBC, BBC | Great follow-up shot. |
| Anthony Hopkins — first openly-diagnosed-on-spectrum actor to win an Oscar (2021, The Father); disclosed diagnosis in 2017 | `verified` (with nuance) | Slate (4/2021), Collider (4/2025) | ⚠️ He later (2025) called the label "nonsense." Demo phrasing: "publicly revealed his Asperger's diagnosis in 2017." Do not claim "currently diagnosed." |
| Dan Aykroyd — the idea for Ghost Busters came from his Asperger's obsession (ghosts + law enforcement) | `verified` | UPI (2013), The Walrus (8/2025) | Clean. |
| Greta Thunberg diagnosed age 11; calls autism a "superpower" | `verified` | The Guardian (2019), Vox (2019) | Clean. |
| Down syndrome life expectancy: ~25 (1980) → 60+ today | `verified` (institutional) | CDC / NICHD consensus | Punchy, local, safe. |
| Temple Grandin: roughly half of US cattle handling designed through her humane systems | `needs-verify` | her self-statements widely echoed; find co-updated | Cite carefully (some sources say "most of North America"). |
| Savant-skill prevalence "debate": studies from 9.8% (Rimland 1978) to 71% (Rapin 1996); ~29% outstanding skill (Howlin 2009) | `verified` | Howlin 2009 (Phil Trans RSB), Meilleur 2015 | Strong *anti-savant-stereotype* claim: not a single %, the range *is* the story. |
| Anna Rose Rubright — first person with DS to degrees from Rowan University | `verified` | Forbes (5/2020) | |
| Shéri Bryna — only person with DS to hold an unmodified tertiary teacher's degree (SA) | `verified` | her verified bio (pdf) | Phrase narrowly. |
| Autistica matters: "no savant traits for the lowest-IQ group; the savant isn't about IQ" | `verified` | Howlin 2009 | Substantive counter-myth. |

**Dropped (mislabeled / unverified):** "first DS dentist" (search cases were
spinal injuries, not DS); "DS pilot" (was honorary/flight-attendant-for-a-day);
"15% vs 6% admin spend" — needs Love 21's official financials, mark
`unverified` until the foundation provides the annual report link.

## 4. Data model

Extend `backend/app/data/question_bank.json` with a top-level `rounds` array:

```json
"rounds": [
  {
    "id": "rw-001",
    "theme": "sport",
    "kick": "2 FACTS, 1 MYTH — can you spot it?",
    "twist": "all_true", // or "all_myths"
    "statements": [
      {
        "id": "st-001a",
        "text": "...",
        "is_myth": false,
        "status": "verified",
        "reveal": "...",
        "source": { "label": "...", "url": "..." }
      }
    ]
  }
]
```

- `status`: `verified` | `needs-verify` | `unverified`. UI only surfaces
  `verified` (and dev-flagged `needs-verify`) statements; `unverified` blocks a
  round from demo selection.
- Charc_ways: same validation/source/cta seam as the myth quiz data-quality
  test suite (unique ids, non-empty reveal, source present, `is_myth` +
  `twist` consistent).

## 5. Analytics tie-in (Umami)

- `hero_myth_round_started`, `hero_myth_round_revealed`, `hero_myth_round_wrong`
  events with `{round_id, code}`; hero stats:
  - Which statement people "tapped" as the myth → per-round misconception rates,
  - funnel `/` → round-reveal → quiz → volunteer/donate.
- Countries/grouping: `data-cta` on the hero CTA entries (matching the
  existing analytics pattern; see `analytics-plan.md`).

## 6. Todo / open items

1. Pick the presentation layer: inline hero component vs. augment the existing
   `#quiz` section (frontend owner to decide).
2. Lock statements: verify Hopkins' phrasing, obtain Love 21 financials or drop
   the "15%/6%" card; decide on "all_true" vs "all_myths" for rw-001.
3. Schema + bank: add `rounds` to `question_bank.json`, add DQ tests.
4. Umami events for the hero rounds.
5. Decline verify statements: keep them dev-only (never ship in the final).

## 7. Risk

- The demo is a **source-integrity moment**; a best-source game-show fact that
  fails a Google-check hurts the pitch. So `unverified` claims never shipped,
  sources displayed inline on reveal, and the round-`twist` label matches the
  data (all_true vs all_myths) exactly.
# Help Page Support Finder

The Help page opens with a three-question flow that ranks seven support
pathways and points someone at a sensible next step. It replaces three static
"Ways we can help" cards that led nowhere.

The audience is someone seeking help from Love 21 — a neurodivergent person, a
family member or carer, a professional, or somebody just trying to understand
more.

## Structure

```text
frontend/src/
├── content/
│   ├── support.ts            # questions, options, pathways, answer summary
│   └── zh.ts                 # Traditional Chinese mirror of the above
├── lib/
│   ├── supportMatching.ts    # ranking logic
│   └── supportMatching.test.ts
├── components/help/
│   ├── SupportFinder.tsx     # the stepped UI
│   └── SupportFinder.css     # scoped styles for the whole section
└── pages/HelpPage.tsx        # renders the finder above the request form
```

No backend changes.

## The three questions

| Step | Question | Answers |
| --- | --- | --- |
| 1 | Who are you looking for support for? | self, carer, professional, exploring, unspecified |
| 2 | What would help most right now? | talk, community, practical, discrimination, carer_rest, activities, unsure |
| 3 | How would you like to start? | conversation, read, group, action |

One question per screen, with a progress bar and a Back button. Focus moves to
each new step so keyboard and screen-reader users are not left behind.

`carer_rest` ("I am exhausted and need support myself") is the only
conditional option — it appears for carers, professionals and "prefer not to
say", because it reads strangely to someone asking for themselves. Everything
else is pure scoring.

## Why the first question is not "are you neurodivergent?"

Asking about *need* rather than *identity* was deliberate.

Love 21 serves Down syndrome, autistic and neurodiverse communities, and those
communities have opposing language conventions — the autistic community
broadly prefers identity-first ("autistic person"), the Down syndrome
community broadly prefers person-first ("person with Down syndrome"). A single
self-identification checkbox cannot satisfy both, and getting it wrong reads
as careless to exactly the people being served.

It also excludes anyone undiagnosed, questioning, or waiting on assessment,
which is a large share of people seeking help. "Who are you looking for
support for?" routes just as accurately without asking anyone to self-diagnose.

"Prefer not to say" is always offered, and nothing is ever gated on the
answer — it changes what is suggested first, never what is available.

## Scoring

Each pathway is tagged with the answers it suits, then scored:

| Match | Points |
| --- | ---: |
| `need` | +45 |
| `start` | +30 |
| `audience` | +25 |
| audience **mismatch** | −20 |

Ties break on **specificity** (fewest total tags wins), then catalogue order.

Two rules exist because live testing caught bad routing that the first
implementation produced, and both have regression tests:

- **Specificity tie-break.** An exhausted carer scored "Book a support
  conversation" and "Support for you, not only for them" at 100 each, and
  catalogue order handed it to the generic one. A targeted pathway should beat
  a generalist that merely shares a tag.
- **Audience mismatch penalty.** A mismatch used to score zero rather than
  negative, so "Work with Love 21" — aimed at partner organisations — floated
  into an exhausted carer's alternatives on the `conversation` tag alone.

Nothing scores the person. The number measures how well a pathway fits, never
how badly someone is doing.

## What the results show

The top pathway with its call to action, plus the next two as alternatives.
All seven are always ranked and returned; answers change the order, never the
availability, so a wrong tap never dead-ends anyone.

Pathways either link to a page (`/members`, `/impact`, `/resources`,
`/volunteer`, `/partners`) or to `#support-request`, the booking form further
down the same page.

## Answers feed the request form

On completion, the chosen labels are written into the form's "What would you
like to discuss?" box, so nobody retypes what they just said:

```text
For someone I care for. I am exhausted and need support myself. A conversation with the team.
```

- Anything already typed is **never** overwritten.
- "Prefer not to say" is dropped rather than echoed back.
- Chinese uses the ideographic full stop, not ". ".
- Answers stay in the browser. Nothing is sent unless the form is submitted.

## Languages

Questions, options and pathways are content, exported from `content/en.ts` and
mirrored in `content/zh.ts`, so the EN / 繁 toggle translates them. Values
(`carer`, `carer_rest`, …) are identical across languages, so ranking is
unaffected by the active language.

UI chrome ("Question 1 of 3", "Back", "Start again") stays English, matching
the rest of the site — "Sign in" is English in Chinese mode too.

## Notes for whoever touches this next

**Tailwind utilities lose to `styles.css`.** Those rules are unlayered, and
unlayered CSS beats Tailwind's `@layer utilities` regardless of specificity.
Anything overriding them must be written as CSS, which is what
`SupportFinder.css` is for.

**Watch for specificity ties.** `.section-heading > p:last-child` is `(0,2,1)`.
A plain `.help-finder .section-heading p` is also `(0,2,1)`, so source order
decides and `styles.css` wins. Repeat the `> p:last-child` shape to reach
`(0,3,1)`.

## Limitations

- **No crisis signposting.** A help page for this audience should state that
  Love 21 is not an emergency service and give real Hong Kong contacts. Those
  numbers must come from the NGO — they were deliberately not invented.
- **The request form still posts nowhere.** `onSubmit` sets local state; no
  API call is made.
- The rest of the Help page (hero, form labels) is not translated.
- No component tests for `SupportFinder`; the ranking logic has ten.

Demand:
Redesign the donation experience so supporters can clearly see what their contribution supports.

Implementation status: **Implemented on 2026-07-31.**

This document now describes the shipped hackathon prototype. The implementation
does not process payments, save personal information, send email, or connect to
a CRM. It stores only the non-personal donation cause, amount, currency,
anonymous flag, reference, and timestamp.

First principle Idea:
Need a system to automatically convert the donation into the expected impact.
The expression of impact should be romantic.


Design:
Overall Structure:
```
Donate Webpage
│
├─ Select a support area
├─ Select a donation amount
├─ Request an Impact Preview
├─ Display the Impact Card
├─ Enter donor information
└─ Submit the Donation Intent
          │
          ▼
FastAPI Backend
│
├─ Provide available donation causes
├─ Store average programme cost configuration
├─ Calculate estimated impact
├─ Validate the donation request
└─ Return the final Donation Result
          │
          ▼
Thank-you Page
│
├─ Display the final Impact Card
└─ Continue to a separate Post-donation Engagement flow
```



Backend:
The backend is responsible for only four things:
1. Store the average costs provided by Love 21;
2. Calculate donation impact;
3. Validate the data submitted by the donor;
4. Return the final result.
Emotional messaging belongs in the frontend; the backend returns only structured facts.

## 2.1 File Structure

```
backend/app/
├── api/routes/
│   └── donations.py
├── schemas/
│   └── donation.py
├── services/
│   └── donation_impact.py
└── data/
    └── impact_rules.py
```

The existing backbone also requires each new feature to use a separate route and schema rather than placing all logic in `main.py`.

---

## 2.2 Impact Rules

The exact amounts must be confirmed by Love 21. Clearly labelled demo data may be used during the competition.

```
# backend/app/data/impact_rules.py

from dataclasses import dataclass
from typing import Literal


CauseId = Literal[
    "where_needed_most",
    "dance",
    "sports",
    "nutrition",
    "family_support",
]


@dataclass(frozen=True)
class ImpactRule:
    cause_id: CauseId
    copy_key: str
    unit_cost_hkd: int | None
    unit_key: str | None


IMPACT_RULES: dict[CauseId, ImpactRule] = {
    "where_needed_most": ImpactRule(
        cause_id="where_needed_most",
        copy_key="where_needed_most",
        unit_cost_hkd=None,
        unit_key=None,
    ),
    "dance": ImpactRule(
        cause_id="dance",
        copy_key="dance",
        unit_cost_hkd=150,  # Demo value
        unit_key="dance_training_session",
    ),
    "sports": ImpactRule(
        cause_id="sports",
        copy_key="sports",
        unit_cost_hkd=120,  # Demo value
        unit_key="supported_sports_session",
    ),
    "nutrition": ImpactRule(
        cause_id="nutrition",
        copy_key="nutrition",
        unit_cost_hkd=300,  # Demo value
        unit_key="nutrition_consultation",
    ),
    "family_support": ImpactRule(
        cause_id="family_support",
        copy_key="family_support",
        unit_cost_hkd=500,  # Demo value
        unit_key="family_support_opportunity",
    ),
}
```

`copy_key` only tells the frontend which copy set to use; it prevents the backend from constructing English sentences directly.

---

## 2.3 Three Impact Modes

The system cannot simply always calculate:

```
Donation amount ÷ unit cost
```

This is because a donation may be less than one complete unit, or the donor may not select a specific cause.

Define three result types:

```
ImpactMode = Literal[
    "counted",       # Can display an approximate number of activities
    "contribution",  # Less than one complete unit
    "flexible",      # Where needed most
]
```

### Counted

```
HK$600 ÷ HK$150 = 4

Four more chances to move, learn, and shine.
Approximately four dance training sessions.
```

### Contribution

For example, HK$100 is not enough to cover one HK$150 dance training session:

```
Another chance to move, learn, and shine begins here.

Your donation contributes towards dance training opportunities.
```

Never display:

```
0 dance sessions
```

### Flexible

The user selects `Where needed most`:

```
One gift. Many possible moments to grow, connect and shine.

Your donation gives Love 21 flexibility to respond where support is needed most.
```

Do not calculate a misleadingly specific quantity.

---

## 2.4 Pydantic Schemas

```
# backend/app/schemas/donation.py

from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator

class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class ImpactPreviewRequest(StrictModel):
    cause_id: CauseId
    amount_hkd: int = Field(ge=10, le=1_000_000)


class ImpactBase(StrictModel):
    cause_id: CauseId
    amount_hkd: int
    copy_key: str
    is_estimate: Literal[True] = True


class CountedImpact(ImpactBase):
    mode: Literal["counted"] = "counted"
    estimated_units: int = Field(gt=0)
    unit_key: str


class ContributionImpact(ImpactBase):
    mode: Literal["contribution"] = "contribution"
    estimated_units: None = None
    unit_key: str


class FlexibleImpact(ImpactBase):
    mode: Literal["flexible"] = "flexible"
    estimated_units: None = None
    unit_key: None = None


ImpactPreviewResponse = Annotated[
    CountedImpact | ContributionImpact | FlexibleImpact,
    Field(discriminator="mode"),
]


class DonationIntentRequest(StrictModel):
    cause_id: CauseId
    amount_hkd: int = Field(ge=10, le=1_000_000)
    donor_name: str | None = Field(default=None, max_length=100)
    donor_email: EmailStr | None = None
    anonymous: bool = False
    consent_to_updates: bool = False

    # The implementation requires donor_email when consent_to_updates is true.
    @model_validator(mode="after")
    def require_email_for_updates(self): ...


class DonationIntentResponse(StrictModel):
    donation_intent_id: str
    status: Literal["simulated"]
    simulation: Literal[True] = True
    persistence: Literal["stored"] = "stored"
    impact: ImpactPreviewResponse
```

Important principle:

> The frontend submits the amount and cause, but not the final `estimated_units`.

The backend must recalculate the result and must not trust values sent by the browser.

---

## 2.5 Impact Calculation Service

```
# backend/app/services/donation_impact.py

from app.data.impact_rules import IMPACT_RULES
from app.schemas.donation import (
    ImpactPreviewRequest,
    ImpactPreviewResponse,
)


def calculate_impact(
    request: ImpactPreviewRequest,
) -> ImpactPreviewResponse:
    rule = IMPACT_RULES[request.cause_id]

    if rule.unit_cost_hkd is None:
        return ImpactPreviewResponse(
            cause_id=request.cause_id,
            amount_hkd=request.amount_hkd,
            mode="flexible",
            copy_key=rule.copy_key,
            estimated_units=None,
            unit_key=None,
        )

    estimated_units = request.amount_hkd // rule.unit_cost_hkd

    if estimated_units < 1:
        return ImpactPreviewResponse(
            cause_id=request.cause_id,
            amount_hkd=request.amount_hkd,
            mode="contribution",
            copy_key=rule.copy_key,
            estimated_units=None,
            unit_key=rule.unit_key,
        )

    return ImpactPreviewResponse(
        cause_id=request.cause_id,
        amount_hkd=request.amount_hkd,
        mode="counted",
        copy_key=rule.copy_key,
        estimated_units=estimated_units,
        unit_key=rule.unit_key,
    )
```

Floor division is used here to avoid overstating the contribution.

For example:

```
HK$650 ÷ HK$150 = 4.33
```

The page displays:

> approximately four sessions

rather than five sessions.

---

## 2.6 API Endpoints

The implementation includes three endpoints.

### Get Donation Causes

```
GET /api/v1/donation-impact/options
```

Response:

```
{
  "default_cause_id": "where_needed_most",
  "preset_amounts_hkd": [200, 400, 600, 1000],
  "demo_estimates": true,
  "causes": [
    {
      "cause_id": "where_needed_most",
      "copy_key": "where_needed_most"
    },
    {
      "cause_id": "dance",
      "copy_key": "dance"
    }
  ]
}
```

### Generate an Impact Preview

```
POST /api/v1/donation-impact/preview
```

Request:

```
{
  "cause_id": "dance",
  "amount_hkd": 600
}
```

Response:

```
{
  "cause_id": "dance",
  "amount_hkd": 600,
  "mode": "counted",
  "copy_key": "dance",
  "estimated_units": 4,
  "unit_key": "dance_training_session",
  "is_estimate": true
}
```

### Submit a Donation Intent

Continue using the existing endpoint:

```
POST /api/v1/donation-intents
```

Request:

```
{
  "cause_id": "dance",
  "amount_hkd": 600,
  "donor_name": "Alex Chan",
  "donor_email": "alex@example.com",
  "anonymous": false,
  "consent_to_updates": true
}
```

The backend recalculates the impact and returns:

```
{
  "donation_intent_id": "DON-9F2A0B91",
  "status": "simulated",
  "simulation": true,
  "persistence": "stored",
  "impact": {
    "cause_id": "dance",
    "amount_hkd": 600,
    "mode": "counted",
    "copy_key": "dance",
    "estimated_units": 4,
    "unit_key": "dance_training_session",
    "is_estimate": true
  }
}
```

`donor_name` and `donor_email` are optional fields in the prototype. When
`consent_to_updates` is selected, a valid email address is required; this preference is neither stored nor used to trigger an email.

The competition version does not accept credit card or payment information. The
backend stores only the non-personal donation subset and has no payment
processing, authentication, email, or CRM integration.

---

# 3. Donate Webpage

Use a single-page flow rather than splitting it across too many pages.

```
Left: Donation flow
Right: Live Impact Card
```

On mobile, place the Impact Card below the amount selector.

## 3.1 Frontend File Structure

```
frontend/src/
├── pages/
│   └── DonatePage.tsx
├── components/donate/
│   ├── CauseSelector.tsx
│   ├── AmountSelector.tsx
│   ├── ImpactCard.tsx
│   ├── DonorDetailsForm.tsx
│   ├── DonationReview.tsx
│   └── DonationSuccess.tsx
├── api/
│   ├── client.ts
│   └── schema.d.ts
├── analytics.ts
└── content/
    └── en.ts
```

The website copy is already centralised in `frontend/src/content/en.ts`, so the emotional headlines should also be stored there to simplify organisational review and future Chinese localisation.

---

# 4. Complete Donate Webpage Flow

## Step 1: Enter the Donate Page

Page title:

> **What kind of opportunity would you like to create?**

Default selection:

> **Where it’s needed most**

The user may donate without selecting a specific cause.

Cause options:

```
Where it’s needed most
Move & Grow
Discover a Talent
Live Healthier
Support a Family
```

Internal mapping:

```
const causeIds = {
  whereNeededMost: "where_needed_most",
  moveAndGrow: "sports",
  discoverTalent: "dance",
  liveHealthier: "nutrition",
  supportFamily: "family_support",
};
```

---

## Step 2: Select an Amount

```
HK$200
HK$400
HK$600
HK$1,000
Custom amount
```

When the amount or cause changes, request:

```
POST /api/v1/donation-impact/preview
```

The frontend does not determine the final impact result; it only displays the data returned by the backend.

To avoid sending a request after every keystroke in the custom amount field, add a 250 ms debounce.

```
useEffect(() => {
  if (!causeId || amountHkd < 10) {
    return;
  }

  const timer = window.setTimeout(async () => {
    const nextPreview = await previewDonationImpact({
      cause_id: causeId,
      amount_hkd: amountHkd,
    });

    setPreview(nextPreview);
  }, 250);

  return () => window.clearTimeout(timer);
}, [causeId, amountHkd]);
```

---

## Step 3: Generate the Impact Card

The frontend uses:

```
copy_key + mode + estimated_units
```

to select prewritten copy.

```
// frontend/src/content/en.ts

export const donationImpactCopy = {
  dance: {
    counted: (count: number) => ({
      headline: `${formatCount(count)} more chances to move, learn, and shine.`,
      detail:
        `Your donation could help support approximately ` +
        `${count} dance training sessions.`,
    }),

    contribution: () => ({
      headline: "Another chance to move, learn, and shine begins here.",
      detail:
        "Your donation contributes towards dance training opportunities.",
    }),
  },

  sports: {
    counted: (count: number) => ({
      headline:
        `${formatCount(count)} more opportunities to move with confidence.`,
      detail:
        `Your donation could help support approximately ` +
        `${count} sports sessions.`,
    }),

    contribution: () => ({
      headline: "Every step towards confidence begins with an opportunity.",
      detail:
        "Your donation contributes towards supported sports activities.",
    }),
  },

  where_needed_most: {
    flexible: () => ({
      headline:
        "One gift. Many possible moments to grow, connect and shine.",
      detail:
        "Your donation gives Love 21 the flexibility to direct support " +
        "where it is needed most.",
    }),
  },
};
```

`formatCount(4)` can return `Four` to make the headline sound more natural.

```
const numberWords: Record<number, string> = {
  1: "One",
  2: "Two",
  3: "Three",
  4: "Four",
  5: "Five",
  6: "Six",
  7: "Seven",
  8: "Eight",
  9: "Nine",
  10: "Ten",
};

function formatCount(count: number): string {
  return numberWords[count] ?? String(count);
}
```

---

## Step 4: Impact Card Visual Structure

```
┌──────────────────────────────────────────┐
│ Your possible impact                     │
│                                          │
│ Four more chances to                     │
│ move, learn, and shine.                  │
│                                          │
│ ●  ●  ●  ●                               │
│                                          │
│ Your HK$600 could help support           │
│ approximately four dance training        │
│ sessions.                                │
│                                          │
│ Based on average programme costs.        │
└──────────────────────────────────────────┘
```

Always include:

1. An emotional headline;
2. A simple visual representation of units;
3. A factual explanation;
4. Estimate disclosure.

Use a consistent disclosure:

> Impact estimates are based on average programme costs. Donations support Love 21’s wider programmes and are allocated according to operational needs.

Do not phrase the card as:

> You bought four dance classes.

because a donor’s contribution may not be directly allocated to exactly four classes.

---

## Step 5: Enter Donor Details

Continue with the following fields below or to the left of the Impact Card:

```
Name
Email
Donate anonymously
Receive occasional Love 21 updates
```

`Donate anonymously` controls only public acknowledgement; it does not remove the donor’s identity. The Review page always displays
the name entered by the user. When selected, show the following below the name:

> Public acknowledgement: Anonymous

The success greeting does not display a name when the donation is anonymous or no name was provided.

Do not add a full set of engagement preferences at this stage.

Keep only one simple checkbox here:

> Keep me updated about Love 21’s impact.

More detailed preferences, such as:

- What content the donor wants to see;
- Which events the donor wants to attend;
- Whether the donor is interested in volunteering;

should be handled in a separate engagement module after the donation is completed.

---

## Step 6: Review

Display before submission:

```
Donation amount       HK$600
Support direction     Discover a Talent
Estimated impact      4 dance training opportunities
Donor                 Alex Chan
```

Primary button:

> **Continue with HK$600**

If the hackathon prototype has no real payment flow, use:

> **Confirm prototype donation**

Also make it clear that this is a demo.

---

## Step 7: Submit the Donation Intent

The frontend submits:

```
const result = await createDonationIntent({
  cause_id: causeId,
  amount_hkd: amountHkd,
  donor_name: values.name,
  donor_email: values.email,
  anonymous: values.anonymous,
  consent_to_updates: values.consentToUpdates,
});
```

Key point:

> The Success page must use `result.impact` returned by the backend rather than the preview previously cached by the frontend.

This ensures that the final result has been revalidated by the backend.

---

## Step 8: Thank-you Page

```
Thank you, Alex.

You helped create:

Four more chances
to move, learn, and shine.

HK$600
Discover a Talent
```

Display the factual explanation below:

> Your contribution could help support approximately four dance training sessions.

Then provide only one transition action:

> **Stay part of the journey**

Only after the user clicks it should the separate post-donation engagement module begin.

The handoff between the two parts is therefore:

```
type EngagementContext = {
  donationIntentId: string;
  supportedCause: string;
  consentToUpdates: boolean;
};
```

There is no need to place the entire engagement system inside the Donate Page.

---

# 5. Frontend Page State

The entire page needs only a few state fields:

```
type DonatePageState = {
  causeId: CauseId;
  amountHkd: number;

  preview: ImpactPreview | null;
  previewStatus: "idle" | "loading" | "success" | "error";

  formStep: "donation" | "details" | "review" | "success";

  donationResult: DonationIntentResponse | null;
};
```

Flow:

```
donation
→ details
→ review
→ success
```

The Impact Preview remains visible throughout the first three stages.

---

# 6. API Client

```
// frontend/src/api/client.ts

import { z } from "zod";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8000";

const API_TIMEOUT_MS = 5_000;

export async function previewDonationImpact(input: {
  cause_id: CauseId;
  amount_hkd: number;
}, signal?: AbortSignal): Promise<ImpactPreview> {
  // postJson uses API_BASE_URL and fetchWithTimeout.
  // The response is parsed by a Zod discriminated union on `mode`.
  return postJson(
    "/api/v1/donation-impact/preview",
    input,
    signal,
  ).then((result) => impactPreviewSchema.parse(result));
}
```

The existing project uses the FastAPI schema as the source of truth for the API contract and supports generating TypeScript types. The production implementation can therefore use generated types instead of maintaining duplicate handwritten types.

All GET and POST requests in the actual client have a five-second timeout. The Preview page additionally uses
an `AbortController` and an incrementing request sequence: stale requests cannot overwrite a newer selection, and an invalid amount immediately clears
the previous preview. Requests deliberately cancelled by the caller do not show an error, while genuine timeouts enter the fallback/error state.

---

# 7. Edge Cases

## Preview API Failure

Do not prevent the user from donating.

The implementation aborts an unresponsive request after five seconds so the Impact Card does not remain indefinitely on
`Calculating another possibility…`.

The Impact Card falls back to:

> **Every gift creates another possibility.**
> Your donation will support Love 21’s programmes and community.

The user can still continue.

## Custom Amount Is Too Small

Do not display zero activities.

Display the `contribution` copy.

## No Cause Selected

Default to `where_needed_most` without blocking the flow.

## Cost Data Has Not Been Confirmed by Love 21

The interface must display:

> Demonstration estimates for prototype purposes.

State this proactively during the pitch as well, so judges do not question the data’s authenticity.

---

# 8. Analytics Events

At minimum, record:

```
donate_page_viewed
donation_cause_selected
donation_amount_selected
impact_preview_displayed
donation_details_started
donation_intent_submitted
donation_success_displayed
stay_involved_clicked
```

Event parameters:

```
{
  cause_id: "dance",
  amount_bucket: "400-799",
  impact_mode: "counted"
}
```

For privacy, do not send names, email addresses, or precise personal data to GA4.

The implementation is located in `frontend/src/analytics.ts`. It pushes data only when the page already provides
`window.dataLayer`; without GA4, it safely performs a no-op. The adapter accepts only the allowlisted fields
`cause_id`, `amount_bucket`, and `impact_mode`.

---

# 9. Testing

Implementation verification on 2026-07-31:

```
Backend pytest        17 passed
Frontend Vitest       15 passed
Playwright E2E         4 passed
Frontend/backend lint  passed
Production build       passed
```

Backend tests should cover at least:

```
HK$600 + dance → 4 units + counted
HK$100 + dance → contribution
HK$600 + where needed most → flexible
Negative amount → 422
Unknown cause → 422
Recalculate impact when submitting a donation intent
```

Frontend tests should cover at least:

```
Impact Card updates after the amount changes
Copy updates after the cause changes
Where needed most does not display a specific number of activities
A small donation does not display 0 sessions
Fallback is displayed when the Preview API fails
Use the backend response after a successful submission
```

E2E flow:

```
Open /donate
→ Select Discover a Talent
→ Select HK$600
→ See Four more chances...
→ Enter donor information
→ Submit
→ See the Thank-you Impact Card
```

The existing backbone already includes frontend unit tests, backend tests, Playwright journeys, and accessibility checks, all of which can be reused directly.

---

# 10. Implemented System

## Backend

- `backend/app/data/impact_rules.py` stores frozen rules and exposes them through a read-only mapping;
- `backend/app/services/donation_impact.py` is the single impact calculation service;
- `backend/app/schemas/donation.py` uses strict models and a `mode` discriminated union;
- `backend/app/api/routes/donations.py` provides options, preview, and simulated intent endpoints;
- The intent flow always recalculates impact and never accepts units submitted by the browser;
- The response explicitly includes `status: simulated`, `simulation: true`, and
  `persistence: stored`.

## Frontend

- `DonatePage.tsx` manages the Donation → Details → Review → Success states;
- `components/donate/` contains CauseSelector, AmountSelector, ImpactCard,
  DonorDetailsForm, DonationReview, and DonationSuccess;
- If the options API fails, the same five local prototype defaults are used;
- The preview uses a 250 ms debounce, AbortController, sequence guard, and a five-second timeout;
- Success displays only the final impact from the backend intent response;
- Counted mode renders no more than eight decorative dots, preventing large donations from creating excessive DOM elements;
- “Stay part of the journey” opens the existing `/impact` page.

## Donor identity and privacy

- Name and email are both optional;
- The updates preference requires an email address, but it is neither saved nor used to send email;
- Only cause, amount, currency, anonymous flag, reference, and timestamp are persisted;
- Anonymous represents only a public acknowledgement preference;
- The Review page still displays the donor name and additionally marks the public acknowledgement as Anonymous;
- Analytics contains no name, email address, exact amount, or consent status.

## Local development reliability

Browser `fetch` has no default timeout, so all API calls use the shared
`fetchWithTimeout`. Even if a backend process occupies the port but returns no response, the page exits the loading state within
five seconds. Playwright uses separate frontend/backend ports
`5183/8010` to avoid interfering with the development environment’s `5173/8000` ports.

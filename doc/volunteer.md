Requirement:

Create a clear and welcoming path from initial interest to expressing an interest in volunteering. The journey should feel human, approachable and rewarding.

Implementation status:

The Hackathon MVP has been implemented. This document records both the current implementation boundary and the direction for a live product. Anything involving real session confirmation, staff follow-up or post-activity workflows is outside the current Demo.

The prototype helps prospective volunteers understand which role may suit them, learn what a first experience feels like through a volunteer story, and express interest in a low-commitment trial activity.

It is not a complete volunteer management system. It does not conduct background checks, automatically approve volunteers, match volunteers one-to-one with individual members, or replace training and in-person supervision from Love 21 staff.

Product hypothesis:

Many volunteer websites ask people to submit an application before helping them feel, “I am ready for this.”

We believe that people who are new to Love 21 and interested in volunteering may hesitate because they are unsure about questions such as:

- Which role suits me?
- What will happen the first time I attend?
- What if I say or do the wrong thing?
- Does applying mean making a long-term commitment?

We therefore want to test whether people are more willing to express interest when they can see clear roles and example sessions, understand role boundaries and the practical shape of a first visit, and begin with one low-commitment experience. Actual attendance can only be evaluated after the product is connected to real programme operations.

This hypothesis must be validated through user interviews, the existing application funnel and prototype testing. The product does not assume that a lack of confidence is the only, or even the main, cause of volunteer drop-off.

This product is more than a volunteer matching questionnaire.

It is a confidence-building journey that helps someone move from:

“I am interested.”

to:

“I understand the role, know what a first visit may involve, and feel ready to take the first step.”


Design:

Product name:

Volunteer Launchpad

Core proposition:

Recommendations help people begin exploring.

Volunteer stories build motivation and confidence.

Trial activities help people take a first step.


Overall structure:

```text
Volunteer landing page
│
├─ Quick path: browse roles or sessions directly
└─ Guided path: complete an approximately 60-second role match
          │
          ▼
Explore roles
│
├─ Understand responsibilities, boundaries, time and available support
├─ See one recommended role and alternative choices
└─ Optional: watch a volunteer story
          │
          ▼
Choose a first step
│
├─ Observe first
├─ Try one session
└─ Register general interest
          │
          ▼
Demo session or expression of interest
│
├─ Select a session or register interest
├─ Submit the minimum contact and selection details
└─ Receive a first-session plan with a clear status
          │
          ▼
Future participation (live product)
│
├─ Attend an activity
├─ Complete a short reflection
└─ Decide whether to participate occasionally or regularly
```


# 1. Product Positioning

## 1.1 Primary audience

The Hackathon prototype is primarily for:

> An individual volunteer who is new to Love 21 and willing to try volunteering, but is not yet sure which role suits them, what a first visit will involve, or whether they want to make a long-term commitment.

Corporate teams, volunteers offering defined professional skills, existing long-term volunteers and bulk group applications are not the prototype's primary audience. They can use the quick path to browse roles directly, while a live product can add dedicated journeys if real demand supports them.

## 1.2 Positioning and boundaries

Volunteer Launchpad should not be described as:

- A test that decides whether someone is eligible to volunteer;
- An algorithm that understands someone better than they understand themselves;
- A replacement for Love 21 staff training;
- A system that automatically approves volunteer applications.

It should be described as:

> A friendly exploration tool that helps you discover where you may fit and understand what a first volunteering experience could feel like.

The product primarily reduces four forms of uncertainty:

| User uncertainty | Product response |
| --- | --- |
| Will I fit? | Role matching and clear role descriptions |
| What will I do the first time? | A volunteer story and first-session plan |
| What if I make a mistake? | Real experience in the story and clear in-person support |
| Must I commit for the long term? | A commitment ladder and trial activities |

The first question to validate is not whether the recommendation is perfectly accurate. It is whether this preparation experience helps more suitable prospective volunteers take a real first step.


# 2. Entry Points

People should be able to enter the journey from several places on the website:

- The volunteer landing page;
- Member stories;
- Activity or programme pages;
- The Impact page;
- Community event pages;
- A post-donation participation journey.

Example entry copy on a story page:

> Growth journeys like Crystal's are made possible by people who are willing to show up and take part.

Button:

> Find where you can contribute

The volunteer landing page presents two clear paths:

1. **Guided path: help me find a suitable role** — for people who are unsure where to begin;
2. **Quick path: browse roles or available sessions directly** — for people who already have a clear interest or stronger intent to participate.

People must not be required to finish the matching questionnaire or watch the video before they can view roles, view sessions or express interest. The product should preserve their current selection and let them move freely between the two paths.


# 3. Volunteer Role Match

The role match should take approximately 60 seconds.

This stage asks only questions that help someone explore roles. It should not begin by asking for a name, phone number or email address.

## 3.1 Questions

### Area of interest

- Dance and performance;
- Sports and movement;
- Community events.

### Realistic availability

> What can you realistically offer right now?

- One activity only;
- Once a month;
- Twice a month;
- Once a week;
- I am not sure yet.

### Preferred participation style

- I enjoy joining activities directly;
- I prefer helping behind the scenes;
- I would like to observe before deciding.

### Optional confidence preference, excluded from matching

> How does a first visit feel right now?

- I feel ready to take part;
- I am interested but a little unsure;
- I would feel better coming with a friend;
- I would like to observe first.

The first three categories determine role recommendations: interest, realistic availability and participation style.

Confidence does not affect role scores. In the current MVP it is a self-expression option that does not change the result. It should affect subsequent guidance only when the product can offer a real and actionable difference in support. It must never restrict which roles someone can view or select.


# 4. Recommendation Results

The product returns one featured recommendation and up to two alternatives.

Example:

## Featured recommendation: Dance Activity Buddy

> Join members in an activity, offer encouragement and help create a friendly environment in which everyone feels welcome.

### Why this role may suit you

- You are interested in dance and movement;
- You prefer direct participation;
- You can participate about once a month;
- The role does not require teaching experience.

### What you may do

- Join the warm-up;
- Take part in the activity;
- Offer respectful and measured encouragement;
- Help prepare simple equipment;
- Follow the programme team's direction.

### What you are not expected to do

- Provide personal care;
- Handle difficult situations alone;
- Coach without staff support;
- Make decisions on behalf of a member;
- Give medical or behavioural advice.

Buttons:

- View Demo sessions;
- Watch a volunteer story;
- View the full role description;
- Explore every role.

Do not display false precision such as:

> 93.7% match

Use understandable labels instead:

- Strong fit;
- Good fit;
- Worth exploring.


# 5. Browse Every Role

Recommendations reduce the cost of choosing; they do not restrict choice.

After receiving a recommendation, people can still browse all three MVP roles:

- Dance Activity Buddy;
- Sports Activity Buddy;
- Community Event Volunteer.

Each role card should explain:

- The contribution the role makes;
- Common tasks;
- Expected time commitment;
- Whether experience is required;
- Level of interaction;
- Support provided by Love 21;
- Whether a Demo session is available;
- Paths to view sessions and watch the volunteer story.

Someone may choose a role that was not recommended.

The product must respect that choice and use the person's final selection in the rest of the journey.

Core principle:

> Recommendations help people begin exploring; people make their own decisions.


# 6. Volunteer Story Video

After the shared volunteering principles, each role page presents a 60–90 second volunteer story. Its purpose is to build motivation and realistic expectations, not to train, test or create an application gate.

The story should answer:

1. Why the volunteer first came to Love 21;
2. What they actually did during an activity;
3. What worried them before their first visit;
4. What support the Love 21 team provided;
5. What they gained in relationships, confidence or perspective;
6. What they would say to someone attending for the first time.

Suggested page copy:

> See what volunteering really feels like.
>
> Hear what a volunteer actually does, what support is available and what they take away from showing up alongside the Love 21 community.

In the Hackathon MVP, all three role pages use `frontend/public/video/volunteer-story.mp4`. The current file is an approximately 15-second placeholder and is clearly labelled as Demo media. Before a live release, it must be replaced with an authorised 60–90 second story from a real volunteer, with reviewed captions or a transcript.

The video is optional. People can view sessions, register interest or select another role without playing or finishing it.


# 7. Commitment Ladder

Volunteering should not be presented as a binary choice.

Commitment is a way for someone to express a preference, not a separate mandatory page before they can view sessions or express interest. For first-time volunteers, the product prioritises “Observe first” and “Try once.” Questions about occasional or regular participation are more appropriate after a first activity.

Possible levels are:

## Observe first

Attend an introductory or open activity before deciding whether to volunteer.

## Try once

Join one staff-supported trial activity without making a long-term commitment.

## Participate occasionally

Receive suitable one-off or monthly opportunities.

## Participate regularly

Express interest in joining a recurring programme.

For a first-time volunteer who still feels unsure, recommend:

> Begin with one supported trial activity.

Core message:

> You are not committing forever. You are taking one first step.


# 8. Demo Session Selection

After selecting a role, someone can view related sessions. A high-intent visitor who has not selected a role can also browse all upcoming sessions first and understand the role through a session.

Example:

## Saturday Dance Project

- Saturday, 10:00–12:00;
- Love 21 Centre;
- Volunteer trial session;
- No relevant experience required;
- Includes a staff briefing;
- Shows two remaining Demo places in the prototype.

Buttons:

- Try this session;
- Ask to observe;
- View other dates.

The Hackathon prototype may use activity data only when it is explicitly labelled as Demo data.


# 9. Volunteer Application

Personal details are requested only after someone selects a session or explicitly chooses to register interest.

Role matching, the volunteer story and commitment exploration are not mandatory before submission. The product may record non-personal exploration events, but cannot use them to block the quick path.

Minimum fields:

- Name;
- Email;
- Selected role;
- Selected Demo session, if any;
- First-step preference: observe, try once or register interest only;
- Demo submission consent.

The Hackathon prototype does not ask for preparation or support needs in the application form because it cannot arrange or follow up on them. In a live product, staff should ask about necessary accessibility or support arrangements only after session confirmation, through a process with a defined purpose and appropriate privacy safeguards.


# 10. First-Session Plan

After submission, do not display only:

> Application submitted.

The result should show a clear status and a first-session plan consistent with that status.

A live product must clearly distinguish “Interest submitted,” “Session pending confirmation” and “Session confirmed.” The Hackathon MVP simulates only the first two outcomes: `interest_submitted` when no session is selected and `pending_confirmation` when a Demo session is selected. Neither means that Love 21 received an application, and the Demo never produces a confirmed session.

The result page must state that the request was not saved, Love 21 did not receive the details and no place was reserved. Every schedule must be labelled as Demo or provisional so that it cannot be mistaken for a completed booking.

## Your first visit — session pending confirmation

### Role

Dance Activity Buddy

### Selected session

Saturday Dance Project

10:00–12:00

### Provisional schedule

```text
09:50  Arrive and meet the programme team
10:00  Join a short volunteer briefing
10:10  Meet members and warm up together
10:30  Take part in the main dance activity
11:50  Reflect briefly with the team
```

### What to bring

- Comfortable clothing;
- Drinking water;
- An open and respectful attitude.

### A small first-session task

> Learn two people's names, join the activity rather than watching from the edge, and ask before offering help.

### In-person support

> You do not need to handle unfamiliar situations alone. A Love 21 lead or coach will be there to support the activity.

When sessions are simulated, the session card, application action and result page must all state clearly that the request and activity are for demonstration only. Do not use language or visuals that imply a real booking unless Love 21 supplies real operational data.


# 11. Designing a Sense of Achievement

The product should create a genuine sense of progress without competitive points or leaderboards.

This can happen at three stages.

## Before applying

Guided path:

> You have explored the roles and learned about a first visit through a volunteer's story.

Quick path:

> You have found a realistic first step for yourself.

## After applying

Current Demo:

> This was a simulated submission. Your details were not saved or sent, and no session place was reserved.

A live product may say, “We have received your expression of interest,” only after the request has genuinely been delivered.

## After a first activity

> You showed up, took part and helped create a more welcoming activity.

Do not claim outcomes the product cannot verify, such as:

> You changed five people's lives today.

Celebrate actions that genuinely occurred:

- Showing up;
- Participating respectfully;
- Learning;
- Asking before helping;
- Reflecting;
- Deciding whether to return.


# 12. Post-Activity Reflection

A live product may send a short reflection after an activity:

- What surprised you?
- What did you enjoy most?
- Did you feel well prepared?
- Would you participate again?
- What support could improve your next experience?

The product could recommend different next steps based on the answers:

```text
Enjoyed direct participation
→ Recommend another related activity

Still felt nervous or underprepared
→ Offer clearer guidance or an option to attend with someone

Preferred behind-the-scenes work
→ Recommend event preparation, media or administrative roles

Cannot participate regularly
→ Offer occasional opportunities
```

This is outside the Hackathon MVP. If the longer-term direction needs to appear in a demonstration, use a static concept card rather than sending scheduled messages.


# 13. Frontend Structure

```text
frontend/src/
├── pages/
│   ├── VolunteerPage.tsx
│   ├── VolunteerMatchPage.tsx
│   ├── VolunteerRolesPage.tsx
│   ├── VolunteerRolePage.tsx
│   ├── VolunteerSessionsPage.tsx
│   ├── VolunteerApplicationPage.tsx
│   └── VolunteerConfirmedPage.tsx
├── components/volunteer/
│   ├── VolunteerStoryVideo.tsx
│   ├── VolunteerRoleCard.tsx
│   ├── VolunteerSessionCard.tsx
│   └── FirstSessionPlan.tsx
├── content/
│   └── volunteer.ts
└── lib/
    ├── volunteerMatching.ts
    └── volunteerAnalytics.ts
```

Routes:

```text
/volunteer
/volunteer/match
/volunteer/roles
/volunteer/roles/:roleId
/volunteer/sessions
/volunteer/apply
/volunteer/confirmed
```

The volunteer story is embedded in each role page. Someone can continue from a role to its sessions or go directly from `/volunteer` to `/volunteer/sessions`; the product does not impose a fixed route order. All three roles currently share one Demo video. Roles, sessions and matching rules live in reviewed static frontend configuration.


# 14. Backend Responsibilities

The backend:

1. Validates volunteer application fields;
2. Validates role IDs and Demo session IDs;
3. Checks that a selected session belongs to the selected role;
4. Returns a simulated `interest_submitted` or `pending_confirmation` status;
5. Discards the request without logging, saving or sending personal details.

Educational and emotional copy should be managed consistently and reviewed by Love 21.

Matching runs in the frontend with deterministic rules. It does not decide whether someone may volunteer.


# 15. Backend Structure

```text
backend/app/
├── api/routes/
│   └── volunteers.py
└── schemas/
    └── volunteer.py
```


# 16. Core API

## Submit an application

```http
POST /api/v1/volunteer-applications
```

Request:

```json
{
  "name": "Jamie Chan",
  "email": "jamie@example.com",
  "role_id": "dance_activity_buddy",
  "session_id": "saturday_dance_project",
  "first_step": "trial",
  "consent": true
}
```

Response:

```json
{
  "simulation": true,
  "persistence": "none",
  "status": "pending_confirmation",
  "role_id": "dance_activity_buddy",
  "session_id": "saturday_dance_project",
  "next_steps": ["...", "..."]
}
```

The response does not contain the person's name, email address or a queryable application reference. The frontend uses static role and session configuration to generate the corresponding provisional first-session plan.


# 17. Matching Logic

The role match uses a simple weighted score:

```text
Interest overlap          40%
Availability fit          35%
Participation style fit   25%
```

Every result must include reasons that someone can understand.

These weights are deterministic sorting rules for the Hackathon prototype, not evidence of validated matching accuracy. Do not display percentage matches or spend time fine-tuning the weights. Confidence about a first visit does not affect role ranking.

The algorithm helps someone explore potentially suitable roles; it does not decide whether they are permitted to volunteer.

The Hackathon implementation does not use AI or a matching API. The rules read reviewed static role configuration in the frontend. Results must be stable, explainable and allow free selection of other roles. Ties preserve the configured role order.


# 18. Data Storage

The Hackathon MVP has no database. Roles, Demo sessions and first-session plan templates are stored in static frontend configuration. The Demo video is stored under `frontend/public/video/`.

An application is sent only to the local Demo API for field and relationship validation, then immediately discarded. The result page uses the non-personal response passed through the current navigation state. Refreshing or opening the result page directly displays that the Demo result is no longer available.

Do not save:

- Member medical information;
- Member profiles;
- Unnecessary sensitive volunteer information;
- Private one-to-one member assignments;
- Background-check documents in the prototype.


# 19. Edge Cases

## Someone skips role matching

Allow them to browse every role or upcoming Demo session directly.

## Someone selects a non-recommended role

Respect the choice and update the rest of the journey accordingly.

## Someone is not ready

Offer “Observe first” or “Register interest only” rather than ending the journey. Attending with a friend is a future direction and is not part of the current application flow.

## No suitable session is available

Allow the person to register general interest for a future opportunity.

## The volunteer story fails to load

Keep a content summary beside the video explaining what the volunteer will discuss, and allow the person to continue to sessions or register interest.

## A Demo request is submitted

Do not imply that the application was approved or sent to Love 21. The current Demo should display:

> This is a simulation only. Love 21 has not received this request and no place has been reserved.


# 20. Product Success and Analytics

## 20.1 Core product hypothesis

> When prospective volunteers can quickly see a suitable role or real session, understand role boundaries and the shape of a first visit, and begin with a low-commitment experience, more suitable people will express interest and attend.

The Hackathon prototype primarily tests whether people understand and are willing to use the journey. The number of Demo submissions cannot demonstrate real-world impact.

## 20.2 Success measures

North-star metric:

> Suitable new volunteers who complete a first supported experience each month.

Core measures:

- The proportion of volunteer-page visitors who submit genuine trial interest;
- Application completion after selecting a session;
- Attendance among people with a confirmed trial;
- Repeat participation within 30 days of a first visit;
- Change in self-reported agreement with “I know what I will do on my first visit.”

Guardrail measures:

- Exit rates for the quick and guided paths;
- Application cancellation and no-show rates;
- The proportion of people who mistake “pending confirmation” for a completed booking;
- Applications Love 21 considers unsuitable or needs to rearrange.

Before a live launch, establish a baseline from the existing funnel and agree target values. Page clicks alone are not a measure of success.

## 20.3 Analytics events

Minimum events:

```text
volunteer_page_viewed
role_match_started
role_match_completed
recommended_role_viewed
all_roles_viewed
role_selected
volunteer_story_video_started
volunteer_story_video_completed
first_step_selected
trial_session_selected
volunteer_application_started
volunteer_application_submitted
first_session_plan_viewed
```

Events include only non-personal journey and status properties, such as `journey_path=quick|guided` and `application_status=interest_submitted|pending_confirmation`. This allows comparison of the two paths without assuming the longer guided journey is inherently better.

Never send a name, email address or other personal information to GA4.


# 21. Testing

Backend tests cover:

```text
Selecting a session returns pending_confirmation
Submitting without a session returns interest_submitted
Unknown role or session IDs return 422
A role and session mismatch returns 422
Missing consent or removed personal fields return 422
The response does not expose a name, email address or queryable reference
```

Frontend tests cover:

```text
Someone can skip role matching and browse every role
Someone can browse sessions from the landing page and express interest
Recommendation results explain why a role may fit
Recommendation sorting, level thresholds and tie order are stable
Every role displays the shared Demo volunteer story
Someone can continue without playing or finishing the video
Someone can select a non-recommended role
Someone can choose to observe or try once
The result page shows the selected role, session and accurate application status
A pending session is never presented as booked
```

End-to-end coverage:

```text
Guided path:
Open /volunteer
→ Complete the approximately 60-second role match
→ Receive Dance Activity Buddy as the recommendation
→ Optionally watch the volunteer story
→ Select Saturday Dance Project
→ Submit the Demo application
→ View a personalised plan with a pending-confirmation status

Quick path:
Open /volunteer
→ Browse roles or sessions directly
→ Select Saturday Dance Project
→ Submit the Demo application
→ View a personalised plan with a pending-confirmation status

Community role:
Select Community Event Volunteer
→ Register interest without a Demo session
→ View the interest_submitted Demo result

State and accessibility:
Open or refresh /volunteer/confirmed directly
→ Display “Demo result is no longer available”
→ Run axe checks across every Volunteer route
```


# 22. Hackathon MVP

The implemented MVP includes:

1. Three role-matching questions;
2. Three volunteer roles;
3. One recommendation with understandable reasons;
4. A quick path that does not require matching or video playback;
5. One optional volunteer story shared across all three role pages;
6. “Observe first” and “Try once” first-step choices;
7. Two trial sessions explicitly labelled as Demo data;
8. A short volunteer application;
9. A personalised first-session plan clearly labelled as pending confirmation.

The application collects only a name, email address, role, optional Demo session, first step and Demo consent. It does not collect a phone number, preparation needs, accessibility information or free text.

Possible future enhancements:

- Attend with a friend;
- SQLite persistence;
- A staff application management page;
- Post-activity reflection;
- Choosing occasional or regular participation after a first activity;
- Email or WhatsApp previews.

The Hackathon MVP does not need:

- A separate commitment-level page;
- A separate video detail page;
- A different video for every role;
- A complex matching algorithm or weight optimisation;
- A query flow for recovering result-page plans.


# 23. Out of Scope

The Hackathon prototype does not include:

- AI-generated volunteer training content;
- Automatic volunteer approval;
- Background checks;
- Real member-to-volunteer matching;
- Volunteer access to member profiles;
- Complex scheduling optimisation;
- Complex role-matching scores;
- Full CRM integration;
- Automatic email or WhatsApp messages;
- Points, leaderboards or competitive gamification.


# 24. Final Product Definition

Volunteer Launchpad is:

> A friendly participation journey for first-time volunteers that helps them find a suitable role, understand what a first visit may involve, and express interest in one supported experience without making a long-term commitment.

Core message:

> Most volunteer websites stop at the application.
>
> Volunteer Launchpad helps people feel prepared before applying and take one real, achievable first step.

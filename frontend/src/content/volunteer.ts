import type { Program } from "./types";
import { programs } from "./programs";

export type VolunteerRoleId =
  | "dance_activity_buddy"
  | "sports_activity_buddy"
  | "community_event_volunteer"
  | "nutrition_class_assistant"
  | "family_support_assistant"
  | "sports_class_leader"
  | "enrichment_class_leader";

export type VolunteerSessionId =
  | "saturday_dance_project"
  | "sunday_sports_session"
  | "dragon_boat_training_day"
  | "nutrition_cooking_workshop"
  | "family_support_afternoon"
  | "community_csr_volunteer_day";

export type VolunteerRoleType = "class_assistant" | "class_leader" | "event_helper";

export type VolunteerInterest = Program["slug"];
export type VolunteerAvailability =
  | "one_time"
  | "monthly"
  | "twice_monthly"
  | "weekly"
  | "unsure";
export type VolunteerParticipationStyle = "direct" | "behind_scenes" | "observe";
export type VolunteerConfidence = "ready" | "unsure" | "with_friend" | "observe";
export type VolunteerFirstStep = "observe" | "trial" | "interest_only";
export type VolunteerHeardFrom =
  | "existing_volunteer"
  | "social_media"
  | "edm"
  | "company"
  | "other";

export interface VolunteerRole {
  id: VolunteerRoleId;
  title: string;
  shortTitle: string;
  programSlug: Program["slug"];
  roleType: VolunteerRoleType;
  summary: string;
  contribution: string;
  tasks: string[];
  boundaries: string[];
  timeCommitment: string;
  experience: string;
  interactionLevel: string;
  support: string[];
  interestTags: VolunteerInterest[];
  availabilityTags: VolunteerAvailability[];
  styleTags: VolunteerParticipationStyle[];
  accent: "red" | "blue" | "yellow" | "teal" | "orange";
}

export interface VolunteerSession {
  id: VolunteerSessionId;
  roleId: VolunteerRoleId;
  title: string;
  dateLabel: string;
  timeLabel: string;
  location: string;
  demoSpots: number;
  summary: string;
  arrivalTime: string;
  schedule: { time: string; activity: string }[];
  bring: string[];
  smallTask: string;
}

export interface VolunteerMatchAnswers {
  programs: VolunteerInterest[];
  roleType?: VolunteerRoleType;
  availability: VolunteerAvailability;
  participationStyle: VolunteerParticipationStyle;
  confidence?: VolunteerConfidence;
  // Local-only context used to personalise copy. Never submitted to the API.
  aboutYou?: string;
  heardFrom?: VolunteerHeardFrom;
}

export interface VolunteerTestimonial {
  quote: string;
  name: string;
  role: string;
  org: string;
  accent: "red" | "blue" | "yellow" | "teal" | "orange";
  // When set, this testimonial is prioritised on roles within that programme.
  // Leave unset for a general testimonial shown as a fallback on every role.
  programSlug?: Program["slug"];
}

export const volunteerRoles: VolunteerRole[] = [
  {
    id: "dance_activity_buddy",
    title: "Creative Arts Class Assistant",
    shortTitle: "Creative arts assistant",
    programSlug: "enrichment",
    roleType: "class_assistant",
    summary:
      "Join members in dance and creative arts, offer respectful encouragement and help make the room welcoming.",
    contribution:
      "Your participation helps create an activity where people can move, create and enjoy being part of the group.",
    tasks: [
      "Join the warm-up and main activity",
      "Offer encouragement without pressure",
      "Help prepare simple equipment or materials",
      "Follow the coach and programme team's lead",
    ],
    boundaries: [
      "You will not provide personal care",
      "You will not lead a class without staff support",
      "You will not make choices for a member",
      "You will not give medical or behavioural advice",
    ],
    timeCommitment: "A supported two-hour trial, then monthly or more if it suits you.",
    experience: "No dance or teaching experience required.",
    interactionLevel: "High — you will take part alongside members.",
    support: [
      "A short briefing before the activity",
      "A coach or Love 21 lead present throughout",
      "A quick reflection after your first session",
    ],
    interestTags: ["enrichment"],
    availabilityTags: ["monthly", "twice_monthly", "weekly"],
    styleTags: ["direct", "observe"],
    accent: "red",
  },
  {
    id: "sports_activity_buddy",
    title: "Sports Class Assistant",
    shortTitle: "Sports assistant",
    programSlug: "sports",
    roleType: "class_assistant",
    summary:
      "Take part in an adapted sports activity — from bocce to boxing — and help everyone feel included at their own pace.",
    contribution:
      "Showing up as a teammate helps make movement social, encouraging and focused on each person's strengths.",
    tasks: [
      "Join demonstrations and team activities",
      "Help set up or put away light equipment",
      "Encourage effort without comparing people",
      "Follow safety guidance from the coach",
    ],
    boundaries: [
      "You will not assess someone's ability",
      "You will not change an activity without the coach",
      "You will not provide physical assistance without asking",
      "You will not manage an incident alone",
    ],
    timeCommitment: "A supported two-hour trial, with flexible future opportunities.",
    experience: "No coaching or sports qualification required.",
    interactionLevel: "High — expect active, shared participation.",
    support: [
      "Clear activity and safety guidance",
      "A coach present throughout",
      "Permission to pause and ask questions at any time",
    ],
    interestTags: ["sports"],
    availabilityTags: ["monthly", "twice_monthly", "weekly"],
    styleTags: ["direct", "observe"],
    accent: "blue",
  },
  {
    id: "community_event_volunteer",
    title: "Community Event Helper",
    shortTitle: "Event helper",
    programSlug: "community",
    roleType: "event_helper",
    summary:
      "Help a public event — including corporate CSR days — feel organised, friendly and easy for members, families and visitors to join.",
    contribution:
      "You help create the conditions for connection — from a warm welcome to thoughtful behind-the-scenes support.",
    tasks: [
      "Welcome people and help with directions",
      "Prepare activity or information areas",
      "Support simple registration tasks",
      "Join in when the event team invites you",
    ],
    boundaries: [
      "You will only access information needed for your task",
      "You will not speak on a member's behalf",
      "You will not photograph people without permission",
      "You will refer unfamiliar requests to the event lead",
    ],
    timeCommitment: "One-off events are welcome; no regular commitment is required.",
    experience: "No event experience required.",
    interactionLevel: "Flexible — choose welcoming, activity or set-up support.",
    support: [
      "A defined task and named event lead",
      "An event briefing before visitors arrive",
      "A team member available for questions",
    ],
    interestTags: ["community"],
    availabilityTags: ["one_time", "monthly", "unsure"],
    styleTags: ["direct", "behind_scenes", "observe"],
    accent: "yellow",
  },
  {
    id: "nutrition_class_assistant",
    title: "Nutrition Workshop Assistant",
    shortTitle: "Nutrition assistant",
    programSlug: "nutrition",
    roleType: "class_assistant",
    summary:
      "Help with food prep and guide small groups through cooking and healthy-eating workshops.",
    contribution:
      "You help turn nutrition guidance into a hands-on, sociable experience families can repeat at home.",
    tasks: [
      "Help set up and pack away simple food-prep stations",
      "Guide a small group through a recipe step by step",
      "Support the dietitian or programme lead with demonstrations",
      "Encourage participation without rushing anyone",
    ],
    boundaries: [
      "You will not give personalised dietary or medical advice",
      "You will not handle food alone without staff oversight",
      "You will not manage allergies or substitutions without staff sign-off",
      "You will refer health questions to the programme lead",
    ],
    timeCommitment: "A supported two-hour trial, then monthly or more if it suits you.",
    experience: "No nutrition or culinary qualification required.",
    interactionLevel: "High — hands-on, small-group support.",
    support: [
      "A short briefing and recipe walkthrough beforehand",
      "A dietitian or Love 21 lead present throughout",
      "A quick reflection after your first session",
    ],
    interestTags: ["nutrition"],
    availabilityTags: ["monthly", "twice_monthly", "weekly"],
    styleTags: ["direct", "observe"],
    accent: "orange",
  },
  {
    id: "family_support_assistant",
    title: "Family Support Assistant",
    shortTitle: "Family support assistant",
    programSlug: "family_support",
    roleType: "class_assistant",
    summary:
      "Welcome families and caregivers and help facilitate group conversations and activities.",
    contribution:
      "Your presence helps families feel welcomed, heard and supported alongside their children.",
    tasks: [
      "Welcome families as they arrive",
      "Help facilitate small-group conversations or activities",
      "Support light logistics such as sign-in and seating",
      "Follow the family support lead's guidance throughout",
    ],
    boundaries: [
      "You will not offer counselling or clinical advice",
      "You will not share a family's information with anyone else",
      "You will not lead a session without staff present",
      "You will refer sensitive concerns to the programme lead",
    ],
    timeCommitment: "A supported two-hour trial, then monthly or more if it suits you.",
    experience: "No counselling or facilitation experience required.",
    interactionLevel: "High — warm, conversation-based support.",
    support: [
      "A short briefing before the session",
      "A family support lead present throughout",
      "A quick reflection after your first session",
    ],
    interestTags: ["family_support"],
    availabilityTags: ["monthly", "twice_monthly", "unsure"],
    styleTags: ["direct", "behind_scenes"],
    accent: "teal",
  },
  {
    id: "sports_class_leader",
    title: "Sports Class Leader",
    shortTitle: "Sports class leader",
    programSlug: "sports",
    roleType: "class_leader",
    summary:
      "Host or lead a new sports class — such as a dragon boat or bocce group — for members to join.",
    contribution:
      "Leading a new class expands what Love 21 can offer and lets you shape an activity around your own experience.",
    tasks: [
      "Plan a simple class structure with the programme team",
      "Lead warm-ups and the main activity",
      "Adapt pace and instructions so everyone can take part",
      "Debrief with the coordinator after each session",
    ],
    boundaries: [
      "You will not run a class without a first supported trial",
      "You will not make safety calls alone in higher-risk activities",
      "You will not exclude a member without checking with staff",
      "You will not handle incidents without support",
    ],
    timeCommitment: "A short co-planning session, then a supported first class before leading independently.",
    experience: "Relevant sport, coaching or teaching experience is helpful but not required.",
    interactionLevel: "High — you would lead the group with staff backup.",
    support: [
      "Co-planning with the sports programme lead",
      "A staff member present for your first class",
      "Ongoing check-ins as you settle in",
    ],
    interestTags: ["sports"],
    availabilityTags: ["twice_monthly", "weekly"],
    styleTags: ["direct"],
    accent: "blue",
  },
  {
    id: "enrichment_class_leader",
    title: "Creative Arts Class Leader",
    shortTitle: "Creative arts class leader",
    programSlug: "enrichment",
    roleType: "class_leader",
    summary:
      "Host or lead a new creative arts, craft or music class for members to explore.",
    contribution:
      "Leading a new class brings fresh ideas and interests into the programme, straight from your own strengths.",
    tasks: [
      "Plan a simple class structure with the programme team",
      "Lead the warm-up and main creative activity",
      "Adapt materials and pace so everyone can take part",
      "Debrief with the coordinator after each session",
    ],
    boundaries: [
      "You will not run a class without a first supported trial",
      "You will not exclude a member without checking with staff",
      "You will not use materials that have not been safety-checked",
      "You will not handle incidents without support",
    ],
    timeCommitment: "A short co-planning session, then a supported first class before leading independently.",
    experience: "Relevant creative, teaching or facilitation experience is helpful but not required.",
    interactionLevel: "High — you would lead the group with staff backup.",
    support: [
      "Co-planning with the enrichment programme lead",
      "A staff member present for your first class",
      "Ongoing check-ins as you settle in",
    ],
    interestTags: ["enrichment"],
    availabilityTags: ["twice_monthly", "weekly"],
    styleTags: ["direct"],
    accent: "red",
  },
];

export const volunteerSessions: VolunteerSession[] = [
  {
    id: "saturday_dance_project",
    roleId: "dance_activity_buddy",
    title: "Saturday Dance Project",
    dateLabel: "Saturday, 15 August (demo)",
    timeLabel: "10:00–12:00",
    location: "Love 21 Centre — demo location",
    demoSpots: 2,
    summary: "A supported first session with a staff briefing and shared dance activity.",
    arrivalTime: "09:50",
    schedule: [
      { time: "09:50", activity: "Arrive and meet the programme team" },
      { time: "10:00", activity: "Join a short volunteer briefing" },
      { time: "10:10", activity: "Meet members and warm up together" },
      { time: "10:30", activity: "Take part in the main dance activity" },
      { time: "11:50", activity: "Reflect briefly with the team" },
    ],
    bring: ["Comfortable clothing", "Drinking water", "An open, respectful attitude"],
    smallTask:
      "Learn two names, join the activity rather than watching from the edge, and ask before offering help.",
  },
  {
    id: "sunday_sports_session",
    roleId: "sports_activity_buddy",
    title: "Sunday Sports Session",
    dateLabel: "Sunday, 16 August (demo)",
    timeLabel: "14:00–16:00",
    location: "Community sports venue — demo location",
    demoSpots: 3,
    summary: "Try an inclusive bocce and boxing circuit with a coach and volunteer team beside you.",
    arrivalTime: "13:50",
    schedule: [
      { time: "13:50", activity: "Arrive and meet the coach" },
      { time: "14:00", activity: "Review the activity and safety guidance" },
      { time: "14:15", activity: "Warm up with members" },
      { time: "14:30", activity: "Join the main sports activity" },
      { time: "15:50", activity: "Pack down and reflect with the team" },
    ],
    bring: ["Sports shoes", "Drinking water", "Comfortable clothing"],
    smallTask:
      "Encourage effort without comparison, give people time to respond, and ask before helping.",
  },
  {
    id: "dragon_boat_training_day",
    roleId: "sports_class_leader",
    title: "Dragon Boat Training Day",
    dateLabel: "Saturday, 23 August (demo)",
    timeLabel: "08:00–12:00",
    location: "Harbourfront paddling centre — demo location",
    demoSpots: 8,
    summary: "Join the team on the water and see what co-leading a new sports class could look like.",
    arrivalTime: "07:50",
    schedule: [
      { time: "07:50", activity: "Arrive and meet the coordinator" },
      { time: "08:00", activity: "Safety briefing and boat assignments" },
      { time: "08:30", activity: "On-water warm-up and drills" },
      { time: "09:30", activity: "Main training session" },
      { time: "11:30", activity: "Debrief and plan the next session" },
    ],
    bring: ["Quick-dry clothing", "Sun protection", "Drinking water"],
    smallTask:
      "Shadow the current lead, learn how a session is structured, and share one idea for a future drill.",
  },
  {
    id: "nutrition_cooking_workshop",
    roleId: "nutrition_class_assistant",
    title: "Nutrition Workshop Helper",
    dateLabel: "Saturday, 16 August (demo)",
    timeLabel: "11:00–13:00",
    location: "Love 21 Centre kitchen — demo location",
    demoSpots: 5,
    summary: "Assist with food prep and guide small groups through a simple, healthy recipe.",
    arrivalTime: "10:50",
    schedule: [
      { time: "10:50", activity: "Arrive and meet the dietitian" },
      { time: "11:00", activity: "Recipe walkthrough and food-safety briefing" },
      { time: "11:15", activity: "Support small groups through food prep" },
      { time: "12:30", activity: "Share and taste together" },
      { time: "12:50", activity: "Pack down and reflect with the team" },
    ],
    bring: ["Closed-toe shoes", "Hair tie if needed", "An open, patient attitude"],
    smallTask:
      "Help one small group finish their step of the recipe and ask before offering hands-on help.",
  },
  {
    id: "family_support_afternoon",
    roleId: "family_support_assistant",
    title: "Family Support Afternoon",
    dateLabel: "Thursday, 14 August (demo)",
    timeLabel: "13:00–15:00",
    location: "Love 21 Centre — demo location",
    demoSpots: 3,
    summary: "Welcome families and help facilitate group conversations in a relaxed, supportive setting.",
    arrivalTime: "12:50",
    schedule: [
      { time: "12:50", activity: "Arrive and meet the family support lead" },
      { time: "13:00", activity: "Welcome families as they arrive" },
      { time: "13:15", activity: "Support the group conversation or activity" },
      { time: "14:45", activity: "Help with light tidy-up" },
      { time: "14:50", activity: "Reflect briefly with the team" },
    ],
    bring: ["Comfortable clothing", "Drinking water", "A warm, patient attitude"],
    smallTask: "Welcome two families by name and support the conversation without leading it.",
  },
  {
    id: "community_csr_volunteer_day",
    roleId: "community_event_volunteer",
    title: "Corporate CSR Volunteer Day",
    dateLabel: "Tuesday, 19 August (demo)",
    timeLabel: "09:30–12:30",
    location: "Community sports venue — demo location",
    demoSpots: 12,
    summary:
      "Join a corporate group taking a fitness station in a circuit-training session alongside members.",
    arrivalTime: "09:20",
    schedule: [
      { time: "09:20", activity: "Arrive and meet the Love 21 team" },
      { time: "09:30", activity: "Introduction to the community and the day's activities" },
      { time: "09:50", activity: "Take a fitness station in the circuit" },
      { time: "11:30", activity: "Group activity and photos (with consent)" },
      { time: "12:15", activity: "Reflect and share takeaways as a team" },
    ],
    bring: ["Comfortable clothing", "Trainers", "An open, curious attitude"],
    smallTask:
      "Run one simple exercise station and encourage effort without comparing participants.",
  },
];

export const matchInterestOptions = programs.map((program) => ({
  value: program.slug,
  label: program.title,
})) as { value: VolunteerInterest; label: string }[];

export const matchRoleTypeOptions: { value: VolunteerRoleType; label: string }[] = [
  { value: "class_assistant", label: "Assist an existing class" },
  { value: "class_leader", label: "Host or lead a new class" },
  { value: "event_helper", label: "Support a large event" },
];

export const matchAvailabilityOptions = [
  { value: "one_time", label: "One activity for now" },
  { value: "monthly", label: "About once a month" },
  { value: "twice_monthly", label: "About twice a month" },
  { value: "weekly", label: "About once a week" },
  { value: "unsure", label: "I am not sure yet" },
] as const;

export const matchStyleOptions = [
  { value: "direct", label: "Join activities directly" },
  { value: "behind_scenes", label: "Help behind the scenes" },
  { value: "observe", label: "Observe before deciding" },
] as const;

export const confidenceOptions = [
  { value: "ready", label: "I feel ready to take part" },
  { value: "unsure", label: "I am interested but a little unsure" },
  { value: "with_friend", label: "I would feel better coming with a friend" },
  { value: "observe", label: "I would like to observe first" },
] as const;

export const heardFromOptions: { value: VolunteerHeardFrom; label: string }[] = [
  { value: "existing_volunteer", label: "I'm an existing Love 21 volunteer" },
  { value: "social_media", label: "Love 21's social media" },
  { value: "edm", label: "Love 21's newsletter (eDM)" },
  { value: "company", label: "My company" },
  { value: "other", label: "Other" },
];

export const volunteerTestimonials: VolunteerTestimonial[] = [
  {
    quote:
      "Our experience with Love 21 has been amazing. We first met with Jeff and Carmel, who explained the challenges that this community face, before assisting in a circuit training lesson where each of us took a fitness station to help the community stay active through different simple exercises. It was an incredible experience and one that will stay with us for a long time, really happy to have helped an organisation with such a great cause!",
    name: "Chaim",
    role: "Corporate CSR volunteer",
    org: "Argyll Scott",
    accent: "blue",
  },
  {
    quote:
      "Volunteering at Love 21 was an eye-opening experience for us, with some delightful members and a cool space! We loved the different activities and a chance to be involved with such an amazing community.",
    name: "Laura",
    role: "Corporate CSR volunteer",
    org: "Nakama Global",
    accent: "teal",
  },
  {
    quote:
      "I came in expecting to just help out for an afternoon, but ended up learning so much from the members themselves. The team briefed us well and I never felt unsure about what to do.",
    name: "Marcus",
    role: "Individual volunteer",
    org: "Sports programme",
    accent: "red",
    programSlug: "sports",
  },
  {
    quote:
      "As a student with no experience in this space, I was nervous going in. Love 21's coaches made it easy — clear guidance, a warm welcome, and members who were happy to have us there.",
    name: "Priya",
    role: "Student volunteer",
    org: "Creative arts programme",
    accent: "yellow",
    programSlug: "enrichment",
  },
  {
    quote:
      "What stood out most was how well-organised the day was. Every station had a clear task, and the staff were always close by if we had questions. Our whole team wants to come back.",
    name: "Wei Ling",
    role: "Corporate CSR volunteer",
    org: "Dragon boat training day",
    accent: "orange",
    programSlug: "sports",
  },
];

export function getTestimonialsForRole(role: VolunteerRole): VolunteerTestimonial[] {
  const specific = volunteerTestimonials.filter(
    (testimonial) => testimonial.programSlug === role.programSlug,
  );
  const general = volunteerTestimonials.filter((testimonial) => !testimonial.programSlug);
  const combined = [...specific, ...general];
  return combined.length ? combined : volunteerTestimonials;
}

export const commonVolunteerPrinciples = [
  "Communicate directly with the person.",
  "Ask before offering help.",
  "Respect choice and personal space.",
  "Do not assume what someone can or cannot do.",
  "Ask a Love 21 team member when you are unsure.",
  "You are part of a team and do not need to solve everything alone.",
];

export function getVolunteerRole(roleId: string | null): VolunteerRole | undefined {
  return volunteerRoles.find((role) => role.id === roleId);
}

export function getVolunteerSession(
  sessionId: string | null,
): VolunteerSession | undefined {
  return volunteerSessions.find((session) => session.id === sessionId);
}

export function getVolunteerRolesForProgram(programSlug: Program["slug"]): VolunteerRole[] {
  return volunteerRoles.filter((role) => role.programSlug === programSlug);
}

export type VolunteerRoleId =
  | "dance_activity_buddy"
  | "sports_activity_buddy"
  | "community_event_volunteer";

export type VolunteerSessionId =
  | "saturday_dance_project"
  | "sunday_sports_session";

export type VolunteerInterest = "dance" | "sports" | "community";
export type VolunteerAvailability =
  | "one_time"
  | "monthly"
  | "twice_monthly"
  | "weekly"
  | "unsure";
export type VolunteerParticipationStyle = "direct" | "behind_scenes" | "observe";
export type VolunteerConfidence = "ready" | "unsure" | "with_friend" | "observe";
export type VolunteerFirstStep = "observe" | "trial" | "interest_only";

export interface VolunteerRole {
  id: VolunteerRoleId;
  title: string;
  shortTitle: string;
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
  accent: "red" | "blue" | "yellow";
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
  interest: VolunteerInterest;
  availability: VolunteerAvailability;
  participationStyle: VolunteerParticipationStyle;
  confidence?: VolunteerConfidence;
}

export const volunteerRoles: VolunteerRole[] = [
  {
    id: "dance_activity_buddy",
    title: "Dance Activity Buddy",
    shortTitle: "Dance buddy",
    summary:
      "Join members in movement, offer respectful encouragement and help make the room welcoming.",
    contribution:
      "Your participation helps create an activity where people can move, connect and enjoy being part of the group.",
    tasks: [
      "Join the warm-up and main activity",
      "Offer encouragement without pressure",
      "Help prepare simple equipment",
      "Follow the coach and programme team's lead",
    ],
    boundaries: [
      "You will not provide personal care",
      "You will not coach without staff support",
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
    interestTags: ["dance"],
    availabilityTags: ["monthly", "twice_monthly", "weekly"],
    styleTags: ["direct", "observe"],
    accent: "red",
  },
  {
    id: "sports_activity_buddy",
    title: "Sports Activity Buddy",
    shortTitle: "Sports buddy",
    summary:
      "Take part in an adapted sports activity and help everyone feel included at their own pace.",
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
    title: "Community Event Volunteer",
    shortTitle: "Community volunteer",
    summary:
      "Help a public event feel organised, friendly and easy for members, families and visitors to join.",
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
    summary: "Try an inclusive sports activity with a coach and volunteer team beside you.",
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
];

export const matchInterestOptions = [
  { value: "dance", label: "Dance & movement" },
  { value: "sports", label: "Sports & fitness" },
  { value: "community", label: "Community events" },
] as const;

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

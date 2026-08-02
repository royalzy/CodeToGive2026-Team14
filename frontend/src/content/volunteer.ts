import type { Program } from "./types";
import { programs } from "./programs";
import type { Lang } from "./languageContextValue";

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
      "As a student with no experience in this space, I was nervous going in. Love 21's coaches made it easy: clear guidance, a warm welcome, and members who were happy to have us there.",
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

// Traditional Chinese mirrors of the English content above. This file is not
// part of the src/content/en.ts + zh.ts barrel, so translations live here
// instead, keyed by id and merged onto the English record via the
// `localizeVolunteer*` helpers. Author in Traditional Chinese only —
// Simplified is derived at render time via localizeDeep.

type VolunteerRoleCopy = Pick<
  VolunteerRole,
  | "title"
  | "shortTitle"
  | "summary"
  | "contribution"
  | "tasks"
  | "boundaries"
  | "timeCommitment"
  | "experience"
  | "interactionLevel"
  | "support"
>;

export const volunteerRoleCopyZh: Record<VolunteerRoleId, VolunteerRoleCopy> = {
  dance_activity_buddy: {
    title: "創意藝術課堂助理",
    shortTitle: "創意藝術助理",
    summary:
      "與會員一起參與舞蹈和創意藝術活動，給予尊重的鼓勵，讓活動室成為讓人感到自在的地方。",
    contribution: "你的參與，有助營造一個讓大家可以自在活動、創作，並享受共聚時光的活動。",
    tasks: [
      "參與熱身和主要活動",
      "給予鼓勵，不施加壓力",
      "協助準備簡單的器材或用品",
      "配合教練和計劃團隊的指示",
    ],
    boundaries: [
      "你不會提供個人照顧",
      "你不會在沒有職員支援下獨自帶領課堂",
      "你不會替會員作決定",
      "你不會提供醫療或行為建議",
    ],
    timeCommitment: "有支援的兩小時體驗，之後可按你的意願，每月或更頻密地參與。",
    experience: "毋須具備舞蹈或教學經驗。",
    interactionLevel: "高 — 你會與會員一同參與活動。",
    support: ["活動前的簡短講解", "全程有教練或 Love 21 團隊在場", "首次參與後的簡短回顧"],
  },
  sports_activity_buddy: {
    title: "體育課堂助理",
    shortTitle: "體育助理",
    summary:
      "參與適應性體育活動——由地滾球到拳擊——協助每位參加者以自己的步伐感受融入。",
    contribution: "以隊友身分出現，有助讓運動變得更有社交性、更具鼓勵性，並聚焦於每個人的強項。",
    tasks: [
      "參與示範和團隊活動",
      "協助搬運及收拾輕便器材",
      "鼓勵努力，不作比較",
      "遵從教練的安全指引",
    ],
    boundaries: [
      "你不會評估某人的能力",
      "你不會在沒有教練同意下更改活動",
      "你不會在未經詢問下提供身體協助",
      "你不會獨自處理突發事件",
    ],
    timeCommitment: "有支援的兩小時體驗，日後機會安排彈性。",
    experience: "毋須具備教練或體育資歷。",
    interactionLevel: "高 — 預期有主動且共同的參與。",
    support: ["清晰的活動及安全指引", "全程有教練在場", "隨時可以暫停及提問"],
  },
  community_event_volunteer: {
    title: "社區活動助手",
    shortTitle: "活動助手",
    summary:
      "協助公眾活動——包括企業義工日——讓會員、家庭和訪客感到有條理、友善且容易參與。",
    contribution: "你有助營造連繫的條件——從熱情的歡迎，到細心的幕後支援。",
    tasks: [
      "歡迎參加者並提供方向指引",
      "準備活動或資訊區域",
      "協助簡單的登記工作",
      "在活動團隊邀請時參與其中",
    ],
    boundaries: [
      "你只可查閱與工作相關的資訊",
      "你不會代表會員發言",
      "你不會在未經同意下為他人拍照",
      "遇到不熟悉的要求時，請轉交活動負責人處理",
    ],
    timeCommitment: "歡迎單次參與，毋須定期承諾。",
    experience: "毋須具備活動籌辦經驗。",
    interactionLevel: "彈性 — 可選擇迎賓、活動或場地佈置支援。",
    support: ["明確的工作範圍及指定活動負責人", "訪客到達前的活動簡報", "隨時有團隊成員解答疑問"],
  },
  nutrition_class_assistant: {
    title: "營養工作坊助理",
    shortTitle: "營養助理",
    summary: "協助食物準備，帶領小組完成烹飪和健康飲食工作坊。",
    contribution: "你有助把營養指導變成親身體驗、具社交性的活動，讓家庭能在家中延續。",
    tasks: [
      "協助設置及收拾簡單的備餐工作台",
      "逐步帶領小組完成食譜",
      "協助營養師或計劃負責人進行示範",
      "鼓勵參與，不催促任何人",
    ],
    boundaries: [
      "你不會提供個人化的飲食或醫療建議",
      "你不會在沒有職員監督下獨自處理食物",
      "你不會在未經職員批准下處理過敏或食材替代事宜",
      "健康相關問題請轉交計劃負責人",
    ],
    timeCommitment: "有支援的兩小時體驗，之後可按你的意願，每月或更頻密地參與。",
    experience: "毋須具備營養或廚藝資歷。",
    interactionLevel: "高 — 親身參與的小組支援。",
    support: ["事前的簡短講解及食譜說明", "全程有營養師或 Love 21 團隊在場", "首次參與後的簡短回顧"],
  },
  family_support_assistant: {
    title: "家庭支援助理",
    shortTitle: "家庭支援助理",
    summary: "歡迎家庭和照顧者，協助促進小組對話和活動。",
    contribution: "你的存在讓家庭在陪伴子女的同時，感受到歡迎、聆聽和支持。",
    tasks: [
      "在家庭到達時給予歡迎",
      "協助促進小組對話或活動",
      "協助簡單的後勤工作，例如登記及安排座位",
      "全程遵從家庭支援負責人的指示",
    ],
    boundaries: [
      "你不會提供輔導或臨床建議",
      "你不會向他人透露家庭的資訊",
      "你不會在沒有職員在場下獨自帶領活動",
      "敏感議題請轉交計劃負責人",
    ],
    timeCommitment: "有支援的兩小時體驗，之後可按你的意願，每月或更頻密地參與。",
    experience: "毋須具備輔導或帶領活動經驗。",
    interactionLevel: "高 — 溫暖、以對話為本的支援。",
    support: ["活動前的簡短講解", "全程有家庭支援負責人在場", "首次參與後的簡短回顧"],
  },
  sports_class_leader: {
    title: "體育課堂帶領者",
    shortTitle: "體育課堂帶領者",
    summary: "主持或帶領新的體育課堂——例如龍舟或地滾球小組——讓會員參與。",
    contribution: "帶領新課堂能擴闊 Love 21 提供的活動範疇，讓你能按自己的經驗塑造活動。",
    tasks: [
      "與計劃團隊一起策劃簡單的課堂流程",
      "帶領熱身和主要活動",
      "調整節奏和指示，讓每個人都能參與",
      "每節活動後與統籌人員進行檢討",
    ],
    boundaries: [
      "你不會在沒有先進行有支援的試教前獨自開班",
      "在較高風險的活動中，你不會獨自作出安全決定",
      "你不會在未經職員確認下拒絕會員參與",
      "你不會在沒有支援下獨自處理事故",
    ],
    timeCommitment: "先進行簡短的共同策劃，再有支援地帶領首堂課，然後才獨立帶班。",
    experience: "具備相關體育、教練或教學經驗會有幫助，但並非必要。",
    interactionLevel: "高 — 你會在職員支援下帶領小組。",
    support: ["與體育計劃負責人共同策劃", "首堂課有職員在場", "適應期間持續有人跟進"],
  },
  enrichment_class_leader: {
    title: "創意藝術課堂帶領者",
    shortTitle: "創意藝術課堂帶領者",
    summary: "主持或帶領新的創意藝術、手工藝或音樂課堂，讓會員探索。",
    contribution: "帶領新課堂能為計劃帶來新意念和興趣，直接源自你的強項。",
    tasks: [
      "與計劃團隊一起策劃簡單的課堂流程",
      "帶領熱身和主要創作活動",
      "調整物料和節奏，讓每個人都能參與",
      "每節活動後與統籌人員進行檢討",
    ],
    boundaries: [
      "你不會在沒有先進行有支援的試教前獨自開班",
      "你不會在未經職員確認下拒絕會員參與",
      "你不會使用未經安全檢查的物料",
      "你不會在沒有支援下獨自處理事故",
    ],
    timeCommitment: "先進行簡短的共同策劃，再有支援地帶領首堂課，然後才獨立帶班。",
    experience: "具備相關創作、教學或帶領活動經驗會有幫助，但並非必要。",
    interactionLevel: "高 — 你會在職員支援下帶領小組。",
    support: ["與充實計劃負責人共同策劃", "首堂課有職員在場", "適應期間持續有人跟進"],
  },
};

export function localizeVolunteerRole(role: VolunteerRole, lang: Lang): VolunteerRole {
  if (lang === "en") return role;
  return { ...role, ...volunteerRoleCopyZh[role.id] };
}

type VolunteerSessionCopy = Pick<
  VolunteerSession,
  | "title"
  | "dateLabel"
  | "location"
  | "summary"
  | "schedule"
  | "bring"
  | "smallTask"
>;

export const volunteerSessionCopyZh: Record<VolunteerSessionId, VolunteerSessionCopy> = {
  saturday_dance_project: {
    title: "週六舞蹈計劃",
    dateLabel: "8 月 15 日星期六（示範）",
    location: "Love 21 中心 — 示範地點",
    summary: "有支援的首次參與，包括職員簡介和共同舞蹈活動。",
    schedule: [
      { time: "09:50", activity: "到達並與計劃團隊見面" },
      { time: "10:00", activity: "參與簡短的義工簡介" },
      { time: "10:10", activity: "與會員見面並一起熱身" },
      { time: "10:30", activity: "參與主要舞蹈活動" },
      { time: "11:50", activity: "與團隊簡短回顧" },
    ],
    bring: ["舒適的衣物", "飲用水", "開放而尊重的態度"],
    smallTask: "記住兩個名字，積極參與而非在旁觀看，並在提供協助前先詢問。",
  },
  sunday_sports_session: {
    title: "週日體育活動",
    dateLabel: "8 月 16 日星期日（示範）",
    location: "社區體育場地 — 示範地點",
    summary: "在教練和義工團隊陪同下，體驗共融地滾球和拳擊活動。",
    schedule: [
      { time: "13:50", activity: "到達並與教練見面" },
      { time: "14:00", activity: "回顧活動和安全指引" },
      { time: "14:15", activity: "與會員一起熱身" },
      { time: "14:30", activity: "參與主要體育活動" },
      { time: "15:50", activity: "收拾並與團隊回顧" },
    ],
    bring: ["運動鞋", "飲用水", "舒適的衣物"],
    smallTask: "鼓勵努力而不作比較，給予對方回應的時間，並在協助前先詢問。",
  },
  dragon_boat_training_day: {
    title: "龍舟訓練日",
    dateLabel: "8 月 23 日星期六（示範）",
    location: "海濱划艇中心 — 示範地點",
    summary: "與團隊一同出海，體驗協助帶領新體育課堂的感覺。",
    schedule: [
      { time: "07:50", activity: "到達並與統籌人員見面" },
      { time: "08:00", activity: "安全簡介及分配龍舟" },
      { time: "08:30", activity: "水上熱身及訓練練習" },
      { time: "09:30", activity: "主要訓練環節" },
      { time: "11:30", activity: "檢討並策劃下一節活動" },
    ],
    bring: ["快乾衣物", "防曬用品", "飲用水"],
    smallTask: "跟隨現任負責人觀摩，了解活動編排方式，並分享一個未來訓練的構思。",
  },
  nutrition_cooking_workshop: {
    title: "營養工作坊助手",
    dateLabel: "8 月 16 日星期六（示範）",
    location: "Love 21 中心廚房 — 示範地點",
    summary: "協助食物準備，帶領小組完成簡單健康食譜。",
    schedule: [
      { time: "10:50", activity: "到達並與營養師見面" },
      { time: "11:00", activity: "食譜講解及食物安全簡介" },
      { time: "11:15", activity: "協助小組進行備餐" },
      { time: "12:30", activity: "一起分享和品嚐" },
      { time: "12:50", activity: "收拾並與團隊回顧" },
    ],
    bring: ["包頭鞋", "如有需要請備髮圈", "開放而有耐性的態度"],
    smallTask: "協助一個小組完成食譜步驟，並在提供實際協助前先詢問。",
  },
  family_support_afternoon: {
    title: "家庭支援下午聚會",
    dateLabel: "8 月 14 日星期四（示範）",
    location: "Love 21 中心 — 示範地點",
    summary: "在輕鬆而支持的環境中，歡迎家庭並協助促進小組對話。",
    schedule: [
      { time: "12:50", activity: "到達並與家庭支援負責人見面" },
      { time: "13:00", activity: "在家庭到達時給予歡迎" },
      { time: "13:15", activity: "協助小組對話或活動" },
      { time: "14:45", activity: "協助簡單的清理工作" },
      { time: "14:50", activity: "與團隊簡短回顧" },
    ],
    bring: ["舒適的衣物", "飲用水", "溫暖而有耐性的態度"],
    smallTask: "以姓名歡迎兩個家庭，並在不主導的情況下支援對話。",
  },
  community_csr_volunteer_day: {
    title: "企業社會責任義工日",
    dateLabel: "8 月 19 日星期二（示範）",
    location: "社區體育場地 — 示範地點",
    summary: "與企業團隊一同參與循環訓練活動，和會員一起負責其中一個運動站。",
    schedule: [
      { time: "09:20", activity: "到達並與 Love 21 團隊見面" },
      { time: "09:30", activity: "介紹社群和當天的活動" },
      { time: "09:50", activity: "負責循環訓練中的其中一個運動站" },
      { time: "11:30", activity: "小組活動及拍照（須經同意）" },
      { time: "12:15", activity: "與團隊一起回顧和分享得著" },
    ],
    bring: ["舒適的衣物", "運動鞋", "開放而好奇的態度"],
    smallTask: "負責一個簡單的運動站，鼓勵努力而不比較參加者表現。",
  },
};

export function localizeVolunteerSession(session: VolunteerSession, lang: Lang): VolunteerSession {
  if (lang === "en") return session;
  return { ...session, ...volunteerSessionCopyZh[session.id] };
}

type VolunteerTestimonialCopy = Pick<VolunteerTestimonial, "quote" | "role" | "org">;

// Keyed by the (untranslated) name so English-only fields (name, org where it
// is a company name) stay put; only quote/role/org copy is mirrored here.
export const volunteerTestimonialCopyZh: Record<string, VolunteerTestimonialCopy> = {
  Chaim: {
    quote:
      "我們在 Love 21 的體驗很棒。我們首先與 Jeff 和 Carmel 見面，他們講解了這個社群面對的挑戰，然後我們協助了一節循環訓練課，每個人負責一個運動站，幫助社群成員透過簡單的運動保持活躍。這是一次難忘的經歷，很高興能夠幫助一個有著這麼重要使命的機構！",
    role: "企業社會責任義工",
    org: "Argyll Scott",
  },
  Laura: {
    quote:
      "在 Love 21 做義工對我們來說是一次大開眼界的經歷，遇到一些可愛的會員，也有很棒的空間！我們很喜歡不同的活動，也很高興能參與這個了不起的社群。",
    role: "企業社會責任義工",
    org: "Nakama Global",
  },
  Marcus: {
    quote:
      "我原本以為只是幫忙一個下午，最後卻從會員身上學到很多。團隊給了我們清楚的簡介，我從未感到不知所措。",
    role: "個人義工",
    org: "體育計劃",
  },
  Priya: {
    quote:
      "作為一個在這方面毫無經驗的學生，我起初有點緊張。Love 21 的教練讓一切變得容易：清晰的指引、熱情的歡迎，還有樂意讓我們參與的會員。",
    role: "學生義工",
    org: "創意藝術計劃",
  },
  "Wei Ling": {
    quote:
      "最讓我印象深刻的是活動安排得非常有條理。每個站都有明確的工作，職員也一直在附近解答疑問。我們整個團隊都想再來。",
    role: "企業社會責任義工",
    org: "龍舟訓練日",
  },
};

export function localizeVolunteerTestimonial(
  testimonial: VolunteerTestimonial,
  lang: Lang,
): VolunteerTestimonial {
  if (lang === "en") return testimonial;
  const zh = volunteerTestimonialCopyZh[testimonial.name];
  return zh ? { ...testimonial, ...zh } : testimonial;
}

export const matchRoleTypeLabelZh: Record<VolunteerRoleType, string> = {
  class_assistant: "協助現有課堂",
  class_leader: "主持或帶領新課堂",
  event_helper: "支援大型活動",
};

// Content for the Help page support finder: three questions and the pathways
// they rank. Kept as content (not inline JSX) so a Traditional Chinese mirror
// can be added to zh.ts without touching the component.

export type Audience = "self" | "carer" | "professional" | "exploring" | "unspecified";

export type Need =
  | "talk"
  | "community"
  | "practical"
  | "discrimination"
  | "carer_rest"
  | "activities"
  | "unsure";

export type StartStyle = "conversation" | "read" | "group" | "action";

export interface SupportAnswers {
  audience: Audience;
  need: Need;
  start: StartStyle;
}

export interface SupportOption<TValue extends string> {
  value: TValue;
  label: string;
  hint?: string;
  /** When set, the option is only offered to these audiences. */
  audiences?: Audience[];
}

export const audienceOptions: SupportOption<Audience>[] = [
  {
    value: "self",
    label: "For myself",
    hint: "You are looking for support for your own situation.",
  },
  {
    value: "carer",
    label: "For someone I care for",
    hint: "A child, family member, partner or friend.",
  },
  {
    value: "professional",
    label: "I support someone professionally",
    hint: "A teacher, therapist, social worker or support worker.",
  },
  {
    value: "exploring",
    label: "I am trying to understand more",
    hint: "No particular situation, you want to learn.",
  },
  {
    value: "unspecified",
    label: "Prefer not to say",
    hint: "You will still see every option.",
  },
];

export const needOptions: SupportOption<Need>[] = [
  {
    value: "talk",
    label: "Someone to talk to",
    hint: "A conversation with a person who understands.",
  },
  {
    value: "community",
    label: "Meeting people who understand",
    hint: "Other families and members with shared experience.",
  },
  {
    value: "practical",
    label: "Practical guidance",
    hint: "Routines, communication, transitions, day-to-day life.",
  },
  {
    value: "discrimination",
    label: "Facing exclusion or unfair treatment",
    hint: "At school, at work, or in the community.",
  },
  {
    value: "carer_rest",
    label: "I am exhausted and need support myself",
    hint: "Caring is demanding. Support exists for you too.",
    audiences: ["carer", "professional", "unspecified"],
  },
  {
    value: "activities",
    label: "Finding activities to join",
    hint: "Sports, dance, nutrition and community programmes.",
  },
  {
    value: "unsure",
    label: "I am not sure yet",
    hint: "That is a completely reasonable place to start.",
  },
];

export const startOptions: SupportOption<StartStyle>[] = [
  {
    value: "conversation",
    label: "A conversation with the team",
    hint: "Someone from Love 21 gets in touch.",
  },
  {
    value: "read",
    label: "Something to read on my own first",
    hint: "Take your time, no contact needed.",
  },
  {
    value: "group",
    label: "Meeting others in a group",
    hint: "Sessions and community events.",
  },
  {
    value: "action",
    label: "Doing something practical",
    hint: "Take part, help out, get involved.",
  },
];

export interface SupportPathway {
  id: string;
  title: string;
  body: string;
  /** Where the primary action goes. `#support-request` is the form on this page. */
  href: string;
  actionLabel: string;
  audienceTags: Audience[];
  needTags: Need[];
  startTags: StartStyle[];
}

// Order matters: it is the tie-break when two pathways score the same, so the
// gentler, lower-commitment options are listed first.
export const supportPathways: SupportPathway[] = [
  {
    id: "conversation",
    title: "Book a support conversation",
    body: "Tell us a little about what you need and the Love 21 team will arrange a time to talk it through.",
    href: "#support-request",
    actionLabel: "Request a conversation",
    audienceTags: ["self", "carer", "professional", "unspecified"],
    needTags: ["talk", "discrimination", "carer_rest", "practical", "unsure"],
    startTags: ["conversation"],
  },
  {
    id: "carer_support",
    title: "Support for you, not only for them",
    body: "Carers need care too. Start a conversation about respite, peer support and what would genuinely help.",
    href: "#support-request",
    actionLabel: "Talk to someone",
    audienceTags: ["carer", "professional"],
    needTags: ["carer_rest", "talk", "discrimination"],
    startTags: ["conversation", "group", "read"],
  },
  {
    id: "programmes",
    title: "Explore the programmes",
    body: "Find out our healthy activities across sports, dance and nutrition.",
    href: "/story",
    actionLabel: "See what is on",
    audienceTags: ["self", "carer", "exploring", "professional", "unspecified"],
    needTags: ["activities", "practical", "community"],
    startTags: ["group", "action", "read"],
  },
  {
    id: "learn",
    title: "Understand neurodiversity",
    body: "How neurodivergent minds actually work, in plain language. Strengths first, not deficits.",
    href: "/neuro-strengths",
    actionLabel: "Start learning",
    audienceTags: ["self", "carer", "professional", "exploring", "unspecified"],
    needTags: ["practical", "discrimination", "unsure"],
    startTags: ["read"],
  },
  {
    id: "community",
    title: "See the community around you",
    body: "1,284 supporters and 10 partner organisations stand behind this work, and behind you.",
    href: "/supporter",
    actionLabel: "Meet the community",
    audienceTags: ["self", "carer", "exploring", "unspecified"],
    needTags: ["community", "unsure"],
    startTags: ["group"],
  },
  {
    id: "volunteer",
    title: "Get involved",
    body: "Doing something alongside others is its own kind of support.",
    href: "/volunteer",
    actionLabel: "Explore volunteering",
    audienceTags: ["exploring", "professional", "self", "unspecified"],
    needTags: ["community", "activities"],
    startTags: ["action"],
  },
];

/**
 * Turn a completed set of answers into a sentence for the support request
 * form, so the person does not have to retype what they just told us.
 *
 * Uses the option labels rather than the raw values, and drops "Prefer not to
 * say" — repeating it back adds nothing and reads oddly.
 */
export function describeAnswers(
  answers: SupportAnswers,
  // Defaults to English; the component passes the active language's questions
  // so the summary is written in whatever the person was reading.
  questions: SupportQuestion[] = supportQuestions,
): string {
  const optionsFor = (id: SupportQuestion["id"]) =>
    questions.find((question) => question.id === id)?.options ?? [];

  const chosen: (SupportOption<string> | undefined)[] = [
    optionsFor("audience").find((option) => option.value === answers.audience),
    optionsFor("need").find((option) => option.value === answers.need),
    optionsFor("start").find((option) => option.value === answers.start),
  ];

  const labels = chosen
    .filter(
      (option): option is SupportOption<string> =>
        option !== undefined && option.value !== "unspecified",
    )
    .map((option) => option.label);

  if (labels.length === 0) return "";

  // Chinese takes the ideographic full stop with no trailing space; using
  // ". " between Chinese clauses looks wrong to a reader.
  const isChinese = labels.some((label) => /[一-鿿]/.test(label));
  return isChinese ? `${labels.join("。")}。` : `${labels.join(". ")}.`;
}

export interface SupportQuestion {
  id: "audience" | "need" | "start";
  legend: string;
  /** Empty string renders no help line. */
  help: string;
  options: SupportOption<string>[];
}

export const supportQuestions: SupportQuestion[] = [
  {
    id: "audience" as const,
    legend: "Who are you looking for support for?",
    help: "",
    options: audienceOptions,
  },
  {
    id: "need" as const,
    legend: "What would help most right now?",
    help: "Pick the one closest to how things feel today.",
    options: needOptions,
  },
  {
    id: "start" as const,
    legend: "How would you like to start?",
    help: "There is no wrong answer, and you can change your mind later.",
    options: startOptions,
  },
];

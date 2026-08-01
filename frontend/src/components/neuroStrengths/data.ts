export type TraitId = "focus" | "pattern" | "kinesthetic" | "creative" | "communication";

export const TRAITS: { id: TraitId; label: string }[] = [
  { id: "focus", label: "Hyper-focus" },
  { id: "pattern", label: "Pattern Recognition" },
  { id: "kinesthetic", label: "Kinesthetic Awareness" },
  { id: "creative", label: "Creative Problem Solving" },
  { id: "communication", label: "Direct Communication" },
];

function dicebearAvatar(style: string, seed: string, backgroundColor: string) {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=${backgroundColor}`;
}

export type Archetype = {
  id: string;
  name: string;
  avatarUrl: string;
  story: string;
  stats: Record<TraitId, number>;
  myth: string;
  realityTitle: string;
  realityBody: string;
};

export const ARCHETYPES: Archetype[] = [
  {
    id: "kinetic",
    name: "The Kinetic",
    avatarUrl: dicebearAvatar("notionists", "Kinetic", "e0f2fe"),
    story:
      "The Kinetic possesses an extraordinary connection to their physical environment. Experiencing the world at a higher sensory volume, they are exceptionally good at spatial awareness, making them natural athletes, dancers, and hands-on creators.",
    stats: { focus: 4, pattern: 5, kinesthetic: 10, creative: 6, communication: 3 },
    myth: "They are too sensitive to their physical environment.",
    realityTitle: "Heightened Awareness",
    realityBody:
      "Experiencing the physical world at a higher volume translates to incredible balance, coordination, and athletic potential.",
  },
  {
    id: "analyst",
    name: "The Analyst",
    avatarUrl: dicebearAvatar("notionists", "Analyst", "dbeafe"),
    story:
      "The Analyst is a master of details. They process the world with incredible precision and are exceptionally good at spotting anomalies, recognizing deep patterns, and solving complex systemic problems that others completely miss.",
    stats: { focus: 3, pattern: 10, kinesthetic: 4, creative: 7, communication: 5 },
    myth: "They get distracted by irrelevant little details.",
    realityTitle: "Elite Pattern Recognition",
    realityBody:
      "A brain wired to process more resting data, allowing them to spot details, fix errors, and memorize complex routines instantly.",
  },
  {
    id: "specialist",
    name: "The Specialist",
    avatarUrl: dicebearAvatar("notionists", "Specialist", "f3e8ff"),
    story:
      "The Specialist brings unmatched dedication to their passions. When engaged, they enter a state of deep flow, exceptionally good at absorbing massive amounts of knowledge and mastering niche skills with a level of dedication that is impossible to teach.",
    stats: { focus: 10, pattern: 6, kinesthetic: 3, creative: 5, communication: 4 },
    myth: "They get obsessed with one topic and ignore everything else.",
    realityTitle: "Hyper-focus",
    realityBody:
      "The ability to block out distractions and dedicate intense, passionate energy to mastering a specific skill, hobby, or sport.",
  },
  {
    id: "innovator",
    name: "The Innovator",
    avatarUrl: dicebearAvatar("notionists", "Innovator", "fff7ed"),
    story:
      "The Innovator does not see the world through standard rules. They think in webs rather than straight lines, making them exceptionally good at bypassing traditional logic to discover highly creative, outside-the-box solutions.",
    stats: { focus: 5, pattern: 4, kinesthetic: 6, creative: 10, communication: 3 },
    myth: 'They don\'t do things the "normal" way.',
    realityTitle: "Creative Thinking",
    realityBody:
      "A neurodivergent brain naturally bypasses standard associative rules to find completely innovative, outside-the-box solutions.",
  },
  {
    id: "anchor",
    name: "The Anchor",
    avatarUrl: dicebearAvatar("notionists", "Anchor", "ecfdf5"),
    story:
      "The Anchor is the ultimate truth-teller. Unburdened by confusing social politics, they are exceptionally good at providing extreme reliability, crystal-clear instructions, and unfiltered honesty, making them the most dependable person in any team.",
    stats: { focus: 6, pattern: 5, kinesthetic: 4, creative: 3, communication: 10 },
    myth: "They are blunt, rude, or bad at socializing.",
    realityTitle: "Direct Communication",
    realityBody:
      "Skipping vague social hints in favor of unfiltered honesty, crystal-clear instructions, and extreme reliability in a team setting.",
  },
];

export type QuizScenario = {
  id: string;
  question: string;
  options: { label: string; text: string; isCorrect: boolean }[];
  fact: string;
};

export const QUIZ_SCENARIOS: QuizScenario[] = [
  {
    id: "processing",
    question:
      "A team member wearing noise-canceling headphones is staring blankly at a wall while you explain a complex project. What is likely happening?",
    options: [
      { label: "A", text: "They are actively ignoring you.", isCorrect: false },
      { label: "B", text: "They are daydreaming and lost focus.", isCorrect: false },
      {
        label: "C",
        text: "They are processing audio information without visual distractions.",
        isCorrect: true,
      },
      { label: "D", text: "They are trying to quickly memorize the room layout.", isCorrect: false },
    ],
    fact: "Many neurodivergent individuals struggle with processing multiple sensory inputs at once. Looking away removes visual clutter, allowing their brain to allocate 100% of its resources to listening to you.",
  },
  {
    id: "hyperfocus",
    question:
      "Your colleague has been working on a single coding bug for 6 hours straight, skipping lunch and ignoring emails. This is an example of:",
    options: [
      { label: "A", text: "Poor time management.", isCorrect: false },
      { label: "B", text: "Hyper-focus.", isCorrect: true },
      { label: "C", text: "Avoidance of other tasks.", isCorrect: false },
      { label: "D", text: "Lack of peripheral awareness.", isCorrect: false },
    ],
    fact: "Hyper-focus is a state of intense concentration commonly seen in ADHD and Autism. While it requires management to ensure basic needs are met, it allows for incredible productivity and problem-solving.",
  },
  {
    id: "direct",
    question:
      "During a feedback meeting, an employee tells you exactly what is wrong with the company process without sugarcoating it. This behavior is:",
    options: [
      { label: "A", text: "Intentional Disrespect.", isCorrect: false },
      { label: "B", text: "A lack of emotional intelligence.", isCorrect: false },
      { label: "C", text: "Trying to assert dominance.", isCorrect: false },
      { label: "D", text: "Direct Communication.", isCorrect: true },
    ],
    fact: "Autistic communication often prioritizes efficiency and truth over social pleasantries. This 'bottom-up' thinking is incredibly valuable for identifying real systemic issues quickly.",
  },
  {
    id: "stimming",
    question:
      "Someone is pacing back and forth or tapping their fingers rapidly before a big presentation. They are likely:",
    options: [
      { label: "A", text: "Having a severe panic attack.", isCorrect: false },
      { label: "B", text: "Stimming to self-regulate.", isCorrect: true },
      { label: "C", text: "Trying to intimidate the audience.", isCorrect: false },
      { label: "D", text: "Just highly caffeinated.", isCorrect: false },
    ],
    fact: "Stimming (self-stimulatory behavior) is a natural way neurodivergent nervous systems regulate stress, focus, or express excitement. It is a healthy coping mechanism.",
  },
  {
    id: "routine",
    question:
      "An individual becomes visibly distressed when a scheduled 10:00 AM meeting is suddenly changed to 10:15 AM. Why?",
    options: [
      { label: "A", text: "They are being stubborn about time.", isCorrect: false },
      { label: "B", text: "Disruption of predictability.", isCorrect: true },
      { label: "C", text: "They want to leave work early.", isCorrect: false },
      { label: "D", text: "They have a poor sense of time.", isCorrect: false },
    ],
    fact: "For brains that process massive amounts of unpredictable sensory data every second, rigid routines act as an essential anchor. A sudden change breaks that anchor, requiring immense cognitive effort to recalibrate.",
  },
];

export type TriviaCard = {
  id: string;
  question: string;
  answer: string;
};

export const TRIVIA: TriviaCard[] = [
  {
    id: "empathy",
    question: "Do autistic individuals lack empathy?",
    answer:
      "False. Research shows the \"Double Empathy Problem.\" Autistic people communicate and empathize perfectly well with other autistic people; the disconnect only happens when translating between different neurotypes.",
  },
  {
    id: "cure",
    question: "Is autism an illness that needs curing?",
    answer:
      "No. Autism is a naturally occurring neurological variation (neurodiversity), largely driven by genetics. It is a different way the brain is wired from birth, not a disease.",
  },
  {
    id: "activity",
    question: "Why are physical activities so vital?",
    answer:
      "Exercise is a powerful self-regulation tool. It helps process overwhelming sensory input, builds executive functioning skills, and significantly reduces clinical anxiety.",
  },
  {
    id: "eye-contact",
    question: "Is avoiding eye contact a sign of disrespect?",
    answer:
      "No. For many neurodivergent people, eye contact is intensely overwhelming. Looking away helps them focus entirely on what you are saying.",
  },
  {
    id: "non-speaking",
    question: "Does being non-speaking mean someone has low intelligence?",
    answer:
      "Absolutely not. Speech and intelligence are handled by different parts of the brain. Many non-speaking individuals are highly intelligent.",
  },
  {
    id: "stimming-stop",
    question: "Should stimming (flapping, rocking) be stopped?",
    answer:
      "No. Unless it's harmful, stimming is a vital and healthy way for the nervous system to self-regulate and manage sensory input.",
  },
];

export type Article = {
  id: string;
  label: "FOUNDATIONS" | "PRACTICAL" | "STORIES" | "GROWTH" | "SUPPORT" | "COMMUNITY";
  title: string;
  subtitle: string;
  content: string;
};

export const ARTICLES: Article[] = [
  {
    id: "understanding-neurodiversity",
    label: "FOUNDATIONS",
    title: "Understanding neurodiversity",
    subtitle:
      "A beginner-friendly guide to different ways people experience the world, communicate and learn.",
    content:
      "Neurodiversity is the concept that there is no single 'right' or 'normal' way for a brain to function. Just as biodiversity is essential for a healthy ecosystem, neurological variations like Autism, ADHD, Dyslexia, and Dyspraxia are vital for a thriving human society. Instead of viewing these differences as deficits that need to be cured, the neurodiversity paradigm recognizes them as natural human variations. [Paragraph break] This shift in perspective is crucial. It moves us away from a medical model of 'fixing' people toward a social model of 'accommodating' them. When we understand that a person staring at a wall isn't being rude, but rather regulating their sensory input, we foster genuine empathy and belonging.",
  },
  {
    id: "inclusion-tips",
    label: "PRACTICAL",
    title: "Inclusion tips for everyday life",
    subtitle: "Simple ways to create calm, welcoming spaces at home, school and in the community.",
    content:
      "Creating an inclusive environment doesn't always require massive structural changes; it often comes down to thoughtful, everyday adjustments. [Paragraph break] 1. **Clear Communication:** Say what you mean. Avoid dropping subtle hints or expecting someone to 'read between the lines.' [Paragraph break] 2. **Sensory Friendly Spaces:** Fluorescent lights, ticking clocks, and overlapping conversations can be physically painful for hypersensitive individuals. Offering a quiet zone or allowing noise-canceling headphones can instantly transform a space from hostile to welcoming. [Paragraph break] 3. **Predictability:** Sudden changes provoke anxiety. Providing visual schedules or giving advance notice for transitions helps neurodivergent individuals prepare their mental energy.",
  },
  {
    id: "celebrating-strengths",
    label: "STORIES",
    title: "Celebrating strengths",
    subtitle: "Explore how abilities grow through confidence, routine, curiosity and joyful participation.",
    content:
      "When we stop forcing neurodivergent individuals to mask their traits to fit into a neurotypical mold, incredible strengths emerge. Consider the 'Spiky Profile.' While an autistic individual might struggle with small talk, they might possess elite pattern recognition, allowing them to spot anomalies in code or data that others miss entirely. [Paragraph break] ADHD individuals, often criticized for being easily distracted, frequently excel in high-pressure crises, their brains naturally wired to seek stimulation and act decisively when others panic. By focusing on these inherent strengths, we move from mere acceptance to active celebration and empowerment.",
  },
  {
    id: "building-confidence",
    label: "GROWTH",
    title: "Building confidence",
    subtitle: "Small, steady experiences can build independence, participation and self-belief over time.",
    content:
      "Confidence for neurodivergent youth is often eroded by a world not built for them. Rebuilding it requires a strengths-based approach. [Paragraph break] Instead of constantly working on 'weaknesses,' lean heavily into their special interests. If a child is fascinated by trains, use trains to teach math, history, and social skills. Success breeds success. When individuals are allowed to engage with the world through the lens of what they love, they experience competence. Over time, these small wins compound, creating a robust foundation of self-belief that transfers into more challenging areas of life.",
  },
  {
    id: "communication-that-works",
    label: "SUPPORT",
    title: "Communication that works",
    subtitle: "Helpful ways to listen, pause, show choice and make space for different communication styles.",
    content:
      "Communication is a two-way street, and the 'Double Empathy Problem' shows that misunderstandings occur because different neurotypes are essentially speaking different languages. [Paragraph break] To bridge this gap: **Embrace the Pause.** Many neurodivergent individuals require extra processing time to translate their thoughts into spoken words. Wait 5-10 seconds after asking a question before jumping in. **Respect Non-Speaking Communication.** Typing, using AAC devices, or communicating through behavior and body language are all valid. Never equate speech with intelligence.",
  },
  {
    id: "finding-belonging",
    label: "COMMUNITY",
    title: "Finding belonging",
    subtitle: "Real connection comes from shared routines, warm welcome and opportunities to contribute.",
    content:
      "True belonging is more than just being invited to the room; it's about being valued for exactly who you are once you get there. For the Love 21 Foundation, community means creating spaces where individuals with Down syndrome and autistic individuals aren't just participants, but leaders. [Paragraph break] Belonging is built through shared routines—like sports and nutrition programs—where the focus is on joyful participation rather than rigid compliance. When we build communities that expect and celebrate differences, we create a world where everyone has the opportunity to reach their holistic potential.",
  },
];

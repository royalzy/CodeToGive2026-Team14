import type { Lang } from "../../content/languageContextValue";

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

// Traditional Chinese mirrors of the English content above. This module is
// not part of the src/content/en.ts + zh.ts barrel, so translations live
// here instead, keyed by id and merged onto the English data via the
// `localize*` helpers below. Author in Traditional Chinese only —
// Simplified is derived at render time via localizeDeep.

export const traitLabelCopyZh: Record<TraitId, string> = {
  focus: "過度專注",
  pattern: "模式識別",
  kinesthetic: "動覺意識",
  creative: "創意解難",
  communication: "直接溝通",
};

export function localizeTraitLabel(id: TraitId, lang: Lang): string {
  if (lang === "en") return TRAITS.find((trait) => trait.id === id)?.label ?? id;
  return traitLabelCopyZh[id];
}

type ArchetypeCopy = Pick<Archetype, "name" | "story" | "myth" | "realityTitle" | "realityBody">;

export const archetypeCopyZh: Record<string, ArchetypeCopy> = {
  kinetic: {
    name: "動覺型",
    story:
      "動覺型的人與身體感官環境有著非凡的連繫。他們以更高的感官強度體驗世界，因此在空間感知方面表現出色，讓他們成為天生的運動員、舞者和動手實踐的創作者。",
    myth: "他們對身處的物理環境過於敏感。",
    realityTitle: "強化的覺察力",
    realityBody: "以更高強度體驗物理世界，轉化為出色的平衡感、協調能力和運動潛力。",
  },
  analyst: {
    name: "分析型",
    story:
      "分析型的人是細節大師。他們以驚人的精準度處理世界資訊，特別擅長發現異常、辨識深層模式，以及解決其他人完全忽略的複雜系統性問題。",
    myth: "他們會被無關痛癢的小細節分散注意力。",
    realityTitle: "卓越的模式識別能力",
    realityBody: "大腦天生擅長處理更多背景資訊，讓他們能即時發現細節、修正錯誤，並記住複雜的程序。",
  },
  specialist: {
    name: "專才型",
    story:
      "專才型的人對自己熱衷的事物投入無比的專注。當投入其中時，他們會進入深度心流狀態，特別擅長吸收大量知識，並以難以模仿的專注程度掌握小眾技能。",
    myth: "他們會沉迷於單一主題，忽略其他一切。",
    realityTitle: "過度專注",
    realityBody: "能夠屏蔽外界干擾，全情投入、充滿熱情地掌握某項特定技能、興趣或運動。",
  },
  innovator: {
    name: "創新型",
    story:
      "創新型的人不會用標準規則看待世界。他們以網狀方式思考，而非直線思維，讓他們特別擅長跳出傳統邏輯框架，發現極具創意的破格解決方案。",
    myth: "他們做事「不按常理」。",
    realityTitle: "創意思維",
    realityBody: "神經多樣的大腦天生會繞過標準的聯想規則，從而找出完全創新、破格的解決方案。",
  },
  anchor: {
    name: "支柱型",
    story:
      "支柱型的人是終極的真話直說者。不受複雜社交政治所困擾，他們特別擅長提供極高的可靠性、清晰明確的指示，以及不加修飾的誠實，讓他們成為團隊中最值得信賴的人。",
    myth: "他們說話直接、粗魯，或不善社交。",
    realityTitle: "直接溝通",
    realityBody:
      "跳過含糊的社交暗示，以不加修飾的誠實、清晰明確的指示，以及在團隊中極高的可靠性取而代之。",
  },
};

export function localizeArchetype(archetype: Archetype, lang: Lang): Archetype {
  if (lang === "en") return archetype;
  const zh = archetypeCopyZh[archetype.id];
  return zh ? { ...archetype, ...zh } : archetype;
}

type QuizScenarioCopy = { question: string; optionTexts: string[]; fact: string };

export const quizScenarioCopyZh: Record<string, QuizScenarioCopy> = {
  processing: {
    question:
      "一位同事戴著降噪耳機，在你講解一個複雜項目時目光呆滯地盯著牆壁。這很可能是甚麼原因？",
    optionTexts: [
      "他們正在故意無視你。",
      "他們在發白日夢，分心了。",
      "他們正在處理聽覺資訊，避免視覺干擾。",
      "他們正嘗試快速記住房間的佈局。",
    ],
    fact:
      "許多神經多樣的人在同時處理多種感官資訊時會感到吃力。移開視線可以減少視覺雜訊，讓大腦能將百分之百的資源用於聆聽你說話。",
  },
  hyperfocus: {
    question:
      "你的同事連續六小時專注解決同一個程式錯誤，不吃午飯、也不理會電郵。這是以下哪一種情況的例子：",
    optionTexts: ["時間管理不善。", "過度專注。", "逃避其他工作。", "缺乏周邊環境的覺察力。"],
    fact:
      "過度專注是一種高度專注的狀態，常見於專注力不足/過度活躍症（ADHD）和自閉症人士身上。雖然需要適當管理以確保基本需要得到滿足，但它能帶來驚人的生產力和解難能力。",
  },
  direct: {
    question: "在一次意見反饋會議上，一位員工毫不修飾地直接指出公司流程的問題所在。這種行為是：",
    optionTexts: ["刻意的不尊重。", "缺乏情緒智商。", "試圖展現主導地位。", "直接溝通。"],
    fact:
      "自閉人士的溝通方式往往著重效率和真實，多於社交上的客套話。這種「由下而上」的思考方式，對於快速找出真正的系統性問題非常有價值。",
  },
  stimming: {
    question: "有人在重要簡報前來回踱步，或快速地敲打手指。他們很可能：",
    optionTexts: [
      "正經歷嚴重的恐慌發作。",
      "透過自我刺激行為來自我調節。",
      "試圖恐嚇聽眾。",
      "只是攝取了過多咖啡因。",
    ],
    fact:
      "自我刺激行為（stimming）是神經多樣人士的神經系統用來調節壓力、專注或表達興奮的自然方式，是一種健康的應對機制。",
  },
  routine: {
    question: "當一個原定上午十時的會議突然改到十時十五分時，某人變得明顯不安。為甚麼？",
    optionTexts: [
      "他們對時間過於固執。",
      "可預測性被打亂。",
      "他們想早點下班。",
      "他們對時間的感知不佳。",
    ],
    fact:
      "對於每秒都在處理大量不可預測感官資訊的大腦而言，固定的常規是一個重要的錨點。突如其來的改變會打破這個錨點，需要極大的認知努力才能重新適應。",
  },
};

export function localizeQuizScenario(scenario: QuizScenario, lang: Lang): QuizScenario {
  if (lang === "en") return scenario;
  const zh = quizScenarioCopyZh[scenario.id];
  if (!zh) return scenario;
  return {
    ...scenario,
    question: zh.question,
    fact: zh.fact,
    options: scenario.options.map((option, index) => ({
      ...option,
      text: zh.optionTexts[index] ?? option.text,
    })),
  };
}

type TriviaCopy = { question: string; answer: string };

export const triviaCopyZh: Record<string, TriviaCopy> = {
  empathy: {
    question: "自閉人士是否缺乏同理心？",
    answer:
      "並非如此。研究顯示「雙重同理心問題」（Double Empathy Problem）的存在。自閉人士與其他自閉人士溝通及建立同理心時完全沒有問題；斷層只在於不同神經類型之間的「翻譯」過程。",
  },
  cure: {
    question: "自閉症是否一種需要治癒的疾病？",
    answer:
      "不是。自閉症是一種天然存在的神經變異（神經多樣性），主要由基因決定。這是大腦天生運作方式的不同，並非一種疾病。",
  },
  activity: {
    question: "為何體能活動如此重要？",
    answer: "運動是強大的自我調節工具，有助處理過度負荷的感官資訊、建立執行功能技巧，並顯著減輕臨床焦慮。",
  },
  "eye-contact": {
    question: "避免眼神接觸是不尊重的表現嗎？",
    answer:
      "不是。對許多神經多樣人士而言，眼神接觸的感覺極度強烈。移開視線有助他們將全部注意力集中在你所說的話上。",
  },
  "non-speaking": {
    question: "不能說話是否代表智力較低？",
    answer: "絕對不是。語言能力和智力由大腦不同部分處理。許多不能說話的人士其實非常聰明。",
  },
  "stimming-stop": {
    question: "應否阻止自我刺激行為（如拍動雙手、搖晃身體）？",
    answer:
      "不應該。除非該行為具傷害性，否則自我刺激行為是神經系統自我調節及應對感官資訊的重要且健康的方式。",
  },
};

export function localizeTrivia(card: TriviaCard, lang: Lang): TriviaCard {
  if (lang === "en") return card;
  const zh = triviaCopyZh[card.id];
  return zh ? { ...card, ...zh } : card;
}

type ArticleCopy = Pick<Article, "title" | "subtitle" | "content">;

export const articleCopyZh: Record<string, ArticleCopy> = {
  "understanding-neurodiversity": {
    title: "認識神經多樣性",
    subtitle: "一份適合初學者的入門指南，了解人們體驗世界、溝通和學習的不同方式。",
    content:
      "神經多樣性的概念是：大腦運作沒有單一的「正確」或「正常」方式。正如生物多樣性對健康的生態系統至關重要一樣，自閉症、專注力不足/過度活躍症（ADHD）、讀寫障礙和動作協調障礙等神經變異，對蓬勃發展的人類社會同樣不可或缺。與其將這些差異視為需要治癒的缺陷，神經多樣性的思考框架將它們視為自然的人類變異。[Paragraph break] 這種觀點的轉變至關重要。它讓我們從一個著重「治好」他人的醫療模式，轉向著重「配合」他們需要的社會模式。當我們明白一個盯著牆壁的人並非無禮，而是在調節自己的感官輸入時，我們便能培養出真正的同理心和歸屬感。",
  },
  "inclusion-tips": {
    title: "日常生活中的共融小貼士",
    subtitle: "在家中、學校和社區中，營造平靜、友善空間的簡單方法。",
    content:
      "營造共融的環境，不一定需要大規模的架構改變；往往取決於用心的日常調整。[Paragraph break] 1. **清晰溝通：** 直接說出你的意思，避免旁敲側擊，或期望別人能「聽出弦外之音」。[Paragraph break] 2. **感官友善的空間：** 螢光燈、滴答作響的時鐘和重疊的對話，對感官過敏的人來說可能帶來真實的痛楚。提供一個安靜區域，或容許使用降噪耳機，就能瞬間將一個空間由充滿敵意轉化為讓人感到歡迎。[Paragraph break] 3. **可預測性：** 突如其來的改變會引發焦慮。提供視覺化的時間表，或在轉換活動前提早通知，有助神經多樣人士預備好自己的心理能量。",
  },
  "celebrating-strengths": {
    title: "頌揚強項",
    subtitle: "探索能力如何透過自信、常規、好奇心和喜悅的參與而成長。",
    content:
      "當我們不再強迫神經多樣人士掩藏自己的特質去迎合神經典型的模式時，驚人的強項便會浮現。試想想「參差能力剖析」（Spiky Profile）：一位自閉人士也許在閒聊上感到困難，但可能擁有卓越的模式識別能力，讓他們能發現別人完全忽略的程式或數據異常。[Paragraph break] 專注力不足/過度活躍症（ADHD）人士，常被批評容易分心，但他們往往在高壓危機中表現出色，大腦天生傾向尋求刺激，並在他人恐慌時果斷行動。透過聚焦這些與生俱來的強項，我們便能從單純的接納，走向積極的頌揚和賦權。",
  },
  "building-confidence": {
    title: "建立自信",
    subtitle: "微小而穩定的經驗，能隨時間建立獨立、參與感和自我價值。",
    content:
      "神經多樣的年輕人，其自信心往往被一個並非為他們而設的世界所侵蝕。要重建自信，需要一套以強項為本的方法。[Paragraph break] 與其不斷專注於「弱項」，不如大力發揮他們的特別興趣。假如一位孩子熱愛火車，就用火車去教數學、歷史和社交技巧。成功會帶來更多成功。當人們獲允許透過自己所愛的事物去體驗世界時，他們便能感受到自身的能力。隨著時間推移，這些微小的勝利會不斷累積，建立起穩固的自我價值基礎，並延伸至人生中更具挑戰的領域。",
  },
  "communication-that-works": {
    title: "行之有效的溝通方式",
    subtitle: "聆聽、停頓、給予選擇，並為不同溝通方式留有空間的有用方法。",
    content:
      "溝通是雙向的過程，而「雙重同理心問題」顯示，誤解的產生是因為不同的神經類型本質上是在說著不同的「語言」。[Paragraph break] 要跨越這道鴻溝：**擁抱停頓。** 許多神經多樣人士需要額外的處理時間，才能將思緒轉化為口語。在提問後，等待五至十秒才插話。**尊重非口語溝通方式。** 打字、使用擴大及替代溝通（AAC）裝置，或透過行為和肢體語言溝通，同樣都是有效的方式。切勿將說話能力與智力畫上等號。",
  },
  "finding-belonging": {
    title: "尋找歸屬感",
    subtitle: "真正的連繫源自共同的常規、溫暖的歡迎，以及貢獻的機會。",
    content:
      "真正的歸屬感不僅僅是被邀請進入一個房間，而是當你身處其中時，能因為真實的自己而被重視。對 Love 21 Foundation 而言，社群意味著創造一個空間，讓唐氏綜合症人士和自閉人士不只是參與者，更是領導者。[Paragraph break] 歸屬感是透過共同的常規建立的——例如體育和營養計劃——當中的重點在於喜悅的參與，而非僵化的服從。當我們建立起期待並頌揚差異的社群時，我們便創造了一個讓每個人都有機會發揮全面潛能的世界。",
  },
};

export function localizeArticle(article: Article, lang: Lang): Article {
  if (lang === "en") return article;
  const zh = articleCopyZh[article.id];
  return zh ? { ...article, ...zh } : article;
}

export const articleLabelCopyZh: Record<Article["label"], string> = {
  FOUNDATIONS: "基礎知識",
  PRACTICAL: "實用貼士",
  STORIES: "真實故事",
  GROWTH: "成長",
  SUPPORT: "支援",
  COMMUNITY: "社群",
};

export function localizeArticleLabel(label: Article["label"], lang: Lang): string {
  if (lang === "en") return label;
  return articleLabelCopyZh[label];
}

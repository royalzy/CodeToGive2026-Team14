import type { VolunteerRoleId } from "./volunteer";
import type { Lang } from "./languageContextValue";

export type QuizLetter = "A" | "B" | "C" | "D";

export interface QuizOption {
  letter: QuizLetter;
  text: string;
}

export interface QuizQuestion {
  id: number;
  prompt: string;
  options: QuizOption[];
}

export interface QuizRoleMatch {
  roleId: VolunteerRoleId;
  note: string;
}

export interface QuizResult {
  letter: QuizLetter;
  archetype: string;
  title: string;
  personality: string;
  matches: QuizRoleMatch[];
  whatMakesYouSpecial: string;
  // Illustration with a #223969 navy background — see public/images/result-*.png
  image: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    prompt: "You're at a community event and you see a shy person standing alone. What do you do?",
    options: [
      {
        letter: "A",
        text: "Go over and start a friendly conversation to make them feel welcome. I love connecting with new people.",
      },
      {
        letter: "B",
        text: "I'd probably be too shy myself to approach them first, but I'd make sure to smile and make eye contact if they looked over.",
      },
      {
        letter: "C",
        text: "I'd step in and organise a fun, inclusive game that everyone can join in on.",
      },
      {
        letter: "D",
        text: "I'd make sure the food and drink area is well-stocked and inviting, hoping that draws them in.",
      },
    ],
  },
  {
    id: 2,
    prompt: "What kind of activity do you most enjoy in your free time?",
    options: [
      { letter: "A", text: "Getting active! Playing sports, working out, or just being outdoors." },
      {
        letter: "B",
        text: "Creative stuff – drawing, painting, making music, dancing, or crafting.",
      },
      { letter: "C", text: "Cooking or baking. I love experimenting with new healthy recipes." },
      {
        letter: "D",
        text: "I'm a planner. I love organising events, making lists, and seeing a project come together.",
      },
    ],
  },
  {
    id: 3,
    prompt: "A friend asks you for help learning a new skill. What's your approach?",
    options: [
      {
        letter: "A",
        text: "I'd show them how it's done and then encourage them to try. The best way to learn is by doing!",
      },
      { letter: "B", text: "I'd work alongside them, figuring it out together. Teamwork makes the dream work." },
      {
        letter: "C",
        text: "I'd break it down into simple, step-by-step instructions and guide them through it patiently.",
      },
      {
        letter: "D",
        text: "I'd find the best resources, books, or videos for them and let them learn at their own pace.",
      },
    ],
  },
  {
    id: 4,
    prompt: "What's your ideal way to make a difference in your community?",
    options: [
      { letter: "A", text: "Helping people feel happier, healthier, and more active." },
      { letter: "B", text: "Using my creativity to bring joy and inspiration to others." },
      { letter: "C", text: "By supporting families and caregivers, who are the backbone of our community." },
      {
        letter: "D",
        text: "Behind the scenes! I like to make sure everything runs smoothly so others can have a great experience.",
      },
    ],
  },
  {
    id: 5,
    prompt: "You are describing yourself. Which word fits you best?",
    options: [
      { letter: "A", text: "Encouraging. I love to cheer people on and help them achieve their potential." },
      { letter: "B", text: "Creative. I think outside the box and love artistic expression." },
      {
        letter: "C",
        text: "Caring. I'm empathetic and always want to help people feel comfortable and supported.",
      },
      { letter: "D", text: "Reliable. I'm dependable and people know they can count on me." },
    ],
  },
];

export const quizResults: Record<QuizLetter, QuizResult> = {
  A: {
    letter: "A",
    archetype: "The Motivational Coach",
    title: "Active & Inclusive Volunteer",
    personality:
      "You're a natural encourager with a vibrant, can-do attitude. You believe in the power of activity to build confidence and community. You are sociable, energetic, and love seeing people of all abilities succeed. You don't just watch from the sidelines; you get in there and participate!",
    matches: [
      {
        roleId: "sports_activity_buddy",
        note: "You're perfect for the Sports Assistant role — help create an inclusive, high-energy environment where everyone feels capable and included.",
      },
      {
        roleId: "dance_activity_buddy",
        note: "Your encouraging nature is also a great fit as a Creative Arts Assistant, where you can cheer members on as they express themselves through dance and art.",
      },
    ],
    whatMakesYouSpecial:
      "Your positive energy is contagious! You have a gift for making people feel capable and motivated, no matter their starting point.",
    image: "/images/result-motivational-coach.png",
  },
  B: {
    letter: "B",
    archetype: "The Creative Spirit",
    title: "Arts & Culture Volunteer",
    personality:
      "You are imaginative, empathetic, and see the world through a unique lens. You express yourself best through creativity and find joy in helping others discover their own creative spark. You are patient and understanding and believe in the therapeutic power of art and music.",
    matches: [
      {
        roleId: "dance_activity_buddy",
        note: "The Creative Arts Class Assistant role is a perfect match — you'll be right at home helping members explore dance, music, craft and other creative outlets.",
      },
      {
        roleId: "community_event_volunteer",
        note: "Your creative thinking can also be a fantastic asset as an Event Helper, making events more engaging and fun.",
      },
    ],
    whatMakesYouSpecial:
      "You understand that creativity is a form of expression and connection that transcends words. You help people find their voice through art.",
    image: "/images/result-creative.png",
  },
  C: {
    letter: "C",
    archetype: "The Nurturing Guide",
    title: "Care & Connection Volunteer",
    personality:
      "You are deeply compassionate, patient, and a great listener. You are at your best when you are supporting others, whether that's a family member or an individual. You're a natural caregiver who creates a safe, warm and welcoming environment. You find fulfilment in nurturing others.",
    matches: [
      {
        roleId: "family_support_assistant",
        note: "The Family Support Assistant role is ideal — you'll be a friendly, calming presence for families and help facilitate meaningful group conversations and activities.",
      },
      {
        roleId: "nutrition_class_assistant",
        note: "The Nutrition Workshop Assistant is also a great choice, letting you channel your caring nature into guiding small groups through healthy cooking and eating.",
      },
    ],
    whatMakesYouSpecial:
      "Your empathy and warmth create a safe space where people feel heard, valued and cared for.",
    image: "/images/result-nurturing-guide.png",
  },
  D: {
    letter: "D",
    archetype: "The Behind-the-Scenes Hero",
    title: "Community Organiser",
    personality:
      "You are a fantastic organiser with an eye for detail. You are dependable, practical, and love the satisfaction of a job well done. You are the type of person who makes things happen, but you don't need the spotlight. You are a master at making complex projects look effortless.",
    matches: [
      {
        roleId: "community_event_volunteer",
        note: "The Event Helper role is your calling — you'll be the organisational backbone of public events and corporate CSR days, keeping everything friendly, organised and seamless.",
      },
      {
        roleId: "sports_class_leader",
        note: "Your organisational skills would also be a huge asset as a Sports Class Leader, helping co-plan sessions and keep them running like clockwork.",
      },
    ],
    whatMakesYouSpecial:
      "You are the reliable foundation that makes the entire volunteer programme possible. You turn chaos into calm and make sure every detail is handled so others can focus on their role.",
    image: "/images/result-behind-the-scene.png",
  },
};

// Traditional Chinese mirrors of the English quiz content above, keyed by
// question id / result letter and merged onto the English record via the
// `localizeQuiz*` helpers below. Author in Traditional Chinese only —
// Simplified is derived at render time via localizeDeep.

type QuizQuestionCopy = {
  prompt: string;
  options: { letter: QuizLetter; text: string }[];
};

export const quizQuestionCopyZh: Record<number, QuizQuestionCopy> = {
  1: {
    prompt: "在社區活動中，你看到一位害羞的人獨自站著。你會怎樣做？",
    options: [
      {
        letter: "A",
        text: "走過去友善地展開對話，讓對方感到受歡迎。我喜歡結識新朋友。",
      },
      {
        letter: "B",
        text: "我自己可能也會害羞，不會主動走過去，但如果對方望過來，我會確保微笑並保持眼神接觸。",
      },
      {
        letter: "C",
        text: "我會主動組織一個有趣、人人都能參與的遊戲。",
      },
      {
        letter: "D",
        text: "我會確保食物和飲品區充足且吸引，希望這能吸引他們過來。",
      },
    ],
  },
  2: {
    prompt: "在空閒時間，你最喜歡哪類活動？",
    options: [
      { letter: "A", text: "活動一下！做運動、健身，或者到戶外走走。" },
      {
        letter: "B",
        text: "創作類活動——畫畫、繪畫、作曲、跳舞或手工藝。",
      },
      { letter: "C", text: "烹飪或烘焙。我喜歡嘗試新的健康食譜。" },
      {
        letter: "D",
        text: "我是個策劃者。我喜歡籌辦活動、列清單，看著一個項目逐步成形。",
      },
    ],
  },
  3: {
    prompt: "朋友請你幫忙學習一項新技能。你會怎樣處理？",
    options: [
      {
        letter: "A",
        text: "我會示範給他們看，然後鼓勵他們嘗試。學習的最好方法就是親手做！",
      },
      { letter: "B", text: "我會和他們一起，共同摸索。團隊合作能成就夢想。" },
      {
        letter: "C",
        text: "我會把它拆解成簡單、逐步的指示，耐心地引導他們完成。",
      },
      {
        letter: "D",
        text: "我會為他們找出最好的資源、書籍或影片，讓他們按自己的步伐學習。",
      },
    ],
  },
  4: {
    prompt: "你理想中為社區帶來改變的方式是甚麼？",
    options: [
      { letter: "A", text: "幫助大家感到更快樂、更健康、更有活力。" },
      { letter: "B", text: "運用我的創意，為他人帶來喜悅和啟發。" },
      { letter: "C", text: "透過支援家庭和照顧者，他們是社區的支柱。" },
      {
        letter: "D",
        text: "在幕後默默付出！我喜歡確保一切運作順暢，讓其他人能有美好的體驗。",
      },
    ],
  },
  5: {
    prompt: "你正在形容自己。哪個詞最適合你？",
    options: [
      { letter: "A", text: "鼓勵人心。我喜歡為人打氣，幫助他們發揮潛能。" },
      { letter: "B", text: "有創意。我思考不受框架限制，喜愛藝術表達。" },
      {
        letter: "C",
        text: "體貼關懷。我富有同理心，總是希望幫助大家感到自在和被支持。",
      },
      { letter: "D", text: "可靠。我值得信賴，大家都知道可以依靠我。" },
    ],
  },
};

export function localizeQuizQuestion(question: QuizQuestion, lang: Lang): QuizQuestion {
  if (lang === "en") return question;
  const zh = quizQuestionCopyZh[question.id];
  return zh ? { ...question, ...zh } : question;
}

type QuizResultCopy = Pick<
  QuizResult,
  "archetype" | "title" | "personality" | "matches" | "whatMakesYouSpecial"
>;

export const quizResultsCopyZh: Record<QuizLetter, QuizResultCopy> = {
  A: {
    archetype: "熱血教練型",
    title: "活力共融義工",
    personality:
      "你天生就是個鼓勵者，充滿活力又積極主動。你相信活動的力量能建立自信和社群連繫。你善於社交、精力充沛，喜歡看到不同能力的人都能發揮所長。你不會只在旁觀看，而是會親身參與其中！",
    matches: [
      {
        roleId: "sports_activity_buddy",
        note: "體育課堂助理這個角色非常適合你——協助營造一個共融、充滿活力的環境，讓每個人都感到有能力並被包容。",
      },
      {
        roleId: "dance_activity_buddy",
        note: "你善於鼓勵的性格，同樣適合擔任創意藝術課堂助理，你可以為會員在舞蹈和藝術中的自我表達加油打氣。",
      },
    ],
    whatMakesYouSpecial:
      "你的正能量會感染身邊的人！無論對方的起點如何，你都有天賦讓他們感到有能力、有動力。",
  },
  B: {
    archetype: "創意靈魂型",
    title: "藝術與文化義工",
    personality:
      "你富有想像力、善解人意，並以獨特的角度看世界。你最擅長透過創意表達自己，也樂於幫助他人發掘自己的創作火花。你有耐性、善解人意，相信藝術和音樂具有療癒的力量。",
    matches: [
      {
        roleId: "dance_activity_buddy",
        note: "創意藝術課堂助理的角色非常適合你——你會樂在其中，協助會員透過舞蹈、音樂、手工藝等方式探索創意。",
      },
      {
        roleId: "community_event_volunteer",
        note: "你的創意思維同樣是擔任活動助手的一大優勢，能讓活動更吸引、更有趣。",
      },
    ],
    whatMakesYouSpecial:
      "你明白創意是一種超越言語的表達和連繫方式。你幫助大家找到屬於自己的聲音。",
  },
  C: {
    archetype: "溫柔引導型",
    title: "關懷與連繫義工",
    personality:
      "你富有同理心、有耐性，也是個很好的聆聽者。當你在支援他人時——無論是家庭成員還是個人——你會發揮最大所長。你天生是個照顧者，能營造安全、溫暖、受歡迎的環境。幫助他人讓你感到滿足。",
    matches: [
      {
        roleId: "family_support_assistant",
        note: "家庭支援助理這個角色最適合你——你會是家庭身邊親切、安定的存在，協助促進有意義的小組對話和活動。",
      },
      {
        roleId: "nutrition_class_assistant",
        note: "營養工作坊助理同樣是很好的選擇，讓你能把關懷的天性，投放在帶領小組完成健康烹飪和飲食活動上。",
      },
    ],
    whatMakesYouSpecial:
      "你的同理心和溫暖，營造出一個讓人感到被聆聽、被重視、被關懷的安全空間。",
  },
  D: {
    archetype: "幕後英雄型",
    title: "社區統籌者",
    personality:
      "你是個出色的統籌者，注重細節。你可靠、務實，享受把事情做好的滿足感。你是那種能讓事情順利發生的人，卻不需要成為焦點。你擅長讓複雜的項目看起來輕鬆自如。",
    matches: [
      {
        roleId: "community_event_volunteer",
        note: "活動助手正是你的使命所在——你會成為公眾活動和企業義工日的組織支柱，讓一切保持友善、有條理、順暢進行。",
      },
      {
        roleId: "sports_class_leader",
        note: "你的組織能力同樣是擔任體育課堂帶領者的一大優勢，協助共同策劃課堂並讓一切運作如常。",
      },
    ],
    whatMakesYouSpecial:
      "你是讓整個義工計劃得以運作的可靠基石。你能化混亂為秩序，確保每個細節都妥善處理，讓其他人可以專注於自己的角色。",
  },
};

export function localizeQuizResult(result: QuizResult, lang: Lang): QuizResult {
  if (lang === "en") return result;
  return { ...result, ...quizResultsCopyZh[result.letter] };
}

export function tallyQuizAnswers(answers: QuizLetter[]): QuizLetter {
  const counts: Record<QuizLetter, number> = { A: 0, B: 0, C: 0, D: 0 };
  for (const answer of answers) {
    counts[answer] += 1;
  }
  return (["A", "B", "C", "D"] as QuizLetter[]).reduce((best, letter) =>
    counts[letter] > counts[best] ? letter : best,
  );
}

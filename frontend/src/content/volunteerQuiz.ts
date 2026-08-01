import type { VolunteerRoleId } from "./volunteer";

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
  },
};

export function tallyQuizAnswers(answers: QuizLetter[]): QuizLetter {
  const counts: Record<QuizLetter, number> = { A: 0, B: 0, C: 0, D: 0 };
  for (const answer of answers) {
    counts[answer] += 1;
  }
  return (["A", "B", "C", "D"] as QuizLetter[]).reduce((best, letter) =>
    counts[letter] > counts[best] ? letter : best,
  );
}

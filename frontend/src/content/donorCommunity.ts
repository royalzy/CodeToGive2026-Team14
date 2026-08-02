export type DonorCommunityCopy = {
  eyebrow: string;
  heroLead: string;
  heroEmphasis: string;
  heroBody: string;
  heroQuote: string;
  join: string;
  meet: string;
  supportersEyebrow: string;
  partnersEyebrow: string;
  partnersTitle: string;
  wallEyebrow: string;
  wallTitle: string;
  wallBody: string;
  pending: string;
  thanksEyebrow: string;
  thanksTitle: string;
  thanksBody: string;
};

export const donorCommunityCopy: Record<"en" | "zh", DonorCommunityCopy> = {
  en: {
    eyebrow: "Our community · Hong Kong",
    heroLead: "People making",
    heroEmphasis: "this possible.",
    heroBody:
      "1,284 supporters and 10 partner organisations have joined. Every number is a person who believes this work deserves to happen.",
    heroQuote:
      "The story is not how much we raised. It is how many people chose to care.",
    join: "Join the community",
    meet: "Meet our people",
    supportersEyebrow: "People making this possible",
    partnersEyebrow: "Alongside us",
    partnersTitle: "10 organisations sharing the work",
    wallEyebrow: "Donor wall · moderated",
    wallTitle: "Small messages. Real company.",
    wallBody:
      "New notes are visible to their author immediately. The Love 21 team reviews them before they appear publicly.",
    pending: "Visible only to you · awaiting review",
    thanksEyebrow: "A note from Love 21",
    thanksTitle: "Thank you for choosing to stand beside this community.",
    thanksBody:
      "Your support creates the steady conditions in which people can move, learn, work and belong. We will keep showing you where that support goes and what it makes possible.",
  },
  zh: {
    eyebrow: "我們的社群 · 香港",
    heroLead: "讓這一切發生的",
    heroEmphasis: "每一個人。",
    heroBody:
      "已有 1,284 位支持者和 10 家機構加入。每一個數字，都代表有人相信這件事值得發生。",
    heroQuote: "故事的重點不是籌得多少，而是有多少人選擇同行。",
    join: "加入這個社群",
    meet: "認識支持者",
    supportersEyebrow: "People making this possible",
    partnersEyebrow: "與我們同行",
    partnersTitle: "10 家機構一起把事情做好",
    wallEyebrow: "支持者留言牆 · 經審核",
    wallTitle: "短短一句，也能讓人感到同行。",
    wallBody:
      "新留言會立即顯示給作者本人，Love 21 團隊審核後才會公開。",
    pending: "只有你看得到 · 等待審核",
    thanksEyebrow: "Love 21 的一封話",
    thanksTitle: "謝謝你選擇站在這個社群身旁。",
    thanksBody:
      "你的支持讓大家能持續運動、學習、工作和找到歸屬。我們會清楚交代支持去了哪裡，以及它實際帶來了甚麼。",
  },
};

export const supporterFaces = [
  ["阿木", "#c96f50"], ["小鲸鱼", "#7f9679"], ["Annie", "#d6a14f"],
  ["Mountain", "#4f7380"], ["YL", "#a65767"], ["KM", "#8a674c"],
  ["晴", "#9ba979"], ["CW", "#4b424f"], ["安", "#c96f50"],
  ["T", "#7f9679"], ["R", "#d6a14f"], ["樂", "#4f7380"],
  ["家", "#a65767"], ["P", "#8a674c"], ["陳", "#9ba979"],
  ["N", "#4b424f"], ["星", "#c96f50"], ["浩", "#7f9679"],
  ["AR", "#d6a14f"], ["林", "#4f7380"], ["魚", "#a65767"],
  ["SK", "#8a674c"], ["善", "#9ba979"], ["L", "#4b424f"],
  ["JY", "#c96f50"], ["M", "#7f9679"], ["何", "#d6a14f"],
  ["W", "#4f7380"], ["AJ", "#a65767"], ["鄧", "#8a674c"],
] as const;

export const communityPartners = [
  ["AIA", "Health partner"],
  ["HKJC", "Community partner"],
  ["CUHK", "Knowledge partner"],
  ["KPMG", "Skills partner"],
  ["+6", "More organisations"],
] as const;

export const donorWallPosts = [
  {
    name: "小鲸鱼",
    message: "I hope every child feels seen.",
    time: "Today · 10:42",
    status: "public",
  },
  {
    name: "Annie",
    message: "So glad to be part of this community.",
    time: "Yesterday",
    status: "public",
  },
  {
    name: "Mountain",
    message: "Thank you for continuing this work.",
    time: "2 days ago",
    status: "public",
  },
  {
    name: "阿木",
    message: "May every child have space to shine at their own pace.",
    time: "Just now",
    status: "pending",
  },
] as const;

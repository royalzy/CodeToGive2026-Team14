// Traditional Chinese content mirror of the English content barrel.
// Short, high-visibility copy is translated; member names and long-form
// body copy stay in English to guarantee accuracy. Extend as translations
// are reviewed.

import type {
  AllocationShare,
  Badge,
  BookableEvent,
  FamilyAccount,
  Level,
  Member,
  Metric,
  Milestone,
  Moment,
  Program,
  VolunteerOpportunity,
  WishlistItem,
} from "./types";

export const navigation = [
  { label: "影響力", href: "/impact" },
  { label: "義工服務", href: "/volunteer" },
  { label: "捐款", href: "/donate" },
  { label: "會員", href: "/members" },
  { label: "企業夥伴", href: "/partners" },
  { label: "支援", href: "/help" },
  { label: "學習資源", href: "/resources" },
];

export const personas = [
  { icon: "❤️", label: "我想當義工", description: "付出時間與心力，支持這個社群。", href: "/volunteer" },
  { icon: "💰", label: "我想捐款", description: "清楚了解您的捐款支持了甚麼。", href: "/donate" },
  { icon: "👨‍👩‍👦", label: "我是會員或家人", description: "登入瀏覽課程並報名活動。", href: "/login" },
  { icon: "🏢", label: "我是企業夥伴", description: "了解贊助及企業社會責任機會。", href: "/partners" },
  { icon: "🌍", label: "我想了解更多", description: "認識神經多樣性、共融及如何協助。", href: "/resources" },
];

export const metrics: Metric[] = [
  { value: "680+", label: "受助家庭", detail: "一起成長的社群。", accent: "red" },
  { value: "900+", label: "每月活動", detail: "由經驗豐富的教練帶領。", accent: "yellow" },
  { value: "90+", label: "活動種類", detail: "發掘新才能的空間。", accent: "blue" },
  { value: "500+", label: "每月義工時數", detail: "每週真摯的連繫。", accent: "teal" },
];

export const programs: Program[] = [
  {
    slug: "sports",
    title: "體育及健身",
    eyebrow: "行動",
    description: "從地滾球、拳擊到瑜伽和龍舟，會員在挑戰中鍛煉韌力。",
    accent: "red",
    outcomes: [
      { label: "協調", detail: "Balance, motor skills and physical confidence" },
      { label: "團隊合作", detail: "Collaboration, trust and shared goals" },
    ],
  },
  {
    slug: "community",
    title: "社區及教育",
    eyebrow: "連繫",
    description: "外展、表演和義工計劃為香港社區帶來真摯連繫。",
    accent: "blue",
    outcomes: [
      { label: "歸屬感", detail: "Meaningful relationships and community presence" },
      { label: "倡導", detail: "Public understanding and inclusion" },
    ],
  },
  {
    slug: "family_support",
    title: "家庭支援",
    eyebrow: "歸屬",
    description: "家庭和照顧者獲得實用支援、互相理解和同行社群。",
    accent: "teal",
    outcomes: [
      { label: "韌力", detail: "Practical guidance and emotional support" },
      { label: "連繫", detail: "Peer networks and shared experience" },
    ],
  },
  {
    slug: "nutrition",
    title: "營養及飲食",
    eyebrow: "成長",
    description: "全人指導支持可持續的健康習慣和身心安康。",
    accent: "orange",
    outcomes: [
      { label: "安康", detail: "Healthy routines and informed choices" },
      { label: "成長", detail: "Physical development and energy" },
    ],
  },
  {
    slug: "enrichment",
    title: "充實及介入",
    eyebrow: "茁壯",
    description: "創意和發展機會，讓興趣、自信和獨立成長。",
    accent: "yellow",
    outcomes: [
      { label: "創造力", detail: "Self-expression through arts and exploration" },
      { label: "獨立", detail: "Confidence to try, lead and grow" },
    ],
  },
];

export const crystalMilestones: Milestone[] = [
  { label: "嘗試", title: "發掘新活動", description: "Integrated sports sessions gave Crystal space to strengthen balance, coordination and thinking skills through play." },
  { label: "成長", title: "自信地參與", description: "She embraced activities and performances with increasing confidence, joy and maturity." },
  { label: "領導", title: "培訓為舞蹈助理", description: "A love of dance became a new opportunity: Crystal was selected to train as one of Love 21's dance assistants." },
];

export const volunteerInterests = programs.map(({ slug, title }) => ({
  value: slug,
  label: title,
}));

export const availabilityOptions = [
  { value: "weekday", label: "平日" },
  { value: "evening", label: "晚間" },
  { value: "weekend", label: "週末" },
  { value: "flexible", label: "時間彈性" },
];

export const donationPrograms = [
  { value: "general", label: "用於最需要的地方" },
  ...programs.map(({ slug, title }) => ({ value: slug, label: title })),
];

export const memberProfiles: Member[] = [
  {
    slug: "crystal",
    name: "Crystal",
    bio: "Crystal found her rhythm through sports and dance. Today, she trains as a dance assistant and inspires everyone around her with her energy, confidence and willingness to try anything.",
    photo: "/images/crystal-performing.jpg",
    accent: "red",
    milestones: crystalMilestones,
  },
  {
    slug: "ka-wai",
    name: "Ka Wai",
    bio: "Ka Wai started with nutrition workshops and discovered a love for cooking. He now helps prepare healthy meals for community events and shares recipes with other families.",
    photo: "/images/community-performance.jpg",
    accent: "orange",
    milestones: [
      { label: "探索", title: "在廚房建立自信", description: "Nutrition workshops gave Ka Wai a structured, hands-on way to learn about food and wellbeing." },
      { label: "分享", title: "為社區下廚", description: "He began contributing to community meals, sharing recipes and building pride in his work." },
      { label: "教導", title: "帶領營養課堂", description: "Ka Wai now co-leads introductory cooking sessions for new members and their families." },
    ],
  },
  {
    slug: "mei-ling",
    name: "Mei Ling",
    bio: "Mei Ling joined community programmes shy and quiet. Through performance and outreach, she found her voice and now speaks at public events about what inclusion means to her.",
    photo: "/images/sports-session.jpg",
    accent: "blue",
    milestones: [
      { label: "參與", title: "安靜的開始", description: "Mei Ling joined community sessions with hesitation, observing from the edge." },
      { label: "演出", title: "踏上舞台", description: "She participated in her first community performance and discovered a love for being seen." },
      { label: "發聲", title: "找到公眾聲音", description: "Mei Ling now shares her story at events, helping others understand the power of belonging." },
    ],
  },
];

export const moments: Moment[] = [
  { member: "Crystal", activity: "為20位會員帶領舞蹈熱身", date: "本週" },
  { member: "Ka Wai", activity: "在營養會分享新食譜", date: "3天前" },
  { member: "Mei Ling", activity: "於社區共融論壇發言", date: "上週" },
  { member: "Crystal", activity: "完成第50次舞蹈課堂", date: "2星期前" },
  { member: "Ka Wai", activity: "獲得健康烹飪徽章", date: "上月" },
  { member: "Mei Ling", activity: "於年度匯演表演", date: "上月" },
];

export const opportunities: VolunteerOpportunity[] = [
  { id: "opp-1", title: "週六體育助理", program: "sports", date: "9 Aug 2025", time: "10:00 – 12:00", spots: 4, role: "與教練一同支援地滾球及拳擊課堂", accent: "red" },
  { id: "opp-2", title: "社區表演準備", program: "community", date: "12 Aug 2025", time: "14:00 – 16:00", spots: 6, role: "協助舞台、服裝及排練支援", accent: "blue" },
  { id: "opp-3", title: "家庭支援下午", program: "family_support", date: "14 Aug 2025", time: "13:00 – 15:00", spots: 3, role: "歡迎家庭並協助小組交流", accent: "teal" },
  { id: "opp-4", title: "營養工作坊助理", program: "nutrition", date: "16 Aug 2025", time: "11:00 – 13:00", spots: 5, role: "協助備餐及引導小組", accent: "orange" },
  { id: "opp-5", title: "創意藝術課堂", program: "enrichment", date: "19 Aug 2025", time: "10:00 – 12:00", spots: 4, role: "支援會員參與繪畫、手工和音樂", accent: "yellow" },
  { id: "opp-6", title: "龍舟訓練日", program: "sports", date: "23 Aug 2025", time: "08:00 – 12:00", spots: 8, role: "毋須經驗，與團隊一起上船", accent: "red" },
];

export const wishlistItems: WishlistItem[] = [
  { id: "wish-1", label: "地滾球套裝（比賽級）", program: "sports", cost: 800, description: "Replace a well-loved set used by over 40 members each week." },
  { id: "wish-2", label: "營養工作坊食材（一個月）", program: "nutrition", cost: 1200, description: "Fresh ingredients for cooking sessions that teach healthy habits." },
  { id: "wish-3", label: "表演服裝（10套）", program: "community", cost: 2500, description: "Help members shine on stage at the annual community showcase." },
  { id: "wish-4", label: "美術用品包", program: "enrichment", cost: 600, description: "Paints, brushes and materials for creative expression sessions." },
  { id: "wish-5", label: "家庭支援資源套（20份）", program: "family_support", cost: 1500, description: "Practical guides and tools for families navigating daily support." },
  { id: "wish-6", label: "龍舟槳套裝", program: "sports", cost: 3000, description: "Equip the growing dragon boat team with quality paddles." },
];

export const allocation: AllocationShare[] = [
  { program: "sports", percentage: 30, funds: "教練、器材及場地租用" },
  { program: "nutrition", percentage: 20, funds: "營養師工作坊及新鮮食材" },
  { program: "community", percentage: 20, funds: "外展活動及表演計劃" },
  { program: "enrichment", percentage: 15, funds: "創意課堂及介入工具" },
  { program: "family_support", percentage: 15, funds: "照顧者資源及輔導服務" },
];

export const levels: Level[] = [
  { name: "第一步", minPoints: 0 },
  { name: "好奇學習者", minPoints: 100 },
  { name: "社群建設者", minPoints: 300 },
  { name: "自信建立者", minPoints: 600 },
  { name: "能力冠軍", minPoints: 1000 },
];

export const badges: Badge[] = [
  { id: "first-activity", label: "首次活動", description: "出席第一次課堂", threshold: 1 },
  { id: "five-sessions", label: "五次紀錄", description: "出席五次課堂", threshold: 5 },
  { id: "team-player", label: "團隊成員", description: "於社區活動中協助", threshold: 1 },
  { id: "streak-4", label: "連續一個月", description: "連續四星期保持活躍", threshold: 4 },
  { id: "dance-star", label: "舞蹈之星", description: "於舞台上表演", threshold: 1 },
  { id: "kitchen-hero", label: "廚房英雄", description: "帶領烹飪課堂", threshold: 1 },
];

export const bookableEvents: BookableEvent[] = [
  { id: "bev-1", title: "週六體育：地滾球及拳擊", program: "sports", date: "9 Aug 2025", time: "10:00 – 12:00", spots: 4, location: "Love 21 體育館", ageRange: "8–18", accent: "red" },
  { id: "bev-2", title: "創意藝術下午", program: "enrichment", date: "10 Aug 2025", time: "14:00 – 16:00", spots: 6, location: "Love 21 藝術工作室", ageRange: "6–14", accent: "yellow" },
  { id: "bev-3", title: "營養工作坊：健康小食", program: "nutrition", date: "11 Aug 2025", time: "11:00 – 13:00", spots: 5, location: "Love 21 廚房", ageRange: "10–18", accent: "orange" },
  { id: "bev-4", title: "社區表演綵排", program: "community", date: "12 Aug 2025", time: "14:00 – 16:00", spots: 8, location: "社區禮堂", ageRange: "所有年齡", accent: "blue" },
  { id: "bev-5", title: "家庭支援小組", program: "family_support", date: "14 Aug 2025", time: "10:00 – 11:30", spots: 10, location: "Love 21 家庭室", ageRange: "家長及照顧者", accent: "teal" },
  { id: "bev-6", title: "龍舟訓練", program: "sports", date: "16 Aug 2025", time: "08:00 – 11:00", spots: 12, location: "赤柱海灘", ageRange: "14+", accent: "red" },
  { id: "bev-7", title: "音樂與律動", program: "enrichment", date: "18 Aug 2025", time: "10:00 – 11:30", spots: 8, location: "Love 21 工作室", ageRange: "5–12", accent: "yellow" },
  { id: "bev-8", title: "週六體育：瑜伽及平衡", program: "sports", date: "23 Aug 2025", time: "10:00 – 11:30", spots: 6, location: "Love 21 體育館", ageRange: "8–18", accent: "red" },
];

export const demoFamilies: FamilyAccount[] = [
  { id: "fam-1", name: "Sarah 的家庭", memberSlugs: ["crystal", "ka-wai"] },
  { id: "fam-2", name: "陳先生一家", memberSlugs: ["mei-ling"] },
];

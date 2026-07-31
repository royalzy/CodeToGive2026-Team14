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
  { label: "Impact", href: "/impact" },
  { label: "Volunteer", href: "/volunteer" },
  { label: "Donate", href: "/donate" },
  { label: "Members", href: "/members" },
  { label: "Partners", href: "/partners" },
  { label: "Help", href: "/help" },
  { label: "Resources", href: "/resources" },
] as const;

export const metrics: Metric[] = [
  {
    value: "680+",
    label: "families supported",
    detail: "A community growing together.",
    accent: "red",
  },
  {
    value: "900+",
    label: "activities each month",
    detail: "Led by experienced coaches.",
    accent: "yellow",
  },
  {
    value: "90+",
    label: "types of activities",
    detail: "Space to discover new strengths.",
    accent: "blue",
  },
  {
    value: "500+",
    label: "volunteer hours monthly",
    detail: "Real connection, week after week.",
    accent: "teal",
  },
];

export const programs: Program[] = [
  {
    slug: "sports",
    title: "Sports & fitness",
    eyebrow: "Move",
    description:
      "From bocce and boxing to yoga and dragon boat racing, members challenge themselves and build resilience.",
    accent: "red",
    outcomes: [
      { label: "Coordination", detail: "Balance, motor skills and physical confidence" },
      { label: "Teamwork", detail: "Collaboration, trust and shared goals" },
    ],
  },
  {
    slug: "community",
    title: "Community & education",
    eyebrow: "Connect",
    description:
      "Outreach, performance and volunteer programmes spark meaningful connection across Hong Kong.",
    accent: "blue",
    outcomes: [
      { label: "Belonging", detail: "Meaningful relationships and community presence" },
      { label: "Advocacy", detail: "Public understanding and inclusion" },
    ],
  },
  {
    slug: "family_support",
    title: "Family support",
    eyebrow: "Belong",
    description:
      "Families and caregivers find practical support, shared understanding and a community beside them.",
    accent: "teal",
    outcomes: [
      { label: "Resilience", detail: "Practical guidance and emotional support" },
      { label: "Connection", detail: "Peer networks and shared experience" },
    ],
  },
  {
    slug: "nutrition",
    title: "Nutrition & dietetics",
    eyebrow: "Thrive",
    description:
      "Whole-person guidance supports sustainable habits and wellbeing beyond a single activity.",
    accent: "orange",
    outcomes: [
      { label: "Wellbeing", detail: "Healthy routines and informed choices" },
      { label: "Growth", detail: "Physical development and energy" },
    ],
  },
  {
    slug: "enrichment",
    title: "Enrichment & intervention",
    eyebrow: "Grow",
    description:
      "Creative and developmental opportunities make room for interests, confidence and independence.",
    accent: "yellow",
    outcomes: [
      { label: "Creativity", detail: "Self-expression through arts and exploration" },
      { label: "Independence", detail: "Confidence to try, lead and grow" },
    ],
  },
];

export const crystalMilestones: Milestone[] = [
  {
    label: "Try",
    title: "Discovering new activities",
    description:
      "Integrated sports sessions gave Crystal space to strengthen balance, coordination and thinking skills through play.",
  },
  {
    label: "Grow",
    title: "Showing up with confidence",
    description:
      "She embraced activities and performances with increasing confidence, joy and maturity.",
  },
  {
    label: "Lead",
    title: "Training as a dance assistant",
    description:
      "A love of dance became a new opportunity: Crystal was selected to train as one of Love 21's dance assistants.",
  },
];

export const volunteerInterests = programs.map(({ slug, title }) => ({
  value: slug,
  label: title,
}));

export const availabilityOptions = [
  { value: "weekday", label: "Weekdays" },
  { value: "evening", label: "Evenings" },
  { value: "weekend", label: "Weekends" },
  { value: "flexible", label: "I'm flexible" },
] as const;

export const donationPrograms = [
  { value: "general", label: "Where it is most useful" },
  ...programs.map(({ slug, title }) => ({ value: slug, label: title })),
] as const;

// ---------------------------------------------------------------------------
// Member portal
// ---------------------------------------------------------------------------

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
      {
        label: "Explore",
        title: "Finding confidence in the kitchen",
        description:
          "Nutrition workshops gave Ka Wai a structured, hands-on way to learn about food and wellbeing.",
      },
      {
        label: "Share",
        title: "Cooking for the community",
        description:
          "He began contributing to community meals, sharing recipes and building pride in his work.",
      },
      {
        label: "Teach",
        title: "Leading nutrition sessions",
        description:
          "Ka Wai now co-leads introductory cooking sessions for new members and their families.",
      },
    ],
  },
  {
    slug: "mei-ling",
    name: "Mei Ling",
    bio: "Mei Ling joined community programmes shy and quiet. Through performance and outreach, she found her voice and now speaks at public events about what inclusion means to her.",
    photo: "/images/sports-session.jpg",
    accent: "blue",
    milestones: [
      {
        label: "Arrive",
        title: "A quiet beginning",
        description:
          "Mei Ling joined community sessions with hesitation, observing from the edge.",
      },
      {
        label: "Perform",
        title: "Stepping onto the stage",
        description:
          "She participated in her first community performance and discovered a love for being seen.",
      },
      {
        label: "Speak",
        title: "Finding her public voice",
        description:
          "Mei Ling now shares her story at events, helping others understand the power of belonging.",
      },
    ],
  },
];

export const moments: Moment[] = [
  { member: "Crystal", activity: "Led a dance warm-up for 20 members", date: "This week" },
  { member: "Ka Wai", activity: "Shared a new recipe at nutrition club", date: "3 days ago" },
  { member: "Mei Ling", activity: "Spoke at a community inclusion forum", date: "Last week" },
  { member: "Crystal", activity: "Completed 50th dance session", date: "2 weeks ago" },
  { member: "Ka Wai", activity: "Earned Healthy Cooking badge", date: "Last month" },
  { member: "Mei Ling", activity: "Performed at the annual showcase", date: "Last month" },
];

// ---------------------------------------------------------------------------
// Volunteer calendar
// ---------------------------------------------------------------------------

export const opportunities: VolunteerOpportunity[] = [
  {
    id: "opp-1",
    title: "Saturday Sports Assistant",
    program: "sports",
    date: "9 Aug 2025",
    time: "10:00 – 12:00",
    spots: 4,
    role: "Support bocce and boxing sessions alongside coaches",
    accent: "red",
  },
  {
    id: "opp-2",
    title: "Community Performance Prep",
    program: "community",
    date: "12 Aug 2025",
    time: "14:00 – 16:00",
    spots: 6,
    role: "Help with staging, costumes and rehearsal support",
    accent: "blue",
  },
  {
    id: "opp-3",
    title: "Family Support Afternoon",
    program: "family_support",
    date: "14 Aug 2025",
    time: "13:00 – 15:00",
    spots: 3,
    role: "Welcome families and help facilitate group conversations",
    accent: "teal",
  },
  {
    id: "opp-4",
    title: "Nutrition Workshop Helper",
    program: "nutrition",
    date: "16 Aug 2025",
    time: "11:00 – 13:00",
    spots: 5,
    role: "Assist with food prep and guide small groups",
    accent: "orange",
  },
  {
    id: "opp-5",
    title: "Creative Arts Session",
    program: "enrichment",
    date: "19 Aug 2025",
    time: "10:00 – 12:00",
    spots: 4,
    role: "Support members exploring painting, craft and music",
    accent: "yellow",
  },
  {
    id: "opp-6",
    title: "Dragon Boat Training Day",
    program: "sports",
    date: "23 Aug 2025",
    time: "08:00 – 12:00",
    spots: 8,
    role: "Join the team on the water — no experience needed",
    accent: "red",
  },
];

// ---------------------------------------------------------------------------
// Donation wishlist
// ---------------------------------------------------------------------------

export const wishlistItems: WishlistItem[] = [
  {
    id: "wish-1",
    label: "Bocce set (competition grade)",
    program: "sports",
    cost: 800,
    description: "Replace a well-loved set used by over 40 members each week.",
  },
  {
    id: "wish-2",
    label: "Nutrition workshop ingredients (one month)",
    program: "nutrition",
    cost: 1200,
    description: "Fresh ingredients for cooking sessions that teach healthy habits.",
  },
  {
    id: "wish-3",
    label: "Performance costumes (set of 10)",
    program: "community",
    cost: 2500,
    description: "Help members shine on stage at the annual community showcase.",
  },
  {
    id: "wish-4",
    label: "Art supplies pack",
    program: "enrichment",
    cost: 600,
    description: "Paints, brushes and materials for creative expression sessions.",
  },
  {
    id: "wish-5",
    label: "Family support resource kits (×20)",
    program: "family_support",
    cost: 1500,
    description: "Practical guides and tools for families navigating daily support.",
  },
  {
    id: "wish-6",
    label: "Dragon boat paddle set",
    program: "sports",
    cost: 3000,
    description: "Equip the growing dragon boat team with quality paddles.",
  },
];

export const allocation: AllocationShare[] = [
  { program: "sports", percentage: 30, funds: "Coaching, equipment and venue hire" },
  { program: "nutrition", percentage: 20, funds: "Dietitian-led workshops and fresh ingredients" },
  { program: "community", percentage: 20, funds: "Outreach events and performance programmes" },
  { program: "enrichment", percentage: 15, funds: "Creative sessions and intervention tools" },
  { program: "family_support", percentage: 15, funds: "Caregiver resources and counselling access" },
];

// ---------------------------------------------------------------------------
// Gamification (Duolingo-style)
// ---------------------------------------------------------------------------

export const levels: Level[] = [
  { name: "First Steps", minPoints: 0 },
  { name: "Curious Learner", minPoints: 100 },
  { name: "Community Maker", minPoints: 300 },
  { name: "Confidence Builder", minPoints: 600 },
  { name: "Ability Champion", minPoints: 1000 },
];

export const badges: Badge[] = [
  { id: "first-activity", label: "First Activity", description: "Attended your first session", threshold: 1 },
  { id: "five-sessions", label: "Five and Counting", description: "Attended five sessions", threshold: 5 },
  { id: "team-player", label: "Team Player", description: "Helped at a community event", threshold: 1 },
  { id: "streak-4", label: "Monthly Streak", description: "Active for four weeks in a row", threshold: 4 },
  { id: "dance-star", label: "Dance Star", description: "Performed on stage", threshold: 1 },
  { id: "kitchen-hero", label: "Kitchen Hero", description: "Led a cooking session", threshold: 1 },
];

// ---------------------------------------------------------------------------
// Personas (home page)
// ---------------------------------------------------------------------------

export const personas = [
  {
    icon: "❤️",
    label: "I want to volunteer",
    description: "Give your time and energy to support the community.",
    href: "/volunteer",
  },
  {
    icon: "💰",
    label: "I want to donate",
    description: "See exactly what your contribution supports.",
    href: "/donate",
  },
  {
    icon: "👨‍👩‍👦",
    label: "I'm a member or family",
    description: "Sign in to browse programmes and book activities.",
    href: "/login",
  },
  {
    icon: "🏢",
    label: "I'm a corporate partner",
    description: "Explore sponsorship and CSR opportunities.",
    href: "/partners",
  },
  {
    icon: "🌍",
    label: "I want to learn more",
    description: "Understand neurodiversity, inclusion and how to help.",
    href: "/resources",
  },
] as const;

// ---------------------------------------------------------------------------
// Member portal — booking
// ---------------------------------------------------------------------------

export const bookableEvents: BookableEvent[] = [
  {
    id: "bev-1",
    title: "Saturday Sports: Bocce & Boxing",
    program: "sports",
    date: "9 Aug 2025",
    time: "10:00 – 12:00",
    spots: 4,
    location: "Love 21 Sports Hall",
    ageRange: "8–18",
    accent: "red",
  },
  {
    id: "bev-2",
    title: "Creative Arts Afternoon",
    program: "enrichment",
    date: "10 Aug 2025",
    time: "14:00 – 16:00",
    spots: 6,
    location: "Love 21 Art Studio",
    ageRange: "6–14",
    accent: "yellow",
  },
  {
    id: "bev-3",
    title: "Nutrition Workshop: Healthy Snacks",
    program: "nutrition",
    date: "11 Aug 2025",
    time: "11:00 – 13:00",
    spots: 5,
    location: "Love 21 Kitchen",
    ageRange: "10–18",
    accent: "orange",
  },
  {
    id: "bev-4",
    title: "Community Performance Rehearsal",
    program: "community",
    date: "12 Aug 2025",
    time: "14:00 – 16:00",
    spots: 8,
    location: "Community Hall",
    ageRange: "All ages",
    accent: "blue",
  },
  {
    id: "bev-5",
    title: "Family Support Circle",
    program: "family_support",
    date: "14 Aug 2025",
    time: "10:00 – 11:30",
    spots: 10,
    location: "Love 21 Family Room",
    ageRange: "Parents & carers",
    accent: "teal",
  },
  {
    id: "bev-6",
    title: "Dragon Boat Training",
    program: "sports",
    date: "16 Aug 2025",
    time: "08:00 – 11:00",
    spots: 12,
    location: "Stanley Beach",
    ageRange: "14+",
    accent: "red",
  },
  {
    id: "bev-7",
    title: "Music & Movement",
    program: "enrichment",
    date: "18 Aug 2025",
    time: "10:00 – 11:30",
    spots: 8,
    location: "Love 21 Studio",
    ageRange: "5–12",
    accent: "yellow",
  },
  {
    id: "bev-8",
    title: "Saturday Sports: Yoga & Balance",
    program: "sports",
    date: "23 Aug 2025",
    time: "10:00 – 11:30",
    spots: 6,
    location: "Love 21 Sports Hall",
    ageRange: "8–18",
    accent: "red",
  },
];

export const demoFamilies: FamilyAccount[] = [
  { id: "fam-1", name: "Sarah's family", memberSlugs: ["crystal", "ka-wai"] },
  { id: "fam-2", name: "Mr. Chan's family", memberSlugs: ["mei-ling"] },
];


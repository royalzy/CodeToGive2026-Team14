export type DashboardCopy = {
  eyebrow: string;
  welcome: (name: string) => string;
  signOut: string;
  alreadyBooked: string;
  bookingLimitReached: string;
  bookedSuccess: string;
  yourMembersEyebrow: string;
  whoBookingTitle: string;
  bookingsThisWeek: (count: number, max: number) => string;
  browseAndBookEyebrow: string;
  availableSessionsTitle: string;
  chooseSessionBody: string;
  agesLabel: string;
  spotsLabel: string;
  signUpSuffix: string;
  yourCalendarEyebrow: string;
  upcomingSessionsTitle: string;
  bookedForLabel: string;
};

export const dashboardCopy: Record<"en" | "zh", DashboardCopy> = {
  en: {
    eyebrow: "Family dashboard",
    welcome: (name) => `Welcome, ${name}`,
    signOut: "Sign out",
    alreadyBooked: "Already booked for this session.",
    bookingLimitReached: "Booking limit reached for this week or day.",
    bookedSuccess: "Booked! Check your upcoming sessions below.",
    yourMembersEyebrow: "Your members",
    whoBookingTitle: "Who are you booking for?",
    bookingsThisWeek: (count, max) => `${count} of ${max} bookings this week`,
    browseAndBookEyebrow: "Browse and book",
    availableSessionsTitle: "Available sessions",
    chooseSessionBody: "Choose a session and select which member to sign up.",
    agesLabel: "Ages",
    spotsLabel: "spots",
    signUpSuffix: "Sign up",
    yourCalendarEyebrow: "Your calendar",
    upcomingSessionsTitle: "Upcoming sessions",
    bookedForLabel: "Booked for:",
  },
  zh: {
    eyebrow: "家庭專區",
    welcome: (name) => `歡迎，${name}`,
    signOut: "登出",
    alreadyBooked: "已報名此場次。",
    bookingLimitReached: "已達本週或本日的報名上限。",
    bookedSuccess: "已成功報名！請於下方查看即將舉行的場次。",
    yourMembersEyebrow: "你的家庭成員",
    whoBookingTitle: "要為哪位成員報名？",
    bookingsThisWeek: (count, max) => `本週已報名 ${count} / ${max} 次`,
    browseAndBookEyebrow: "瀏覽及報名",
    availableSessionsTitle: "可供報名的場次",
    chooseSessionBody: "選擇場次並選取要報名的成員。",
    agesLabel: "年齡",
    spotsLabel: "個名額",
    signUpSuffix: "報名",
    yourCalendarEyebrow: "你的日程",
    upcomingSessionsTitle: "即將舉行的場次",
    bookedForLabel: "已為以下成員報名：",
  },
};

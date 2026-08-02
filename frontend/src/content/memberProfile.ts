export type MemberProfileCopy = {
  notFoundEyebrow: string;
  notFoundTitle: string;
  notFoundBody: string;
  journeyEyebrow: (name: string) => string;
  activitiesLabel: string;
  eventsHelpedLabel: string;
  pointsEarned: (points: number, activityLabel: string) => string;
  demoGamificationEyebrow: string;
  logActivityTitle: string;
  profileHint: string;
  activityOptions: { id: "session" | "event" | "share" | "lead"; label: string; pts: string }[];
  growthStoryEyebrow: string;
  milestonesTitle: string;
  achievementsEyebrow: string;
  badgesEarnedTitle: string;
  badgesBody: string;
  noBadgesYet: string;
};

export const memberProfileCopy: Record<"en" | "zh", MemberProfileCopy> = {
  en: {
    notFoundEyebrow: "Not found",
    notFoundTitle: "This member profile is not available yet.",
    notFoundBody: "Return to the member portal to explore other profiles.",
    journeyEyebrow: (name) => `${name}'s journey`,
    activitiesLabel: "activities",
    eventsHelpedLabel: "events helped",
    pointsEarned: (points, activityLabel) => `+${points} points — ${activityLabel}`,
    demoGamificationEyebrow: "Demo gamification",
    logActivityTitle: "Log an activity",
    profileHint:
      "Tap a button to add points in-session. In a live service, points are earned through real participation.",
    activityOptions: [
      { id: "session", label: "Attend a session", pts: "+20" },
      { id: "event", label: "Help at an event", pts: "+50" },
      { id: "share", label: "Share your story", pts: "+10" },
      { id: "lead", label: "Lead an activity", pts: "+80" },
    ],
    growthStoryEyebrow: "Growth story",
    milestonesTitle: "Milestones",
    achievementsEyebrow: "Achievements",
    badgesEarnedTitle: "Badges earned",
    badgesBody: "Badges are unlocked as members participate, share and grow.",
    noBadgesYet: "Log your first activity to see badges appear here.",
  },
  zh: {
    notFoundEyebrow: "找不到頁面",
    notFoundTitle: "這個會員檔案暫時無法查看。",
    notFoundBody: "請返回會員專區瀏覽其他檔案。",
    journeyEyebrow: (name) => `${name} 的成長旅程`,
    activitiesLabel: "次活動",
    eventsHelpedLabel: "次協助活動",
    pointsEarned: (points, activityLabel) => `+${points} 分 — ${activityLabel}`,
    demoGamificationEyebrow: "示範遊戲化功能",
    logActivityTitle: "記錄一次活動",
    profileHint: "按下按鈕即可即時加分。在正式服務中，積分將透過真實參與獲得。",
    activityOptions: [
      { id: "session", label: "出席場次", pts: "+20" },
      { id: "event", label: "協助活動", pts: "+50" },
      { id: "share", label: "分享故事", pts: "+10" },
      { id: "lead", label: "帶領活動", pts: "+80" },
    ],
    growthStoryEyebrow: "成長故事",
    milestonesTitle: "里程碑",
    achievementsEyebrow: "成就",
    badgesEarnedTitle: "已獲得的徽章",
    badgesBody: "會員透過參與、分享和成長解鎖徽章。",
    noBadgesYet: "記錄你的第一次活動，即可在此查看徽章。",
  },
};

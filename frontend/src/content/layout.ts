export type LayoutCopy = {
  dashboard: string;
  signOut: string;
  signIn: string;
  openNavigation: string;
  footerTagline: string;
  footerExplore: string;
  footerPrototypeNoteHeading: string;
  footerPrototypeNoteBody: string;
  footerFollowUs: string;
  footerBottomLeft: string;
  footerBottomRight: string;
};

export const routePageTitles: Record<"en" | "zh", Record<string, string>> = {
  en: {
    "/volunteer": "Volunteer with Love 21",
    "/volunteer/match": "Volunteer personality quiz",
    "/volunteer/roles": "Browse volunteer roles",
    "/volunteer/sessions": "Browse volunteer sessions",
  },
  zh: {
    "/volunteer": "與 Love 21 一起做義工",
    "/volunteer/match": "義工性格配對測驗",
    "/volunteer/roles": "瀏覽義工崗位",
    "/volunteer/sessions": "瀏覽義工場次",
  },
};

export const layoutCopy: Record<"en" | "zh", LayoutCopy> = {
  en: {
    dashboard: "Dashboard",
    signOut: "Sign out",
    signIn: "Sign in",
    openNavigation: "Open navigation",
    footerTagline: "So much ability. So many ways to belong.",
    footerExplore: "Explore",
    footerPrototypeNoteHeading: "Prototype note",
    footerPrototypeNoteBody:
      "This hackathon experience stores demo donor profiles securely but does not process real donations.",
    footerFollowUs: "Follow us",
    footerBottomLeft: "Love 21 Foundation hackathon prototype",
    footerBottomRight: "#SoMuchAbility",
  },
  zh: {
    dashboard: "會員專區",
    signOut: "登出",
    signIn: "登入",
    openNavigation: "開啟導覽選單",
    footerTagline: "有無限可能，也有無數種歸屬的方式。",
    footerExplore: "探索",
    footerPrototypeNoteHeading: "原型說明",
    footerPrototypeNoteBody:
      "這個黑客松原型會安全地儲存示範捐款者資料，但不會處理真實捐款。",
    footerFollowUs: "追蹤我們",
    footerBottomLeft: "Love 21 基金會黑客松原型",
    footerBottomRight: "#SoMuchAbility",
  },
};

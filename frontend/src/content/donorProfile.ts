export type DonorProfileCopy = {
  privateDonorProfile: string;
  donorSignIn: string;
  welcomeBack: string;
  checkingSession: string;
  signingIn: string;
  viewMyProfile: string;
  passwordNote: string;
  emailLabel: string;
  passwordLabel: string;
  checkProfileError: string;
  signInError: string;
  yourDonorProfile: string;
  memberSince: (date: string) => string;
  giftWord: (count: number) => string;
  lifetimeGiving: string;
  prototypeDonationsRecorded: string;
  yourSharedImpact: string;
  latestGiftDirected: (amount: string, cause: string) => string;
  giftRecordedWord: (count: number) => string;
  totalSupport: string;
  traceable: string;
  impactAllocatedNote: string;
  firstImpactHeadline: string;
  firstImpactBody: string;
  recordBehindNumber: string;
  donationTimeline: string;
  prototypeConfirmed: string;
  referenceLabel: (id: string) => string;
  detailedRecordSummary: string;
  detailedRecordSubtitle: string;
  setInMotionHeading: (amount: string) => string;
  planningEstimateNote: string;
  noDonationsYet: string;
  quoteNote: string;
  consentNote: string;
  donationRecords: string;
  noRecordsYet: string;
  makeAnotherDonation: string;
  signOut: string;
};

export const donorProfileCopy: Record<"en" | "zh", DonorProfileCopy> = {
  en: {
    privateDonorProfile: "Private donor profile",
    donorSignIn: "Donor sign in",
    welcomeBack: "Welcome back",
    checkingSession: "Checking your session…",
    signingIn: "Signing in…",
    viewMyProfile: "View my profile",
    passwordNote: "Your password is securely verified by the donor service and is never displayed here.",
    emailLabel: "Email",
    passwordLabel: "Password",
    checkProfileError: "We could not check your donor profile. Please try signing in.",
    signInError: "We could not sign you in. Please try again.",
    yourDonorProfile: "Your donor profile",
    memberSince: (date) => `Member since ${date}`,
    giftWord: (count) => (count === 1 ? "gift" : "gifts"),
    lifetimeGiving: "Lifetime giving",
    prototypeDonationsRecorded: "Prototype donations recorded",
    yourSharedImpact: "Your shared impact",
    latestGiftDirected: (amount, cause) =>
      `Your latest HK$${amount} gift is directed to ${cause}. This is an expected-impact estimate until programme delivery is verified.`,
    giftRecordedWord: (count) => (count === 1 ? "gift recorded" : "gifts recorded"),
    totalSupport: "total support",
    traceable: "traceable in this profile",
    impactAllocatedNote:
      "Impact is allocated from actual programme spend at quarter close. We never claim one gift caused an outcome alone.",
    firstImpactHeadline: "Your first impact record will begin with your first gift.",
    firstImpactBody:
      "Your donor profile is ready. Every future prototype donation will be kept here with its programme direction and expected impact.",
    recordBehindNumber: "The record behind the number",
    donationTimeline: "Your donation timeline",
    prototypeConfirmed: "prototype confirmed",
    referenceLabel: (id) => `Reference: ${id}.`,
    detailedRecordSummary: "Detailed expected-impact record",
    detailedRecordSubtitle: "Programme work, access, verification and reporting",
    setInMotionHeading: (amount) => `What your HK$${amount} gift is expected to set in motion.`,
    planningEstimateNote:
      "This is a planning estimate, not a promise that one gift alone caused an outcome. It will be replaced with verified programme records after delivery.",
    noDonationsYet: "No donations yet. When you make one, today’s record will appear here immediately.",
    quoteNote: "Thank you for helping create steady, practical support that lets people keep showing up.",
    consentNote: "Participant imagery is shown with consent.",
    donationRecords: "Donation records",
    noRecordsYet: "No records yet",
    makeAnotherDonation: "Make another donation",
    signOut: "Sign out",
  },
  zh: {
    privateDonorProfile: "私人捐款者檔案",
    donorSignIn: "捐款者登入",
    welcomeBack: "歡迎回來",
    checkingSession: "正在檢查登入狀態…",
    signingIn: "登入中…",
    viewMyProfile: "查看我的檔案",
    passwordNote: "你的密碼會經捐款服務安全驗證，並不會在此顯示。",
    emailLabel: "電郵",
    passwordLabel: "密碼",
    checkProfileError: "未能查看你的捐款者檔案，請嘗試登入。",
    signInError: "未能為你登入，請再試一次。",
    yourDonorProfile: "你的捐款者檔案",
    memberSince: (date) => `會員起始日期：${date}`,
    giftWord: () => "次捐款",
    lifetimeGiving: "累計捐款",
    prototypeDonationsRecorded: "已記錄的原型捐款",
    yourSharedImpact: "你帶來的成效",
    latestGiftDirected: (amount, cause) =>
      `你最近一筆 HK$${amount} 的捐款用於「${cause}」。這是預期成效的估算，將於服務落實後核實。`,
    giftRecordedWord: () => "次已記錄的捐款",
    totalSupport: "總支持金額",
    traceable: "可於此檔案追蹤",
    impactAllocatedNote:
      "成效數字是根據每季實際服務支出分配。我們不會聲稱單一捐款單獨促成某項成果。",
    firstImpactHeadline: "你的第一筆捐款，將開啟屬於你的成效記錄。",
    firstImpactBody:
      "你的捐款者檔案已準備就緒。未來每一筆原型捐款，都會連同其服務方向及預期成效記錄在此。",
    recordBehindNumber: "數字背後的記錄",
    donationTimeline: "你的捐款時間軸",
    prototypeConfirmed: "原型已確認",
    referenceLabel: (id) => `參考編號：${id}。`,
    detailedRecordSummary: "詳細預期成效記錄",
    detailedRecordSubtitle: "服務工作、資源運用、核實及報告",
    setInMotionHeading: (amount) => `你這筆 HK$${amount} 捐款預期能帶來的改變。`,
    planningEstimateNote:
      "這是規劃階段的估算，並非承諾單一捐款能單獨促成某項成果。落實後將以核實的服務記錄取代。",
    noDonationsYet: "暫時未有捐款記錄。當你完成捐款後，今天的記錄會立即顯示於此。",
    quoteNote: "謝謝你協助建立穩定而實在的支援，讓大家能持續參與。",
    consentNote: "參與者相片已取得同意後展示。",
    donationRecords: "捐款記錄",
    noRecordsYet: "暫時未有記錄",
    makeAnotherDonation: "再次捐款",
    signOut: "登出",
  },
};

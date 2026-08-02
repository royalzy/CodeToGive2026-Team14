import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";

import {
  ApiError,
  createDonorProfile,
  createDonorSession,
  createDonationIntent,
  getDonationImpactOptions,
  previewDonationImpact,
  type CauseId,
  type DonorSummary,
  type DonationIntentResult,
  type ImpactPreview,
} from "../api/client";
import { track, trackFormStarted } from "../analytics/umami";
import {
  getAmountBucket,
  trackDonationEvent,
} from "../analytics";
import { AmountSelector } from "../components/donate/AmountSelector";
import {
  CauseSelector,
  type CauseChoice,
} from "../components/donate/CauseSelector";
import { DonationReview } from "../components/donate/DonationReview";
import {
  DonorDetailsForm,
  type DonorDetails,
  type DonorDetailsErrors,
} from "../components/donate/DonorDetailsForm";
import { DonationSuccess } from "../components/donate/DonationSuccess";
import {
  ImpactCard,
  type PreviewStatus,
} from "../components/donate/ImpactCard";
import { DEMO_DONOR_DETAILS, getLocalizedImpactMessage } from "../content/donations";
import { useLanguage } from "../hooks/useLanguage";
import { localizeDeep } from "../lib/zhConvert";

type FormStep = "gift" | "details" | "review" | "success";

const fallbackPresets = [200, 400, 600, 1000];

const demoDonorSuffix = Math.random().toString(36).slice(2, 7);

const initialDetails: DonorDetails = {
  donorName: "Chloe Wong",
  donorEmail: `chloe.wong+${demoDonorSuffix}@gmail.com`,
  donorNickname: `Chloe Wong`,
  donorPassword: "Demo1234!",
  profileMode: "new",
  anonymous: false,
  wantsAnonymousReceipt: false,
  anonymousReceiptEmail: "",
  consentToUpdates: false,
};

const stepLabelsCopy = {
  en: [
    { id: "gift" as const, label: "Your gift" },
    { id: "details" as const, label: "Your details" },
    { id: "review" as const, label: "Review" },
    { id: "success" as const, label: "Complete" },
  ],
  zh: [
    { id: "gift" as const, label: "捐款" },
    { id: "details" as const, label: "你的資料" },
    { id: "review" as const, label: "確認" },
    { id: "success" as const, label: "完成" },
  ],
} as const;

const transparencyRowsCopy = {
  en: [
    {
      label: "Direct programmes & coaching",
      percentage: 62,
      detail: "1,860 coaching hours for 126 young people, plus 48 family support sessions.",
    },
    {
      label: "Employment & life-skills",
      percentage: 21,
      detail: "32 paid work placements; 24 participants moved into sustained employment.",
    },
    {
      label: "Programme staff & safeguarding",
      percentage: 12,
      detail: "Two case workers, background checks, training and participant transport support.",
    },
    {
      label: "Operations & payment fees",
      percentage: 5,
      detail: "Rent, accounting, audit and card fees. Nothing hidden inside programme costs.",
    },
  ],
  zh: [
    {
      label: "直接服務項目及教練",
      percentage: 62,
      detail: "為 126 位年輕人提供 1,860 小時教練指導，加上 48 節家庭支援活動。",
    },
    {
      label: "就業及生活技能",
      percentage: 21,
      detail: "32 個有薪實習職位；24 位參加者成功獲得持續就業。",
    },
    {
      label: "服務團隊及保障措施",
      percentage: 12,
      detail: "兩位個案主任、背景審查、培訓及參加者交通支援。",
    },
    {
      label: "營運及付款手續費",
      percentage: 5,
      detail: "租金、會計、審計及信用卡手續費，全部公開透明，不隱藏於服務成本中。",
    },
  ],
} as const;

const causeImagesCopy: Record<"en" | "zh", Record<CauseId, { src: string; alt: string }>> = {
  en: {
    where_needed_most: {
      src: "/images/donate-1.png",
      alt: "Love 21 members taking part across our programmes",
    },
    sports: {
      src: "/images/sports-session.jpg",
      alt: "A member taking part in a supported sports session",
    },
    dance: {
      src: "/images/crystal-performing.jpg",
      alt: "A member performing with confidence",
    },
    nutrition: {
      src: "/images/donate-5.png",
      alt: "A dietitian-led nutrition and life-skills session",
    },
    family_support: {
      src: "/images/donate-3.png",
      alt: "Programme staff supporting a family session",
    },
  },
  zh: {
    where_needed_most: {
      src: "/images/donate-1.png",
      alt: "Love 21 會員參與我們的各項服務",
    },
    sports: {
      src: "/images/sports-session.jpg",
      alt: "會員參與有支援的體育活動",
    },
    dance: {
      src: "/images/crystal-performing.jpg",
      alt: "會員自信地演出",
    },
    nutrition: {
      src: "/images/donate-5.png",
      alt: "由營養師帶領的營養及生活技能活動",
    },
    family_support: {
      src: "/images/donate-3.png",
      alt: "服務團隊支援家庭活動",
    },
  },
};

const transparencyPhotosCopy = {
  en: [
    { id: "photo-1", src: "/images/donate-1.png", alt: "Young people in a coaching session" },
    { id: "photo-2", src: "/images/donate-2.png", alt: "Participants at a life-skills workshop" },
    { id: "photo-3", src: "/images/donate-3.png", alt: "A mentor working one-to-one with a participant" },
    { id: "photo-4", src: "/images/donate-4.png", alt: "Programme staff supporting a family session" },
  ],
  zh: [
    { id: "photo-1", src: "/images/donate-1.png", alt: "年輕人參與教練指導活動" },
    { id: "photo-2", src: "/images/donate-2.png", alt: "參加者出席生活技能工作坊" },
    { id: "photo-3", src: "/images/donate-3.png", alt: "導師與參加者一對一相處" },
    { id: "photo-4", src: "/images/donate-4.png", alt: "服務團隊支援家庭活動" },
  ],
} as const;

type DonateCopy = {
  transparencyEyebrow: string;
  headlineLine1: string;
  headlineLine2: string;
  remainingNote: string;
  evidenceLabel: string;
  evidenceBody: string;
  meetSupporters: string;
  donateNow: string;
  photosAria: string;
  prevPhoto: string;
  nextPhoto: string;
  donationProgressAria: string;
  donationFlowAria: string;
  simulationBanner: string;
  giftHeading: string;
  continueToDetails: string;
  giftFootnote: string;
  impactAria: string;
  detailsHeading: string;
  profileReady: (nickname: string) => string;
  back: string;
  openingProfile: string;
  reviewAndContinue: string;
  reviewHeading: string;
  reviewFootnote: string;
  confirming: string;
  confirmDonation: (amount: string) => string;
  optionsUnavailable: string;
  amountRangeError: string;
  receiptEmailRequired: string;
  validEmailRequired: string;
  nameTooLong: string;
  emailRequired: string;
  passwordTooShort: string;
  nicknameRequired: string;
  nicknameTooLong: string;
  profileOpenError: string;
  donationConfirmError: string;
};

const donateCopy: Record<"en" | "zh", DonateCopy> = {
  en: {
    transparencyEyebrow: "Jan–Jun 2026 · independently reviewed",
    headlineLine1: "HK$3.28m received.",
    headlineLine2: "HK$2.91m put to work.",
    remainingNote: "The remaining HK$370k is committed to programmes already scheduled for August–October.",
    evidenceLabel: "Evidence, not estimates:",
    evidenceBody: "attendance logs, coach records and 90-day employment follow-ups support these figures.",
    meetSupporters: "Meet our supporters →",
    donateNow: "Donate now",
    photosAria: "Photos from our programmes",
    prevPhoto: "Show previous photo",
    nextPhoto: "Show next photo",
    donationProgressAria: "Donation progress",
    donationFlowAria: "Donation flow",
    simulationBanner:
      "Hackathon simulation — no payment is taken. Donor profiles and their demo donation records are stored in the local service.",
    giftHeading: "How would you like to give?",
    continueToDetails: "Continue to your details",
    giftFootnote: "Secure payment · Receipt by email · You can change your mind before confirming",
    impactAria: "Your possible impact",
    detailsHeading: "Your details",
    profileReady: (nickname: string) => `Donor profile ready for ${nickname}.`,
    back: "Back",
    openingProfile: "Opening your donor profile…",
    reviewAndContinue: "Review & continue to secure payment",
    reviewHeading: "Review your prototype donation",
    reviewFootnote: "This confirms a prototype intention only. No money will be charged.",
    confirming: "Confirming…",
    confirmDonation: (amount: string) => `Confirm prototype donation of HK$${amount}`,
    optionsUnavailable: "Live choices are temporarily unavailable. Safe prototype defaults are shown.",
    amountRangeError: "Enter a whole HKD amount between HK$10 and HK$1,000,000.",
    receiptEmailRequired: "Enter an email to receive your receipt.",
    validEmailRequired: "Enter a valid email address.",
    nameTooLong: "Keep the name to 100 characters or fewer.",
    emailRequired: "Enter the email for your donor profile.",
    passwordTooShort: "Use at least 6 characters for this prototype.",
    nicknameRequired: "Choose a nickname for your donor profile.",
    nicknameTooLong: "Keep the nickname to 40 characters or fewer.",
    profileOpenError: "We could not open your donor profile. Please try again.",
    donationConfirmError: "We could not confirm the prototype donation. Please try again.",
  },
  zh: {
    transparencyEyebrow: "2026年1至6月 · 獨立審核",
    headlineLine1: "已收到 HK$3.28m 捐款。",
    headlineLine2: "已投入 HK$2.91m 於服務。",
    remainingNote: "餘下的 HK$370k 已承諾用於8月至10月已排定的服務項目。",
    evidenceLabel: "有實據，不是估算：",
    evidenceBody: "出席紀錄、教練記錄及90天就業跟進均支持以上數字。",
    meetSupporters: "認識我們的支持者 →",
    donateNow: "立即捐款",
    photosAria: "我們服務項目的相片",
    prevPhoto: "顯示上一張相片",
    nextPhoto: "顯示下一張相片",
    donationProgressAria: "捐款進度",
    donationFlowAria: "捐款流程",
    simulationBanner:
      "黑客松模擬 — 不會收取任何款項。捐款人帳戶及示範捐款紀錄儲存在本地服務中。",
    giftHeading: "你想以哪種方式捐款？",
    continueToDetails: "繼續填寫你的資料",
    giftFootnote: "安全付款 · 電郵收據 · 確認前仍可更改",
    impactAria: "你可能帶來的影響",
    detailsHeading: "你的資料",
    profileReady: (nickname: string) => `捐款人帳戶已準備就緒：${nickname}。`,
    back: "返回",
    openingProfile: "正在開啟你的捐款人帳戶…",
    reviewAndContinue: "確認並前往安全付款",
    reviewHeading: "確認你的模擬捐款",
    reviewFootnote: "此步驟僅確認模擬捐款意向，不會收取任何款項。",
    confirming: "確認中…",
    confirmDonation: (amount: string) => `確認模擬捐款 HK$${amount}`,
    optionsUnavailable: "即時選項暫時無法載入，現顯示安全的預設原型選項。",
    amountRangeError: "請輸入 HK$10 至 HK$1,000,000 之間的整數金額。",
    receiptEmailRequired: "請輸入接收收據的電郵地址。",
    validEmailRequired: "請輸入有效的電郵地址。",
    nameTooLong: "姓名請保持在100個字元或以下。",
    emailRequired: "請輸入你捐款人帳戶的電郵地址。",
    passwordTooShort: "此原型至少需要6個字元的密碼。",
    nicknameRequired: "請為你的捐款人帳戶選擇一個暱稱。",
    nicknameTooLong: "暱稱請保持在40個字元或以下。",
    profileOpenError: "未能開啟你的捐款人帳戶，請再試一次。",
    donationConfirmError: "未能確認此模擬捐款，請再試一次。",
  },
} as const;

function isValidAmount(amount: number): boolean {
  return Number.isInteger(amount) && amount >= 10 && amount <= 1_000_000;
}

function validateDetails(
  details: DonorDetails,
  copy: DonateCopy,
): DonorDetailsErrors {
  const errors: DonorDetailsErrors = {};
  const name = details.donorName.trim();
  const email = details.donorEmail.trim();

  if (details.anonymous) {
    if (details.wantsAnonymousReceipt) {
      const receiptEmail = details.anonymousReceiptEmail.trim();
      if (!receiptEmail) {
        errors.anonymousReceiptEmail = copy.receiptEmailRequired;
      } else if (!z.string().email().safeParse(receiptEmail).success) {
        errors.anonymousReceiptEmail = copy.validEmailRequired;
      }
    }
    return errors;
  }

  if (name.length > 100) {
    errors.donorName = copy.nameTooLong;
  }
  if (!email) {
    errors.donorEmail = copy.emailRequired;
  } else if (!z.string().email().safeParse(email).success) {
    errors.donorEmail = copy.validEmailRequired;
  }
  if (details.donorPassword.length < 6) {
    errors.donorPassword = copy.passwordTooShort;
  }
  if (details.profileMode === "new") {
    const nickname = details.donorNickname.trim();
    if (!nickname) {
      errors.donorNickname = copy.nicknameRequired;
    } else if (nickname.length > 40) {
      errors.donorNickname = copy.nicknameTooLong;
    }
  }
  return errors;
}

function isAbortError(error: unknown): boolean {
  return (
    (error instanceof DOMException && error.name === "AbortError") ||
    (error instanceof Error && error.name === "AbortError")
  );
}

export function DonatePage() {
  const { lang, t } = useLanguage();
  const copy = localizeDeep(donateCopy[lang === "en" ? "en" : "zh"], lang);
  const stepLabels = localizeDeep(stepLabelsCopy[lang === "en" ? "en" : "zh"], lang);
  const transparencyRows = localizeDeep(transparencyRowsCopy[lang === "en" ? "en" : "zh"], lang);
  const causeImages = localizeDeep(causeImagesCopy[lang === "en" ? "en" : "zh"], lang);
  const transparencyPhotos = localizeDeep(
    transparencyPhotosCopy[lang === "en" ? "en" : "zh"],
    lang,
  );
  const fallbackChoices: CauseChoice[] = t.donationPrograms.map((program) => ({
    causeId: program.value,
    label: program.label,
  }));

  const [step, setStep] = useState<FormStep>("gift");
  const [causeId, setCauseId] = useState<CauseId>("where_needed_most");
  const [amountInput, setAmountInput] = useState("400");
  const [presets, setPresets] = useState<number[]>(fallbackPresets);
  const [liveCauseIds, setLiveCauseIds] = useState<CauseId[] | null>(null);
  const [optionsNotice, setOptionsNotice] = useState<string | null>(null);
  const [preview, setPreview] = useState<ImpactPreview | null>(null);
  const [previewStatus, setPreviewStatus] =
    useState<PreviewStatus>("idle");
  const [details, setDetails] = useState<DonorDetails>(initialDetails);
  const [detailsErrors, setDetailsErrors] =
    useState<DonorDetailsErrors>({});
  const [amountError, setAmountError] = useState<string | undefined>();
  const [result, setResult] = useState<DonationIntentResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [authenticatedDonor, setAuthenticatedDonor] =
    useState<DonorSummary | null>(null);
  const [photoStackOrder, setPhotoStackOrder] = useState<string[]>(
    transparencyPhotos.map((photo) => photo.id),
  );

  const requestSequence = useRef(0);
  const pageViewTracked = useRef(false);
  const detailsStartedTracked = useRef(false);
  const causeTouched = useRef(false);
  const flowPanelRef = useRef<HTMLDivElement>(null);
  const previousStep = useRef<FormStep>(step);

  const amountHkd = Number(amountInput);
  const causeChoices: CauseChoice[] = useMemo(() => {
    if (!liveCauseIds) return fallbackChoices;
    return liveCauseIds.map((id) => ({
      causeId: id,
      label: t.donationPrograms.find((program) => program.value === id)?.label ?? id,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveCauseIds, t]);
  const selectedCauseLabel =
    causeChoices.find((choice) => choice.causeId === causeId)?.label ??
    "Love 21";
  const impactMessage = useMemo(
    () => getLocalizedImpactMessage(preview, lang),
    [preview, lang],
  );
  const donorDisplayName =
    authenticatedDonor?.nickname || details.donorNickname.trim() || details.donorName.trim();

  useEffect(() => {
    if (!pageViewTracked.current) {
      pageViewTracked.current = true;
      trackDonationEvent("donate_page_viewed");
    }
  }, []);

  useEffect(() => {
    if (previousStep.current !== step) {
      flowPanelRef.current?.focus();
      previousStep.current = step;
    }
  }, [step]);

  useEffect(() => {
    const controller = new AbortController();

    getDonationImpactOptions(controller.signal)
      .then((options) => {
        setPresets(options.preset_amounts_hkd);
        setLiveCauseIds(options.causes.map((cause) => cause.cause_id));
        if (!causeTouched.current) {
          setCauseId(options.default_cause_id);
        }
        setOptionsNotice(null);
      })
      .catch((error: unknown) => {
        if (!isAbortError(error)) {
          setOptionsNotice(copy.optionsUnavailable);
        }
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const sequence = ++requestSequence.current;

    if (!isValidAmount(amountHkd)) {
      setPreview(null);
      setPreviewStatus("idle");
      return;
    }

    const controller = new AbortController();
    setPreview(null);
    setPreviewStatus("loading");

    const timer = window.setTimeout(() => {
      previewDonationImpact(
        { cause_id: causeId, amount_hkd: amountHkd },
        controller.signal,
      )
        .then((nextPreview) => {
          if (requestSequence.current !== sequence) return;
          setPreview(nextPreview);
          setPreviewStatus("success");
          trackDonationEvent("impact_preview_displayed", {
            cause_id: nextPreview.cause_id,
            amount_bucket: getAmountBucket(nextPreview.amount_hkd),
            impact_mode: nextPreview.mode,
          });
        })
        .catch((error: unknown) => {
          if (isAbortError(error) || requestSequence.current !== sequence) {
            return;
          }
          setPreview(null);
          setPreviewStatus("error");
        });
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [amountHkd, causeId]);

  function selectCause(nextCauseId: CauseId) {
    causeTouched.current = true;
    setCauseId(nextCauseId);
    trackDonationEvent("donation_cause_selected", {
      cause_id: nextCauseId,
      amount_bucket: isValidAmount(amountHkd)
        ? getAmountBucket(amountHkd)
        : undefined,
    });
  }

  function selectPreset(nextAmount: number) {
    setAmountInput(String(nextAmount));
    setAmountError(undefined);
    trackDonationEvent("donation_amount_selected", {
      cause_id: causeId,
      amount_bucket: getAmountBucket(nextAmount),
    });
  }

  function confirmCustomAmount() {
    if (!isValidAmount(amountHkd)) return;
    trackDonationEvent("donation_amount_selected", {
      cause_id: causeId,
      amount_bucket: getAmountBucket(amountHkd),
    });
  }

  function continueToDetails() {
    if (!isValidAmount(amountHkd)) {
      setAmountError(copy.amountRangeError);
      return;
    }
    setAmountError(undefined);
    setStep("details");
  }

  async function continueToReview() {
    const errors = authenticatedDonor && !details.anonymous
      ? {}
      : validateDetails(details, copy);
    setDetailsErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setProfileError(null);

    if (!details.anonymous && authenticatedDonor === null) {
      setIsAuthenticating(true);
      try {
        const authResult = details.profileMode === "new"
          ? await createDonorProfile({
              email: details.donorEmail.trim(),
              password: details.donorPassword,
              nickname: details.donorNickname.trim(),
              name: details.donorName.trim() || null,
              consent_to_updates: details.consentToUpdates,
            })
          : await createDonorSession({
              email: details.donorEmail.trim(),
              password: details.donorPassword,
            });
        setAuthenticatedDonor(authResult.profile);
        setDetails((current) => ({ ...current, donorPassword: "" }));
      } catch (error) {
        const isDemoEmail =
          details.profileMode === "new" &&
          details.donorEmail.trim() === DEMO_DONOR_DETAILS.donorEmail;
        if (isDemoEmail && error instanceof ApiError && error.code === "email_taken") {
          // The demo details are reused across every run of this flow, so the
          // "create" call fails from the second run onward. Sign into the
          // profile it made the first time instead of surfacing an error —
          // for a demo, reusing that profile is fine.
          try {
            const authResult = await createDonorSession({
              email: DEMO_DONOR_DETAILS.donorEmail,
              password: DEMO_DONOR_DETAILS.donorPassword,
            });
            setAuthenticatedDonor(authResult.profile);
            setDetails((current) => ({ ...current, donorPassword: "" }));
          } catch {
            setProfileError(copy.profileOpenError);
            return;
          }
        } else if (error instanceof ApiError && error.code === "email_taken") {
          setDetailsErrors({ donorEmail: error.message });
          return;
        } else if (error instanceof ApiError && error.code === "nickname_taken") {
          setDetailsErrors({ donorNickname: error.message });
          return;
        } else {
          setProfileError(
            error instanceof Error
              ? error.message
              : copy.profileOpenError,
          );
          return;
        }
      } finally {
        setIsAuthenticating(false);
      }
    }
    if (!detailsStartedTracked.current) {
      detailsStartedTracked.current = true;
      trackDonationEvent("donation_details_started", {
        cause_id: causeId,
        amount_bucket: getAmountBucket(amountHkd),
        impact_mode: preview?.mode,
      });
    }
    setStep("review");
  }

  async function submitDonationIntent() {
    setSubmitError(null);
    setIsSubmitting(true);
    trackDonationEvent("donation_intent_submitted", {
      cause_id: causeId,
      amount_bucket: getAmountBucket(amountHkd),
      impact_mode: preview?.mode,
    });

    try {
      const nextResult = await createDonationIntent({
        cause_id: causeId,
        amount_hkd: amountHkd,
        anonymous: details.anonymous,
      });
      setResult(nextResult);
      setDetails((current) => ({ ...current, donorPassword: "" }));
      setStep("success");
      trackDonationEvent("donation_success_displayed", {
        cause_id: nextResult.impact.cause_id,
        amount_bucket: getAmountBucket(nextResult.impact.amount_hkd),
        impact_mode: nextResult.impact.mode,
      });
      track("donation_intent", {
        program: causeId,
        amount: amountHkd,
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : copy.donationConfirmError,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function bringPhotoToFront(id: string) {
    setPhotoStackOrder((current) => [
      id,
      ...current.filter((photoId) => photoId !== id),
    ]);
  }

  function cyclePhotoStack(direction: 1 | -1) {
    setPhotoStackOrder((current) => {
      if (direction === 1) {
        const [first, ...rest] = current;
        return [...rest, first];
      }
      const last = current[current.length - 1];
      return [last, ...current.slice(0, -1)];
    });
  }

  return (
    <div className="donate-a-page">
      <div className="donate-a-content">
        <div className="donate-a-main">
          <div className="donate-a-top-row">
            <article className="donate-a-transparency" aria-labelledby="donation-transparency-title">
              <p className="donor-community-eyebrow">{copy.transparencyEyebrow}</p>
              <h1 id="donation-transparency-title">
                {copy.headlineLine1}
                <br />
                {copy.headlineLine2}
              </h1>
              <p>{copy.remainingNote}</p>
              <div className="donate-a-allocation">
                {transparencyRows.map((item) => (
                  <div className="donate-a-allocation-row" key={item.label}>
                    <div><strong>{item.label}</strong><strong>{item.percentage}%</strong></div>
                    <i aria-hidden="true"><b style={{ width: `${item.percentage}%` }} /></i>
                    <p>{item.detail}</p>
                  </div>
                ))}
              </div>
              <div className="donate-a-evidence"><strong>{copy.evidenceLabel}</strong> {copy.evidenceBody}</div>
              <Link className="donor-community-button donor-community-button-primary donate-a-supporter-link" to="/supporter">
                {copy.meetSupporters}
              </Link>
              <button
                type="button"
                className="donate-a-evidence-cta"
                onClick={() =>
                  flowPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                <span aria-hidden="true">↓</span>
                {copy.donateNow}
              </button>
            </article>

            <aside className="donate-a-photos" aria-label={copy.photosAria}>
              <div className="donate-a-photo-stack">
                {transparencyPhotos.map((photo) => {
                  const depth = photoStackOrder.indexOf(photo.id);
                  return (
                    <button
                      key={photo.id}
                      type="button"
                      className="donate-a-photo-stack-item"
                      style={{
                        zIndex: photoStackOrder.length - depth,
                        "--rotate": `${depth * 4}deg`,
                        "--offset": `${depth * 6}px`,
                      } as CSSProperties}
                      onClick={() => bringPhotoToFront(photo.id)}
                    >
                      <img src={photo.src} alt={photo.alt} loading="lazy" />
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                className="donate-a-photo-nav donate-a-photo-nav-prev"
                aria-label={copy.prevPhoto}
                onClick={() => cyclePhotoStack(-1)}
              >
                ‹
              </button>
              <button
                type="button"
                className="donate-a-photo-nav donate-a-photo-nav-next"
                aria-label={copy.nextPhoto}
                onClick={() => cyclePhotoStack(1)}
              >
                ›
              </button>
            </aside>
          </div>

          <section
            className="donation-flow-card donate-a-flow-card"
            ref={flowPanelRef}
            tabIndex={-1}
            onFocusCapture={() => trackFormStarted("donation")}
            aria-label={copy.donationFlowAria}
          >
            <div className="donate-a-flow-topline">
              <ol className="donation-steps" aria-label={copy.donationProgressAria}>
                {stepLabels.map((item, index) => {
                  const currentIndex = stepLabels.findIndex(
                    (candidate) => candidate.id === step,
                  );
                  return (
                    <li
                      key={item.id}
                      className={index === currentIndex ? "current" : index < currentIndex ? "complete" : ""}
                      aria-current={index === currentIndex ? "step" : undefined}
                    >
                      <span className="donation-step-bar" />
                      <span className="donation-step-label">{item.label}</span>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="simulation-banner" role="note">
              {copy.simulationBanner}
            </div>

            {optionsNotice && <div className="form-alert form-notice" role="status">{optionsNotice}</div>}

            {step === "gift" && (
              <>
                <div className="form-heading">
                  <h2 id="donation-flow-title">{copy.giftHeading}</h2>
                </div>
                <div className="donate-a-gift-grid">
                  <div className="donate-a-gift-fields">
                    <CauseSelector choices={causeChoices} value={causeId} onChange={selectCause} />
                    <AmountSelector
                      presets={presets}
                      amount={amountInput}
                      error={amountError}
                      onPreset={selectPreset}
                      onChange={(value) => {
                        setAmountInput(value);
                        setAmountError(undefined);
                      }}
                      onCustomAmountConfirmed={confirmCustomAmount}
                    />
                    <button className="button button-dark button-full" type="button" onClick={continueToDetails}>
                      {copy.continueToDetails}
                    </button>
                    <p className="form-footnote">{copy.giftFootnote}</p>
                  </div>
                  <aside className="donate-a-gift-impact" aria-label={copy.impactAria}>
                    <div className="donate-a-impact-preview">
                      <ImpactCard
                        amountHkd={amountHkd}
                        impact={preview}
                        status={previewStatus}
                        imageSrc={causeImages[causeId].src}
                      />
                    </div>
                  </aside>
                </div>
              </>
            )}

            {step === "details" && (
              <>
                <div className="form-heading">
                  <h2 id="donation-flow-title">{copy.detailsHeading}</h2>
                </div>
                <DonorDetailsForm
                  value={details}
                  errors={detailsErrors}
                  onChange={(nextDetails) => {
                    setDetails(nextDetails);
                    setDetailsErrors({});
                  }}
                />
                {authenticatedDonor && !details.anonymous && (
                  <div className="form-alert form-notice" role="status">
                    {copy.profileReady(authenticatedDonor.nickname)}
                  </div>
                )}
                {profileError && <div className="form-alert" role="alert">{profileError}</div>}
                <div className="button-row">
                  <button className="button button-outline" type="button" onClick={() => setStep("gift")}>{copy.back}</button>
                  <button className="button button-dark" type="button" onClick={continueToReview} disabled={isAuthenticating}>
                    {isAuthenticating ? copy.openingProfile : copy.reviewAndContinue}
                  </button>
                </div>
              </>
            )}

            {step === "review" && (
              <>
                <div className="form-heading">
                  <h2 id="donation-flow-title">{copy.reviewHeading}</h2>
                </div>
                {submitError && <div className="form-alert" role="alert">{submitError}</div>}
                <DonationReview
                  amountHkd={amountHkd}
                  causeLabel={selectedCauseLabel}
                  donorName={donorDisplayName}
                  anonymous={details.anonymous}
                  impactMessage={impactMessage}
                />
                <div className="donate-a-impact-preview donate-a-impact-after">
                  <ImpactCard
                    amountHkd={amountHkd}
                    impact={preview}
                    status={previewStatus}
                    imageSrc={causeImages[causeId].src}
                  />
                </div>
                <p className="form-footnote review-footnote">{copy.reviewFootnote}</p>
                <div className="button-row">
                  <button className="button button-outline" type="button" onClick={() => setStep("details")} disabled={isSubmitting}>{copy.back}</button>
                  <button className="button button-dark" type="button" onClick={submitDonationIntent} disabled={isSubmitting}>
                    {isSubmitting ? copy.confirming : copy.confirmDonation(amountHkd.toLocaleString("en-HK"))}
                  </button>
                </div>
              </>
            )}

            {step === "success" && result && (
              <DonationSuccess
                result={result}
                donorName={donorDisplayName}
                donorEmail={details.anonymous ? details.anonymousReceiptEmail : details.donorEmail}
                anonymous={details.anonymous}
                causeLabel={selectedCauseLabel}
                onStayInvolved={() => trackDonationEvent("stay_involved_clicked", {
                  cause_id: result.impact.cause_id,
                  amount_bucket: getAmountBucket(result.impact.amount_hkd),
                  impact_mode: result.impact.mode,
                })}
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

import { DEMO_DONOR_DETAILS } from "../../content/donations";
import { useLanguage } from "../../hooks/useLanguage";
import { localizeDeep } from "../../lib/zhConvert";

export type DonorDetails = {
  donorName: string;
  donorEmail: string;
  donorNickname: string;
  donorPassword: string;
  profileMode: "existing" | "new";
  anonymous: boolean;
  wantsAnonymousReceipt: boolean;
  anonymousReceiptEmail: string;
  consentToUpdates: boolean;
};

export type DonorDetailsErrors = Partial<
  Record<"donorEmail" | "donorName" | "donorNickname" | "donorPassword" | "anonymousReceiptEmail", string>
>;

const copyByLang = {
  en: {
    giveModeLegend: "Choose whether to use a donor profile",
    giveWithProfileTitle: "Give with my profile",
    giveWithProfileNote: "See receipts and long-term impact in one place.",
    giveAnonymouslyTitle: "Give completely anonymously",
    giveAnonymouslyNote: "Continue with no profile, email or public name.",
    anonymousConfirmation:
      "Identity fields have been cleared. You can continue without creating or signing into a donor profile.",
    emailReceiptAnywayTitle: "Email me a receipt anyway",
    emailReceiptAnywayNote:
      "Your name still won't be shared or shown anywhere. We only use this address to send a copy of your receipt.",
    emailForReceiptLabel: "Email for receipt",
    emailPlaceholder: "you@example.com",
    profileDetailsLegend: "Profile details",
    haveProfileTitle: "I have a donor profile",
    haveProfileNote: "Sign in to keep receipts and impact records together.",
    createProfileTitle: "Create a donor profile",
    createProfileNote: "Choose a public nickname before payment.",
    fillDemoDetails: "Fill demo details",
    emailLabel: "Email",
    passwordLabel: "Password",
    passwordPlaceholder: "At least 6 characters",
    nicknameLabel: "Unique nickname",
    nicknamePlaceholder: "e.g. Alex_Chan",
    nameLabel: "Name (optional)",
    namePlaceholder: "e.g. Alex Chan",
    updatesConsent:
      "I would like occasional Love 21 updates. This preference is saved to a new donor profile, but no updates are sent by this prototype.",
  },
  zh: {
    giveModeLegend: "選擇是否使用捐款人帳戶",
    giveWithProfileTitle: "使用我的帳戶捐款",
    giveWithProfileNote: "在同一位置查看收據及長期成效。",
    giveAnonymouslyTitle: "完全匿名捐款",
    giveAnonymouslyNote: "無需建立帳戶、電郵或公開姓名，直接繼續。",
    anonymousConfirmation: "身份相關欄位已清除。你可以繼續進行，而毋須建立或登入捐款人帳戶。",
    emailReceiptAnywayTitle: "仍然電郵收據給我",
    emailReceiptAnywayNote: "你的姓名依然不會被分享或顯示。此電郵地址僅用作傳送收據副本。",
    emailForReceiptLabel: "接收收據的電郵地址",
    emailPlaceholder: "you@example.com",
    profileDetailsLegend: "帳戶資料",
    haveProfileTitle: "我已有捐款人帳戶",
    haveProfileNote: "登入以將收據及成效紀錄集中管理。",
    createProfileTitle: "建立捐款人帳戶",
    createProfileNote: "在付款前選擇一個公開暱稱。",
    fillDemoDetails: "填入示範資料",
    emailLabel: "電郵",
    passwordLabel: "密碼",
    passwordPlaceholder: "至少6個字元",
    nicknameLabel: "獨一無二的暱稱",
    nicknamePlaceholder: "例如：Alex_Chan",
    nameLabel: "姓名（選填）",
    namePlaceholder: "例如：Alex Chan",
    updatesConsent:
      "我想不定期收到 Love 21 的最新消息。此偏好設定會儲存至新的捐款人帳戶，惟此原型不會實際發送消息。",
  },
} as const;

export function DonorDetailsForm({
  value,
  errors,
  onChange,
}: {
  value: DonorDetails;
  errors: DonorDetailsErrors;
  onChange: (details: DonorDetails) => void;
}) {
  const { lang } = useLanguage();
  const copy = localizeDeep(copyByLang[lang === "en" ? "en" : "zh"], lang);

  function chooseAnonymous(anonymous: boolean) {
    onChange({
      ...value,
      anonymous,
      donorName: anonymous ? "" : value.donorName,
      donorEmail: anonymous ? "" : value.donorEmail,
      donorNickname: anonymous ? "" : value.donorNickname,
      donorPassword: anonymous ? "" : value.donorPassword,
      consentToUpdates: anonymous ? false : value.consentToUpdates,
    });
  }

  return (
    <>
      <fieldset className="donor-give-mode">
        <legend className="sr-only">{copy.giveModeLegend}</legend>
        <label>
          <input type="radio" name="give-mode" checked={!value.anonymous} onChange={() => chooseAnonymous(false)} />
          <span><strong>{copy.giveWithProfileTitle}</strong><small>{copy.giveWithProfileNote}</small></span>
        </label>
        <label>
          <input type="radio" name="give-mode" checked={value.anonymous} onChange={() => chooseAnonymous(true)} />
          <span><strong>{copy.giveAnonymouslyTitle}</strong><small>{copy.giveAnonymouslyNote}</small></span>
        </label>
      </fieldset>

      {value.anonymous ? (
        <>
          <div className="anonymous-confirmation" role="status">{copy.anonymousConfirmation}</div>
          <label className="consent-row">
            <input
              type="checkbox"
              checked={value.wantsAnonymousReceipt}
              onChange={(event) =>
                onChange({
                  ...value,
                  wantsAnonymousReceipt: event.target.checked,
                  anonymousReceiptEmail: event.target.checked ? value.anonymousReceiptEmail : "",
                })
              }
            />
            <span><strong>{copy.emailReceiptAnywayTitle}</strong><small>{copy.emailReceiptAnywayNote}</small></span>
          </label>
          {value.wantsAnonymousReceipt && (
            <label className={`field ${errors.anonymousReceiptEmail ? "field-error" : ""}`}>
              <span className="field-label">{copy.emailForReceiptLabel}</span>
              <input
                type="email"
                autoComplete="email"
                placeholder={copy.emailPlaceholder}
                value={value.anonymousReceiptEmail}
                onChange={(event) => onChange({ ...value, anonymousReceiptEmail: event.target.value })}
              />
              {errors.anonymousReceiptEmail && <span className="field-message">{errors.anonymousReceiptEmail}</span>}
            </label>
          )}
        </>
      ) : (
        <>
          <fieldset className="donor-profile-mode">
            <legend>{copy.profileDetailsLegend}</legend>
            <label><input type="radio" name="profile-mode" checked={value.profileMode === "existing"} onChange={() => onChange({ ...value, profileMode: "existing", donorName: "", donorNickname: "" })} /><span><strong>{copy.haveProfileTitle}</strong><small>{copy.haveProfileNote}</small></span></label>
            <label><input type="radio" name="profile-mode" checked={value.profileMode === "new"} onChange={() => onChange({ ...value, profileMode: "new" })} /><span><strong>{copy.createProfileTitle}</strong><small>{copy.createProfileNote}</small></span></label>
          </fieldset>

          {value.profileMode === "new" && (
            <button
              type="button"
              className="donor-demo-fill"
              onClick={() => onChange({ ...value, ...DEMO_DONOR_DETAILS })}
            >
              {copy.fillDemoDetails}
            </button>
          )}

          <div className="two-column-fields">
            <label className={`field ${errors.donorEmail ? "field-error" : ""}`}>
              <span className="field-label">{copy.emailLabel}</span>
              <input type="email" autoComplete="email" placeholder={copy.emailPlaceholder} value={value.donorEmail} onChange={(event) => onChange({ ...value, donorEmail: event.target.value })} />
              {errors.donorEmail && <span className="field-message">{errors.donorEmail}</span>}
            </label>
            <label className={`field ${errors.donorPassword ? "field-error" : ""}`}>
              <span className="field-label">{copy.passwordLabel}</span>
              <input type="password" autoComplete={value.profileMode === "new" ? "new-password" : "current-password"} placeholder={copy.passwordPlaceholder} value={value.donorPassword} onChange={(event) => onChange({ ...value, donorPassword: event.target.value })} />
              {errors.donorPassword && <span className="field-message">{errors.donorPassword}</span>}
            </label>
          </div>

          {value.profileMode === "new" && (
            <div className="two-column-fields">
              <label className={`field ${errors.donorNickname ? "field-error" : ""}`}>
                <span className="field-label">{copy.nicknameLabel}</span>
                <input autoComplete="nickname" placeholder={copy.nicknamePlaceholder} value={value.donorNickname} onChange={(event) => onChange({ ...value, donorNickname: event.target.value })} />
                {errors.donorNickname && <span className="field-message">{errors.donorNickname}</span>}
              </label>
              <label className={`field ${errors.donorName ? "field-error" : ""}`}>
                <span className="field-label">{copy.nameLabel}</span>
                <input autoComplete="name" placeholder={copy.namePlaceholder} value={value.donorName} onChange={(event) => onChange({ ...value, donorName: event.target.value })} />
                {errors.donorName && <span className="field-message">{errors.donorName}</span>}
              </label>
            </div>
          )}

          {value.profileMode === "new" && (
            <label className="consent-row">
              <input type="checkbox" checked={value.consentToUpdates} onChange={(event) => onChange({ ...value, consentToUpdates: event.target.checked })} />
              <span>{copy.updatesConsent}</span>
            </label>
          )}
        </>
      )}
    </>
  );
}

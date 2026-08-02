import { useState } from "react";
import { Link } from "react-router-dom";

import {
  createDonorWallPost,
  type DonationIntentResult,
  type DonorWallPost,
} from "../../api/client";
import { causeStampImages } from "../../lib/donationShareImage";
import { getLocalizedImpactMessage } from "../../content/donations";
import { useLanguage } from "../../hooks/useLanguage";
import { localizeDeep } from "../../lib/zhConvert";
import { DonationReceipt } from "./DonationReceipt";
import { DonationShareModal } from "./DonationShareModal";
import { ImpactCard } from "./ImpactCard";
import { DonationImpactBreakdown } from "./DonationImpactBreakdown";

const copyByLang = {
  en: {
    thankYouName: (name: string) => `Thank you, ${name}.`,
    thankYouPlain: "Thank you.",
    recipientFallback: "A Friend of Love 21",
    donationConfirmed: "Donation confirmed",
    addressFrom: "From: 21 Foundation",
    addressTo: (name: string) => `To: ${name}`,
    youMadeThisPossible: "You just made this possible",
    givenTo: (amount: string, causeLabel: string) => `${amount} given to ${causeLabel}`,
    shareMyImpact: "Share my impact",
    demoReference: "Demo reference:",
    simulationAnonymous:
      "Simulation complete — no money was charged and no personal information was attached to this gift.",
    simulationNamed:
      "Simulation complete — no money was charged. This demo gift is now stored in your donor profile.",
    emailNote: (email: string) => (
      <>
        A prototype confirmation, receipt and thank-you note would be sent to <strong>{email}</strong>.
      </>
    ),
    wallPostError: "We could not save your wall preview. Please try again.",
    backendCalculated: "Backend-calculated expected impact",
    giftExpectedHeading: (amount: string) => `What your ${amount} gift is expected to set in motion.`,
    plannedEstimateNote:
      "This is a planning estimate, not a promise that one gift alone caused an outcome. We will replace it with verified programme records after delivery.",
    thanksQuote:
      "“Thank you for helping create the steady, practical support that lets people join in, build confidence, and keep showing up.”",
    thanksAttribution: "With gratitude from the Love 21 programme team",
    consentNote: "Participant imagery is shown with consent.",
    anonymityCompleteTitle: "Your anonymity choice is complete.",
    anonymityCompleteBody: (hasEmailNote: string) =>
      `No name, profile or supporter-wall prompt is attached to this donation${hasEmailNote}`,
    anonymityEmailSuffix: ", aside from the receipt copy you asked to be emailed.",
    anonymityEmailNone: ".",
    oneLastChoice: "One last choice",
    wallInvitationTitle: "Take your place on the supporter wall?",
    showAvatarTitle: "Show my generated avatar and nickname",
    showAvatarNote: "Your gift amount is never public.",
    messageLabel: "Message to the community (optional)",
    messagePlaceholder: "What would you like the community to know?",
    saving: "Saving…",
    sendForReview: "Send for review",
    visiblePendingTitle: "Visible to you now · public after review",
    joinedFamily: (nickname: string) => `${nickname} joined the family.`,
    visitSupporters: "Visit our supporters",
    viewProfile: "View my donor profile",
  },
  zh: {
    thankYouName: (name: string) => `多謝你，${name}。`,
    thankYouPlain: "多謝你。",
    recipientFallback: "Love 21 的朋友",
    donationConfirmed: "捐款已確認",
    addressFrom: "寄件人：21 Foundation",
    addressTo: (name: string) => `收件人：${name}`,
    youMadeThisPossible: "這一切因你而成真",
    givenTo: (amount: string, causeLabel: string) => `已捐出 ${amount} 予 ${causeLabel}`,
    shareMyImpact: "分享我的成效",
    demoReference: "示範參考編號：",
    simulationAnonymous: "模擬完成 — 並無收取任何款項，亦沒有任何個人資料附加於此筆捐款。",
    simulationNamed: "模擬完成 — 並無收取任何款項。此示範捐款現已儲存於你的捐款人帳戶中。",
    emailNote: (email: string) => (
      <>
        原型確認、收據及感謝函將會傳送至 <strong>{email}</strong>。
      </>
    ),
    wallPostError: "未能儲存你的支持者牆預覽，請再試一次。",
    backendCalculated: "後台計算的預計成效",
    giftExpectedHeading: (amount: string) => `你的 ${amount} 捐款預計將帶來以下改變。`,
    plannedEstimateNote:
      "此為規劃預算，並非保證單一筆捐款能單獨促成某項成果。服務完成後，我們會以已核實的服務紀錄取代此預算。",
    thanksQuote:
      "「多謝你幫助我們建立穩定而實際的支援，讓大家能夠參與其中、建立自信，並持續前行。」",
    thanksAttribution: "由衷感謝 —— Love 21 服務團隊",
    consentNote: "參加者影像已獲同意後展示。",
    anonymityCompleteTitle: "你的匿名選擇已完成設定。",
    anonymityCompleteBody: (hasEmailNote: string) =>
      `此筆捐款不會附上姓名、帳戶或支持者牆邀請${hasEmailNote}`,
    anonymityEmailSuffix: "，只有你要求以電郵發送的收據副本除外。",
    anonymityEmailNone: "。",
    oneLastChoice: "最後一個選擇",
    wallInvitationTitle: "要在支持者牆上留名嗎？",
    showAvatarTitle: "顯示我生成的頭像及暱稱",
    showAvatarNote: "你的捐款金額永遠不會公開。",
    messageLabel: "給社群的留言（選填）",
    messagePlaceholder: "你想讓社群知道些什麼？",
    saving: "儲存中…",
    sendForReview: "送出審核",
    visiblePendingTitle: "現時只有你能看到 · 審核後公開",
    joinedFamily: (nickname: string) => `${nickname} 加入了這個大家庭。`,
    visitSupporters: "探訪我們的支持者",
    viewProfile: "查看我的捐款人帳戶",
  },
} as const;

export function DonationSuccess({
  result,
  donorName,
  donorEmail,
  anonymous,
  causeLabel,
  onStayInvolved,
}: {
  result: DonationIntentResult;
  donorName: string;
  donorEmail: string;
  anonymous: boolean;
  causeLabel: string;
  onStayInvolved: () => void;
}) {
  const { lang } = useLanguage();
  const copy = localizeDeep(copyByLang[lang === "en" ? "en" : "zh"], lang);
  const [showOnWall, setShowOnWall] = useState(true);
  const [message, setMessage] = useState("");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [wallPost, setWallPost] = useState<DonorWallPost | null>(null);
  const [wallError, setWallError] = useState<string | null>(null);
  const [isSubmittingWall, setIsSubmittingWall] = useState(false);
  const greeting =
    !anonymous && donorName.trim() ? copy.thankYouName(donorName.trim()) : copy.thankYouPlain;
  const recipientName =
    !anonymous && donorName.trim() ? donorName.trim() : copy.recipientFallback;
  const impactMessage = getLocalizedImpactMessage(result.impact, lang);
  const amountLabel = `HK$${result.impact.amount_hkd.toLocaleString("en-HK")}`;

  async function submitWallPost() {
    setWallError(null);
    setIsSubmittingWall(true);
    try {
      const post = await createDonorWallPost(result.donation_intent_id, {
        message: message.trim() || null,
      });
      setWallPost(post);
    } catch (error) {
      setWallError(
        error instanceof Error
          ? error.message
          : copy.wallPostError,
      );
    } finally {
      setIsSubmittingWall(false);
    }
  }

  return (
    <div className="donation-success" role="status">
      <span className="status-mark" aria-hidden="true">
        ✓
      </span>
      <p className="eyebrow">{copy.donationConfirmed}</p>
      <h2>{greeting}</h2>

      <div className="donation-impact-hero donation-envelope">
        <svg className="donation-envelope-flap" viewBox="0 0 100 34" preserveAspectRatio="none" aria-hidden="true">
          <polyline points="0,0 50,34 100,0" />
        </svg>
        <span className="donation-envelope-postmark" aria-hidden="true">
          <span className="donation-envelope-postmark-ring donation-envelope-postmark-ring-outer" />
          <span className="donation-envelope-postmark-ring donation-envelope-postmark-ring-inner" />
          <span className="donation-envelope-postmark-ray" />
          <span className="donation-envelope-postmark-ray" />
          <span className="donation-envelope-postmark-ray" />
          <span className="donation-envelope-postmark-ray" />
          <span className="donation-envelope-postmark-ray" />
        </span>
        <figure className="donation-envelope-stamp">
          <img src={causeStampImages[result.impact.cause_id]} alt="" />
        </figure>
        <span className="donation-envelope-seal" aria-hidden="true">21</span>
        <span className="donation-impact-confetti" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </span>
        <p className="donation-envelope-address">
          {copy.addressFrom}
          <br />
          {copy.addressTo(recipientName)}
        </p>
        <p className="eyebrow">{copy.youMadeThisPossible}</p>
        <p className="donation-impact-headline">{impactMessage.headline}</p>
        <p className="donation-impact-amount">{copy.givenTo(amountLabel, causeLabel)}</p>
        <p className="donation-impact-detail">{impactMessage.detail}</p>
        <button
          type="button"
          className="button button-outline donation-impact-share-button"
          onClick={() => setIsShareOpen(true)}
        >
          {copy.shareMyImpact}
        </button>
      </div>

      <p className="reference">
        {copy.demoReference} <strong>{result.donation_intent_id}</strong>
      </p>
      <div className="simulation-confirmation">
        {anonymous
          ? copy.simulationAnonymous
          : copy.simulationNamed}
      </div>
      <DonationReceipt
        result={result}
        donorName={donorName}
        donorEmail={donorEmail}
        anonymous={anonymous}
        causeLabel={causeLabel}
      />
      {donorEmail && <p className="donation-email-note">{copy.emailNote(donorEmail)}</p>}

      <section className="donation-outcome-record" aria-labelledby="donation-outcome-title">
        <div className="donate-a-impact-preview donate-a-impact-after">
          <ImpactCard
            amountHkd={result.impact.amount_hkd}
            impact={result.impact}
            status="success"
            imageSrc={causeStampImages[result.impact.cause_id]}
          />
        </div>
        <p className="eyebrow">{copy.backendCalculated}</p>
        <h3 id="donation-outcome-title">{copy.giftExpectedHeading(amountLabel)}</h3>
        <p className="donation-outcome-lede"><strong>{impactMessage.headline}</strong> {copy.plannedEstimateNote}</p>
        <DonationImpactBreakdown impact={result.impact} />
        <figure className="donation-outcome-thanks">
          <img src="/images/crystal-performing.jpg" alt="Crystal performing confidently during a Love 21 programme" />
          <figcaption><blockquote>{copy.thanksQuote}</blockquote><span>{copy.thanksAttribution}</span><small>{copy.consentNote}</small></figcaption>
        </figure>
      </section>

      {anonymous ? (
        <div className="anonymous-success-note">
          <strong>{copy.anonymityCompleteTitle}</strong>
          <p>
            {copy.anonymityCompleteBody(
              donorEmail ? copy.anonymityEmailSuffix : copy.anonymityEmailNone,
            )}
          </p>
        </div>
      ) : (
        <section className="donation-wall-invitation" aria-labelledby="wall-invitation-title">
          <p className="eyebrow">{copy.oneLastChoice}</p>
          <h3 id="wall-invitation-title">{copy.wallInvitationTitle}</h3>
          <label className="consent-row"><input type="checkbox" checked={showOnWall} disabled={wallPost !== null} onChange={(event) => { setShowOnWall(event.target.checked); setWallError(null); }} /><span><strong>{copy.showAvatarTitle}</strong><small>{copy.showAvatarNote}</small></span></label>
          {showOnWall && !wallPost && <><label className="field"><span className="field-label">{copy.messageLabel}</span><textarea maxLength={180} value={message} onChange={(event) => setMessage(event.target.value)} placeholder={copy.messagePlaceholder} /></label>{wallError && <div className="form-alert" role="alert">{wallError}</div>}<button className="button button-dark" type="button" onClick={submitWallPost} disabled={isSubmittingWall}>{isSubmittingWall ? copy.saving : copy.sendForReview}</button></>}
          {showOnWall && wallPost && <div className="wall-pending-preview" role="status"><strong>{copy.visiblePendingTitle}</strong><p>{copy.joinedFamily(wallPost.nickname)}</p>{wallPost.message && <blockquote>“{wallPost.message}”</blockquote>}</div>}
        </section>
      )}
      <div className="button-row donation-success-actions">
        <Link className="button button-dark" to="/supporter" onClick={onStayInvolved}>{copy.visitSupporters}</Link>
        {!anonymous && <Link className="button button-outline" to="/donor-profile">{copy.viewProfile}</Link>}
      </div>

      {isShareOpen && (
        <DonationShareModal
          data={{
            causeId: result.impact.cause_id,
            amountHkd: result.impact.amount_hkd,
            headline: impactMessage.headline,
            donorDisplayName: donorName,
          }}
          onClose={() => setIsShareOpen(false)}
        />
      )}
    </div>
  );
}

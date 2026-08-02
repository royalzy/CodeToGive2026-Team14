import { useState } from "react";
import { Link } from "react-router-dom";

import {
  createDonorWallPost,
  type DonationIntentResult,
  type DonorWallPost,
} from "../../api/client";
import { getDonationImpactMessage } from "../../content/donations";
import { causeStampImages } from "../../lib/donationShareImage";
import { DonationReceipt } from "./DonationReceipt";
import { DonationShareModal } from "./DonationShareModal";
import { ImpactCard } from "./ImpactCard";
import { DonationImpactBreakdown } from "./DonationImpactBreakdown";

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
  const [showOnWall, setShowOnWall] = useState(true);
  const [message, setMessage] = useState("");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [wallPost, setWallPost] = useState<DonorWallPost | null>(null);
  const [wallError, setWallError] = useState<string | null>(null);
  const [isSubmittingWall, setIsSubmittingWall] = useState(false);
  const greeting =
    !anonymous && donorName.trim() ? `Thank you, ${donorName.trim()}.` : "Thank you.";
  const recipientName =
    !anonymous && donorName.trim() ? donorName.trim() : "A Friend of Love 21";
  const impactMessage = getDonationImpactMessage(result.impact);
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
          : "We could not save your wall preview. Please try again.",
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
      <p className="eyebrow">Donation confirmed</p>
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
          From: 21 Foundation
          <br />
          To: {recipientName}
        </p>
        <p className="eyebrow">You just made this possible</p>
        <p className="donation-impact-headline">{impactMessage.headline}</p>
        <p className="donation-impact-amount">{amountLabel} given to {causeLabel}</p>
        <p className="donation-impact-detail">{impactMessage.detail}</p>
        <button
          type="button"
          className="button button-outline donation-impact-share-button"
          onClick={() => setIsShareOpen(true)}
        >
          Share my impact
        </button>
      </div>

      <p className="reference">
        Demo reference: <strong>{result.donation_intent_id}</strong>
      </p>
      <div className="simulation-confirmation">
        {anonymous
          ? "Simulation complete — no money was charged and no personal information was attached to this gift."
          : "Simulation complete — no money was charged. This demo gift is now stored in your donor profile."}
      </div>
      <DonationReceipt
        result={result}
        donorName={donorName}
        donorEmail={donorEmail}
        anonymous={anonymous}
        causeLabel={causeLabel}
      />
      {donorEmail && <p className="donation-email-note">A prototype confirmation, receipt and thank-you note would be sent to <strong>{donorEmail}</strong>.</p>}

      <section className="donation-outcome-record" aria-labelledby="donation-outcome-title">
        <div className="donate-a-impact-preview donate-a-impact-after">
          <ImpactCard
            amountHkd={result.impact.amount_hkd}
            impact={result.impact}
            status="success"
            imageSrc={causeStampImages[result.impact.cause_id]}
          />
        </div>
        <p className="eyebrow">Backend-calculated expected impact</p>
        <h3 id="donation-outcome-title">What your {amountLabel} gift is expected to set in motion.</h3>
        <p className="donation-outcome-lede"><strong>{impactMessage.headline}</strong> This is a planning estimate, not a promise that one gift alone caused an outcome. We will replace it with verified programme records after delivery.</p>
        <DonationImpactBreakdown impact={result.impact} />
        <figure className="donation-outcome-thanks">
          <img src="/images/crystal-performing.jpg" alt="Crystal performing confidently during a Love 21 programme" />
          <figcaption><blockquote>“Thank you for helping create the steady, practical support that lets people join in, build confidence, and keep showing up.”</blockquote><span>With gratitude from the Love 21 programme team</span><small>Participant imagery is shown with consent.</small></figcaption>
        </figure>
      </section>

      {anonymous ? (
        <div className="anonymous-success-note">
          <strong>Your anonymity choice is complete.</strong>
          <p>
            No name, profile or supporter-wall prompt is attached to this donation
            {donorEmail ? ", aside from the receipt copy you asked to be emailed." : "."}
          </p>
        </div>
      ) : (
        <section className="donation-wall-invitation" aria-labelledby="wall-invitation-title">
          <p className="eyebrow">One last choice</p>
          <h3 id="wall-invitation-title">Take your place on the supporter wall?</h3>
          <label className="consent-row"><input type="checkbox" checked={showOnWall} disabled={wallPost !== null} onChange={(event) => { setShowOnWall(event.target.checked); setWallError(null); }} /><span><strong>Show my generated avatar and nickname</strong><small>Your gift amount is never public.</small></span></label>
          {showOnWall && !wallPost && <><label className="field"><span className="field-label">Message to the community (optional)</span><textarea maxLength={180} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="What would you like the community to know?" /></label>{wallError && <div className="form-alert" role="alert">{wallError}</div>}<button className="button button-dark" type="button" onClick={submitWallPost} disabled={isSubmittingWall}>{isSubmittingWall ? "Saving…" : "Send for review"}</button></>}
          {showOnWall && wallPost && <div className="wall-pending-preview" role="status"><strong>Visible to you now · public after review</strong><p>{wallPost.nickname} joined the family.</p>{wallPost.message && <blockquote>“{wallPost.message}”</blockquote>}</div>}
        </section>
      )}
      <div className="button-row donation-success-actions">
        <Link className="button button-dark" to="/supporter" onClick={onStayInvolved}>Visit our supporters</Link>
        {!anonymous && <Link className="button button-outline" to="/donor-profile">View my donor profile</Link>}
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

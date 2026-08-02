import { useState } from "react";
import { Link } from "react-router-dom";

import {
  createDonorWallPost,
  type DonationIntentResult,
  type DonorWallPost,
} from "../../api/client";
import { getDonationImpactMessage } from "../../content/donations";
import { DonationImpactBreakdown } from "./DonationImpactBreakdown";

export function DonationSuccess({
  result,
  donorName,
  donorEmail,
  anonymous,
  onStayInvolved,
}: {
  result: DonationIntentResult;
  donorName: string;
  donorEmail: string;
  anonymous: boolean;
  onStayInvolved: () => void;
}) {
  const [showOnWall, setShowOnWall] = useState(true);
  const [message, setMessage] = useState("");
  const [wallPost, setWallPost] = useState<DonorWallPost | null>(null);
  const [wallError, setWallError] = useState<string | null>(null);
  const [isSubmittingWall, setIsSubmittingWall] = useState(false);
  const greeting =
    !anonymous && donorName.trim() ? `Thank you, ${donorName.trim()}.` : "Thank you.";
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
      <p className="eyebrow">Prototype donation confirmed</p>
      <h2>{greeting}</h2>
      <p>
        Your possible impact has been recalculated and confirmed by the demonstration service. After delivery, verified records and photos will appear in your donor profile.
      </p>
      <p className="reference">
        Demo reference: <strong>{result.donation_intent_id}</strong>
      </p>
      <div className="simulation-confirmation">
        {anonymous
          ? "Simulation complete — no money was charged and no personal information was attached to this gift."
          : "Simulation complete — no money was charged. This demo gift is now stored in your donor profile."}
      </div>
      {!anonymous && donorEmail && <p className="donation-email-note">A prototype confirmation, receipt and thank-you note would be sent to <strong>{donorEmail}</strong>.</p>}

      <section className="donation-outcome-record" aria-labelledby="donation-outcome-title">
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
        <div className="anonymous-success-note"><strong>Your anonymity choice is complete.</strong><p>No email, profile or supporter-wall prompt is attached to this donation.</p></div>
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
    </div>
  );
}

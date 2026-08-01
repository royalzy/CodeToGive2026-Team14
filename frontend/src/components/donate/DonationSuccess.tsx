import { useState } from "react";
import { Link } from "react-router-dom";

import type { DonationIntentResult } from "../../api/client";

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
  const [submitted, setSubmitted] = useState(false);
  const greeting =
    !anonymous && donorName.trim() ? `Thank you, ${donorName.trim()}.` : "Thank you.";

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
        Simulation complete — no money was charged and no personal information
        was stored.
      </div>
      {!anonymous && donorEmail && <p className="donation-email-note">A prototype confirmation, receipt and thank-you note would be sent to <strong>{donorEmail}</strong>.</p>}

      {anonymous ? (
        <div className="anonymous-success-note"><strong>Your anonymity choice is complete.</strong><p>No email, profile or supporter-wall prompt is attached to this donation.</p></div>
      ) : (
        <section className="donation-wall-invitation" aria-labelledby="wall-invitation-title">
          <p className="eyebrow">One last choice</p>
          <h3 id="wall-invitation-title">Take your place on the supporter wall?</h3>
          <label className="consent-row"><input type="checkbox" checked={showOnWall} onChange={(event) => { setShowOnWall(event.target.checked); setSubmitted(false); }} /><span><strong>Show my generated avatar and nickname</strong><small>Your gift amount is never public.</small></span></label>
          {showOnWall && !submitted && <><label className="field"><span className="field-label">Message to the community (optional)</span><textarea maxLength={180} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="What would you like the community to know?" /></label><button className="button button-dark" type="button" onClick={() => setSubmitted(true)}>Send for review</button></>}
          {showOnWall && submitted && <div className="wall-pending-preview" role="status"><strong>Visible to you now · public after review</strong><p>{donorName || "A new supporter"} joined the family.</p>{message && <blockquote>“{message}”</blockquote>}</div>}
        </section>
      )}
      <div className="button-row donation-success-actions">
        <Link className="button button-dark" to="/community" onClick={onStayInvolved}>Visit our community</Link>
        {!anonymous && <Link className="button button-outline" to="/donor-profile">View my donor profile</Link>}
      </div>
    </div>
  );
}

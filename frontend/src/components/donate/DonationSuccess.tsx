import { useState } from "react";
import { Link } from "react-router-dom";

import type { DonationIntentResult } from "../../api/client";
import { getDonationImpactMessage } from "../../content/donations";

const programmeDetails = {
  where_needed_most: {
    focus: "the highest verified programme need at the next allocation review",
    access: "coach time, accessible venue use, participant transport, or urgent family support where current records show the clearest gap",
  },
  dance: {
    focus: "coached dance and creative movement delivery",
    access: "trained coaches, accessible rehearsal space, participant transport, performance preparation, and the support needed to join confidently",
  },
  sports: {
    focus: "supported sport and movement sessions",
    access: "qualified coaching, accessible venues, safe equipment, participant transport, and adaptations that keep the activity genuinely inclusive",
  },
  nutrition: {
    focus: "nutrition consultations and practical healthy-living workshops",
    access: "dietitian time, fresh ingredients, accessible learning materials, family follow-up, and the support needed to practise new habits at home",
  },
  family_support: {
    focus: "family and caregiver support",
    access: "case-worker time, transport, practical resources, counselling access, and follow-up for families navigating an immediate need",
  },
} as const;

function describeBackendEstimate(result: DonationIntentResult) {
  const impact = result.impact;
  if (impact.mode === "counted") {
    const unitLabels: Record<string, string> = {
      dance_training_session: "coached dance training sessions",
      sports_session: "supported sports sessions",
      nutrition_consultation: "nutrition consultations",
      family_support_opportunity: "family support opportunities",
    };
    const unitLabel = unitLabels[impact.unit_key] ?? "programme opportunities";
    return `The backend estimate associates this gift with approximately ${impact.estimated_units.toLocaleString("en-HK")} ${unitLabel}. The final record will use delivered activity, not this estimate.`;
  }
  if (impact.mode === "contribution") {
    return "This amount contributes toward the next complete unit of programme delivery. We will report the delivered work without rounding a partial contribution up into a result.";
  }
  return "This flexible gift will be assigned at the next allocation review to the highest verified need. The final record will identify the programme and delivered work rather than implying a result today.";
}

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
  const impactMessage = getDonationImpactMessage(result.impact);
  const programme = programmeDetails[result.impact.copy_key as keyof typeof programmeDetails]
    ?? programmeDetails.where_needed_most;
  const amountLabel = `HK$${result.impact.amount_hkd.toLocaleString("en-HK")}`;

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

      <section className="donation-outcome-record" aria-labelledby="donation-outcome-title">
        <p className="eyebrow">Backend-calculated expected impact</p>
        <h3 id="donation-outcome-title">What your {amountLabel} gift is expected to set in motion.</h3>
        <p className="donation-outcome-lede"><strong>{impactMessage.headline}</strong> This is a planning estimate, not a promise that one gift alone caused an outcome. We will replace it with verified programme records after delivery.</p>
        <div className="donation-outcome-grid">
          <article><span>01</span><h4>Expected programme work</h4><p>{describeBackendEstimate(result)} It is currently directed toward {programme.focus}.</p></article>
          <article><span>02</span><h4>What access may require</h4><p>The allocation can cover {programme.access}. These practical conditions are part of the impact, not overhead hidden from view.</p></article>
          <article><span>03</span><h4>How Love 21 will verify it</h4><p>Attendance logs, coach or case-worker records, invoices, and consented photos are checked together. We will not publish a participant story or image without consent.</p></article>
          <article><span>04</span><h4>When the record becomes real</h4><p>After the programme cycle closes, the estimate is reconciled against delivered work. Identified donors receive the receipt, programme note, photographs where consented, and the verified outcome by email and in their profile.</p></article>
        </div>
        <div className="donation-outcome-timeline" aria-label="Expected reporting timeline">
          <div><strong>Today</strong><span>Gift intention and selected programme direction confirmed.</span></div>
          <div><strong>Next programme cycle</strong><span>Funds allocated alongside other gifts to scheduled delivery.</span></div>
          <div><strong>After delivery</strong><span>Programme team checks participation, spending and supporting records.</span></div>
          <div><strong>Quarter close</strong><span>Estimate replaced by the clearest verified account of what happened.</span></div>
        </div>
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

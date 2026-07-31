import { Link } from "react-router-dom";

import type { DonationIntentResult } from "../../api/client";

export function DonationSuccess({
  result,
  donorName,
  anonymous,
  onStayInvolved,
}: {
  result: DonationIntentResult;
  donorName: string;
  anonymous: boolean;
  onStayInvolved: () => void;
}) {
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
        Your possible impact has been recalculated and confirmed by the
        demonstration service.
      </p>
      <p className="reference">
        Demo reference: <strong>{result.donation_intent_id}</strong>
      </p>
      <div className="simulation-confirmation">
        Simulation complete — no money was charged and no personal information
        was stored.
      </div>
      <Link
        className="button button-dark"
        to="/impact"
        onClick={onStayInvolved}
      >
        Stay part of the journey
      </Link>
    </div>
  );
}

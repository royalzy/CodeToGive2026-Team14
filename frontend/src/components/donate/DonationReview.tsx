import type { DonationImpactMessage } from "../../content/donations";

export function DonationReview({
  amountHkd,
  causeLabel,
  donorName,
  anonymous,
  impactMessage,
}: {
  amountHkd: number;
  causeLabel: string;
  donorName: string;
  anonymous: boolean;
  impactMessage: DonationImpactMessage;
}) {
  return (
    <dl className="donation-review">
      <div>
        <dt>Donation amount</dt>
        <dd>HK${amountHkd.toLocaleString("en-HK")}</dd>
      </div>
      <div>
        <dt>Support direction</dt>
        <dd>{causeLabel}</dd>
      </div>
      <div>
        <dt>Estimated impact</dt>
        <dd>{impactMessage.detail}</dd>
      </div>
      <div>
        <dt>Donor</dt>
        <dd>
          {anonymous ? "Completely anonymous" : donorName.trim() || "Signed-in donor profile"}
          <span className="donor-acknowledgement">
            {anonymous
              ? "No email, nickname, profile or supporter-wall tile will be attached."
              : "Gift amount stays private on the supporter wall."}
          </span>
        </dd>
      </div>
    </dl>
  );
}

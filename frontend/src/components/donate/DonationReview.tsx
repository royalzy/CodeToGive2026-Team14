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
          {donorName.trim() || "Not provided"}
          {anonymous && (
            <span className="donor-acknowledgement">
              Public acknowledgement: Anonymous
            </span>
          )}
        </dd>
      </div>
    </dl>
  );
}

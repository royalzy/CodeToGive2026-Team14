import type { CauseId, ImpactPreview } from "./api/client";

export type DonationEventName =
  | "donate_page_viewed"
  | "donation_cause_selected"
  | "donation_amount_selected"
  | "impact_preview_displayed"
  | "donation_details_started"
  | "donation_intent_submitted"
  | "donation_success_displayed"
  | "stay_involved_clicked";

type DonationEventParameters = {
  cause_id?: CauseId;
  amount_bucket?: string;
  impact_mode?: ImpactPreview["mode"];
};

type DonationDataLayerEntry = DonationEventParameters & {
  event: DonationEventName;
};

declare global {
  interface Window {
    dataLayer?: DonationDataLayerEntry[];
  }
}

export function getAmountBucket(amountHkd: number): string {
  if (amountHkd < 200) return "10-199";
  if (amountHkd < 400) return "200-399";
  if (amountHkd < 800) return "400-799";
  return "800+";
}

export function trackDonationEvent(
  event: DonationEventName,
  parameters: DonationEventParameters = {},
): void {
  if (typeof window === "undefined" || !window.dataLayer) return;

  const entry: DonationDataLayerEntry = { event };
  if (parameters.cause_id) entry.cause_id = parameters.cause_id;
  if (parameters.amount_bucket) {
    entry.amount_bucket = parameters.amount_bucket;
  }
  if (parameters.impact_mode) {
    entry.impact_mode = parameters.impact_mode;
  }
  window.dataLayer.push(entry);
}

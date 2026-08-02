import type { ImpactPreview } from "../../api/client";
import { getDonationImpactMessage } from "../../content/donations";

export type PreviewStatus = "idle" | "loading" | "success" | "error";

export function ImpactCard({
  amountHkd,
  impact,
  status,
  imageSrc,
}: {
  amountHkd: number;
  impact: ImpactPreview | null;
  status: PreviewStatus;
  imageSrc?: string;
}) {
  const message = getDonationImpactMessage(impact);
  const visualUnitCount =
    impact?.mode === "counted"
      ? Math.min(impact.estimated_units, 8)
      : impact?.mode === "contribution"
        ? 1
        : 0;

  return (
    <article
      className={`impact-card${imageSrc ? " impact-card--framed" : ""}`}
      aria-live="polite"
      aria-busy={status === "loading"}
    >
      <div className="impact-card-orbits" aria-hidden="true">
        <span />
        <span />
      </div>
      {imageSrc && (
        <div className="impact-card-media" aria-hidden="true">
          <img src={imageSrc} alt="" loading="lazy" />
        </div>
      )}
      <div className="impact-card-body">
        <div className="impact-card-topline">
          <span className="impact-card-kicker">Your possible impact</span>
        </div>

        {status === "loading" ? (
          <div className="impact-loading">
            <span aria-hidden="true" />
            Calculating another possibility…
          </div>
        ) : (
          <>
            {status === "error" && (
              <p className="impact-service-note">
                Live estimate unavailable — showing a general impact message.
              </p>
            )}
            <h2>{message.headline}</h2>
            {visualUnitCount > 0 && (
              <div className="impact-units" aria-hidden="true">
                {Array.from({ length: visualUnitCount }, (_, index) => (
                  <span key={index} />
                ))}
              </div>
            )}
            <p className="impact-amount">
              {Number.isInteger(amountHkd) && amountHkd >= 10
                ? `Your HK$${amountHkd.toLocaleString("en-HK")}`
                : "Your gift"}
            </p>
            <p>{message.detail}</p>
          </>
        )}

        <footer>
          <strong>Demonstration estimates for prototype purposes.</strong>
          <span>
            Impact estimates are based on average programme costs. Donations
            support Love 21’s wider programmes and are allocated according to
            operational needs.
          </span>
        </footer>
      </div>
    </article>
  );
}

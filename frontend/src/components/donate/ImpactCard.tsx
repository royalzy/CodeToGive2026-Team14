import type { ImpactPreview } from "../../api/client";
import { getLocalizedImpactMessage } from "../../content/donations";
import { useLanguage } from "../../hooks/useLanguage";
import { localizeDeep } from "../../lib/zhConvert";

export type PreviewStatus = "idle" | "loading" | "success" | "error";

const copyByLang = {
  en: {
    kicker: "Your possible impact",
    calculating: "Calculating another possibility…",
    liveEstimateUnavailable: "Live estimate unavailable — showing a general impact message.",
    yourAmount: (amount: string) => `Your HK$${amount}`,
    yourGift: "Your gift",
    footerStrong: "Demonstration estimates for prototype purposes.",
    footerBody:
      "Impact estimates are based on average programme costs. Donations support Love 21’s wider programmes and are allocated according to operational needs.",
  },
  zh: {
    kicker: "你可能帶來的影響",
    calculating: "正在計算多一種可能…",
    liveEstimateUnavailable: "即時預算暫時無法載入 — 現顯示一般性的成效訊息。",
    yourAmount: (amount: string) => `你的 HK$${amount}`,
    yourGift: "你的捐款",
    footerStrong: "示範用途的原型預算數字。",
    footerBody:
      "成效預算是根據平均服務項目成本計算。捐款用於支持 Love 21 更廣泛的服務項目，並按實際運作需要分配。",
  },
} as const;

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
  const { lang } = useLanguage();
  const copy = localizeDeep(copyByLang[lang === "en" ? "en" : "zh"], lang);
  const message = getLocalizedImpactMessage(impact, lang);
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
          <span className="impact-card-kicker">{copy.kicker}</span>
        </div>

        {status === "loading" ? (
          <div className="impact-loading">
            <span aria-hidden="true" />
            {copy.calculating}
          </div>
        ) : (
          <>
            {status === "error" && (
              <p className="impact-service-note">
                {copy.liveEstimateUnavailable}
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
                ? copy.yourAmount(amountHkd.toLocaleString("en-HK"))
                : copy.yourGift}
            </p>
            <p>{message.detail}</p>
          </>
        )}

        <footer>
          <strong>{copy.footerStrong}</strong>
          <span>
            {copy.footerBody}
          </span>
        </footer>
      </div>
    </article>
  );
}

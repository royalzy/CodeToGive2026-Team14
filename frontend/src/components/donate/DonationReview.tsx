import type { DonationImpactMessage } from "../../content/donations";
import { useLanguage } from "../../hooks/useLanguage";
import { localizeDeep } from "../../lib/zhConvert";

const copyByLang = {
  en: {
    amountLabel: "Donation amount",
    directionLabel: "Support direction",
    impactLabel: "Estimated impact",
    donorLabel: "Donor",
    anonymousDonor: "Completely anonymous",
    signedInDonor: "Signed-in donor profile",
    anonymousNote: "No email, nickname, profile or supporter-wall tile will be attached.",
    privateNote: "Gift amount stays private on the supporter wall.",
  },
  zh: {
    amountLabel: "捐款金額",
    directionLabel: "支持方向",
    impactLabel: "預計成效",
    donorLabel: "捐款人",
    anonymousDonor: "完全匿名",
    signedInDonor: "已登入的捐款人帳戶",
    anonymousNote: "不會附上電郵、暱稱、帳戶或支持者牆頭像。",
    privateNote: "捐款金額不會在支持者牆上公開。",
  },
} as const;

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
  const { lang } = useLanguage();
  const copy = localizeDeep(copyByLang[lang === "en" ? "en" : "zh"], lang);
  return (
    <dl className="donation-review">
      <div>
        <dt>{copy.amountLabel}</dt>
        <dd>HK${amountHkd.toLocaleString("en-HK")}</dd>
      </div>
      <div>
        <dt>{copy.directionLabel}</dt>
        <dd>{causeLabel}</dd>
      </div>
      <div>
        <dt>{copy.impactLabel}</dt>
        <dd>{impactMessage.detail}</dd>
      </div>
      <div>
        <dt>{copy.donorLabel}</dt>
        <dd>
          {anonymous ? copy.anonymousDonor : donorName.trim() || copy.signedInDonor}
          <span className="donor-acknowledgement">
            {anonymous ? copy.anonymousNote : copy.privateNote}
          </span>
        </dd>
      </div>
    </dl>
  );
}

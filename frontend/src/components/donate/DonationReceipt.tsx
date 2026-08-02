import { useState } from "react";

import type { DonationIntentResult } from "../../api/client";
import { useLanguage } from "../../hooks/useLanguage";
import { localizeDeep } from "../../lib/zhConvert";
import type { Lang } from "../../content/languageContextValue";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const receiptDocCopy = {
  en: {
    htmlLang: "en",
    docTitle: "Love 21 donation receipt",
    eyebrow: "Love 21 · donation receipt",
    thankYou: (donorLine: string) => `Thank you for your gift, ${donorLine}.`,
    anonymousSupporter: "Anonymous supporter",
    valuedSupporter: "Valued supporter",
    receiptIssued: "Receipt issued",
    donationReference: "Donation reference",
    programmeSupported: "Programme supported",
    amount: "Amount",
    donorEmailOnFile: "Donor email on file",
    notice:
      "This is a hackathon simulation receipt. No payment was taken and no personal information was stored by Love 21.",
    footer: "Love 21 · Generated on the spot at the time of donation.",
  },
  zh: {
    htmlLang: "zh-Hant",
    docTitle: "Love 21 捐款收據",
    eyebrow: "Love 21 · 捐款收據",
    thankYou: (donorLine: string) => `多謝你的捐款，${donorLine}。`,
    anonymousSupporter: "匿名支持者",
    valuedSupporter: "尊貴的支持者",
    receiptIssued: "收據簽發日期",
    donationReference: "捐款參考編號",
    programmeSupported: "支持的服務項目",
    amount: "金額",
    donorEmailOnFile: "捐款人電郵地址",
    notice: "此為黑客松模擬收據。並無收取任何款項，Love 21 亦沒有儲存任何個人資料。",
    footer: "Love 21 · 於捐款當刻即時生成。",
  },
} as const;

function buildReceiptHtml({
  result,
  donorName,
  donorEmail,
  anonymous,
  causeLabel,
  lang,
}: {
  result: DonationIntentResult;
  donorName: string;
  donorEmail: string;
  anonymous: boolean;
  causeLabel: string;
  lang: Lang;
}): string {
  const copy = localizeDeep(receiptDocCopy[lang === "en" ? "en" : "zh"], lang);
  const issuedOn = new Date().toLocaleDateString(lang === "en" ? "en-HK" : "zh-Hant-HK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const amountLabel = `HK$${result.impact.amount_hkd.toLocaleString("en-HK")}`;
  const donorLine = anonymous
    ? copy.anonymousSupporter
    : escapeHtml(donorName.trim() || copy.valuedSupporter);

  return `<!doctype html>
<html lang="${copy.htmlLang}">
<head>
<meta charset="utf-8" />
<title>${copy.docTitle}</title>
<style>
  body { font-family: Georgia, 'Times New Roman', serif; color: #1c1a17; margin: 2.5rem; }
  .receipt { max-width: 640px; margin: 0 auto; border: 1px solid #d8cfc0; padding: 2.5rem; }
  h1 { font-size: 1.4rem; margin: 0 0 0.25rem; }
  .eyebrow { text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.75rem; color: #7a6a55; margin: 0 0 1.5rem; }
  table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
  td { padding: 0.5rem 0; border-bottom: 1px solid #ece4d6; font-size: 0.95rem; }
  td:first-child { color: #6b5f4f; width: 45%; }
  td:last-child { text-align: right; font-weight: 600; }
  .amount-row td { font-size: 1.2rem; }
  .notice { margin-top: 2rem; padding: 1rem; background: #f7f0e4; border-radius: 0.5rem; font-size: 0.85rem; }
  .footer { margin-top: 2rem; font-size: 0.8rem; color: #7a6a55; }
  @media print { body { margin: 0; } .receipt { border: none; } }
</style>
</head>
<body>
  <div class="receipt">
    <p class="eyebrow">${copy.eyebrow}</p>
    <h1>${copy.thankYou(donorLine)}</h1>
    <table>
      <tr><td>${copy.receiptIssued}</td><td>${issuedOn}</td></tr>
      <tr><td>${copy.donationReference}</td><td>${escapeHtml(result.donation_intent_id)}</td></tr>
      <tr><td>${copy.programmeSupported}</td><td>${escapeHtml(causeLabel)}</td></tr>
      <tr class="amount-row"><td>${copy.amount}</td><td>${amountLabel}</td></tr>
      ${!anonymous && donorEmail ? `<tr><td>${copy.donorEmailOnFile}</td><td>${escapeHtml(donorEmail)}</td></tr>` : ""}
    </table>
    <div class="notice">
      ${copy.notice}
    </div>
    <p class="footer">${copy.footer}</p>
  </div>
</body>
</html>`;
}

const copyByLang = {
  en: {
    eyebrow: "Your receipt",
    heading: "Get your donation receipt now.",
    body: "Your receipt is ready straight away — download or print it now. Emailing a copy is optional.",
    downloadButton: "Download / print receipt",
    emailedButton: "Receipt emailed",
    emailButton: "Email me a copy (optional)",
    emailNote: (email: string) => (
      <>
        Prototype confirmation: a copy of this receipt would be sent to <strong>{email}</strong>.
      </>
    ),
  },
  zh: {
    eyebrow: "你的收據",
    heading: "立即取得你的捐款收據。",
    body: "你的收據已經準備就緒 — 現可下載或列印。以電郵發送副本則屬可選項目。",
    downloadButton: "下載／列印收據",
    emailedButton: "已電郵收據",
    emailButton: "電郵一份副本給我（可選）",
    emailNote: (email: string) => (
      <>
        原型確認：此收據的副本將會傳送至 <strong>{email}</strong>。
      </>
    ),
  },
} as const;

export function DonationReceipt({
  result,
  donorName,
  donorEmail,
  anonymous,
  causeLabel,
}: {
  result: DonationIntentResult;
  donorName: string;
  donorEmail: string;
  anonymous: boolean;
  causeLabel: string;
}) {
  const { lang } = useLanguage();
  const copy = localizeDeep(copyByLang[lang === "en" ? "en" : "zh"], lang);
  const [emailStatus, setEmailStatus] = useState<"idle" | "sent">("idle");

  function openReceipt() {
    const html = buildReceiptHtml({ result, donorName, donorEmail, anonymous, causeLabel, lang });
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const receiptWindow = window.open(url, "_blank", "width=720,height=900");
    if (!receiptWindow) return;
    receiptWindow.addEventListener("load", () => {
      receiptWindow.print();
      URL.revokeObjectURL(url);
    });
  }

  function simulateEmailReceipt() {
    setEmailStatus("sent");
  }

  return (
    <section className="donation-receipt" aria-labelledby="donation-receipt-title">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h3 id="donation-receipt-title">{copy.heading}</h3>
      <p>{copy.body}</p>
      <div className="button-row">
        <button className="button button-dark" type="button" onClick={openReceipt}>
          {copy.downloadButton}
        </button>
        {donorEmail && (
          <button
            className="button button-outline"
            type="button"
            onClick={simulateEmailReceipt}
            disabled={emailStatus === "sent"}
          >
            {emailStatus === "sent" ? copy.emailedButton : copy.emailButton}
          </button>
        )}
      </div>
      {emailStatus === "sent" && (
        <p className="donation-email-note" role="status">
          {copy.emailNote(donorEmail)}
        </p>
      )}
    </section>
  );
}

import { useState } from "react";

import type { DonationIntentResult } from "../../api/client";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildReceiptHtml({
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
}): string {
  const issuedOn = new Date().toLocaleDateString("en-HK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const amountLabel = `HK$${result.impact.amount_hkd.toLocaleString("en-HK")}`;
  const donorLine = anonymous
    ? "Anonymous supporter"
    : escapeHtml(donorName.trim() || "Valued supporter");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Love 21 donation receipt</title>
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
    <p class="eyebrow">Love 21 &middot; donation receipt</p>
    <h1>Thank you for your gift, ${donorLine}.</h1>
    <table>
      <tr><td>Receipt issued</td><td>${issuedOn}</td></tr>
      <tr><td>Donation reference</td><td>${escapeHtml(result.donation_intent_id)}</td></tr>
      <tr><td>Programme supported</td><td>${escapeHtml(causeLabel)}</td></tr>
      <tr class="amount-row"><td>Amount</td><td>${amountLabel}</td></tr>
      ${!anonymous && donorEmail ? `<tr><td>Donor email on file</td><td>${escapeHtml(donorEmail)}</td></tr>` : ""}
    </table>
    <div class="notice">
      This is a hackathon simulation receipt. No payment was taken and no personal information was stored by Love 21.
    </div>
    <p class="footer">Love 21 &middot; Generated on the spot at the time of donation.</p>
  </div>
</body>
</html>`;
}

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
  const [emailStatus, setEmailStatus] = useState<"idle" | "sent">("idle");

  function openReceipt() {
    const html = buildReceiptHtml({ result, donorName, donorEmail, anonymous, causeLabel });
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
      <p className="eyebrow">Your receipt</p>
      <h3 id="donation-receipt-title">Get your donation receipt now.</h3>
      <p>Your receipt is ready straight away — download or print it now. Emailing a copy is optional.</p>
      <div className="button-row">
        <button className="button button-dark" type="button" onClick={openReceipt}>
          Download / print receipt
        </button>
        {donorEmail && (
          <button
            className="button button-outline"
            type="button"
            onClick={simulateEmailReceipt}
            disabled={emailStatus === "sent"}
          >
            {emailStatus === "sent" ? "Receipt emailed" : "Email me a copy (optional)"}
          </button>
        )}
      </div>
      {emailStatus === "sent" && (
        <p className="donation-email-note" role="status">
          Prototype confirmation: a copy of this receipt would be sent to <strong>{donorEmail}</strong>.
        </p>
      )}
    </section>
  );
}

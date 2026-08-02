import { useEffect, useRef, useState } from "react";

import {
  dataUrlToBlob,
  generateDonationShareImage,
  type DonationShareData,
  type ShareImageOrientation,
} from "../../lib/donationShareImage";
import { trackDonationEvent } from "../../analytics";
import { useLanguage } from "../../hooks/useLanguage";
import { localizeDeep } from "../../lib/zhConvert";

const orientationOptionsCopy = {
  en: [
    { value: "vertical" as ShareImageOrientation, label: "Vertical" },
    { value: "horizontal" as ShareImageOrientation, label: "Horizontal" },
  ],
  zh: [
    { value: "vertical" as ShareImageOrientation, label: "直向" },
    { value: "horizontal" as ShareImageOrientation, label: "橫向" },
  ],
} as const;

interface SocialTarget {
  key: string;
  label: string;
  buildUrl: (shareUrl: string, shareText: string) => string;
}

// Social platform names are proper nouns/brand names — left untranslated.
const socialTargets: SocialTarget[] = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    buildUrl: (shareUrl, shareText) =>
      `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
  },
  {
    key: "facebook",
    label: "Facebook",
    buildUrl: (shareUrl) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
  },
  {
    key: "x",
    label: "X",
    buildUrl: (shareUrl, shareText) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    buildUrl: (shareUrl) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
  },
];

const copyByLang = {
  en: {
    modalAria: "Share your donation impact",
    close: "Close",
    heading: "Share your impact",
    subtitle: "Save the image, copy the link, or post it straight to your favourite app.",
    orientationGroupAria: "Image orientation",
    preparingCard: "Preparing your impact card…",
    shareEllipsis: "Share…",
    saveImage: "Save image",
    copyImage: "Copy image",
    copyLink: "Copy link",
    imageDownloaded: "Image downloaded",
    imageCopied: "Image copied to clipboard",
    copyImageUnsupported: "Copying images isn't supported here — try downloading instead",
    linkCopied: "Link copied to clipboard",
    linkCopyFailed: "Couldn't copy the link",
    shareSheetFailed: "Couldn't open the share sheet",
    shareText: (amount: string, headline: string) =>
      `I just gave HK$${amount} to Love 21 — ${headline}`,
    previewAlt: (headline: string, amount: string) => `${headline} — HK$${amount} donation card`,
  },
  zh: {
    modalAria: "分享你的捐款成效",
    close: "關閉",
    heading: "分享你的成效",
    subtitle: "儲存圖片、複製連結，或直接分享到你喜愛的應用程式。",
    orientationGroupAria: "圖片方向",
    preparingCard: "正在準備你的成效卡片…",
    shareEllipsis: "分享…",
    saveImage: "儲存圖片",
    copyImage: "複製圖片",
    copyLink: "複製連結",
    imageDownloaded: "圖片已下載",
    imageCopied: "圖片已複製到剪貼簿",
    copyImageUnsupported: "此裝置不支援複製圖片 — 請嘗試下載圖片",
    linkCopied: "連結已複製到剪貼簿",
    linkCopyFailed: "未能複製連結",
    shareSheetFailed: "未能開啟分享面板",
    shareText: (amount: string, headline: string) =>
      `我剛捐出 HK$${amount} 給 Love 21 — ${headline}`,
    previewAlt: (headline: string, amount: string) => `${headline} — HK$${amount} 捐款卡片`,
  },
} as const;

export function DonationShareModal({
  data,
  onClose,
}: {
  data: DonationShareData;
  onClose: () => void;
}) {
  const { lang } = useLanguage();
  const copy = localizeDeep(copyByLang[lang === "en" ? "en" : "zh"], lang);
  const orientationOptions = localizeDeep(
    orientationOptionsCopy[lang === "en" ? "en" : "zh"],
    lang,
  );
  const [orientation, setOrientation] = useState<ShareImageOrientation>("vertical");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const shareUrl = new URL("/donate", window.location.origin).toString();
  const shareText = copy.shareText(data.amountHkd.toLocaleString("en-HK"), data.headline);
  const supportsNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  useEffect(() => {
    let cancelled = false;
    setImageUrl(null);
    generateDonationShareImage(data, orientation).then((url) => {
      if (!cancelled) setImageUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [data, orientation]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    panelRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function flash(message: string) {
    setFeedback(message);
    window.setTimeout(() => setFeedback(null), 2200);
  }

  function trackShare() {
    trackDonationEvent("donation_impact_shared", { cause_id: data.causeId });
  }

  function handleDownload() {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `love21-donation-${orientation}.png`;
    link.click();
    trackShare();
    flash(copy.imageDownloaded);
  }

  async function handleCopyImage() {
    if (!imageUrl) return;
    try {
      const blob = dataUrlToBlob(imageUrl);
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      flash(copy.imageCopied);
    } catch {
      flash(copy.copyImageUnsupported);
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      flash(copy.linkCopied);
    } catch {
      flash(copy.linkCopyFailed);
    }
  }

  async function handleNativeShare() {
    if (!navigator.share) return;
    try {
      await navigator.share({ title: shareText, text: shareText, url: shareUrl });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        flash(copy.shareSheetFailed);
      }
    }
    trackShare();
  }

  function handleSocialClick(target: SocialTarget) {
    window.open(target.buildUrl(shareUrl, shareText), "_blank", "noopener,noreferrer");
    trackShare();
  }

  return (
    <div
      className="quiz-share-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="quiz-share-panel"
        role="dialog"
        aria-modal="true"
        aria-label={copy.modalAria}
        tabIndex={-1}
        ref={panelRef}
      >
        <button type="button" className="quiz-share-close" aria-label={copy.close} onClick={onClose}>
          <span aria-hidden="true">×</span>
        </button>
        <h3>{copy.heading}</h3>
        <p className="quiz-share-subtitle">
          {copy.subtitle}
        </p>

        <div className="quiz-share-orientation" role="group" aria-label={copy.orientationGroupAria}>
          {orientationOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`quiz-share-orientation-button ${
                orientation === option.value ? "is-active" : ""
              }`}
              aria-pressed={orientation === option.value}
              onClick={() => setOrientation(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className={`quiz-share-preview quiz-share-preview-${orientation}`}>
          {imageUrl ? (
            <img src={imageUrl} alt={copy.previewAlt(data.headline, data.amountHkd.toLocaleString("en-HK"))} />
          ) : (
            <div className="quiz-share-preview-loading">{copy.preparingCard}</div>
          )}
        </div>

        {feedback && (
          <p className="quiz-share-feedback" role="status">
            {feedback}
          </p>
        )}

        <div className="quiz-share-actions">
          {supportsNativeShare && (
            <button type="button" className="button button-dark" onClick={handleNativeShare}>
              {copy.shareEllipsis}
            </button>
          )}
          <button type="button" className="button button-outline" onClick={handleDownload}>
            {copy.saveImage}
          </button>
          <button type="button" className="button button-outline" onClick={handleCopyImage}>
            {copy.copyImage}
          </button>
          <button type="button" className="button button-outline" onClick={handleCopyLink}>
            {copy.copyLink}
          </button>
        </div>

        <div className="quiz-share-socials">
          {socialTargets.map((target) => (
            <button
              key={target.key}
              type="button"
              className="quiz-share-social-button"
              onClick={() => handleSocialClick(target)}
            >
              {target.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

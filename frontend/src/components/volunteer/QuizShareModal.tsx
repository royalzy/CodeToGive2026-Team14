import { useEffect, useRef, useState } from "react";

import { localizeQuizResult, type QuizResult } from "../../content/volunteerQuiz";
import { useLanguage } from "../../hooks/useLanguage";
import { localizeDeep } from "../../lib/zhConvert";
import {
  dataUrlToBlob,
  generateQuizResultImage,
  type ShareImageOrientation,
} from "../../lib/quizShareImage";
import { trackVolunteerEvent } from "../../lib/volunteerAnalytics";

const orientationOptions: { value: ShareImageOrientation; labelEn: string; labelZh: string }[] = [
  { value: "vertical", labelEn: "Vertical", labelZh: "直向" },
  { value: "horizontal", labelEn: "Horizontal", labelZh: "橫向" },
];

interface SocialTarget {
  key: string;
  label: string;
  buildUrl: (shareUrl: string, shareText: string) => string;
}

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

const copy = {
  en: {
    ariaLabel: "Share your volunteer quiz result",
    close: "Close",
    heading: "Share your result",
    subtitle: "Save the image, copy the link, or post it straight to your favourite app.",
    orientationGroupLabel: "Image orientation",
    preparingCard: "Preparing your result card…",
    resultCardAlt: (archetype: string, title: string) => `${archetype} — ${title} quiz result card`,
    shareText: (archetype: string, title: string) =>
      `I just found out I'm "${archetype}" (${title}) on Love 21's "What type of volunteer are you?" quiz.`,
    imageDownloaded: "Image downloaded",
    imageCopied: "Image copied to clipboard",
    imageCopyUnsupported: "Copying images isn't supported here — try downloading instead",
    linkCopied: "Link copied to clipboard",
    linkCopyFailed: "Couldn't copy the link",
    shareSheetFailed: "Couldn't open the share sheet",
    shareEllipsis: "Share…",
    saveImage: "Save image",
    copyImage: "Copy image",
    copyLink: "Copy link",
  },
  zh: {
    ariaLabel: "分享你的義工測驗結果",
    close: "關閉",
    heading: "分享你的結果",
    subtitle: "儲存圖片、複製連結，或直接分享到你喜愛的應用程式。",
    orientationGroupLabel: "圖片方向",
    preparingCard: "正在準備你的結果卡……",
    resultCardAlt: (archetype: string, title: string) => `${archetype} — ${title} 測驗結果卡`,
    shareText: (archetype: string, title: string) =>
      `我剛在 Love 21 的「你是哪種義工？」測驗中，發現我是「${archetype}」（${title}）。`,
    imageDownloaded: "圖片已下載",
    imageCopied: "圖片已複製到剪貼簿",
    imageCopyUnsupported: "此處不支援複製圖片——請改為下載",
    linkCopied: "連結已複製到剪貼簿",
    linkCopyFailed: "無法複製連結",
    shareSheetFailed: "無法開啟分享面板",
    shareEllipsis: "分享…",
    saveImage: "儲存圖片",
    copyImage: "複製圖片",
    copyLink: "複製連結",
  },
} as const;

export function QuizShareModal({
  result: rawResult,
  onClose,
}: {
  result: QuizResult;
  onClose: () => void;
}) {
  const { lang } = useLanguage();
  // Note: `copy` mixes plain strings with template functions. localizeDeep
  // only walks string/array/object leaves, so functions pass through
  // untouched — their *outputs* are localized individually where used below.
  const rawCopy = copy[lang === "en" ? "en" : "zh"];
  const t = localizeDeep(rawCopy, lang);
  const result = localizeDeep(localizeQuizResult(rawResult, lang), lang);
  const [orientation, setOrientation] = useState<ShareImageOrientation>("vertical");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const shareUrl = new URL(`/volunteer/match?result=${result.letter}`, window.location.origin).toString();
  const shareText = localizeDeep(rawCopy.shareText(result.archetype, result.title), lang);
  const supportsNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  useEffect(() => {
    let cancelled = false;
    setImageUrl(null);
    generateQuizResultImage(result, orientation).then((url) => {
      if (!cancelled) setImageUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [result, orientation]);

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

  function handleDownload() {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `love21-volunteer-quiz-${result.letter.toLowerCase()}-${orientation}.png`;
    link.click();
    trackVolunteerEvent("role_shared", { role_id: result.matches[0].roleId });
    flash(t.imageDownloaded);
  }

  async function handleCopyImage() {
    if (!imageUrl) return;
    try {
      const blob = dataUrlToBlob(imageUrl);
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      flash(t.imageCopied);
    } catch {
      flash(t.imageCopyUnsupported);
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      flash(t.linkCopied);
    } catch {
      flash(t.linkCopyFailed);
    }
  }

  async function handleNativeShare() {
    if (!navigator.share) return;
    try {
      await navigator.share({ title: shareText, text: shareText, url: shareUrl });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        flash(t.shareSheetFailed);
      }
    }
    trackVolunteerEvent("role_shared", { role_id: result.matches[0].roleId });
  }

  function handleSocialClick(target: SocialTarget) {
    window.open(target.buildUrl(shareUrl, shareText), "_blank", "noopener,noreferrer");
    trackVolunteerEvent("role_shared", { role_id: result.matches[0].roleId });
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
        aria-label={t.ariaLabel}
        tabIndex={-1}
        ref={panelRef}
      >
        <button type="button" className="quiz-share-close" aria-label={t.close} onClick={onClose}>
          <span aria-hidden="true">×</span>
        </button>
        <h3>{t.heading}</h3>
        <p className="quiz-share-subtitle">{t.subtitle}</p>

        <div className="quiz-share-orientation" role="group" aria-label={t.orientationGroupLabel}>
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
              {localizeDeep(lang === "en" ? option.labelEn : option.labelZh, lang)}
            </button>
          ))}
        </div>

        <div className={`quiz-share-preview quiz-share-preview-${orientation}`}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={localizeDeep(rawCopy.resultCardAlt(result.archetype, result.title), lang)}
            />
          ) : (
            <div className="quiz-share-preview-loading">{t.preparingCard}</div>
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
              {t.shareEllipsis}
            </button>
          )}
          <button type="button" className="button button-outline" onClick={handleDownload}>
            {t.saveImage}
          </button>
          <button type="button" className="button button-outline" onClick={handleCopyImage}>
            {t.copyImage}
          </button>
          <button type="button" className="button button-outline" onClick={handleCopyLink}>
            {t.copyLink}
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

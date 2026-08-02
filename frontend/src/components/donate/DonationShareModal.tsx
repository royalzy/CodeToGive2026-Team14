import { useEffect, useRef, useState } from "react";

import {
  dataUrlToBlob,
  generateDonationShareImage,
  type DonationShareData,
  type ShareImageOrientation,
} from "../../lib/donationShareImage";
import { trackDonationEvent } from "../../analytics";

const orientationOptions: { value: ShareImageOrientation; label: string }[] = [
  { value: "vertical", label: "Vertical" },
  { value: "horizontal", label: "Horizontal" },
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

export function DonationShareModal({
  data,
  onClose,
}: {
  data: DonationShareData;
  onClose: () => void;
}) {
  const [orientation, setOrientation] = useState<ShareImageOrientation>("vertical");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const shareUrl = new URL("/donate", window.location.origin).toString();
  const shareText = `I just gave HK$${data.amountHkd.toLocaleString("en-HK")} to Love 21 — ${data.headline}`;
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
    flash("Image downloaded");
  }

  async function handleCopyImage() {
    if (!imageUrl) return;
    try {
      const blob = dataUrlToBlob(imageUrl);
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      flash("Image copied to clipboard");
    } catch {
      flash("Copying images isn't supported here — try downloading instead");
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      flash("Link copied to clipboard");
    } catch {
      flash("Couldn't copy the link");
    }
  }

  async function handleNativeShare() {
    if (!navigator.share) return;
    try {
      await navigator.share({ title: shareText, text: shareText, url: shareUrl });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        flash("Couldn't open the share sheet");
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
        aria-label="Share your donation impact"
        tabIndex={-1}
        ref={panelRef}
      >
        <button type="button" className="quiz-share-close" aria-label="Close" onClick={onClose}>
          <span aria-hidden="true">×</span>
        </button>
        <h3>Share your impact</h3>
        <p className="quiz-share-subtitle">
          Save the image, copy the link, or post it straight to your favourite app.
        </p>

        <div className="quiz-share-orientation" role="group" aria-label="Image orientation">
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
            <img src={imageUrl} alt={`${data.headline} — HK$${data.amountHkd.toLocaleString("en-HK")} donation card`} />
          ) : (
            <div className="quiz-share-preview-loading">Preparing your impact card…</div>
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
              Share…
            </button>
          )}
          <button type="button" className="button button-outline" onClick={handleDownload}>
            Save image
          </button>
          <button type="button" className="button button-outline" onClick={handleCopyImage}>
            Copy image
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

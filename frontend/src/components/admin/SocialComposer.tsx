import { useEffect, useRef, useState } from "react";

import {
  FB_MAX_CAPTION,
  IG_MAX_CAPTION,
  WEB_MAX_CAPTION,
  MAX_IMAGES,
  publishSocialPost,
  schedulePost,
  type PlatformId,
  type SocialPostResult,
} from "../../api/client";
import "./SocialComposer.css";

const CAPTION_LIMITS: Record<PlatformId, number> = {
  website: WEB_MAX_CAPTION,
  instagram: IG_MAX_CAPTION,
  facebook: FB_MAX_CAPTION,
};

/** Platforms that cannot publish without an image. */
const NEEDS_IMAGE: PlatformId[] = ["website", "instagram"];

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const IMAGE_REQUIREMENTS =
  `JPEG, PNG or WebP, up to 10MB each and ${MAX_IMAGES} images per post. ` +
  "Large photos are resized automatically. Two or more become an Instagram " +
  "carousel and a Facebook multi-photo post.";

function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38C1.35 2.68.93 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13.67.67 1.34 1.08 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.3 1.46-.72 2.13-1.38.67-.67 1.08-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.79-.72-1.46-1.38-2.13C21.32 1.35 20.65.93 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0z" />
      <path d="M12 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8z" />
      <circle cx="18.41" cy="5.59" r="1.44" />
    </svg>
  );
}

function FacebookIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}

function InfoIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-13h2v2h-2V7zm0 4h2v6h-2v-6z" />
    </svg>
  );
}

function WebsiteIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 0a12 12 0 100 24 12 12 0 000-24zm8.4 7.2h-3.5a18.7 18.7 0 00-1.6-4.1 9.6 9.6 0 015.1 4.1zM12 2.4c.8 1.2 1.5 2.8 2 4.8h-4c.5-2 1.2-3.6 2-4.8zM2.7 14.4a9.5 9.5 0 010-4.8h4a20.6 20.6 0 000 4.8zm1 2.4h3.4c.4 1.5.9 2.9 1.6 4.1a9.6 9.6 0 01-5.1-4.1zm3.4-9.6H3.7a9.6 9.6 0 015.1-4.1c-.7 1.2-1.2 2.6-1.6 4.1zM12 21.6c-.8-1.2-1.5-2.8-2-4.8h4c-.5 2-1.2 3.6-2 4.8zm2.5-7.2h-5a18.4 18.4 0 010-4.8h5a18.4 18.4 0 010 4.8zm.3 6.6c.7-1.2 1.2-2.6 1.6-4.1h3.5a9.6 9.6 0 01-5.1 4.1zm2-6.6a20.6 20.6 0 000-4.8h4a9.5 9.5 0 010 4.8z" />
    </svg>
  );
}

const PLATFORMS: {
  id: PlatformId;
  label: string;
  Icon: (props: { className?: string }) => React.ReactElement;
  brand: string;
}[] = [
  { id: "website", label: "Website", Icon: WebsiteIcon, brand: "text-[#1687a7]" },
  { id: "instagram", label: "Instagram", Icon: InstagramIcon, brand: "text-[#E4405F]" },
  { id: "facebook", label: "Facebook", Icon: FacebookIcon, brand: "text-[#1877F2]" },
];

const PLATFORM_LABEL: Record<PlatformId, string> = {
  website: "Website",
  instagram: "Instagram",
  facebook: "Facebook",
};

/** Shared pill styling so "View post" and "Copy link" read as one control pair.
 *
 * Note: styles.css sets `button { font-size: inherit }` outside any cascade
 * layer, which beats Tailwind's layered utilities regardless of specificity.
 * The size therefore comes from the parent (see PILL_ROW) so the anchor and
 * the button end up identical without needing `!important`. */
const PILL_BUTTON =
  "inline-flex items-center justify-center rounded-full border border-love-ink/20 px-4 py-1.5 " +
  "font-medium text-love-ink no-underline transition-colors hover:bg-love-ink/5";

const PILL_ROW = "mt-3 flex flex-wrap items-center gap-2 text-sm";

function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button type="button" onClick={copy} className={PILL_BUTTON}>
      {copied ? "Copied ✓" : "Copy link"}
    </button>
  );
}

function ResultCard({ result }: { result: SocialPostResult }) {
  const platform = PLATFORMS.find((p) => p.id === result.platform);
  const published = result.status === "published";
  const Icon = platform?.Icon;

  return (
    <article
      className={`rounded-xl border bg-white p-4 ${
        published ? "border-love-teal/50" : "border-love-red/50"
      }`}
    >
      <div className="flex items-center gap-2">
        {Icon ? <Icon className={`h-5 w-5 ${platform?.brand}`} /> : null}
        <strong>{platform?.label}</strong>
        <span
          className={`ml-auto rounded-full px-2 py-0.5 text-xs font-semibold ${
            published ? "bg-love-teal text-white" : "bg-love-red text-white"
          }`}
        >
          {published ? "Published" : "Failed"}
        </span>
      </div>

      {published && result.permalink ? (
        <div className={PILL_ROW}>
          <a href={result.permalink} target="_blank" rel="noreferrer noopener" className={PILL_BUTTON}>
            View post
          </a>
          <CopyLinkButton url={result.permalink} />
        </div>
      ) : null}

      {!published && result.error ? (
        <p className="mt-2 text-sm text-love-ink/80">{result.error}</p>
      ) : null}
    </article>
  );
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex align-middle">
      <button
        type="button"
        aria-label={text}
        className="flex items-center justify-center rounded-full text-love-ink/40 transition-colors hover:text-love-ink"
      >
        <InfoIcon className="h-4 w-4" />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-56 -translate-x-1/2 rounded-lg bg-love-ink px-3 py-2 text-xs leading-snug text-white opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}

interface SocialComposerProps {
  /** Called after a post is scheduled, so the pending list can refresh. */
  onScheduled?: () => void;
}

export function SocialComposer({ onScheduled }: SocialComposerProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [splitCaptions, setSplitCaptions] = useState(false);
  // One entry per platform, so adding a platform needs no new state.
  const [perCaption, setPerCaption] = useState<Record<PlatformId, string>>({
    website: "",
    instagram: "",
    facebook: "",
  });
  const [selected, setSelected] = useState<PlatformId[]>(["website", "instagram", "facebook"]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SocialPostResult[] | null>(null);
  const [scheduling, setScheduling] = useState(false);
  const [scheduledFor, setScheduledFor] = useState("");
  const [scheduledNotice, setScheduledNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Object URLs leak if not revoked when the selection changes or unmounts.
  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    // Wrapped rather than passed by reference: forEach would hand it an index
    // as a second argument and unbind it from URL.
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  // Instagram always needs media, so drop it when there is no image rather
  // than letting the request fail server-side.
  useEffect(() => {
    if (files.length === 0) {
      setSelected((current) => current.filter((p) => !NEEDS_IMAGE.includes(p)));
    }
  }, [files]);

  function addFiles(picked: FileList | null) {
    setError(null);
    setResults(null);
    // Starting a new post: the previous confirmation no longer applies.
    setScheduledNotice(null);
    if (!picked || picked.length === 0) return;

    const incoming = [...picked];
    const rejected = incoming.filter(
      (f) => !ACCEPTED_TYPES.includes(f.type) || f.size > MAX_UPLOAD_BYTES,
    );
    const accepted = incoming.filter((f) => !rejected.includes(f));

    setFiles((current) => {
      const room = MAX_IMAGES - current.length;
      if (room <= 0) {
        setError(`You can attach up to ${MAX_IMAGES} images.`);
        return current;
      }
      if (accepted.length > room) {
        setError(`Only the first ${room} of those fit; the limit is ${MAX_IMAGES} images.`);
      } else if (rejected.length > 0) {
        setError(
          `Skipped ${rejected.length} file(s): use JPEG, PNG or WebP under 10MB.`,
        );
      }
      const next = [...current, ...accepted.slice(0, room)];
      if (next.length > 0) {
        // Re-enable the image-only platforms that were dropped when the
        // selection was cleared, keeping the listed order.
        setSelected((sel) =>
          PLATFORMS.map((p) => p.id).filter(
            (id) => sel.includes(id) || NEEDS_IMAGE.includes(id),
          ),
        );
      }
      return next;
    });

    // Allow re-picking the same file after removing it.
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeFileAt(index: number) {
    setError(null);
    setFiles((current) => current.filter((_, i) => i !== index));
  }

  function clearFiles() {
    setFiles([]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function togglePlatform(id: PlatformId) {
    setScheduledNotice(null);
    setSelected((current) =>
      current.includes(id) ? current.filter((p) => p !== id) : [...current, id],
    );
  }

  function reset() {
    setFiles([]);
    setCaption("");
    setPerCaption({ website: "", instagram: "", facebook: "" });
    setSplitCaptions(false);
    setResults(null);
    setError(null);
    setSelected(["website", "instagram", "facebook"]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  /** Validation shared by "Post now" and "Schedule". Returns the resolved
   *  captions, or null when something is missing (error already set). */
  function validate(): { textFor: (p: PlatformId) => string } | null {
    if (selected.length === 0) {
      setError("Choose at least one platform.");
      return null;
    }
    const imageless = selected.filter((p) => NEEDS_IMAGE.includes(p));
    if (files.length === 0 && imageless.length > 0) {
      setError(
        `${imageless.map((p) => PLATFORM_LABEL[p]).join(" and ")} ` +
          "needs an image. Add one, or post to Facebook only.",
      );
      return null;
    }

    // Each platform uses its override when splitting, otherwise the shared one.
    const textFor = (p: PlatformId) => (splitCaptions ? perCaption[p] : caption).trim();
    const missing = selected.filter((p) => !textFor(p));
    if (missing.length > 0) {
      setError(
        splitCaptions
          ? `Write a caption for ${missing.map((p) => PLATFORM_LABEL[p]).join(" and ")}.`
          : "Write a caption before posting.",
      );
      return null;
    }

    return { textFor };
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setScheduledNotice(null);

    const valid = validate();
    if (!valid) return;
    const { textFor } = valid;

    setBusy(true);
    try {
      const response = await publishSocialPost({
        images: files,
        caption: splitCaptions ? "" : caption.trim(),
        captionWebsite: splitCaptions ? textFor("website") : undefined,
        captionInstagram: splitCaptions ? textFor("instagram") : undefined,
        captionFacebook: splitCaptions ? textFor("facebook") : undefined,
        platforms: selected,
      });
      setResults(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function onSchedule() {
    setError(null);
    setScheduledNotice(null);

    const valid = validate();
    if (!valid) return;
    const { textFor } = valid;

    if (!scheduledFor) {
      setError("Choose a date and time for the post.");
      return;
    }

    setBusy(true);
    try {
      await schedulePost({
        images: files,
        caption: splitCaptions ? "" : caption.trim(),
        captionWebsite: splitCaptions ? textFor("website") : undefined,
        captionInstagram: splitCaptions ? textFor("instagram") : undefined,
        captionFacebook: splitCaptions ? textFor("facebook") : undefined,
        platforms: selected,
        scheduledFor,
      });
      setScheduledNotice(
        `Scheduled for ${new Date(scheduledFor).toLocaleString("en-GB", {
          dateStyle: "medium",
          timeStyle: "short",
        })}.`,
      );
      reset();
      setScheduling(false);
      onScheduled?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not schedule the post.");
    } finally {
      setBusy(false);
    }
  }

  // A shared caption has to satisfy every selected platform, so use the
  // strictest limit among them.
  const sharedLimit = selected.length
    ? Math.min(...selected.map((p) => CAPTION_LIMITS[p]))
    : FB_MAX_CAPTION;
  // Splitting only means anything when posting to more than one place.
  const multipleSelected = selected.length > 1;

  const publishedCount = results?.filter((r) => r.status === "published").length ?? 0;

  return (
    <div className="social-composer mx-auto max-w-3xl">
      {results ? (
        <div className="rounded-2xl border border-love-ink/10 bg-white p-6">
          <h3 className="text-xl font-semibold">
            {publishedCount === results.length
              ? "Posted successfully"
              : publishedCount > 0
                ? "Posted with some issues"
                : "Nothing was posted"}
          </h3>
          <p className="mt-1 text-sm text-love-ink/70">
            {publishedCount} of {results.length} platform{results.length === 1 ? "" : "s"} published.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {results.map((result) => (
              <ResultCard key={result.platform} result={result} />
            ))}
          </div>

          <button
            type="button"
            onClick={reset}
            className="mt-5 rounded-full bg-love-ink px-5 py-2 font-semibold text-white"
          >
            Create another post
          </button>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-love-ink/10 bg-white p-6"
          noValidate
        >
          {error ? (
            <div role="alert" className="mb-4 rounded-lg bg-love-red/10 p-3 text-sm text-love-red">
              {error}
            </div>
          ) : null}

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Images</span>
            <InfoTooltip text={IMAGE_REQUIREMENTS} />
            {files.length > 0 ? (
              <span className="ml-auto text-xs text-love-ink/60">
                {files.length} / {MAX_IMAGES}
              </span>
            ) : null}
          </div>

          {/* Native file input is visually hidden; the label is the click target. */}
          <input
            id="social-image"
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPTED_TYPES.join(",")}
            onChange={(e) => addFiles(e.target.files)}
            className="sr-only"
          />
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <label
              htmlFor="social-image"
              className={`rounded-full border border-love-ink bg-white px-5 py-2 text-sm font-semibold text-love-ink transition-colors focus-within:ring-2 focus-within:ring-love-ink ${
                files.length >= MAX_IMAGES
                  ? "cursor-not-allowed opacity-40"
                  : "cursor-pointer hover:bg-love-ink hover:text-white"
              }`}
            >
              {files.length > 0 ? "Add more" : "Choose images"}
            </label>

            {files.length > 0 ? (
              <button
                type="button"
                onClick={clearFiles}
                className="text-xs text-love-ink/50 underline underline-offset-2 hover:text-love-ink"
              >
                Remove all
              </button>
            ) : (
              <span className="flex items-center gap-1 text-xs text-love-ink/50">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5">
                  <path d="M12 2 1 21h22L12 2zm0 5 7.5 13h-15L12 7zm-1 4v4h2v-4h-2zm0 6v2h2v-2h-2z" />
                </svg>
                No file chosen — text-only post
              </span>
            )}
          </div>

          {previewUrls.length > 0 ? (
            <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {previewUrls.map((url, index) => (
                <li key={url} className="group relative">
                  <img
                    src={url}
                    alt={`Selected image ${index + 1}: ${files[index]?.name ?? ""}`}
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeFileAt(index)}
                    aria-label={`Remove image ${index + 1}`}
                    className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-love-ink/80 text-sm leading-none text-white opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
                  >
                    ×
                  </button>
                  {files.length > 1 ? (
                    <span className="absolute bottom-1 left-1 rounded bg-love-ink/70 px-1.5 text-xs text-white">
                      {index + 1}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
          {files.length > 1 ? (
            <p className="mt-2 text-xs text-love-ink/60">
              Posts as an Instagram carousel and a single Facebook photo post.
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-semibold">Caption</span>
            {/* Only meaningful when posting to more than one place at once. */}
            {multipleSelected ? (
              <label className="flex cursor-pointer items-center gap-2 text-xs text-love-ink/70">
                <input
                  type="checkbox"
                  checked={splitCaptions}
                  onChange={(e) => {
                    const on = e.target.checked;
                    setSplitCaptions(on);
                    // Carry the text across either way so nothing is retyped.
                    if (on) {
                      setPerCaption((current) => {
                        const next = { ...current };
                        for (const id of selected) next[id] = next[id] || caption;
                        return next;
                      });
                    } else {
                      setCaption((v) => v || selected.map((id) => perCaption[id]).find(Boolean) || "");
                    }
                  }}
                />
                Write a different caption for each platform
              </label>
            ) : null}
          </div>

          {splitCaptions && multipleSelected ? (
            <div className="mt-2 grid gap-4 sm:grid-cols-2">
              {/* One box per selected platform, in the order they are listed. */}
              {PLATFORMS.filter((platform) => selected.includes(platform.id)).map((platform) => {
                const limit = CAPTION_LIMITS[platform.id];
                const value = perCaption[platform.id];
                return (
                  <div key={platform.id}>
                    <label
                      className="flex items-center gap-1.5 text-xs font-semibold"
                      htmlFor={`social-caption-${platform.id}`}
                    >
                      <platform.Icon className={`h-3.5 w-3.5 ${platform.brand}`} />
                      {platform.label}
                    </label>
                    <textarea
                      id={`social-caption-${platform.id}`}
                      rows={4}
                      value={value}
                      maxLength={limit}
                      onChange={(e) => {
                        setScheduledNotice(null);
                        setPerCaption((current) => ({
                          ...current,
                          [platform.id]: e.target.value,
                        }));
                      }}
                      placeholder="Share a moment..."
                      className="mt-1 w-full rounded-lg border border-love-ink/20 p-3"
                    />
                    <p className="mt-1 text-right text-xs text-love-ink/60">
                      {value.length} / {limit}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <>
              <label className="sr-only" htmlFor="social-caption">
                Caption
              </label>
              <textarea
                id="social-caption"
                rows={4}
                value={caption}
                maxLength={sharedLimit}
                onChange={(e) => {
                  setScheduledNotice(null);
                  setCaption(e.target.value);
                }}
                placeholder="Share a moment..."
                className="mt-2 w-full rounded-lg border border-love-ink/20 p-3"
              />
              <p className="mt-1 text-right text-xs text-love-ink/60">
                {caption.length} / {sharedLimit}
              </p>
            </>
          )}

          <fieldset className="mt-4">
            <legend className="text-sm font-semibold">Post to</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {PLATFORMS.map(({ id, label, Icon, brand }) => {
                // Website and Instagram cannot post without media; Facebook can.
                const blocked = NEEDS_IMAGE.includes(id) && files.length === 0;
                return (
                  <label
                    key={id}
                    className={`flex items-center gap-3 rounded-xl border p-3 ${
                      blocked
                        ? "cursor-not-allowed border-love-ink/10 opacity-50"
                        : selected.includes(id)
                          ? "cursor-pointer border-love-ink bg-love-ink/5"
                          : "cursor-pointer border-love-ink/20"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(id)}
                      disabled={blocked}
                      onChange={() => togglePlatform(id)}
                    />
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Icon className={`h-4 w-4 ${brand}`} />
                      {label}
                    </span>
                    {blocked ? (
                      <span className="ml-auto text-xs font-normal text-love-ink/50">
                        Needs an image
                      </span>
                    ) : null}
                  </label>
                );
              })}
            </div>
          </fieldset>

          {scheduledNotice ? (
            <p className="mt-4 rounded-lg bg-love-teal/10 p-3 text-sm text-love-ink">
              {scheduledNotice}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={busy}
              className="flex-1 rounded-full bg-love-ink px-5 py-3 font-semibold text-white disabled:opacity-60"
            >
              {busy ? "Posting…" : "Post now"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => setScheduling((open) => !open)}
              aria-expanded={scheduling}
              className="flex-1 rounded-full border border-love-ink px-5 py-3 font-semibold text-love-ink disabled:opacity-60"
            >
              Schedule post
            </button>
          </div>

          {scheduling ? (
            <div className="mt-4 rounded-xl border border-love-ink/15 p-4">
              <label className="block text-sm font-semibold" htmlFor="schedule-when">
                Date and time
              </label>
              <input
                id="schedule-when"
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                className="mt-1 w-full rounded-lg border border-love-ink/20 p-3"
              />
              <p className="mt-2 text-xs text-love-ink/60">
                The post is saved and listed below. Nothing sends automatically —
                publish it from the pending list when you are ready.
              </p>
              <button
                type="button"
                disabled={busy}
                onClick={onSchedule}
                className="mt-3 rounded-full bg-love-ink px-5 py-2 font-semibold text-white disabled:opacity-60"
              >
                {busy ? "Saving…" : "Save to schedule"}
              </button>
            </div>
          ) : null}
          <p aria-live="polite" className="sr-only">
            {busy ? "Posting your update" : ""}
          </p>
        </form>
      )}
    </div>
  );
}

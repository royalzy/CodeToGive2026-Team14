import { useEffect, useRef, useState } from "react";

import { publishSocialPost, type PlatformId, type SocialPostResult } from "../../api/client";
import "./SocialComposer.css";

const MAX_CAPTION = 2200;
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const IMAGE_REQUIREMENTS = "JPEG, PNG or WebP, up to 10MB. Large photos are resized automatically.";

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

const PLATFORMS: {
  id: PlatformId;
  label: string;
  Icon: (props: { className?: string }) => React.ReactElement;
  brand: string;
}[] = [
  { id: "instagram", label: "Instagram", Icon: InstagramIcon, brand: "text-[#E4405F]" },
  { id: "facebook", label: "Facebook", Icon: FacebookIcon, brand: "text-[#1877F2]" },
];

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

export function SocialComposer() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [selected, setSelected] = useState<PlatformId[]>(["instagram", "facebook"]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SocialPostResult[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Object URLs leak if not revoked when the file changes or the form unmounts.
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function chooseFile(next: File | undefined) {
    setError(null);
    setResults(null);
    if (!next) return;

    if (!ACCEPTED_TYPES.includes(next.type)) {
      setError("Choose a JPEG, PNG or WebP image.");
      return;
    }
    if (next.size > MAX_UPLOAD_BYTES) {
      setError("That image is over 10MB. Please choose a smaller file.");
      return;
    }
    setFile(next);
  }

  function togglePlatform(id: PlatformId) {
    setSelected((current) =>
      current.includes(id) ? current.filter((p) => p !== id) : [...current, id],
    );
  }

  function reset() {
    setFile(null);
    setCaption("");
    setResults(null);
    setError(null);
    setSelected(["instagram", "facebook"]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!file) {
      setError("Choose an image to post.");
      return;
    }
    if (!caption.trim()) {
      setError("Write a caption before posting.");
      return;
    }
    if (selected.length === 0) {
      setError("Choose at least one platform.");
      return;
    }

    setBusy(true);
    try {
      const response = await publishSocialPost({
        image: file,
        caption: caption.trim(),
        platforms: selected,
      });
      setResults(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

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
            <span className="text-sm font-semibold">Image</span>
            <InfoTooltip text={IMAGE_REQUIREMENTS} />
          </div>

          {/* Native file input is visually hidden; the label is the click target. */}
          <input
            id="social-image"
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            onChange={(e) => chooseFile(e.target.files?.[0])}
            className="sr-only"
          />
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <label
              htmlFor="social-image"
              className="cursor-pointer rounded-full border border-love-ink bg-white px-5 py-2 text-sm font-semibold text-love-ink transition-colors hover:bg-love-ink hover:text-white focus-within:ring-2 focus-within:ring-love-ink"
            >
              {file ? "Change image" : "Choose image"}
            </label>

            {file ? (
              <span className="text-sm text-love-ink/70">{file.name}</span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-love-ink/50">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5">
                  <path d="M12 2 1 21h22L12 2zm0 5 7.5 13h-15L12 7zm-1 4v4h2v-4h-2zm0 6v2h2v-2h-2z" />
                </svg>
                No file chosen
              </span>
            )}
          </div>

          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Selected upload preview"
              className="mt-3 max-h-64 w-full rounded-xl object-contain"
            />
          ) : null}

          <label className="mt-6 block text-sm font-semibold" htmlFor="social-caption">
            Caption
          </label>
          <textarea
            id="social-caption"
            rows={4}
            value={caption}
            maxLength={MAX_CAPTION}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Share a moment..."
            className="mt-1 w-full rounded-lg border border-love-ink/20 p-3"
          />
          <p className="mt-1 text-right text-xs text-love-ink/60">
            {caption.length} / {MAX_CAPTION}
          </p>

          <fieldset className="mt-4">
            <legend className="text-sm font-semibold">Post to</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {PLATFORMS.map(({ id, label, Icon, brand }) => (
                <label
                  key={id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 ${
                    selected.includes(id) ? "border-love-ink bg-love-ink/5" : "border-love-ink/20"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(id)}
                    onChange={() => togglePlatform(id)}
                  />
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Icon className={`h-4 w-4 ${brand}`} />
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={busy}
            className="mt-6 w-full rounded-full bg-love-ink px-5 py-3 font-semibold text-white disabled:opacity-60"
          >
            {busy ? "Posting…" : "Post now"}
          </button>
          <p aria-live="polite" className="sr-only">
            {busy ? "Posting your update" : ""}
          </p>
        </form>
      )}
    </div>
  );
}

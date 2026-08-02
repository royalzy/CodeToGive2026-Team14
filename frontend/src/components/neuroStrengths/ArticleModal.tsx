import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { LABEL_STYLES } from "./ArticleCard";
import type { Article } from "./data";

function renderRichText(content: string) {
  const paragraphs = content
    .split("[Paragraph break]")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return paragraphs.map((paragraph, index) => {
    const segments = paragraph.split(/(\*\*.+?\*\*)/g);

    return (
      <p key={index}>
        {segments.map((segment, segmentIndex) =>
          segment.startsWith("**") && segment.endsWith("**") ? (
            <strong key={segmentIndex}>{segment.slice(2, -2)}</strong>
          ) : (
            segment
          ),
        )}
      </p>
    );
  });
}

export function ArticleModal({
  article,
  onClose,
}: {
  article: Article | null;
  onClose: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!article) {
      setIsVisible(false);
      return;
    }

    const frame = requestAnimationFrame(() => setIsVisible(true));

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [article, onClose]);

  if (!article) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="article-modal-title"
        onClick={(event) => event.stopPropagation()}
        className={`relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-y-auto rounded-3xl bg-white shadow-2xl transition-all duration-500 ease-out ${
          isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"
        }`}
      >
        <div className="sticky top-0 z-10 flex justify-end bg-white/90 p-4 backdrop-blur-sm">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close article"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-love-ink/5 text-love-ink shadow-sm transition-colors hover:bg-love-ink/10"
          >
            <X size={22} />
          </button>
        </div>

        <div className="px-10 pb-10 md:px-16 md:pb-16">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${LABEL_STYLES[article.label]}`}
          >
            {article.label}
          </span>
          <h3
            id="article-modal-title"
            className="mt-4 text-3xl font-bold text-love-ink sm:text-4xl"
          >
            {article.title}
          </h3>
          <p className="mt-3 text-lg text-love-ink/60">{article.subtitle}</p>

          <div className="prose prose-lg mt-8 max-w-none text-love-ink prose-p:leading-relaxed prose-strong:text-love-ink">
            {renderRichText(article.content)}
          </div>
        </div>
      </div>
    </div>
  );
}

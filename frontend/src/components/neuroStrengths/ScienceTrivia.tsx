import { useEffect, useRef } from "react";

import { useLanguage } from "../../hooks/useLanguage";
import { localizeDeep } from "../../lib/zhConvert";
import { localizeTrivia, TRIVIA } from "./data";

function TriviaCardEl({ card, lang }: { card: (typeof TRIVIA)[number]; lang: ReturnType<typeof useLanguage>["lang"] }) {
  const copy = localizeDeep(localizeTrivia(card, lang), lang);

  return (
    <div className="group w-80 shrink-0 snap-start [perspective:1200px]">
      <div
        tabIndex={0}
        className="relative h-56 w-full rounded-2xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-love-blue/50"
      >
        <div className="absolute inset-0 rounded-2xl [transform-style:preserve-3d] transition-transform duration-700 ease-out group-hover:[transform:rotateY(180deg)] group-focus-visible:[transform:rotateY(180deg)]">
          <div className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-love-blue/15 bg-white/80 p-5 shadow-sm [backface-visibility:hidden]">
            <p className="text-xs font-semibold uppercase tracking-wide text-love-blue/70">
              {lang === "en" ? "Trivia" : localizeDeep("小知識", lang)}
            </p>
            <p className="text-lg font-semibold text-love-ink">{copy.question}</p>
            <p className="text-xs text-love-ink/50">
              {lang === "en"
                ? "Hover or focus to reveal the answer"
                : localizeDeep("移到卡片上或聚焦以查看答案", lang)}
            </p>
          </div>

          <div className="absolute inset-0 flex items-center rounded-2xl border border-love-blue/20 bg-love-ink p-5 text-love-cream shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <p className="text-sm">{copy.answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ScienceTrivia() {
  const { lang } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollLeft = track.scrollWidth / 3;
  }, []);

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const setWidth = track.scrollWidth / 3;
    if (track.scrollLeft < setWidth) {
      track.scrollLeft += setWidth;
    } else if (track.scrollLeft >= setWidth * 2) {
      track.scrollLeft -= setWidth;
    }
  }

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent"
        aria-hidden="true"
      />

      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2"
      >
        {[0, 1, 2].map((copyIndex) =>
          TRIVIA.map((card) => (
            <TriviaCardEl key={`${card.id}-${copyIndex}`} card={card} lang={lang} />
          )),
        )}
      </div>
    </div>
  );
}

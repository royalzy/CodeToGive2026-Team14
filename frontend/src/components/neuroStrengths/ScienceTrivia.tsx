import { TRIVIA } from "./data";

export function ScienceTrivia() {
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

      <div className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2">
        {TRIVIA.map((card) => (
          <div key={card.id} className="group w-80 shrink-0 snap-start [perspective:1200px]">
            <div
              tabIndex={0}
              className="relative h-56 w-full rounded-2xl [transform-style:preserve-3d] transition-transform duration-700 ease-out group-hover:[transform:rotateY(180deg)] group-focus-visible:[transform:rotateY(180deg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-love-blue/50"
            >
              <div className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-love-blue/15 bg-white/80 p-5 shadow-sm [backface-visibility:hidden]">
                <p className="text-xs font-semibold uppercase tracking-wide text-love-blue/70">
                  Trivia
                </p>
                <p className="text-lg font-semibold text-love-ink">{card.question}</p>
                <p className="text-xs text-love-ink/50">Hover or focus to reveal the answer</p>
              </div>

              <div className="absolute inset-0 flex items-center rounded-2xl border border-love-blue/20 bg-love-ink p-5 text-love-cream shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <p className="text-sm">{card.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

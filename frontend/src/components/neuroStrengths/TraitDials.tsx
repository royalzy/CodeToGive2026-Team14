import { TRAITS, type TraitId } from "./data";

export function TraitDials({ values }: { values: Record<TraitId, number> }) {
  return (
    <div className="neuro-trait-dials flex flex-col">
      {TRAITS.map((trait) => (
        <div
          key={trait.id}
          className="neuro-trait-dial rounded-2xl border border-love-blue/15 bg-white/70 shadow-sm"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-love-ink">{trait.label}</span>
            <span className="font-mono text-sm text-love-blue">
              {Math.round(values[trait.id])}
            </span>
          </div>

          <input
            type="range"
            min={1}
            max={10}
            step={0.1}
            value={values[trait.id]}
            readOnly
            aria-readonly="true"
            aria-label={`${trait.label} score (set by the selected archetype)`}
            tabIndex={-1}
            className="neuro-trait-range w-full pointer-events-none accent-love-blue opacity-70"
          />
        </div>
      ))}
    </div>
  );
}

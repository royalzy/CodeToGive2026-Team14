import { TRAITS, type TraitId } from "./data";

export function TraitDials({ values }: { values: Record<TraitId, number> }) {
  return (
    <div className="flex flex-col gap-5">
      {TRAITS.map((trait) => (
        <div
          key={trait.id}
          className="rounded-2xl border border-love-blue/15 bg-white/70 p-4 shadow-sm"
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
            className="mt-3 w-full pointer-events-none accent-love-blue opacity-70"
          />
        </div>
      ))}
    </div>
  );
}

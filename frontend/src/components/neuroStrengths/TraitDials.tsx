import { useLanguage } from "../../hooks/useLanguage";
import { localizeDeep } from "../../lib/zhConvert";
import { localizeTraitLabel, TRAITS, type TraitId } from "./data";

export function TraitDials({ values }: { values: Record<TraitId, number> }) {
  const { lang } = useLanguage();

  return (
    <div className="neuro-trait-dials flex flex-col">
      {TRAITS.map((trait) => {
        const label = localizeDeep(localizeTraitLabel(trait.id, lang), lang);

        return (
          <div
            key={trait.id}
            className="neuro-trait-dial rounded-2xl border border-love-blue/15 bg-white/70 shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-love-ink">{label}</span>
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
              aria-label={
                lang === "en"
                  ? `${label} score (set by the selected archetype)`
                  : localizeDeep(`${label}評分（由所選原型設定）`, lang)
              }
              tabIndex={-1}
              className="neuro-trait-range w-full pointer-events-none accent-love-blue opacity-70"
            />
          </div>
        );
      })}
    </div>
  );
}

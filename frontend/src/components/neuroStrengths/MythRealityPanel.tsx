import type { Archetype } from "./data";

export function MythRealityPanel({ archetype }: { archetype: Archetype }) {
  return (
    <div
      key={archetype.id}
      className="rounded-2xl border border-love-teal/20 bg-love-ink p-5 text-love-cream shadow-sm"
    >
      <p className="text-sm">
        <span className="font-semibold text-love-yellow">The Myth: </span>
        {archetype.myth}
      </p>
      <p className="mt-3 text-sm">
        <span className="font-semibold text-love-teal">The Reality — {archetype.realityTitle}: </span>
        {archetype.realityBody}
      </p>
    </div>
  );
}

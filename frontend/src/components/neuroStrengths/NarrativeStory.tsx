import type { Archetype } from "./data";

export function NarrativeStory({ archetype }: { archetype: Archetype }) {
  return (
    <div className="animate-fade-in motion-reduce:animate-none flex flex-col items-center gap-6 rounded-3xl border border-love-blue/15 bg-white/70 p-6 text-center shadow-sm sm:flex-row sm:items-start sm:text-left">
      <img
        src={archetype.avatarUrl}
        alt={archetype.name}
        className="h-24 w-24 shrink-0 rounded-full border-2 border-love-blue/20 bg-white object-cover sm:h-32 sm:w-32"
      />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-love-blue/70">
          Meet the archetype
        </p>
        <h3 className="mt-1 text-2xl font-bold text-love-ink">{archetype.name}</h3>
        <p className="mt-3 text-love-ink/80">{archetype.story}</p>
      </div>
    </div>
  );
}

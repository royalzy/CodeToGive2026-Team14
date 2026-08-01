import { ARCHETYPES } from "./data";

export function ArchetypeSwitcher({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Neurodiversity archetypes"
      className="flex flex-wrap justify-center gap-3"
    >
      {ARCHETYPES.map((archetype) => {
        const isActive = archetype.id === activeId;

        return (
          <button
            key={archetype.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(archetype.id)}
            className={`flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-4 text-sm font-semibold transition-colors ${
              isActive
                ? "border-love-blue bg-love-blue text-white shadow-md"
                : "border-love-blue/20 bg-white/70 text-love-ink hover:border-love-blue/50 hover:text-love-blue"
            }`}
          >
            <img
              src={archetype.avatarUrl}
              alt=""
              className="h-10 w-10 rounded-full border border-love-blue/20 bg-white object-cover"
            />
            {archetype.name}
          </button>
        );
      })}
    </div>
  );
}

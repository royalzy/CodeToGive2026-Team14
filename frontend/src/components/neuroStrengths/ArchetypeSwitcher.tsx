import { useLanguage } from "../../hooks/useLanguage";
import { localizeDeep } from "../../lib/zhConvert";
import { ARCHETYPES, localizeArchetype } from "./data";

export function ArchetypeSwitcher({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const { lang } = useLanguage();

  return (
    <div
      role="tablist"
      aria-label={lang === "en" ? "Neurodiversity archetypes" : localizeDeep("神經多樣性原型", lang)}
      className="neuro-archetype-switcher flex flex-wrap justify-center"
    >
      {ARCHETYPES.map((rawArchetype) => {
        const archetype = localizeDeep(localizeArchetype(rawArchetype, lang), lang);
        const isActive = rawArchetype.id === activeId;

        return (
          <button
            key={archetype.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(archetype.id)}
            className={`neuro-archetype-tab flex items-center gap-2 rounded-full border font-semibold transition-colors ${
              isActive
                ? "border-love-blue bg-love-blue text-white shadow-md"
                : "border-love-blue/20 bg-white/70 text-love-ink hover:border-love-blue/50 hover:text-love-blue"
            }`}
          >
            <img
              src={archetype.avatarUrl}
              alt=""
              className="neuro-archetype-tab-avatar rounded-full border border-love-blue/20 bg-white object-cover"
            />
            {archetype.name}
          </button>
        );
      })}
    </div>
  );
}

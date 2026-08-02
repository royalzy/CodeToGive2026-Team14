import { useLanguage } from "../../hooks/useLanguage";
import { localizeDeep } from "../../lib/zhConvert";
import { localizeArchetype, type Archetype } from "./data";

export function MythRealityPanel({ archetype: rawArchetype }: { archetype: Archetype }) {
  const { lang } = useLanguage();
  const archetype = localizeDeep(localizeArchetype(rawArchetype, lang), lang);

  return (
    <div
      key={archetype.id}
      className="rounded-2xl border border-love-teal/20 bg-love-ink p-5 text-love-cream shadow-sm"
    >
      <p className="text-sm">
        <span className="font-semibold text-love-yellow">
          {lang === "en" ? "The Myth: " : localizeDeep("迷思：", lang)}
        </span>
        {archetype.myth}
      </p>
      <p className="mt-3 text-sm">
        <span className="font-semibold text-love-teal">
          {lang === "en" ? "The Reality — " : localizeDeep("事實 — ", lang)}
          {archetype.realityTitle}:{" "}
        </span>
        {archetype.realityBody}
      </p>
    </div>
  );
}

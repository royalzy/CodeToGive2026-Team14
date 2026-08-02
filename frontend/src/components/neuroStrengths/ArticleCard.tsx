import { useLanguage } from "../../hooks/useLanguage";
import { localizeDeep } from "../../lib/zhConvert";
import { localizeArticle, localizeArticleLabel, type Article } from "./data";

// eslint-disable-next-line react-refresh/only-export-components -- small shared lookup, also used by ArticleModal
export const LABEL_STYLES: Record<Article["label"], string> = {
  FOUNDATIONS: "bg-love-blue/10 text-love-blue",
  PRACTICAL: "bg-love-teal/10 text-love-teal",
  STORIES: "bg-purple-100 text-purple-600",
  GROWTH: "bg-emerald-100 text-emerald-600",
  SUPPORT: "bg-love-orange/10 text-love-orange",
  COMMUNITY: "bg-love-pink/20 text-love-red",
};

export function ArticleCard({ article, onOpen }: { article: Article; onOpen: () => void }) {
  const { lang } = useLanguage();
  const copy = localizeDeep(localizeArticle(article, lang), lang);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="rounded-3xl border border-love-blue/15 bg-white p-6 text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <span
        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${LABEL_STYLES[article.label]}`}
      >
        {localizeDeep(localizeArticleLabel(article.label, lang), lang)}
      </span>
      <p className="mt-3 text-lg font-bold text-love-ink">{copy.title}</p>
      <p className="mt-1 text-sm leading-relaxed text-love-ink/70">{copy.subtitle}</p>
    </button>
  );
}

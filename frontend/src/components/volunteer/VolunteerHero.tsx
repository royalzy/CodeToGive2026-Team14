import { useLanguage } from "../../hooks/useLanguage";
import { localizeDeep } from "../../lib/zhConvert";

const copy = {
  en: {
    eyebrow: "Where your time becomes impact",
    title: "Step into the action",
    deck: "Behind every great programme are great people. Take a look at the opportunities and see where you could make a difference.",
    caption: "Volunteers and members at a Love 21 gathering",
  },
  zh: {
    eyebrow: "讓你的時間發揮影響力",
    title: "一起走進行動",
    deck: "每個出色的計劃背後，都有出色的人。看看有哪些機會，發掘你可以貢獻的地方。",
    caption: "義工和會員在 Love 21 聚會中",
  },
} as const;

export function VolunteerHero() {
  const { lang } = useLanguage();
  const t = localizeDeep(copy[lang === "en" ? "en" : "zh"], lang);

  return (
    <section className="volunteer-hero-scroll">
      <div className="volunteer-hero-sticky">
        <img
          className="volunteer-hero-image"
          src="/images/Love21Foundation-ourstory-01.jpg"
          alt=""
          aria-hidden="true"
        />
        <div className="volunteer-hero-overlay" />
        <span className="volunteer-hero-shape volunteer-hero-shape-1" aria-hidden="true" />

        <div className="shell volunteer-hero-content">
          <p className="eyebrow volunteer-hero-eyebrow">{t.eyebrow}</p>
          <h1 className="volunteer-hero-title">{t.title}</h1>
          <p className="volunteer-hero-deck">{t.deck}</p>
        </div>
        <p className="volunteer-hero-caption">{t.caption}</p>
      </div>
    </section>
  );
}

import { Fragment, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Apple,
  ArrowDown,
  ArrowUpRight,
  Drama,
  Handshake,
  Heart,
  Medal,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import {
  answerHeroRound,
  getHeroRound,
  getQuizStats,
  type HeroRound,
  type RevealResult,
} from "../api/client";
import { getCurrentLang, track, trackOnce } from "../analytics/umami";
import { useLanguage } from "../hooks/useLanguage";
import { localizeDeep } from "../lib/zhConvert";

const ICON_MAP: Record<string, LucideIcon> = {
  Apple,
  Drama,
  Handshake,
  Medal,
  Sprout,
};

const homeCopy = {
  en: {
    needHelp: "Need help?",
    volunteerAria: "Volunteer with Love 21",
    volunteer: "Volunteer",
    donateAria: "Support Love 21 financially",
    donate: "Donate",
    supportModelCta: "See our support model",
    ourStoryCta: "Our story",
    glanceAria: "Love 21 at a glance",
    mythCheckAria: "Myth check",
    mythVsReality: "Myth vs. reality",
    myth: "Myth",
    true: "True",
    learnMore: "Learn more",
    personHas: "person has",
    peopleHave: "people have",
    testedOnRound: "already been put to the test on this round.",
    reality: {
      eyebrow: "The reality",
      title: "Potential is everywhere. Support is not.",
      body: "People with Down syndrome and autism have strengths, ambitions, and full lives. The challenge is finding support that sees the whole person and stays for the long term.",
    },
    barriers: [
      {
        number: "01",
        title: "Support can feel fragmented.",
        description:
          "Families may have to coordinate health, learning, activity, and social support across separate systems.",
      },
      {
        number: "02",
        title: "Opportunity is still uneven.",
        description:
          "Inaccessible spaces and low expectations can limit chances to participate, build skills, and be seen.",
      },
      {
        number: "03",
        title: "Belonging takes more than access.",
        description:
          "Members need consistent relationships, trusted routines, and a community that grows with them over time.",
      },
    ],
    marqueeWords: ["Move", "Nourish", "Express", "Belong", "Grow"],
    supportModel: {
      eyebrow: "The Love 21 model",
      title: "One community. Five connected layers of support.",
      body: "We do more than run activities. We build a connected support system around each member and the family beside them.",
      centreLabel: "Always at the centre",
      centreValue: "Member + family",
    },
    depth: {
      eyebrow: "What depth looks like",
      title: "Weekly. Connected. Long-term.",
      ctaLabel: "See Love 21 in action",
      imageAlt: "Love 21 members performing together",
      items: [
        {
          marker: "Every week",
          title: "Consistency builds confidence.",
          description:
            "Regular sessions create trusted routines, meaningful relationships, and space for skills to develop.",
        },
        {
          marker: "Across needs",
          title: "The whole person is supported.",
          description:
            "Movement, nutrition, expression, wellbeing, family, and friendship are treated as connected parts of life.",
        },
        {
          marker: "Through life",
          title: "Support grows with the member.",
          description:
            "Our community stays alongside members and families as goals, abilities, and life stages change.",
        },
      ],
    },
    quickLinksAria: "Explore Love 21",
    quickLinks: [
      { label: "Learn More", to: "/neuro-strengths", featured: false },
      { label: "Story", to: "/story", featured: false },
      { label: "Volunteer", to: "/volunteer", featured: false },
      { label: "Donate", to: "/donate", featured: true },
    ],
  },
  zh: {
    needHelp: "需要協助？",
    volunteerAria: "與 Love 21 一起做義工",
    volunteer: "義工服務",
    donateAria: "支持 Love 21",
    donate: "捐助",
    supportModelCta: "了解我們的支援模式",
    ourStoryCta: "我們的故事",
    glanceAria: "Love 21 概覽",
    mythCheckAria: "迷思測試",
    mythVsReality: "迷思與事實",
    myth: "迷思",
    true: "事實",
    learnMore: "了解更多",
    personHas: "人",
    peopleHave: "人",
    testedOnRound: "已經參與過這一輪測試。",
    reality: {
      eyebrow: "事實",
      title: "潛能無處不在，支援卻不然。",
      body: "唐氏綜合症及自閉症人士擁有自己的優勢、抱負和豐盛的人生。挑戰在於找到看見完整的人、並能長期陪伴的支援。",
    },
    barriers: [
      {
        number: "01",
        title: "支援容易變得零散。",
        description: "家庭可能需要在不同系統之間，自行協調醫療、學習、活動及社交支援。",
      },
      {
        number: "02",
        title: "機會仍然不均等。",
        description: "欠缺無障礙的空間及偏低的期望，會限制參與、學習技能及被看見的機會。",
      },
      {
        number: "03",
        title: "歸屬感不只靠參與。",
        description: "會員需要持續的關係、信任的日常，以及一個隨他們成長的社群。",
      },
    ],
    marqueeWords: ["動起來", "滋養", "表達", "歸屬", "成長"],
    supportModel: {
      eyebrow: "Love 21 模式",
      title: "同一社群，五層互相連結的支援。",
      body: "我們做的不只是活動。我們為每一位會員及身邊的家庭，建立一個緊密連結的支援系統。",
      centreLabel: "一直以他們為中心",
      centreValue: "會員及家庭",
    },
    depth: {
      eyebrow: "深度支援是甚麼模樣",
      title: "每週、緊密連結、長期陪伴。",
      ctaLabel: "看看 Love 21 的實踐",
      imageAlt: "Love 21 會員一起表演",
      items: [
        {
          marker: "每週",
          title: "持之以恆建立信心。",
          description: "定期的活動建立信任的日常、有意義的關係，以及發展技能的空間。",
        },
        {
          marker: "跨越需要",
          title: "支援完整的個人。",
          description: "身體活動、營養、表達、身心健康、家庭與友誼，皆是生活中互相連結的一部分。",
        },
        {
          marker: "貫穿一生",
          title: "支援隨會員一同成長。",
          description: "隨著目標、能力及人生階段轉變，我們的社群一直陪伴會員及家庭。",
        },
      ],
    },
    quickLinksAria: "探索 Love 21",
    quickLinks: [
      { label: "了解更多", to: "/neuro-strengths", featured: false },
      { label: "故事", to: "/story", featured: false },
      { label: "義工服務", to: "/volunteer", featured: false },
      { label: "捐助", to: "/donate", featured: true },
    ],
  },
} as const;

function useHomeCopy() {
  const { lang } = useLanguage();
  return localizeDeep(homeCopy[lang === "en" ? "en" : "zh"], lang);
}

function Icon({ name, size = 24 }: { name: string; size?: number }) {
  const Comp = ICON_MAP[name];
  return Comp ? <Comp size={size} strokeWidth={1.75} /> : null;
}

export function HomePage() {
  const { t } = useLanguage();
  const c = t.landingContent;
  const copy = useHomeCopy();

  return (
    <>
      <Hero c={c} copy={copy} />
      <MythQuiz copy={copy} />
      <Barriers copy={copy} />
      <SupportMarquee copy={copy} />
      <SupportModel c={c} copy={copy} />
      <SupportDepth c={c} copy={copy} />
      <QuickLinks copy={copy} />
      <div className="landing-help-buttons">
        <Link to="/help" className="landing-help-button landing-help-button-help">
          <span className="landing-help-button-icon" aria-hidden="true">?</span>
          <span>{copy.needHelp}</span>
        </Link>
        <Link
          to="/volunteer"
          className="landing-help-button landing-help-button-volunteer"
          aria-label={copy.volunteerAria}
        >
          <span className="landing-help-button-icon" aria-hidden="true">
            <Handshake size={16} strokeWidth={2} />
          </span>
          <span>{copy.volunteer}</span>
        </Link>
        <Link
          to="/donate"
          className="landing-help-button landing-help-button-donate"
          aria-label={copy.donateAria}
        >
          <span className="landing-help-button-icon" aria-hidden="true">
            <Heart size={16} strokeWidth={2} />
          </span>
          <span>{copy.donate}</span>
        </Link>
      </div>
    </>
  );
}

type HomeCopy = ReturnType<typeof useHomeCopy>;

function Hero({
  c,
  copy,
}: {
  c: typeof import("../content/en").landingContent;
  copy: HomeCopy;
}) {
  const heroImage = c.hero.images[0];

  return (
    <section className="home-hero">
      <img className="home-hero-image" src={heroImage.src} alt={heroImage.alt} />
      <div className="home-hero-shade" aria-hidden="true" />

      <div className="shell home-hero-inner">
        <p className="home-kicker home-kicker-light">{c.hero.tagline}</p>
        <h1>
          {c.hero.titleLine1} <em>{c.hero.titleAccent}</em>
        </h1>
        <p className="home-hero-lede">{c.hero.subtitle}</p>
        <div className="home-hero-actions">
          <a href="#support-model" className="home-button home-button-yellow">
            {copy.supportModelCta} <ArrowDown size={18} aria-hidden="true" />
          </a>
          <Link to="/story" className="home-button home-button-ghost">
            {copy.ourStoryCta} <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="home-hero-stats" aria-label={copy.glanceAria}>
        {c.hero.stats.map((stat) => (
          <div key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function HeroMythCheck({ copy }: { copy: HomeCopy }) {
  const { lang } = useLanguage();
  const backendLang = lang === "en" ? "en" : "zh-Hant";
  const [round, setRound] = useState<HeroRound | null>(null);
  const [reveal, setReveal] = useState<RevealResult | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [attempts, setAttempts] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    getQuizStats()
      .then((stats) => {
        if (cancelled) {
          return;
        }
        const matched = stats.rounds.find((r) => r.round_id === round?.id);
        if (matched) {
          setAttempts(matched.attempts);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAttempts(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [round]);

  useEffect(() => {
    let cancelled = false;
    setReveal(null);
    setSelectedId(null);
    getHeroRound(backendLang)
      .then((r) => {
        if (cancelled) {
          return;
        }
        setRound(localizeDeep(r, lang));
        trackOnce("hero_myth_round_started", { round_id: r.id });
      })
      .catch(() => {
        if (!cancelled) {
          setRound(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [backendLang, lang]);

  const choose = useCallback(
    (statementId: string) => {
      if (!round || reveal || busy) {
        return;
      }
      setBusy(true);
      setSelectedId(statementId);
      answerHeroRound({
        round_id: round.id,
        selected_statement_id: statementId,
        lang: getCurrentLang(),
      })
        .then((result) => {
          setReveal(localizeDeep(result, lang));
          track("hero_myth_round_revealed", {
            round_id: result.round_id,
            selected_statement_id: statementId,
          });
        })
        .catch(() => {
          setSelectedId(null);
        })
        .finally(() => setBusy(false));
    },
    [round, reveal, busy, lang],
  );

  if (!round) {
    return null;
  }

  return (
    <aside className="hero-myth" aria-label={copy.mythCheckAria} aria-live="polite">
      <p className="hero-myth-kick">{round.kick}</p>
      <ul className="hero-myth-list">
        {round.statements.map((st, i) => {
          const verdict = reveal?.statements.find((r) => r.id === st.id);
          return (
            <li key={st.id}>
              <button
                type="button"
                className={`hero-myth-statement${st.id === selectedId ? " picked" : ""}`}
                onClick={() => choose(st.id)}
                disabled={Boolean(reveal) || busy}
              >
                <span className="hero-myth-index">{i + 1}</span>
                <span className="hero-myth-text">{st.text}</span>
              </button>
              <div className={`hero-myth-panel${verdict ? " open" : ""}`}>
                <div className="hero-myth-panel-inner">
                  {verdict && (
                    <div className={`hero-myth-verdict${st.id === reveal?.selected_statement_id ? " picked" : ""}`}>
                      <strong>{verdict.is_myth ? copy.myth : copy.true}</strong>
                      <p>{verdict.reveal}</p>
                      <a href={verdict.source.url} target="_blank" rel="noreferrer">
                        {verdict.source.label}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {reveal && (
        <div className="hero-myth-reveal">
          <p className="hero-myth-punchline">{reveal.punchline}</p>
          {attempts !== null && (
            <p className="hero-myth-community">
              {attempts.toLocaleString()}{" "}
              {attempts === 1 ? copy.personHas : copy.peopleHave} {copy.testedOnRound}
            </p>
          )}
          <Link
            to="/neuro-strengths"
            className="landing-hero-cta-primary hero-myth-cta"
            data-cta="myth-learn-more"
          >
            {copy.learnMore}
          </Link>
        </div>
      )}
    </aside>
  );
}

function MythQuiz({ copy }: { copy: HomeCopy }) {
  return (
    <section className="bg-love-cream py-20">
      <div className="shell text-center">
        <p className="home-kicker">{copy.mythVsReality}</p>
      </div>
      <div className="shell mt-6 max-w-2xl">
        <HeroMythCheck copy={copy} />
      </div>
    </section>
  );
}

function Barriers({ copy }: { copy: HomeCopy }) {
  return (
    <section className="home-reality">
      <div className="shell">
        <div className="home-section-intro">
          <p className="home-kicker">{copy.reality.eyebrow}</p>
          <h2>{copy.reality.title}</h2>
          <p>{copy.reality.body}</p>
        </div>

        <div className="home-barrier-grid">
          {copy.barriers.map((barrier) => (
            <article key={barrier.number} className="home-barrier-card">
              <span className="home-card-number" aria-hidden="true">{barrier.number}</span>
              <h3>{barrier.title}</h3>
              <p>{barrier.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SupportMarquee({ copy }: { copy: HomeCopy }) {
  const words = copy.marqueeWords;
  return (
    <div className="home-marquee" aria-hidden="true">
      <div>
        {[...words, ...words].map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            <span>{word}</span>
            <b>•</b>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function SupportModel({
  c,
  copy,
}: {
  c: typeof import("../content/en").landingContent;
  copy: HomeCopy;
}) {
  return (
    <section id="support-model" className="home-support">
      <div className="shell">
        <div className="home-support-heading">
          <div>
            <p className="home-kicker home-kicker-light">{copy.supportModel.eyebrow}</p>
            <h2>{copy.supportModel.title}</h2>
          </div>
          <p>{copy.supportModel.body}</p>
        </div>

        <div className="home-support-centre">
          <span>{copy.supportModel.centreLabel}</span>
          <strong>{copy.supportModel.centreValue}</strong>
        </div>

        <div className="home-service-grid">
          {c.whatWeDo.pillars.map((service, index) => (
            <article key={service.id} className="home-service-card">
              <div className="home-service-image-wrap">
                <img src={service.image} alt="" />
                <span className="home-service-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="home-service-copy">
                <span className="home-service-icon" aria-hidden="true">
                  <Icon name={service.icon} size={24} />
                </span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SupportDepth({
  c,
  copy,
}: {
  c: typeof import("../content/en").landingContent;
  copy: HomeCopy;
}) {
  return (
    <section className="home-depth">
      <div className="home-depth-image">
        <img src="/images/community-performance.jpg" alt={copy.depth.imageAlt} />
      </div>

      <div className="home-depth-content">
        <p className="home-kicker">{copy.depth.eyebrow}</p>
        <h2>{copy.depth.title}</h2>
        <p className="home-depth-lede">{c.impact.mission.description}</p>

        <div className="home-depth-list">
          {copy.depth.items.map((item) => (
            <article key={item.marker}>
              <span>{item.marker}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>

        <Link to="/story" className="home-text-link">
          {copy.depth.ctaLabel} <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

function QuickLinks({ copy }: { copy: HomeCopy }) {
  return (
    <nav className="landing-quick-links" aria-label={copy.quickLinksAria}>
      <div className="shell landing-quick-links-grid">
        {copy.quickLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`landing-quick-link${link.featured ? " landing-quick-link-featured" : ""}`}
          >
            <span>{link.label}</span>
            <span aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

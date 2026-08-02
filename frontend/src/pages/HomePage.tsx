import { useCallback, useEffect, useState } from "react";
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

const ICON_MAP: Record<string, LucideIcon> = {
  Apple,
  Drama,
  Handshake,
  Medal,
  Sprout,
};

const BARRIERS = [
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
] as const;

const SUPPORT_DEPTH = [
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
] as const;

const QUICK_LINKS = [
  { label: "Learn More", to: "/neuro-strengths", featured: false },
  { label: "Story", to: "/story", featured: false },
  { label: "Volunteer", to: "/volunteer", featured: false },
  { label: "Donate", to: "/donate", featured: true },
] as const;

function Icon({ name, size = 24 }: { name: string; size?: number }) {
  const Comp = ICON_MAP[name];
  return Comp ? <Comp size={size} strokeWidth={1.75} /> : null;
}

export function HomePage() {
  const { t } = useLanguage();
  const c = t.landingContent;

  return (
    <>
      <Hero c={c} />
      <MythQuiz />
      <Barriers />
      <SupportMarquee />
      <SupportModel c={c} />
      <SupportDepth c={c} />
      <QuickLinks />
      <div className="landing-help-buttons">
        <Link to="/help" className="landing-help-button landing-help-button-help">
          <span className="landing-help-button-icon" aria-hidden="true">?</span>
          <span>Need help?</span>
        </Link>
        <Link
          to="/volunteer"
          className="landing-help-button landing-help-button-volunteer"
          aria-label="Volunteer with Love 21"
        >
          <span className="landing-help-button-icon" aria-hidden="true">
            <Handshake size={16} strokeWidth={2} />
          </span>
          <span>Volunteer</span>
        </Link>
        <Link
          to="/donate"
          className="landing-help-button landing-help-button-donate"
          aria-label="Support Love 21 financially"
        >
          <span className="landing-help-button-icon" aria-hidden="true">
            <Heart size={16} strokeWidth={2} />
          </span>
          <span>Donate</span>
        </Link>
      </div>
    </>
  );
}

function Hero({ c }: { c: typeof import("../content/en").landingContent }) {
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
            See our support model <ArrowDown size={18} aria-hidden="true" />
          </a>
          <Link to="/story" className="home-button home-button-ghost">
            Our story <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="home-hero-stats" aria-label="Love 21 at a glance">
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

function HeroMythCheck() {
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
    getHeroRound()
      .then((r) => {
        if (cancelled) {
          return;
        }
        setRound(r);
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
  }, []);

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
          setReveal(result);
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
    [round, reveal, busy],
  );

  if (!round) {
    return null;
  }

  return (
    <aside className="hero-myth" aria-label="Myth check" aria-live="polite">
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
                      <strong>{verdict.is_myth ? "Myth" : "True"}</strong>
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
              {attempts === 1 ? "person has" : "people have"} already been put to the
              test on this round.
            </p>
          )}
          <Link
            to="/neuro-strengths"
            className="landing-hero-cta-primary hero-myth-cta"
            data-cta="myth-learn-more"
          >
            Learn more
          </Link>
        </div>
      )}
    </aside>
  );
}

function MythQuiz() {
  return (
    <section className="bg-love-cream py-20">
      <div className="shell text-center">
        <p className="home-kicker">Myth vs. reality</p>
      </div>
      <div className="shell mt-6 max-w-2xl">
        <HeroMythCheck />
      </div>
    </section>
  );
}

function Barriers() {
  return (
    <section className="home-reality">
      <div className="shell">
        <div className="home-section-intro">
          <p className="home-kicker">The reality</p>
          <h2>Potential is everywhere. Support is not.</h2>
          <p>
            People with Down syndrome and autism have strengths, ambitions, and full lives.
            The challenge is finding support that sees the whole person and stays for the
            long term.
          </p>
        </div>

        <div className="home-barrier-grid">
          {BARRIERS.map((barrier) => (
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

function SupportMarquee() {
  return (
    <div className="home-marquee" aria-hidden="true">
      <div>
        <span>Move</span><b>•</b><span>Nourish</span><b>•</b><span>Express</span><b>•</b><span>Belong</span><b>•</b><span>Grow</span><b>•</b>
        <span>Move</span><b>•</b><span>Nourish</span><b>•</b><span>Express</span><b>•</b><span>Belong</span><b>•</b><span>Grow</span><b>•</b>
      </div>
    </div>
  );
}

function SupportModel({ c }: { c: typeof import("../content/en").landingContent }) {
  return (
    <section id="support-model" className="home-support">
      <div className="shell">
        <div className="home-support-heading">
          <div>
            <p className="home-kicker home-kicker-light">The Love 21 model</p>
            <h2>One community. Five connected layers of support.</h2>
          </div>
          <p>
            We do more than run activities. We build a connected support system around
            each member and the family beside them.
          </p>
        </div>

        <div className="home-support-centre">
          <span>Always at the centre</span>
          <strong>Member + family</strong>
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

function SupportDepth({ c }: { c: typeof import("../content/en").landingContent }) {
  return (
    <section className="home-depth">
      <div className="home-depth-image">
        <img src="/images/community-performance.jpg" alt="Love 21 members performing together" />
      </div>

      <div className="home-depth-content">
        <p className="home-kicker">What depth looks like</p>
        <h2>Weekly. Connected. Long-term.</h2>
        <p className="home-depth-lede">{c.impact.mission.description}</p>

        <div className="home-depth-list">
          {SUPPORT_DEPTH.map((item) => (
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
          See Love 21 in action <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

function QuickLinks() {
  return (
    <nav className="landing-quick-links" aria-label="Explore Love 21">
      <div className="shell landing-quick-links-grid">
        {QUICK_LINKS.map((link) => (
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

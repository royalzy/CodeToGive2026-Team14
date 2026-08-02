import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Apple,
  Ban,
  Calendar,
  Dna,
  Drama,
  Globe,
  Handshake,
  Heart,
  HeartHandshake,
  Lightbulb,
  Medal,
  Palette,
  Puzzle,
  Rocket,
  Sparkles,
  Sprout,
  Star,
  Stethoscope,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import {
  answerHeroRound,
  getHeroRound,
  type HeroRound,
  type RevealResult,
} from "../api/client";
import { getCurrentLang, track, trackOnce } from "../analytics/umami";
import type { Accent, AutismFact, DSFact } from "../content/types";

const ICON_MAP: Record<string, LucideIcon> = {
  Apple,
  Ban,
  Calendar,
  Dna,
  Drama,
  Globe,
  Handshake,
  Heart,
  HeartHandshake,
  Lightbulb,
  Medal,
  Palette,
  Puzzle,
  Rocket,
  Sparkles,
  Sprout,
  Star,
  Stethoscope,
  Trophy,
};

function Icon({ name, className, size = 24, style }: { name: string; className?: string; size?: number; style?: React.CSSProperties }) {
  const Comp = ICON_MAP[name];
  if (!Comp) return <span className={className}>{name}</span>;
  return <Comp className={className} size={size} strokeWidth={1.75} style={style} />;
}

const TOPIC_STYLE: Record<string, React.CSSProperties> = {
  "Down Syndrome": { background: "#fff0e5", color: "#984000" },
  Autism: { background: "#e7f0ff", color: "#245a9a" },
  Both: { background: "#e4f3f0", color: "#276f67" },
};

export function HomePage() {
  const { t } = useLanguage();
  const c = t.landingContent;
  return (
    <>
      <Hero c={c} />
      <WhatWeDo c={c} />
      <Impact c={c} />
      <LearnSection c={c} />
      <Quiz c={c} />
      <CallToAction c={c} />
    </>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────

function HeroMythCheck() {
  const [round, setRound] = useState<HeroRound | null>(null);
  const [reveal, setReveal] = useState<RevealResult | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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
    <div className="hero-myth" aria-live="polite">
      <p className="hero-myth-kick">{round.kick}</p>
      <ul className="hero-myth-list">
        {round.statements.map((st, i) => (
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
          </li>
        ))}
      </ul>
      {reveal && (
        <div className="hero-myth-reveal">
          <p className="hero-myth-punchline">{reveal.punchline}</p>
          <ul className="hero-myth-verdicts">
            {reveal.statements.map((st) => (
              <li key={st.id} className={st.id === reveal.selected_statement_id ? "picked" : ""}>
                <strong>{st.is_myth ? "Myth" : "True"}</strong>
                <p>{st.reveal}</p>
                <a href={st.source.url} target="_blank" rel="noreferrer">
                  {st.source.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#quiz"
            className="landing-hero-cta-primary hero-myth-cta"
            data-cta="myth-evidence"
          >
            See the evidence
          </a>
        </div>
      )}
    </div>
  );
}

function Hero({ c }: { c: typeof import("../content/en").landingContent }) {
  const [imgIdx, setImgIdx] = useState(0);
  const images = c.hero.images;

  useEffect(() => {
    const t = setInterval(() => setImgIdx((i) => (i + 1) % images.length), 4000);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <section className="landing-hero">
      <div className="landing-hero-bg" aria-hidden="true">
        {images.map((img, i) => (
          <img key={img.src} src={img.src} alt="" className="landing-hero-img"
            style={{ opacity: imgIdx === i ? 1 : 0 }} />
        ))}
        <div className="landing-hero-overlay" />
      </div>
      <div className="landing-hero-content">
        <p className="landing-hero-tagline">{c.hero.tagline}</p>
        <h1>{c.hero.titleLine1}<br /><em>{c.hero.titleAccent}</em></h1>
        <p className="landing-hero-lede">{c.hero.subtitle}</p>
        <div className="landing-hero-ctas">
          <a href="#community" className="landing-hero-cta-primary" data-cta="community-hero">{c.hero.ctaPrimary} ↓</a>
          <Link to="/volunteer" className="landing-hero-cta-secondary" data-cta="volunteer-hero">{c.hero.ctaSecondary}</Link>
        </div>
        <HeroMythCheck />
        <div className="landing-hero-dots" role="tablist" aria-label="Hero images">
          {images.map((img, i) => (
            <button key={img.src} role="tab" aria-selected={imgIdx === i}
              aria-label={`View image ${i + 1}`}
              className={`landing-hero-dot ${imgIdx === i ? "active" : ""}`}
              onClick={() => setImgIdx(i)} />
          ))}
        </div>
        <div className="landing-hero-stats">
          {c.hero.stats.map((s) => (
            <div key={s.label} className="landing-hero-stat">
              <strong>{s.value}</strong><span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── What We Do ───────────────────────────────────────────────────────────

function WhatWeDo({ c }: { c: typeof import("../content/en").landingContent }) {
  const [active, setActive] = useState(0);
  const pillars = c.whatWeDo.pillars;
  const p = pillars[active];

  return (
    <section id="community" className="landing-section">
      <div className="shell">
        <p className="landing-eyebrow">{c.whatWeDo.eyebrow}</p>
        <div className="landing-whatwedo-header">
          <h2 className="landing-title" style={{ marginBottom: 0 }}>{c.whatWeDo.title}</h2>
          <p className="landing-whatwedo-desc">{c.whatWeDo.description}</p>
        </div>
        <div className="landing-pillar-tabs" role="tablist" aria-label="Programme pillars">
          {pillars.map((pillar, i) => (
            <button key={pillar.id} role="tab" aria-selected={active === i}
              className={`landing-pillar-tab ${active === i ? "active" : ""}`}
              onClick={() => setActive(i)}>
              <Icon name={pillar.icon} size={16} /> {pillar.title}
            </button>
          ))}
        </div>
        <div className="landing-pillar-detail">
          <div className="landing-pillar-info">
            <div className="landing-pillar-number" aria-hidden="true">
              {String(active + 1).padStart(2, "0")}
            </div>
            <h3><Icon name={p.icon} size={22} style={{ marginRight: "0.5rem" }} />{p.title}</h3>
            <p>{p.description}</p>
            <Link to="/impact" className="landing-pillar-link">Learn more →</Link>
          </div>
          <div className="landing-pillar-image-wrap">
            <img src={p.image} alt={p.title} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Learn (Autism + Down Syndrome, TOC) ─────────────────────────────────

function LearnSection({ c }: { c: typeof import("../content/en").landingContent }) {
  const [topic, setTopic] = useState<"autism" | "ds">("autism");
  const [active, setActive] = useState(0);
  const isAutism = topic === "autism";
  const facts = (isAutism ? c.autismSection.facts : c.dsSection.facts) as (AutismFact | DSFact)[];
  const f = facts[active];
  const accentBg = (a: Accent): string =>
    `rgb(${a === "red" ? "233 0 63" : a === "blue" ? "20 85 192" : a === "teal" ? "73 169 157" : "244 119 33"})`;

  const selectTopic = (t: "autism" | "ds") => {
    if (t !== topic) {
      setTopic(t);
      setActive(0);
    }
  };

  const topicName = isAutism ? "Autism" : "Down syndrome";

  return (
    <section id="learn" className="landing-section landing-section-alt">
      <div className="shell">
        <p className="landing-eyebrow">{c.learn.eyebrow}</p>
        <h2 className="landing-title">{c.learn.title}</h2>
        <p className="landing-desc">{c.learn.description}</p>

        <div className="landing-learn-toc" role="tablist" aria-label="Choose a topic">
          {c.learn.topics.map((t) => (
            <button key={t.id} role="tab" aria-selected={topic === t.id}
              className={`landing-learn-toc-btn ${topic === t.id ? "active" : ""}`}
              onClick={() => selectTopic(t.id)}>
              <Icon name={t.icon} size={20} />
              <span>{t.title}</span>
            </button>
          ))}
        </div>

        <p className="landing-desc" style={{ marginTop: "2rem" }}>
          {isAutism ? c.autismSection.description : c.dsSection.description}
        </p>

        <div className="landing-fact-cards" role="tablist" aria-label={`${topicName} facts`}>
          {facts.map((fact, i) => (
            <button key={fact.title} role="tab" aria-selected={active === i}
              className={`landing-fact-card ${active === i ? "active" : ""}`}
              style={active === i ? { borderColor: `var(--${fact.accent})`, background: `${accentBg(fact.accent)} / 12%)` } : undefined}
              onClick={() => setActive(i)}>
              <div className="fact-icon" aria-hidden="true"><Icon name={fact.icon} size={32} /></div>
              <div className="fact-title">{fact.title}</div>
              <div className="fact-short">{fact.short}</div>
              {active === i && <div className="fact-dot" style={{ background: `var(--${fact.accent})` }} aria-hidden="true" />}
            </button>
          ))}
        </div>

        <div className="landing-fact-detail">
          <div className="landing-fact-body">
            <div className="fact-icon" aria-hidden="true"><Icon name={f.icon} size={32} /></div>
            <h3>{f.title}</h3>
            <p className="fact-accent" style={{ color: `var(--${f.accent})` }}>{f.short}</p>
            <p className="fact-desc">{f.detail}</p>
            {isAutism && (f as AutismFact).note && (
              <p className="fact-note" style={{ background: `${accentBg(f.accent)} / 8%)`, border: `1px solid ${accentBg(f.accent)} / 12%)` }}>
                {(f as AutismFact).note}
              </p>
            )}
          </div>
          <div className="landing-fact-stats" style={{ background: `${accentBg(f.accent)} / 4%)`, borderLeftColor: `${accentBg(f.accent)} / 12%)` }}>
            {isAutism ? (
              <>
                <p className="landing-fact-stats-label">Key Facts</p>
                {(f as AutismFact).stats.map((stat) => (
                  <div key={stat.label} className="landing-fact-stat">
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-value">{stat.value}</div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <p className="landing-fact-stats-label">Key Points</p>
                <ol className="landing-ds-stats">
                  {(f as DSFact).stats.map((stat, j) => (
                    <li key={stat} className="landing-ds-stat">
                      <span className="ds-stat-num" style={{ background: `var(--${f.accent})`, color: f.accent === "yellow" ? "var(--ink)" : "white" }}>
                        {j + 1}
                      </span>
                      <span>{stat}</span>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>
        </div>

        {isAutism ? (
          <div className="landing-myth-bust">
            <span className="myth-icon" aria-hidden="true"><Icon name="Ban" size={22} /></span>
            <div><strong>{c.autismSection.mythBust.title}</strong>
              <p>{c.autismSection.mythBust.body}</p></div>
          </div>
        ) : (
          <div className="landing-why21">
            <div className="why21-number" aria-hidden="true">21</div>
            <h3>{c.dsSection.why21.title}</h3>
            <p>{c.dsSection.why21.body}</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Quiz ─────────────────────────────────────────────────────────────────

function Quiz({ c }: { c: typeof import("../content/en").landingContent }) {
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [answered, setAnswered] = useState(false);
  const questions = c.quiz.questions;
  const q = questions[qi];

  const choose = useCallback((i: number) => {
    if (answered) return;
    setSelected(i); setAnswered(true);
    if (i === q.answer) setScore((s) => s + 1);
  }, [answered, q.answer]);

  const next = useCallback(() => {
    if (qi < questions.length - 1) { setQi((p) => p + 1); setSelected(null); setAnswered(false); }
    else setDone(true);
  }, [qi, questions.length]);

  const restart = useCallback(() => {
    setQi(0); setSelected(null); setScore(0); setDone(false); setAnswered(false);
  }, []);

  const result = c.quiz.results.find((r) => score >= r.threshold) ?? c.quiz.results[c.quiz.results.length - 1];

  return (
    <section id="quiz" className="landing-section landing-section-soft">
      <div className="shell">
        <p className="landing-eyebrow">{c.quiz.eyebrow}</p>
        <h2 className="landing-title">{c.quiz.title}</h2>
        <p className="landing-desc">{c.quiz.description}</p>
        <div className="landing-quiz">
          <div className="landing-quiz-card">
            {done ? (
              <div className="landing-quiz-result">
                <div className="result-score" aria-hidden="true">{score}/{questions.length}</div>
                <p className="result-title"><Icon name={result.icon} size={28} style={{ marginRight: "0.4rem", verticalAlign: "middle" }} />{result.title}</p>
                <p className="result-msg">{result.message}</p>
                <div className="landing-quiz-result-ctas">
                  <Link to="/volunteer" className="landing-cta-btn landing-cta-btn-teal landing-cta-inline">Volunteer With Us</Link>
                  <Link to="/donate" className="landing-cta-btn landing-cta-btn-red landing-cta-inline">Make a Donation</Link>
                </div>
                <button type="button" className="landing-quiz-retry" onClick={restart}>Try Again</button>
              </div>
            ) : (
              <>
                <div
                  className="landing-quiz-progress"
                  role="progressbar"
                  aria-label="Quiz progress"
                  aria-valuemin={1}
                  aria-valuemax={questions.length}
                  aria-valuenow={qi + 1}
                  aria-valuetext={`Question ${qi + 1} of ${questions.length}`}
                >
                  {questions.map((_, i) => {
                    let cls = ""; if (i < qi) cls = "done"; else if (i === qi) cls = "current";
                    return <div key={i} className={`landing-quiz-bar ${cls}`} />;
                  })}
                </div>
                <div className="landing-quiz-meta">
                  <span className="landing-quiz-num">Q{qi + 1} of {questions.length}</span>
                  <span className="landing-quiz-topic"
                    style={TOPIC_STYLE[q.topic] ?? TOPIC_STYLE["Down Syndrome"]}>
                    {q.topic}
                  </span>
                </div>
                <p className="landing-quiz-question">{q.question}</p>
                <div className="landing-quiz-options">
                  {q.options.map((opt, i) => {
                    let cls = "";
                    if (answered && i === q.answer) cls = "correct";
                    else if (answered && i === selected && i !== q.answer) cls = "wrong";
                    return (
                      <button key={opt} type="button" className={`landing-quiz-option ${cls}`}
                        onClick={() => choose(i)} disabled={answered}>
                        <span className="opt-letter" aria-hidden="true">{String.fromCharCode(65 + i)}</span>
                        <span>{opt}</span>
                        {answered && i === q.answer && <span style={{ marginLeft: "auto", color: "var(--teal)" }} aria-label="Correct">✓</span>}
                      </button>
                    );
                  })}
                </div>
                {answered && (
                  <div className="landing-quiz-fact">
                    <p className="landing-quiz-fact-label"><Icon name="Lightbulb" size={14} style={{ marginRight: "0.35rem" }} />Did You Know?</p>
                    <p>{q.fact}</p>
                  </div>
                )}
                <div className="landing-quiz-nav">
                  <span className="landing-quiz-score">Score: <strong>{score}</strong></span>
                  {answered && (
                    <button type="button" className="landing-quiz-next" onClick={next}>
                      {qi < questions.length - 1 ? "Next Question →" : "See My Results"}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Impact ───────────────────────────────────────────────────────────────

function Impact({ c }: { c: typeof import("../content/en").landingContent }) {
  return (
    <section className="landing-section landing-section-warm">
      <div className="shell">
        <p className="landing-eyebrow">{c.impact.eyebrow}</p>
        <h2 className="landing-title">{c.impact.title}</h2>
        <div className="landing-impact-grid">
          {c.impact.stats.map((s) => (
            <article key={s.label} className="landing-impact-card">
              <span className="impact-icon" aria-hidden="true"><Icon name={s.icon} size={36} /></span>
              <strong>{s.value}</strong><span>{s.label}</span>
            </article>
          ))}
        </div>
        <div className="landing-mission">
          <div className="landing-mission-copy">
            <p className="landing-eyebrow" style={{ marginBottom: "1.25rem" }}>{c.impact.mission.eyebrow}</p>
            <h3>{c.impact.mission.title}</h3>
            <p>{c.impact.mission.description}</p>
            <div className="landing-mission-grid">
              {c.impact.mission.pillars.map((mp) => (
                <div key={mp.title} className="landing-mission-pillar">
                  <span className="mp-icon" aria-hidden="true"><Icon name={mp.icon} size={18} /></span>
                  <strong>{mp.title}</strong><span>{mp.description}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="landing-mission-image">
            <img src="/images/community-performance.jpg" alt="Love 21 community performance" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Call to Action ───────────────────────────────────────────────────────

function CallToAction({ c }: { c: typeof import("../content/en").landingContent }) {
  return (
    <section className="landing-section landing-section-alt">
      <div className="shell">
        <div className="landing-cta-header">
          <p className="landing-eyebrow">{c.cta.eyebrow}</p>
          <h2 className="landing-title">{c.cta.title}</h2>
          <p className="landing-desc">{c.cta.description}</p>
        </div>
        <div className="landing-cta-grid">
          <article className="landing-cta-card">
            <div className="landing-cta-card-image">
              <img src="/images/sports-session.jpg" alt="Volunteering with Love 21 Foundation" />
            </div>
            <div className="landing-cta-card-body">
              <span className="cta-icon" aria-hidden="true"><Icon name={c.cta.volunteer.icon} size={32} /></span>
              <h3>{c.cta.volunteer.title}</h3>
              <p>{c.cta.volunteer.description}</p>
              <ul className="landing-cta-roles">
                {c.cta.volunteer.roles.map((role) => <li key={role}>{role}</li>)}
              </ul>
              <Link to={c.cta.volunteer.route} className="landing-cta-btn landing-cta-btn-teal" data-cta="volunteer-cta">
                {c.cta.volunteer.cta} →
              </Link>
            </div>
          </article>
          <article className="landing-cta-card">
            <div className="landing-cta-card-image">
              <img src="/images/crystal-performing.jpg" alt="Supporting Love 21 Foundation" />
            </div>
            <div className="landing-cta-card-body">
              <span className="cta-icon" aria-hidden="true"><Icon name={c.cta.donate.icon} size={32} /></span>
              <h3>{c.cta.donate.title}</h3>
              <p>{c.cta.donate.description}</p>
              <div className="landing-cta-amounts">
                {c.cta.donate.amounts.map((amt) => (
                  <Link key={amt} to={c.cta.donate.route} className="landing-cta-amount">{amt}</Link>
                ))}
              </div>
              <Link to={c.cta.donate.route} className="landing-cta-btn landing-cta-btn-red" data-cta="donate-cta">
                {c.cta.donate.cta} →
              </Link>
            </div>
          </article>
        </div>
        <div className="landing-cta-tertiary">
          <p>{c.cta.tertiary.text}</p>
          <a href={c.cta.tertiary.href} target="_blank" rel="noopener noreferrer">
            {c.cta.tertiary.label} →
          </a>
        </div>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import {
  Apple,
  ArrowDown,
  ArrowUpRight,
  Drama,
  Handshake,
  Medal,
  Sprout,
  type LucideIcon,
} from "lucide-react";
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
      <Barriers />
      <SupportMarquee />
      <SupportModel c={c} />
      <SupportDepth c={c} />
      <QuickLinks />
      <Link to="/help" className="landing-help-button">
        <span className="landing-help-button-icon" aria-hidden="true">?</span>
        <span>Need help?</span>
      </Link>
    </>
  );
}

function Hero({ c }: { c: typeof import("../content/en").landingContent }) {
  const heroImage = c.hero.images[0];

  return (
    <section className="home-hero">
      <img className="home-hero-image" src={heroImage.src} alt={heroImage.alt} />
      <div className="home-hero-shade" aria-hidden="true" />
      <div className="home-hero-orbits" aria-hidden="true">
        <span />
        <span />
      </div>

      <div className="shell home-hero-inner">
        <p className="home-kicker home-kicker-light">{c.hero.tagline}</p>
        <h1>
          {c.hero.titleLine1}
          <em>{c.hero.titleAccent}</em>
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
        <aside className="home-hero-note" aria-label="Our promise">
          <span>Our promise</span>
          <strong>Whole-person support. Whole-family community.</strong>
        </aside>
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

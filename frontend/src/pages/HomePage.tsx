import { Link } from "react-router-dom";

import {
  MetricCard,
  PathwayCard,
  ProgramCard,
  SectionHeading,
} from "../components/Cards";
import { metrics, programs } from "../content/en";

export function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div className="hero-shape hero-shape-one" aria-hidden="true" />
        <div className="hero-shape hero-shape-two" aria-hidden="true" />
        <div className="shell home-hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Love 21 Foundation · Hong Kong</p>
            <h1>
              See the ability.
              <br />
              <span>Join the story.</span>
            </h1>
            <p className="hero-lede">
              A community where people with Down syndrome, autism and other
              neurodiversity move, create, connect and lead.
            </p>
            <div className="button-row">
              <Link className="button button-dark" to="/impact">
                Discover our impact
              </Link>
              <Link className="button button-light" to="/volunteer">
                Find your place
              </Link>
            </div>
          </div>

          <div className="hero-collage" aria-label="Love 21 members in action">
            <figure className="hero-photo hero-photo-main">
              <img
                src="/images/crystal-performing.jpg"
                alt="Crystal performing confidently on stage with another dancer"
              />
            </figure>
            <figure className="hero-photo hero-photo-side">
              <img
                src="/images/community-performance.jpg"
                alt="Love 21 members and young performers celebrating together"
              />
            </figure>
            <div className="hero-sticker">
              <strong>900+</strong>
              <span>moments to grow every month</span>
            </div>
          </div>
        </div>
      </section>

      <section className="metrics-strip" aria-labelledby="impact-by-numbers">
        <div className="shell">
          <SectionHeading
            eyebrow="A full circle of support"
            title="Impact you can feel"
            body="The numbers show the scale. The stories show what becomes possible."
          />
          <h2 className="sr-only" id="impact-by-numbers">
            Love 21 impact by the numbers
          </h2>
          <div className="metric-grid">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="shell">
          <SectionHeading
            eyebrow="More than a programme"
            title="Support for the whole person"
            body="Every part of Love 21 connects: health, confidence, family, friendship and a place in the wider community."
          />
          <div className="program-grid program-grid-home">
            {programs.map((program) => (
              <ProgramCard compact key={program.slug} program={program} />
            ))}
          </div>
        </div>
      </section>

      <section className="section story-feature">
        <div className="shell story-feature-grid">
          <div className="story-image-frame">
            <img
              src="/images/crystal-performing.jpg"
              alt="Crystal raising her hand during a performance"
            />
            <span className="story-image-label">Confidence in motion</span>
          </div>
          <div className="story-copy">
            <p className="eyebrow">Crystal's story</p>
            <blockquote>
              “Love 21 helped Crystal become more confident, cheerful, and
              motivated to keep learning.”
            </blockquote>
            <p className="quote-credit">— Crystal's mother</p>
            <p>
              Crystal tried new sports, embraced performances and discovered a
              passion for dance. Today, she is training as one of Love 21's
              dance assistants.
            </p>
            <Link className="text-link" to="/impact#crystal-story">
              Follow Crystal's growth <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section pathways-section">
        <div className="shell">
          <SectionHeading
            eyebrow="From visitor to community"
            title="Choose how your story begins"
            align="center"
          />
          <div className="pathway-grid">
            <PathwayCard
              number="01"
              eyebrow="See"
              title="Celebrate ability"
              body="Meet people through their progress, interests and achievements."
              href="/impact"
              cta="Explore real impact"
              accent="red"
            />
            <PathwayCard
              number="02"
              eyebrow="Share"
              title="Volunteer with purpose"
              body="Start with curiosity, find a role and build connection through shared experience."
              href="/volunteer"
              cta="Find your place"
              accent="blue"
            />
            <PathwayCard
              number="03"
              eyebrow="Support"
              title="Give with meaning"
              body="Choose the area that matters to you and see how support strengthens the whole community."
              href="/donate"
              cta="Explore giving"
              accent="yellow"
            />
          </div>
        </div>
      </section>
    </>
  );
}


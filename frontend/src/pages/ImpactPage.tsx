import { Link } from "react-router-dom";

import {
  MetricCard,
  PageHero,
  ProgramCard,
  SectionHeading,
} from "../components/Cards";
import { crystalMilestones, metrics, moments, programs } from "../content/en";

export function ImpactPage() {
  return (
    <>
      <PageHero
        eyebrow="Impact, made visible"
        title="Not what we provide. What people make possible."
        body="Love 21 creates the conditions for members to explore their strengths, build confidence and contribute to their community."
        tone="red"
      />

      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow="Depth and breadth"
            title="One community, many ways to grow"
            body="Programmes connect around each member and family rather than operating as isolated services."
          />
          <div className="program-grid">
            {programs.map((program) => (
              <ProgramCard key={program.slug} program={program} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="shell">
          <SectionHeading
            eyebrow="The scale of belonging"
            title="Every number holds a moment"
          />
          <div className="metric-grid metric-grid-dark">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </div>
        </div>
      </section>

      <section className="section crystal-section" id="crystal-story">
        <div className="shell">
          <div className="crystal-intro">
            <div>
              <p className="eyebrow">A story of becoming</p>
              <h2>Crystal found her rhythm. Then she began to lead.</h2>
            </div>
            <p>
              Growth is not a before-and-after snapshot. It is a series of
              chances to try, be seen and take the next step.
            </p>
          </div>

          <div className="crystal-layout">
            <div className="crystal-photo-stack">
              <img
                className="crystal-photo-main"
                src="/images/crystal-performing.jpg"
                alt="Crystal performing with energy and confidence"
              />
              <div className="crystal-quote">
                <span aria-hidden="true">“</span>
                <p>More confident, cheerful, and motivated to keep learning.</p>
              </div>
            </div>
            <ol className="milestone-list">
              {crystalMilestones.map((milestone, index) => (
                <li key={milestone.label}>
                  <span className="milestone-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="eyebrow">{milestone.label}</p>
                    <h3>{milestone.title}</h3>
                    <p>{milestone.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="shell">
          <SectionHeading
            eyebrow="In the community"
            title="Moments that matter"
            body="Every activity, performance and shared meal is a chance to grow."
          />
          <div className="moments-feed">
            {moments.map((moment, i) => (
              <article key={`${moment.member}-${i}`} className="moment-card">
                <span className="moment-date">{moment.date}</span>
                <strong>{moment.member}</strong>
                <p>{moment.activity}</p>
              </article>
            ))}
          </div>
          <div className="section-cta">
            <Link className="button button-dark" to="/members">
              Explore member profiles
            </Link>
          </div>
        </div>
      </section>

      <section className="section next-step-banner">
        <div className="shell next-step-inner">
          <div>
            <p className="eyebrow">Impact grows through connection</p>
            <h2>Bring your time, curiosity or support.</h2>
          </div>
          <div className="button-row">
            <Link className="button button-dark" to="/volunteer">
              Explore volunteering
            </Link>
            <Link className="button button-outline" to="/donate">
              Explore giving
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}


import { useEffect } from "react";
import { Link } from "react-router-dom";

import { PageHero, SectionHeading } from "../components/Cards";
import { VolunteerNewsletterSignup } from "../components/volunteer/VolunteerNewsletterSignup";
import { VolunteerOtherWaysToHelp } from "../components/volunteer/VolunteerOtherWaysToHelp";
import { VolunteerProgramAccordion } from "../components/volunteer/VolunteerProgramAccordion";
import { volunteerTestimonials } from "../content/volunteer";
import { trackVolunteerEvent } from "../lib/volunteerAnalytics";

export function VolunteerPage() {
  useEffect(() => {
    trackVolunteerEvent("volunteer_page_viewed");
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Volunteer with Love 21"
        title="Your first step can be a small one."
        body="Find a role, see what your first visit could feel like and explore one supported experience without a long-term commitment."
        tone="blue"
      />

      <section className="section volunteer-entry-section">
        <div className="shell">
          <SectionHeading
            eyebrow="Choose your way in"
            title="Start with what you already know."
            body="If you are unsure, we can suggest a role. If you already have an idea, go straight to roles or demo sessions."
          />
          <div className="volunteer-path-grid">
            <article className="volunteer-path-card volunteer-path-guided">
              <span>01 · Guided path</span>
              <h2>Help me find a role</h2>
              <p>
                Tell us about the areas you care about and how you'd like to help. The
                recommendation is a starting point, never a test or restriction.
              </p>
              <Link className="button button-light" to="/volunteer/match">
                Start the guided match
              </Link>
            </article>
            <article className="volunteer-path-card volunteer-path-quick">
              <span>02 · Quick path</span>
              <h2>I know how I want to explore</h2>
              <p>
                Browse every role or look at the available demo sessions without
                completing a questionnaire.
              </p>
              <div className="volunteer-inline-actions">
                <Link className="button button-dark" to="/volunteer/roles">
                  Browse all roles
                </Link>
                <Link className="text-link" to="/volunteer/sessions?journey=quick">
                  View demo sessions <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section volunteer-role-preview-section">
        <div className="shell">
          <SectionHeading
            eyebrow="Three ways to contribute, across every programme"
            title="Clear roles. Clear boundaries."
            body="Assist an existing class, host a new one, or help at a large event. Open a programme below to see the roles and boundaries that come with it."
          />
          <VolunteerProgramAccordion />
        </div>
      </section>

      <section className="section volunteer-testimonial-section">
        <div className="shell">
          <SectionHeading
            eyebrow="From our volunteers"
            title="What corporate and individual volunteers say."
          />
          <div className="volunteer-testimonial-grid">
            {volunteerTestimonials.map((testimonial) => (
              <figure key={testimonial.name} className="volunteer-testimonial-card">
                <blockquote>"{testimonial.quote}"</blockquote>
                <figcaption>
                  {testimonial.name} — {testimonial.org}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section volunteer-reassurance-section">
        <div className="shell volunteer-reassurance-grid">
          <div>
            <p className="eyebrow">What this is</p>
            <h2>A friendly way to prepare before you share personal details.</h2>
          </div>
          <ul>
            <li>No expertise is required for these first-step roles.</li>
            <li>A volunteer story shows what people do and gain from taking part.</li>
            <li>Demo requests are not saved, sent or automatically approved.</li>
            <li>You can observe or express interest without booking a session.</li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="shell volunteer-alternatives-panel">
          <div>
            <p className="eyebrow">Still deciding between roles?</p>
            <h3>Try the guided match, or explore every role.</h3>
            <div className="volunteer-alternative-links">
              <Link className="text-link" to="/volunteer/match">
                Answer a few questions for a suggestion <span aria-hidden="true">→</span>
              </Link>
              <Link className="text-link" to="/volunteer/roles">
                Compare every role side by side <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <VolunteerNewsletterSignup
            source="volunteer_landing"
            title="Prefer to hear from us by email?"
          />
        </div>
      </section>

      <section className="section section-soft">
        <div className="shell">
          <VolunteerOtherWaysToHelp />
        </div>
      </section>
    </>
  );
}

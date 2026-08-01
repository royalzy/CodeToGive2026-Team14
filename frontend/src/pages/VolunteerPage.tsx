import { useEffect } from "react";
import { Link } from "react-router-dom";

import { PageHero, SectionHeading } from "../components/Cards";
import { VolunteerNewsletterSignup } from "../components/volunteer/VolunteerNewsletterSignup";
import { VolunteerOtherWaysToHelp } from "../components/volunteer/VolunteerOtherWaysToHelp";
import { VolunteerProgramAccordion } from "../components/volunteer/VolunteerProgramAccordion";
import { VolunteerTestimonialMarquee } from "../components/volunteer/VolunteerTestimonialMarquee";
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
            title="Not sure where to start?"
            body="Take the quiz for a fun, personalised starting point, or skip straight to browsing every role yourself."
          />
          <div className="volunteer-path-grid volunteer-path-grid-single">
            <article className="volunteer-path-card volunteer-path-quiz">
              <span>60-second quiz</span>
              <h2>Find out which type of volunteer you are</h2>
              <p>
                Answer five quick, fun questions and we'll match you with a role that
                fits your personality. It's a starting point, never a test or restriction.
              </p>
              <div className="volunteer-inline-actions">
                <Link className="button button-light" to="/volunteer/match">
                  Find out which type of volunteer you are{" "}
                  <span aria-hidden="true">→</span>
                </Link>
                <Link className="button button-dark" to="/volunteer/roles">
                  Browse all roles
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
          <VolunteerTestimonialMarquee testimonials={volunteerTestimonials} />
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

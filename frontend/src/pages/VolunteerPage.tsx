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
              <img
                className="volunteer-path-quiz-image"
                src="/images/quiz-cta-girl.jpg"
                alt=""
                aria-hidden="true"
                loading="lazy"
              />
              <div className="volunteer-path-quiz-content">
                <h2>Find out which type of volunteer you are</h2>
                <br></br>
                <p>
                  Take our 1 minute quiz and discover the role that was made for you.
                </p>
                <div className="volunteer-inline-actions">
                  <Link className="button button-light" to="/volunteer/match">
                    Find out{" "}
                    <span aria-hidden="true">→</span>
                  </Link>
                  <Link className="button button-dark" to="/volunteer/roles">
                    Browse all roles
                  </Link>
                </div>
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
            title="Why they keep coming back"
          />
          <VolunteerTestimonialMarquee testimonials={volunteerTestimonials} />
        </div>
      </section>

      <section className="section section-soft">
        <div className="shell">
          <VolunteerOtherWaysToHelp />
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
    </>
  );
}

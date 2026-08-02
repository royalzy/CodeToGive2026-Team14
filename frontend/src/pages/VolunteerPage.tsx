import { useEffect } from "react";
import { Link } from "react-router-dom";

import { SectionHeading } from "../components/Cards";
import { VolunteerHero } from "../components/volunteer/VolunteerHero";
import { VolunteerNewsletterSignup } from "../components/volunteer/VolunteerNewsletterSignup";
import { VolunteerOtherWaysToHelp } from "../components/volunteer/VolunteerOtherWaysToHelp";
import { VolunteerProgramBento } from "../components/volunteer/VolunteerProgramBento";
import { VolunteerTestimonialMarquee } from "../components/volunteer/VolunteerTestimonialMarquee";
import { programs } from "../content/programs";
import { volunteerTestimonials } from "../content/volunteer";
import { trackVolunteerEvent } from "../lib/volunteerAnalytics";

const PROGRAMME_TITLES = programs.map((program) => program.title);

function VolunteerProgramMarquee() {
  return (
    <div className="home-marquee volunteer-program-marquee" aria-hidden="true">
      <div>
        {[0, 1].flatMap((repeat) =>
          PROGRAMME_TITLES.flatMap((title) => [
            <span key={`${repeat}-${title}`}>{title}</span>,
            <b key={`${repeat}-${title}-dot`}>•</b>,
          ]),
        )}
      </div>
    </div>
  );
}

export function VolunteerPage() {
  useEffect(() => {
    trackVolunteerEvent("volunteer_page_viewed");
  }, []);

  return (
    <div className="volunteer-page">
      <VolunteerHero />
      <VolunteerProgramMarquee />

      <section
        className="section volunteer-entry-section volunteer-hero-reveal"
        id="volunteer-entry"
      >
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
                  <Link className="button button-quiz-highlight" to="/volunteer/match">
                    Find out{" "}
                    <span aria-hidden="true">→</span>
                  </Link>
                  <Link className="button button-outline" to="/volunteer/roles">
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
            eyebrow="Five programmes, endless ways to help"
            title="Find the programme that fits you."
            body="Every programme welcomes assistants, leaders and event helpers. Pick the one that speaks to you to see its roles in full."
          />
          <VolunteerProgramBento />
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

      <section className="section section-soft volunteer-ways-section">
        <div className="shell">
          <VolunteerOtherWaysToHelp />
        </div>
      </section>

      <section className="section volunteer-closing-section">
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
    </div>
  );
}

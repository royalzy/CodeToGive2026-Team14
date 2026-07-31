import { useEffect } from "react";
import { Link } from "react-router-dom";

import { PageHero, SectionHeading } from "../components/Cards";
import { VolunteerRoleCard } from "../components/volunteer/VolunteerRoleCard";
import { volunteerRoles } from "../content/volunteer";
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
                Answer three short questions. The recommendation is a starting
                point, never a test or restriction.
              </p>
              <Link className="button button-light" to="/volunteer/match">
                Start the 60-second match
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
            eyebrow="Three ways to contribute"
            title="Clear roles. Clear boundaries."
            body="Every role explains what you may do, what you are not expected to do and who will support you."
          />
          <div className="volunteer-role-grid">
            {volunteerRoles.map((role) => (
              <VolunteerRoleCard key={role.id} role={role} />
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
    </>
  );
}

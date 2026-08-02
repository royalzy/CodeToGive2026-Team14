import { useEffect } from "react";
import { Link, useSearchParams, useParams } from "react-router-dom";
import { Check, X } from "lucide-react";

import { StatusPanel } from "../components/Cards";
import { VolunteerSessionCard } from "../components/volunteer/VolunteerSessionCard";
import { VolunteerStoryVideo } from "../components/volunteer/VolunteerStoryVideo";
import { VolunteerTestimonialMarquee } from "../components/volunteer/VolunteerTestimonialMarquee";
import { programs } from "../content/programs";
import {
  getTestimonialsForRole,
  getVolunteerRole,
  getVolunteerRolesForProgram,
  volunteerSessions,
} from "../content/volunteer";
import { trackVolunteerEvent } from "../lib/volunteerAnalytics";

export function VolunteerRolePage() {
  const { roleId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const journeyPath = searchParams.get("journey") === "guided" ? "guided" : "quick";
  const role = getVolunteerRole(roleId);
  const sessions = volunteerSessions.filter((session) => session.roleId === role?.id);
  const otherProgramRoles = role
    ? getVolunteerRolesForProgram(role.programSlug).filter((item) => item.id !== role.id)
    : [];
  const programTitle = role
    ? programs.find((program) => program.slug === role.programSlug)?.title
    : undefined;
  const roleTestimonials = role ? getTestimonialsForRole(role) : [];

  useEffect(() => {
    if (role) {
      trackVolunteerEvent("role_selected", {
        journey_path: journeyPath,
        role_id: role.id,
      });
    }
  }, [journeyPath, role]);

  if (!role) {
    return (
      <section className="section">
        <div className="shell narrow-shell">
          <h1 className="sr-only">Volunteer role unavailable</h1>
          <StatusPanel title="That volunteer role is not available." tone="notice">
            <p>The link may be out of date. Explore the current first-step roles instead.</p>
            <Link className="button button-dark" to="/volunteer/roles">
              Browse current roles
            </Link>
          </StatusPanel>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="section volunteer-role-detail-section">
        <div className="shell">
          <p className="eyebrow">What your presence makes possible</p>
          <h1>{role.title}</h1>
          <p className="large-copy">{role.summary}</p>
          <p>{role.contribution}</p>
          <div className="role-detail-cta">
            <a className="button button-dark" href="#demo-session">
              Try a demo session <span aria-hidden="true">↓</span>
            </a>
            <span className="role-detail-cta-hint">
              {sessions.length
                ? "Two hours, fully supported — see what to expect below."
                : "Tell us you're interested and we'll set one up."}
            </span>
          </div>

          <div className="role-fact-grid">
            <div className="role-fact-tile">
              <p className="role-fact-label">Time</p>
              <p className="role-fact-value">{role.timeCommitment}</p>
            </div>
            <div className="role-fact-tile role-fact-tile--yellow">
              <p className="role-fact-label">Experience</p>
              <p className="role-fact-value">{role.experience}</p>
            </div>
            <div className="role-fact-tile role-fact-tile--pink">
              <p className="role-fact-label">Interaction</p>
              <p className="role-fact-value">{role.interactionLevel}</p>
            </div>
          </div>

          <div className="role-bento-grid">
            <div className="role-bento-tile role-bento-tile--do">
              <h2>You may do</h2>
              <ul className="role-expectation-list">
                {role.tasks.map((task) => (
                  <li key={task}>
                    <Check aria-hidden="true" size={18} />
                    {task}
                  </li>
                ))}
              </ul>
            </div>
            <div className="role-bento-tile role-bento-tile--dont">
              <h2>Not expected of you</h2>
              <ul className="role-expectation-list">
                {role.boundaries.map((boundary) => (
                  <li key={boundary}>
                    <X aria-hidden="true" size={18} />
                    {boundary}
                  </li>
                ))}
              </ul>
            </div>
            <div className="role-bento-tile role-bento-tile--support">
              <h2>Love 21 provides</h2>
              <ul className="role-expectation-list">
                {role.support.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {roleTestimonials.length > 0 && (
        <section className="section volunteer-role-testimonial-section">
          <div className="shell">
            <p className="eyebrow">In their own words</p>
            <h2>What past volunteers in this role said.</h2>
            <VolunteerTestimonialMarquee testimonials={roleTestimonials} />
          </div>
        </section>
      )}

      <section className="section volunteer-story-section">
        <div className="shell">
          <VolunteerStoryVideo role={role} journeyPath={journeyPath} />
        </div>
      </section>

      <section id="demo-session" className="section volunteer-role-next-section">
        <div className="shell">
          <div className="volunteer-role-next-heading">
            <div>
              <p className="eyebrow">A realistic next step</p>
              <h2>{sessions.length ? "Explore one supported demo session." : "Register your interest."}</h2>
            </div>
            <Link className="text-link" to="/volunteer/roles">
              Compare all roles <span aria-hidden="true">→</span>
            </Link>
          </div>
          {sessions.length ? (
            sessions.map((session) => (
              <VolunteerSessionCard
                key={session.id}
                session={session}
                role={role}
                journeyPath={journeyPath}
              />
            ))
          ) : (
            <div className="volunteer-empty-session">
              <p>
                No demo session is listed for this role. You can still tell us
                whether you would prefer to observe, try once or simply hear about
                a future opportunity.
              </p>
              <Link
                className="button button-dark"
                to={`/volunteer/apply?roleId=${role.id}&journey=${journeyPath}&firstStep=interest_only`}
              >
                Register demo interest
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="section section-soft">
        <div className="shell volunteer-alternatives-panel">
          <p className="eyebrow">Not quite the right fit?</p>
          <h3>
            {otherProgramRoles.length
              ? `Other ways to help with ${programTitle}`
              : "Explore a different programme"}
          </h3>
          <div className="volunteer-alternative-links">
            {otherProgramRoles.map((otherRole) => (
              <Link
                key={otherRole.id}
                className="text-link"
                to={`/volunteer/roles/${otherRole.id}?journey=${journeyPath}`}
              >
                {otherRole.title} <span aria-hidden="true">→</span>
              </Link>
            ))}
            <Link className="text-link" to="/volunteer/roles">
              Browse every programme and role <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

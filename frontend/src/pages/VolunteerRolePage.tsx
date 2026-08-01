import { useEffect } from "react";
import { Link, useSearchParams, useParams } from "react-router-dom";

import { PageHero, StatusPanel } from "../components/Cards";
import { VolunteerNewsletterSignup } from "../components/volunteer/VolunteerNewsletterSignup";
import { VolunteerOtherWaysToHelp } from "../components/volunteer/VolunteerOtherWaysToHelp";
import { VolunteerStoryVideo } from "../components/volunteer/VolunteerStoryVideo";
import { VolunteerSessionCard } from "../components/volunteer/VolunteerSessionCard";
import { VolunteerTestimonialMarquee } from "../components/volunteer/VolunteerTestimonialMarquee";
import { programs } from "../content/programs";
import {
  commonVolunteerPrinciples,
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
      <PageHero
        eyebrow="Volunteer role"
        title={role.title}
        body={role.summary}
        tone={role.accent}
      />
      <section className="section volunteer-role-detail-section">
        <div className="shell volunteer-role-detail-grid">
          <div className="volunteer-role-main">
            <p className="eyebrow">The contribution</p>
            <h2>What your presence makes possible</h2>
            <p className="large-copy">{role.contribution}</p>
            <div className="role-expectation-grid">
              <div>
                <h3>You may do</h3>
                <ul>
                  {role.tasks.map((task) => (
                    <li key={task}>{task}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>You are not expected to</h3>
                <ul>
                  {role.boundaries.map((boundary) => (
                    <li key={boundary}>{boundary}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <aside className="volunteer-role-sidebar">
            <h2>At a glance</h2>
            <dl>
              <div>
                <dt>Time</dt>
                <dd>{role.timeCommitment}</dd>
              </div>
              <div>
                <dt>Experience</dt>
                <dd>{role.experience}</dd>
              </div>
              <div>
                <dt>Interaction</dt>
                <dd>{role.interactionLevel}</dd>
              </div>
            </dl>
            <h3>Love 21 would provide</h3>
            <ul>
              {role.support.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
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

      <section className="section volunteer-principles-section">
        <div className="shell">
          <p className="eyebrow">Shared principles</p>
          <h2>Support starts with respect.</h2>
          <ol className="volunteer-principles-grid">
            {commonVolunteerPrinciples.map((principle, index) => (
              <li key={principle}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{principle}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section volunteer-story-section">
        <div className="shell">
          <VolunteerStoryVideo role={role} journeyPath={journeyPath} />
        </div>
      </section>

      <section className="section volunteer-role-next-section">
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

      <section className="section">
        <div className="shell volunteer-alternatives-panel">
          <div>
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
          <VolunteerNewsletterSignup
            source="volunteer_role_detail"
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

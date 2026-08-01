import { Link, useSearchParams } from "react-router-dom";

import { StatusPanel } from "../components/Cards";
import { VolunteerNewsletterSignup } from "../components/volunteer/VolunteerNewsletterSignup";
import { VolunteerOtherWaysToHelp } from "../components/volunteer/VolunteerOtherWaysToHelp";
import { VolunteerSessionCard } from "../components/volunteer/VolunteerSessionCard";
import {
  getVolunteerRole,
  volunteerRoles,
  volunteerSessions,
} from "../content/volunteer";

export function VolunteerSessionsPage() {
  const [searchParams] = useSearchParams();
  const roleId = searchParams.get("roleId");
  const journeyPath = searchParams.get("journey") === "guided" ? "guided" : "quick";
  const selectedRole = roleId ? getVolunteerRole(roleId) : undefined;

  if (roleId && !selectedRole) {
    return (
      <section className="section">
        <div className="shell narrow-shell">
          <h1 className="sr-only">Volunteer session filter unavailable</h1>
          <StatusPanel title="That role filter is not available." tone="notice">
            <p>View all demo sessions or return to the role list.</p>
            <Link className="button button-dark" to="/volunteer/sessions">
              View all demo sessions
            </Link>
          </StatusPanel>
        </div>
      </section>
    );
  }

  const sessions = selectedRole
    ? volunteerSessions.filter((session) => session.roleId === selectedRole.id)
    : volunteerSessions;

  return (
    <>
      <section className="section volunteer-sessions-section">
        <div className="shell">
          <div className="demo-notice" role="note">
            <strong>Prototype only</strong>
            <p>Dates, locations and places on this page are fictional demonstration data.</p>
          </div>
          {sessions.length ? (
            <div className="volunteer-session-grid">
              {sessions.map((session) => {
                const role = getVolunteerRole(session.roleId)!;
                return (
                  <VolunteerSessionCard
                    key={session.id}
                    session={session}
                    role={role}
                    journeyPath={journeyPath}
                  />
                );
              })}
            </div>
          ) : (
            <div className="volunteer-empty-session">
              <h2>No demo session is listed for this role.</h2>
              <p>You can still register a non-binding interest without choosing a date.</p>
              <Link
                className="button button-dark"
                to={`/volunteer/apply?roleId=${selectedRole!.id}&journey=${journeyPath}&firstStep=interest_only`}
              >
                Register demo interest
              </Link>
            </div>
          )}
          {!selectedRole && (
            <div className="volunteer-no-session-roles">
              <h2>Prefer another kind of contribution?</h2>
              {volunteerRoles
                .filter(
                  (role) => !volunteerSessions.some((session) => session.roleId === role.id),
                )
                .map((role) => (
                  <Link
                    key={role.id}
                    className="text-link"
                    to={`/volunteer/roles/${role.id}?journey=${journeyPath}`}
                  >
                    Explore {role.title} <span aria-hidden="true">→</span>
                  </Link>
                ))}
            </div>
          )}
        </div>
      </section>
      <section className="section">
        <div className="shell">
          <VolunteerNewsletterSignup
            source="volunteer_sessions_page"
            title="Nothing on the calendar for you right now?"
            body="Subscribe and we'll let you know as soon as new demo sessions and opportunities are added."
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

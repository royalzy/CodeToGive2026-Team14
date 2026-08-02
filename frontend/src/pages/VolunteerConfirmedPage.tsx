import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { PageHero, StatusPanel } from "../components/Cards";
import { FirstSessionPlan } from "../components/volunteer/FirstSessionPlan";
import { getVolunteerRole, getVolunteerSession } from "../content/volunteer";
import { trackVolunteerEvent } from "../lib/volunteerAnalytics";
import type { VolunteerConfirmationState } from "../lib/volunteerConfirmation";

export function VolunteerConfirmedPage() {
  const location = useLocation();
  const state = location.state as VolunteerConfirmationState | null;
  const role = state ? getVolunteerRole(state.result.role_id) : undefined;
  const session = state?.result.session_id
    ? getVolunteerSession(state.result.session_id)
    : undefined;

  useEffect(() => {
    if (state && role) {
      trackVolunteerEvent("first_session_plan_viewed", {
        role_id: role.id,
        session_id: session?.id,
        application_status: state.result.status,
      });
    }
  }, [role, session, state]);

  if (!state || !role) {
    return (
      <section className="section">
        <div className="shell narrow-shell">
          <h1 className="sr-only">Volunteer demo result unavailable</h1>
          <StatusPanel title="Demo result is no longer available." tone="notice">
            <p>
              Prototype submissions are not saved in the browser or on the server.
              Choose a role to create another demonstration plan.
            </p>
            <Link className="button button-dark" to="/volunteer/roles">
              Choose a role
            </Link>
          </StatusPanel>
        </div>
      </section>
    );
  }

  const pending = state.result.status === "pending_confirmation";

  return (
    <>
      <PageHero
        eyebrow="Demonstration complete"
        title={pending ? "Your demo request is pending — not booked." : "Your demo interest has been explored."}
        body="This screen shows what a clear next step could feel like. No personal details or request were saved."
        tone="blue"
      />
      <section className="section volunteer-confirmation-section">
        <div className="shell volunteer-confirmation-layout">
          <div>
            <StatusPanel
              title={pending ? "Demo session awaiting confirmation" : "Demo interest submitted"}
              tone="notice"
            >
              <p>
                <strong>Simulation only.</strong> Love 21 has not received this
                request and no place has been reserved.
              </p>
              <ul className="next-steps-list">
                {state.result.next_steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </StatusPanel>
            <div className="confirmation-actions">
              <Link className="button button-dark" to="/volunteer">
                Return to volunteering
              </Link>
              <Link className="text-link" to="/story">
                Explore Love 21's impact <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <FirstSessionPlan role={role} session={session} />
        </div>
      </section>
    </>
  );
}

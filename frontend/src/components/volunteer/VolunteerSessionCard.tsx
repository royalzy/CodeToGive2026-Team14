import { Link } from "react-router-dom";

import type { VolunteerRole, VolunteerSession } from "../../content/volunteer";
import { trackVolunteerEvent } from "../../lib/volunteerAnalytics";

export function VolunteerSessionCard({
  session,
  role,
  journeyPath,
}: {
  session: VolunteerSession;
  role: VolunteerRole;
  journeyPath: "quick" | "guided";
}) {
  const query = new URLSearchParams({
    roleId: role.id,
    sessionId: session.id,
    journey: journeyPath,
  });

  return (
    <article className="volunteer-session-card">
      <div className="demo-badge">Demo session</div>
      <p className="eyebrow">{role.title}</p>
      <h2>{session.title}</h2>
      <p>{session.summary}</p>
      <dl className="volunteer-session-details">
        <div>
          <dt>Date</dt>
          <dd>{session.dateLabel}</dd>
        </div>
        <div>
          <dt>Time</dt>
          <dd>{session.timeLabel}</dd>
        </div>
        <div>
          <dt>Place</dt>
          <dd>{session.location}</dd>
        </div>
        <div>
          <dt>Availability</dt>
          <dd>{session.demoSpots} demo spots</dd>
        </div>
      </dl>
      <div className="volunteer-inline-actions">
        <Link
          className="button button-dark"
          to={`/volunteer/apply?${query}`}
          onClick={() =>
            trackVolunteerEvent("trial_session_selected", {
              journey_path: journeyPath,
              role_id: role.id,
              session_id: session.id,
            })
          }
        >
          Try this session
        </Link>
        <Link
          className="text-link"
          to={`/volunteer/apply?${query}&firstStep=observe`}
          onClick={() =>
            trackVolunteerEvent("trial_session_selected", {
              journey_path: journeyPath,
              role_id: role.id,
              session_id: session.id,
            })
          }
        >
          Ask to observe <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

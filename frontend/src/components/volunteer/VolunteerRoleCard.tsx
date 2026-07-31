import { Link } from "react-router-dom";

import type { VolunteerRole } from "../../content/volunteer";
import type { VolunteerMatchLevel } from "../../lib/volunteerMatching";

export function VolunteerRoleCard({
  role,
  level,
  reasons,
  journeyPath = "quick",
  featured = false,
}: {
  role: VolunteerRole;
  level?: VolunteerMatchLevel;
  reasons?: string[];
  journeyPath?: "quick" | "guided";
  featured?: boolean;
}) {
  return (
    <article
      className={`volunteer-role-card volunteer-accent-${role.accent} ${
        featured ? "volunteer-role-featured" : ""
      }`}
    >
      <div className="volunteer-role-card-topline">
        <span>{role.shortTitle}</span>
        {level && <strong>{level}</strong>}
      </div>
      <h2>{role.title}</h2>
      <p>{role.summary}</p>
      {reasons && (
        <ul className="volunteer-reason-list">
          {reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      )}
      <dl className="volunteer-role-facts">
        <div>
          <dt>Time</dt>
          <dd>{role.timeCommitment}</dd>
        </div>
        <div>
          <dt>Experience</dt>
          <dd>{role.experience}</dd>
        </div>
      </dl>
      <Link
        className="button button-dark"
        to={`/volunteer/roles/${role.id}?journey=${journeyPath}`}
      >
        Explore this role
      </Link>
    </article>
  );
}

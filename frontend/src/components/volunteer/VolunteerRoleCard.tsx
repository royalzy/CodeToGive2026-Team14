import { Link } from "react-router-dom";

import { CardOptionsMenu } from "../CardOptionsMenu";
import { programs } from "../../content/programs";
import type { VolunteerRole, VolunteerRoleType } from "../../content/volunteer";
import { trackVolunteerEvent } from "../../lib/volunteerAnalytics";
import type { VolunteerMatchLevel } from "../../lib/volunteerMatching";
import { copyDetails, copyLink, shareOrCopyLink } from "../../lib/shareUtils";

const roleTypeLabels: Record<VolunteerRoleType, string> = {
  class_assistant: "Class assistant",
  class_leader: "Class leader",
  event_helper: "Event helper",
};

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
  const program = programs.find((item) => item.slug === role.programSlug);
  const shareContent = {
    url: `/volunteer/roles/${role.id}?journey=${journeyPath}`,
    title: role.title,
    text: role.summary,
  };

  function track() {
    trackVolunteerEvent("role_shared", { journey_path: journeyPath, role_id: role.id });
  }

  return (
    <article
      className={`volunteer-role-card volunteer-accent-${role.accent} ${
        featured ? "volunteer-role-featured" : ""
      }`}
    >
      <CardOptionsMenu
        label={`More options for ${role.title}`}
        items={[
          {
            key: "share",
            label: "Share",
            onSelect: (announce) => {
              track();
              return shareOrCopyLink(shareContent, announce);
            },
          },
          {
            key: "copy-link",
            label: "Copy link",
            onSelect: (announce) => {
              track();
              return copyLink(shareContent.url, announce);
            },
          },
          {
            key: "copy-details",
            label: "Copy role details",
            onSelect: (announce) => copyDetails(shareContent, announce),
          },
        ]}
      />
      <div className="volunteer-role-card-topline">
        <span>{role.shortTitle}</span>
        {level && <strong>{level}</strong>}
      </div>
      <div className="volunteer-role-card-badges">
        {program && <span className="volunteer-role-badge">{program.title}</span>}
        <span className="volunteer-role-badge volunteer-role-badge-muted">
          {roleTypeLabels[role.roleType]}
        </span>
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

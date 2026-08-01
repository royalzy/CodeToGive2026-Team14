import { Link } from "react-router-dom";

import { CardOptionsMenu } from "../CardOptionsMenu";
import type { VolunteerRole, VolunteerSession } from "../../content/volunteer";
import { trackVolunteerEvent } from "../../lib/volunteerAnalytics";
import { copyDetails, copyLink, shareOrCopyLink } from "../../lib/shareUtils";

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
  const shareContent = {
    url: `/volunteer/sessions?roleId=${role.id}&journey=${journeyPath}`,
    title: session.title,
    text: `${session.summary} ${session.dateLabel}, ${session.timeLabel} at ${session.location}.`,
  };

  function track() {
    trackVolunteerEvent("session_shared", {
      journey_path: journeyPath,
      role_id: role.id,
      session_id: session.id,
    });
  }

  return (
    <article className="volunteer-session-card">
      <CardOptionsMenu
        label={`More options for ${session.title}`}
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
            label: "Copy session details",
            onSelect: (announce) => copyDetails(shareContent, announce),
          },
        ]}
      />
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

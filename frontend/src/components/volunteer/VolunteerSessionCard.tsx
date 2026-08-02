import { Link } from "react-router-dom";

import { CardOptionsMenu } from "../CardOptionsMenu";
import type { VolunteerRole, VolunteerSession } from "../../content/volunteer";
import { useLanguage } from "../../hooks/useLanguage";
import { localizeDeep } from "../../lib/zhConvert";
import { trackVolunteerEvent } from "../../lib/volunteerAnalytics";
import { copyDetails, copyLink, shareOrCopyLink } from "../../lib/shareUtils";

const copy = {
  en: {
    moreOptionsFor: (title: string) => `More options for ${title}`,
    share: "Share",
    copyLink: "Copy link",
    copySessionDetails: "Copy session details",
    demoSession: "Demo session",
    date: "Date",
    time: "Time",
    place: "Place",
    availability: "Availability",
    demoSpots: (count: number) => `${count} demo spots`,
    trySession: "Try this session",
    askToObserve: "Ask to observe",
  },
  zh: {
    moreOptionsFor: (title: string) => `${title}的更多選項`,
    share: "分享",
    copyLink: "複製連結",
    copySessionDetails: "複製活動詳情",
    demoSession: "示範活動",
    date: "日期",
    time: "時間",
    place: "地點",
    availability: "名額",
    demoSpots: (count: number) => `${count} 個示範名額`,
    trySession: "試試這次活動",
    askToObserve: "要求觀摩",
  },
} as const;

export function VolunteerSessionCard({
  session,
  role,
  journeyPath,
}: {
  session: VolunteerSession;
  role: VolunteerRole;
  journeyPath: "quick" | "guided";
}) {
  const { lang } = useLanguage();
  const t = copy[lang === "en" ? "en" : "zh"];
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
        label={localizeDeep(t.moreOptionsFor(session.title), lang)}
        items={[
          {
            key: "share",
            label: localizeDeep(t.share, lang),
            onSelect: (announce) => {
              track();
              return shareOrCopyLink(shareContent, announce);
            },
          },
          {
            key: "copy-link",
            label: localizeDeep(t.copyLink, lang),
            onSelect: (announce) => {
              track();
              return copyLink(shareContent.url, announce);
            },
          },
          {
            key: "copy-details",
            label: localizeDeep(t.copySessionDetails, lang),
            onSelect: (announce) => copyDetails(shareContent, announce),
          },
        ]}
      />
      <div className="demo-badge">{localizeDeep(t.demoSession, lang)}</div>
      <p className="eyebrow">{role.title}</p>
      <h2>{session.title}</h2>
      <p>{session.summary}</p>
      <dl className="volunteer-session-details">
        <div>
          <dt>{localizeDeep(t.date, lang)}</dt>
          <dd>{session.dateLabel}</dd>
        </div>
        <div>
          <dt>{localizeDeep(t.time, lang)}</dt>
          <dd>{session.timeLabel}</dd>
        </div>
        <div>
          <dt>{localizeDeep(t.place, lang)}</dt>
          <dd>{session.location}</dd>
        </div>
        <div>
          <dt>{localizeDeep(t.availability, lang)}</dt>
          <dd>{localizeDeep(t.demoSpots(session.demoSpots), lang)}</dd>
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
          {localizeDeep(t.trySession, lang)}
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
          {localizeDeep(t.askToObserve, lang)} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

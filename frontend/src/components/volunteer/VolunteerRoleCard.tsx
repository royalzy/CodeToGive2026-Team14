import { Link } from "react-router-dom";

import { CardOptionsMenu } from "../CardOptionsMenu";
import type { VolunteerRole, VolunteerRoleType } from "../../content/volunteer";
import { useLanguage } from "../../hooks/useLanguage";
import { localizeDeep } from "../../lib/zhConvert";
import { trackVolunteerEvent } from "../../lib/volunteerAnalytics";
import type { VolunteerMatchLevel } from "../../lib/volunteerMatching";
import { copyDetails, copyLink, shareOrCopyLink } from "../../lib/shareUtils";

const roleTypeLabels: Record<VolunteerRoleType, string> = {
  class_assistant: "Class assistant",
  class_leader: "Class leader",
  event_helper: "Event helper",
};

const roleTypeLabelsZh: Record<VolunteerRoleType, string> = {
  class_assistant: "課堂助理",
  class_leader: "課堂帶領者",
  event_helper: "活動助手",
};

const copy = {
  en: {
    moreOptionsFor: (title: string) => `More options for ${title}`,
    share: "Share",
    copyLink: "Copy link",
    copyRoleDetails: "Copy role details",
    time: "Time",
    experience: "Experience",
    exploreRole: "Explore this role",
  },
  zh: {
    moreOptionsFor: (title: string) => `${title}的更多選項`,
    share: "分享",
    copyLink: "複製連結",
    copyRoleDetails: "複製角色詳情",
    time: "時間",
    experience: "經驗",
    exploreRole: "了解這個角色",
  },
} as const;

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
  const { lang, t: content } = useLanguage();
  const t = copy[lang === "en" ? "en" : "zh"];
  const roleTypeLabel = localizeDeep(
    (lang === "en" ? roleTypeLabels : roleTypeLabelsZh)[role.roleType],
    lang,
  );
  const program = content.programs.find((item) => item.slug === role.programSlug);
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
        label={localizeDeep(t.moreOptionsFor(role.title), lang)}
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
            label: localizeDeep(t.copyRoleDetails, lang),
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
        <span className="volunteer-role-badge volunteer-role-badge-muted">{roleTypeLabel}</span>
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
          <dt>{localizeDeep(t.time, lang)}</dt>
          <dd>{role.timeCommitment}</dd>
        </div>
        <div>
          <dt>{localizeDeep(t.experience, lang)}</dt>
          <dd>{role.experience}</dd>
        </div>
      </dl>
      <Link
        className="button button-dark"
        to={`/volunteer/roles/${role.id}?journey=${journeyPath}`}
      >
        {localizeDeep(t.exploreRole, lang)}
      </Link>
    </article>
  );
}

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
import { useLanguage } from "../hooks/useLanguage";
import { localizeDeep } from "../lib/zhConvert";

const sessionsCopy = {
  en: {
    filterUnavailableHeading: "Volunteer session filter unavailable",
    filterUnavailableTitle: "That role filter is not available.",
    filterUnavailableBody: "View all demo sessions or return to the role list.",
    viewAllSessions: "View all demo sessions",
    prototypeOnly: "Prototype only",
    prototypeNote:
      "Dates, locations and places on this page are fictional demonstration data.",
    noSessionTitle: "No demo session is listed for this role.",
    noSessionBody: "You can still register a non-binding interest without choosing a date.",
    registerInterest: "Register demo interest",
    otherContribution: "Prefer another kind of contribution?",
    explorePrefix: "Explore ",
    newsletterTitle: "Nothing on the calendar for you right now?",
    newsletterBody:
      "Subscribe and we'll let you know as soon as new demo sessions and opportunities are added.",
  },
  zh: {
    filterUnavailableHeading: "義工時段篩選暫時無法使用",
    filterUnavailableTitle: "此角色篩選暫時無法使用。",
    filterUnavailableBody: "請查看所有示範時段，或返回角色列表。",
    viewAllSessions: "查看所有示範時段",
    prototypeOnly: "僅供示範",
    prototypeNote: "此頁面的日期、地點和名額均為虛構的示範資料。",
    noSessionTitle: "此角色暫時沒有示範時段。",
    noSessionBody: "你仍可登記非約束性興趣，毋須選擇日期。",
    registerInterest: "登記示範興趣",
    otherContribution: "想以其他方式參與？",
    explorePrefix: "了解 ",
    newsletterTitle: "暫時沒有合適的時段？",
    newsletterBody: "訂閱後，我們會在新增示範時段和機會時通知你。",
  },
} as const;

export function VolunteerSessionsPage() {
  const { lang } = useLanguage();
  const copy = localizeDeep(sessionsCopy[lang === "en" ? "en" : "zh"], lang);
  const [searchParams] = useSearchParams();
  const roleId = searchParams.get("roleId");
  const journeyPath = searchParams.get("journey") === "guided" ? "guided" : "quick";
  const selectedRole = roleId ? getVolunteerRole(roleId) : undefined;

  if (roleId && !selectedRole) {
    return (
      <section className="section">
        <div className="shell narrow-shell">
          <h1 className="sr-only">{copy.filterUnavailableHeading}</h1>
          <StatusPanel title={copy.filterUnavailableTitle} tone="notice">
            <p>{copy.filterUnavailableBody}</p>
            <Link className="button button-dark" to="/volunteer/sessions">
              {copy.viewAllSessions}
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
            <strong>{copy.prototypeOnly}</strong>
            <p>{copy.prototypeNote}</p>
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
              <h2>{copy.noSessionTitle}</h2>
              <p>{copy.noSessionBody}</p>
              <Link
                className="button button-dark"
                to={`/volunteer/apply?roleId=${selectedRole!.id}&journey=${journeyPath}&firstStep=interest_only`}
              >
                {copy.registerInterest}
              </Link>
            </div>
          )}
          {!selectedRole && (
            <div className="volunteer-no-session-roles">
              <h2>{copy.otherContribution}</h2>
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
                    {copy.explorePrefix}
                    {role.title} <span aria-hidden="true">→</span>
                  </Link>
                ))}
            </div>
          )}
        </div>
      </section>
      <section className="section section-soft">
        <div className="shell">
          <VolunteerOtherWaysToHelp />
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <VolunteerNewsletterSignup
            source="volunteer_sessions_page"
            title={copy.newsletterTitle}
            body={copy.newsletterBody}
          />
        </div>
      </section>
    </>
  );
}

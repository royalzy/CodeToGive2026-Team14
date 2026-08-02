import { useEffect } from "react";
import { Link, useSearchParams, useParams } from "react-router-dom";
import { Check, X } from "lucide-react";

import { StatusPanel } from "../components/Cards";
import { VolunteerSessionCard } from "../components/volunteer/VolunteerSessionCard";
import { VolunteerStoryVideo } from "../components/volunteer/VolunteerStoryVideo";
import { VolunteerTestimonialMarquee } from "../components/volunteer/VolunteerTestimonialMarquee";
import {
  getTestimonialsForRole,
  getVolunteerRole,
  getVolunteerRolesForProgram,
  localizeVolunteerRole,
  localizeVolunteerSession,
  localizeVolunteerTestimonial,
  volunteerSessions,
} from "../content/volunteer";
import { useLanguage } from "../hooks/useLanguage";
import { localizeDeep } from "../lib/zhConvert";
import { trackVolunteerEvent } from "../lib/volunteerAnalytics";

const pageCopy = {
  en: {
    unavailableHeading: "Volunteer role unavailable",
    unavailableTitle: "That volunteer role is not available.",
    unavailableBody: "The link may be out of date. Explore the current first-step roles instead.",
    browseRoles: "Browse current roles",
    presenceEyebrow: "What your presence makes possible",
    demoAction: "Try a demo session",
    demoHintWithSessions: "Two hours, fully supported — see what to expect below.",
    demoHintNoSessions: "Tell us you're interested and we'll set one up.",
    timeLabel: "Time",
    experienceLabel: "Experience",
    interactionLabel: "Interaction",
    mayDo: "You may do",
    notExpected: "Not expected of you",
    provides: "Love 21 provides",
    testimonialEyebrow: "In their own words",
    testimonialTitle: "What past volunteers in this role said.",
    nextStepEyebrow: "A realistic next step",
    nextStepWithSessions: "Explore one supported demo session.",
    nextStepNoSessions: "Register your interest.",
    compareRoles: "Compare all roles",
    noSessionListed:
      "No demo session is listed for this role. You can still tell us whether you would prefer to observe, try once or simply hear about a future opportunity.",
    registerInterest: "Register demo interest",
    notRightFitEyebrow: "Not quite the right fit?",
    otherWaysWithProgram: "Other ways to help with",
    exploreDifferent: "Explore a different programme",
    browseEvery: "Browse every programme and role",
  },
  zh: {
    unavailableHeading: "義工職位暫時無法瀏覽",
    unavailableTitle: "這個義工職位暫時無法瀏覽。",
    unavailableBody: "連結可能已經失效，請瀏覽目前開放的入門職位。",
    browseRoles: "瀏覽目前開放的職位",
    presenceEyebrow: "你的參與能帶來甚麼",
    demoAction: "體驗示範活動",
    demoHintWithSessions: "有全程支援的兩小時體驗——在下方了解詳情。",
    demoHintNoSessions: "告訴我們你有興趣，我們會為你安排。",
    timeLabel: "時間",
    experienceLabel: "經驗要求",
    interactionLabel: "互動程度",
    mayDo: "你可能會做的事",
    notExpected: "不需要你做的事",
    provides: "Love 21 提供的支援",
    testimonialEyebrow: "他們的親身分享",
    testimonialTitle: "過往義工對這個職位的分享。",
    nextStepEyebrow: "踏出實在的下一步",
    nextStepWithSessions: "了解一個有全程支援的示範活動。",
    nextStepNoSessions: "登記你的興趣。",
    compareRoles: "比較所有職位",
    noSessionListed:
      "這個職位暫時未有安排示範活動，你仍可以告訴我們，你希望先觀察、嘗試一次，還是想了解日後的機會。",
    registerInterest: "登記示範興趣",
    notRightFitEyebrow: "覺得未必適合你？",
    otherWaysWithProgram: "其他支援以下計劃的方式：",
    exploreDifferent: "探索其他計劃",
    browseEvery: "瀏覽所有計劃和職位",
  },
} as const;

export function VolunteerRolePage() {
  const { lang, t } = useLanguage();
  const copy = localizeDeep(pageCopy[lang === "en" ? "en" : "zh"], lang);
  const { roleId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const journeyPath = searchParams.get("journey") === "guided" ? "guided" : "quick";
  const baseRole = getVolunteerRole(roleId);
  const role = baseRole ? localizeDeep(localizeVolunteerRole(baseRole, lang), lang) : undefined;
  const sessions = volunteerSessions
    .filter((session) => session.roleId === baseRole?.id)
    .map((session) => localizeDeep(localizeVolunteerSession(session, lang), lang));
  const otherProgramRoles = baseRole
    ? getVolunteerRolesForProgram(baseRole.programSlug)
        .filter((item) => item.id !== baseRole.id)
        .map((item) => localizeDeep(localizeVolunteerRole(item, lang), lang))
    : [];
  const programTitle = baseRole
    ? t.programs.find((program) => program.slug === baseRole.programSlug)?.title
    : undefined;
  const roleTestimonials = baseRole
    ? getTestimonialsForRole(baseRole).map((testimonial) =>
        localizeDeep(localizeVolunteerTestimonial(testimonial, lang), lang),
      )
    : [];

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
          <h1 className="sr-only">{copy.unavailableHeading}</h1>
          <StatusPanel title={copy.unavailableTitle} tone="notice">
            <p>{copy.unavailableBody}</p>
            <Link className="button button-dark" to="/volunteer/roles">
              {copy.browseRoles}
            </Link>
          </StatusPanel>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="section volunteer-role-detail-section">
        <div className="shell">
          <p className="eyebrow">{copy.presenceEyebrow}</p>
          <h1>{role.title}</h1>
          <p className="large-copy">{role.summary}</p>
          <p>{role.contribution}</p>
          <div className="role-detail-cta">
            <a className="button button-dark" href="#demo-session">
              {copy.demoAction} <span aria-hidden="true">↓</span>
            </a>
            <span className="role-detail-cta-hint">
              {sessions.length ? copy.demoHintWithSessions : copy.demoHintNoSessions}
            </span>
          </div>

          <div className="role-fact-grid">
            <div className="role-fact-tile">
              <p className="role-fact-label">{copy.timeLabel}</p>
              <p className="role-fact-value">{role.timeCommitment}</p>
            </div>
            <div className="role-fact-tile role-fact-tile--yellow">
              <p className="role-fact-label">{copy.experienceLabel}</p>
              <p className="role-fact-value">{role.experience}</p>
            </div>
            <div className="role-fact-tile role-fact-tile--pink">
              <p className="role-fact-label">{copy.interactionLabel}</p>
              <p className="role-fact-value">{role.interactionLevel}</p>
            </div>
          </div>

          <div className="role-bento-grid">
            <div className="role-bento-tile role-bento-tile--do">
              <h2>{copy.mayDo}</h2>
              <ul className="role-expectation-list">
                {role.tasks.map((task) => (
                  <li key={task}>
                    <Check aria-hidden="true" size={18} />
                    {task}
                  </li>
                ))}
              </ul>
            </div>
            <div className="role-bento-tile role-bento-tile--dont">
              <h2>{copy.notExpected}</h2>
              <ul className="role-expectation-list">
                {role.boundaries.map((boundary) => (
                  <li key={boundary}>
                    <X aria-hidden="true" size={18} />
                    {boundary}
                  </li>
                ))}
              </ul>
            </div>
            <div className="role-bento-tile role-bento-tile--support">
              <h2>{copy.provides}</h2>
              <ul className="role-expectation-list">
                {role.support.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {roleTestimonials.length > 0 && (
        <section className="section volunteer-role-testimonial-section">
          <div className="shell">
            <p className="eyebrow">{copy.testimonialEyebrow}</p>
            <h2>{copy.testimonialTitle}</h2>
            <VolunteerTestimonialMarquee testimonials={roleTestimonials} />
          </div>
        </section>
      )}

      <section className="section volunteer-story-section">
        <div className="shell">
          <VolunteerStoryVideo role={role} journeyPath={journeyPath} />
        </div>
      </section>

      <section id="demo-session" className="section volunteer-role-next-section">
        <div className="shell">
          <div className="volunteer-role-next-heading">
            <div>
              <p className="eyebrow">{copy.nextStepEyebrow}</p>
              <h2>{sessions.length ? copy.nextStepWithSessions : copy.nextStepNoSessions}</h2>
            </div>
            <Link className="text-link" to="/volunteer/roles">
              {copy.compareRoles} <span aria-hidden="true">→</span>
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
              <p>{copy.noSessionListed}</p>
              <Link
                className="button button-dark"
                to={`/volunteer/apply?roleId=${role.id}&journey=${journeyPath}&firstStep=interest_only`}
              >
                {copy.registerInterest}
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="section section-soft">
        <div className="shell volunteer-alternatives-panel">
          <p className="eyebrow">{copy.notRightFitEyebrow}</p>
          <h3>
            {otherProgramRoles.length
              ? `${copy.otherWaysWithProgram} ${programTitle}`
              : copy.exploreDifferent}
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
              {copy.browseEvery} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

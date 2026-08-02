import { useParams } from "react-router-dom";
import { useState } from "react";

import { AchievementBadge, LevelBar, PageHero, SectionHeading } from "../components/Cards";
import { useLanguage } from "../hooks/useLanguage";
import { awardPoints, earnedBadges } from "../content/gamification";
import { memberProfileCopy } from "../content/memberProfile";
import { localizeDeep } from "../lib/zhConvert";

export function MemberProfilePage() {
  const { t, lang } = useLanguage();
  const copy = localizeDeep(memberProfileCopy[lang === "en" ? "en" : "zh"], lang);
  const { slug } = useParams<{ slug: string }>();
  const member = t.memberProfiles.find((m) => m.slug === slug);

  const [points, setPoints] = useState(0);
  const [sessions, setSessions] = useState(0);
  const [eventsHelped, setEventsHelped] = useState(0);
  const [lastActivity, setLastActivity] = useState<string | null>(null);

  if (!member) {
    return (
      <PageHero
        eyebrow={copy.notFoundEyebrow}
        title={copy.notFoundTitle}
        body={copy.notFoundBody}
        tone="blue"
      />
    );
  }

  const badgesList = earnedBadges(sessions, eventsHelped);

  function logActivity(activity: string) {
    const pts = awardPoints(activity);
    setPoints((p) => p + pts);
    setSessions((s) => s + 1);
    if (activity === "event") setEventsHelped((e) => e + 1);
    setLastActivity(activity);
  }

  return (
    <>
      <PageHero
        eyebrow={copy.journeyEyebrow(member.name)}
        title={member.name}
        body={member.bio}
        tone="red"
      />

      <section className="section">
        <div className="shell profile-layout">
          <div className="profile-main">
            <LevelBar points={points} />

            <div className="profile-stats">
              <div className="profile-stat">
                <strong>{sessions}</strong>
                <span>{copy.activitiesLabel}</span>
              </div>
              <div className="profile-stat">
                <strong>{eventsHelped}</strong>
                <span>{copy.eventsHelpedLabel}</span>
              </div>
            </div>

            {lastActivity && (
              <p className="profile-activity" role="status">
                {copy.pointsEarned(
                  awardPoints(lastActivity),
                  copy.activityOptions.find((a) => a.id === lastActivity)?.label ?? "",
                )}
              </p>
            )}

            <div className="profile-photo-frame">
              <img src={member.photo} alt={member.name} />
            </div>
          </div>

          <aside className="profile-actions">
            <p className="eyebrow">{copy.demoGamificationEyebrow}</p>
            <h3>{copy.logActivityTitle}</h3>
            <p className="profile-hint">{copy.profileHint}</p>
            <div className="activity-buttons">
              {copy.activityOptions.map((opt) => (
                <button
                  key={opt.id}
                  className="button button-dark"
                  type="button"
                  onClick={() => logActivity(opt.id)}
                >
                  {opt.label} ({opt.pts})
                </button>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="section section-soft">
        <div className="shell">
          <SectionHeading
            eyebrow={copy.growthStoryEyebrow}
            title={copy.milestonesTitle}
          />
          <ol className="milestone-list">
            {member.milestones.map((milestone, index) => (
              <li key={milestone.label}>
                <span className="milestone-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="eyebrow">{milestone.label}</p>
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow={copy.achievementsEyebrow}
            title={copy.badgesEarnedTitle}
            body={copy.badgesBody}
          />
          <div className="badge-grid">
            {badgesList.map((badge) => (
              <AchievementBadge key={badge.id} badge={badge} earned={true} />
            ))}
            {badgesList.length === 0 && (
              <p>{copy.noBadgesYet}</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

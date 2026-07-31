import { useParams } from "react-router-dom";
import { useState } from "react";

import { AchievementBadge, LevelBar, PageHero, SectionHeading } from "../components/Cards";
import { memberProfiles } from "../content/en";
import { awardPoints, earnedBadges } from "../content/gamification";

export function MemberProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const member = memberProfiles.find((m) => m.slug === slug);

  const [points, setPoints] = useState(0);
  const [sessions, setSessions] = useState(0);
  const [eventsHelped, setEventsHelped] = useState(0);
  const [lastActivity, setLastActivity] = useState<string | null>(null);

  if (!member) {
    return (
      <PageHero
        eyebrow="Not found"
        title="This member profile is not available yet."
        body="Return to the member portal to explore other profiles."
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

  const activityOptions = [
    { id: "session", label: "Attend a session", pts: "+20" },
    { id: "event", label: "Help at an event", pts: "+50" },
    { id: "share", label: "Share your story", pts: "+10" },
    { id: "lead", label: "Lead an activity", pts: "+80" },
  ] as const;

  return (
    <>
      <PageHero
        eyebrow={`${member.name}'s journey`}
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
                <span>activities</span>
              </div>
              <div className="profile-stat">
                <strong>{eventsHelped}</strong>
                <span>events helped</span>
              </div>
            </div>

            {lastActivity && (
              <p className="profile-activity" role="status">
                +{awardPoints(lastActivity)} points — {activityOptions.find((a) => a.id === lastActivity)?.label}
              </p>
            )}

            <div className="profile-photo-frame">
              <img src={member.photo} alt={member.name} />
            </div>
          </div>

          <aside className="profile-actions">
            <p className="eyebrow">Demo gamification</p>
            <h3>Log an activity</h3>
            <p className="profile-hint">
              Tap a button to add points in-session. In a live service, points are earned through real participation.
            </p>
            <div className="activity-buttons">
              {activityOptions.map((opt) => (
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
            eyebrow="Growth story"
            title="Milestones"
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
            eyebrow="Achievements"
            title="Badges earned"
            body="Badges are unlocked as members participate, share and grow."
          />
          <div className="badge-grid">
            {badgesList.map((badge) => (
              <AchievementBadge key={badge.id} badge={badge} earned={true} />
            ))}
            {badgesList.length === 0 && (
              <p>Log your first activity to see badges appear here.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

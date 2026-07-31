import { Link } from "react-router-dom";

import type { Badge, Member } from "../../content/types";
import { calculateLevel } from "../../content/gamification";

export function LevelBar({ points }: { points: number }) {
  const { current, next, progress } = calculateLevel(points);

  return (
    <div className="level-bar">
      <div className="level-bar-header">
        <span className="level-name">{current.name}</span>
        {next && <span className="level-next">Next: {next.name}</span>}
      </div>
      <div className="level-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div className="level-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="level-points">{points} points</p>
    </div>
  );
}

export function AchievementBadge({ badge, earned }: { badge: Badge; earned: boolean }) {
  return (
    <div className={`badge ${earned ? "badge-earned" : "badge-locked"}`} aria-label={`${badge.label} — ${earned ? "earned" : "locked"}`}>
      <span className="badge-icon" aria-hidden="true">{earned ? "★" : "☆"}</span>
      <div>
        <strong>{badge.label}</strong>
        <p>{badge.description}</p>
      </div>
    </div>
  );
}

export function MemberCard({ member, points }: { member: Member; points: number }) {
  const { current } = calculateLevel(points);

  return (
    <Link className={`member-card accent-${member.accent}`} to={`/members/${member.slug}`}>
      <div className="member-card-photo">
        <img src={member.photo} alt={member.name} />
      </div>
      <div className="member-card-body">
        <h3>{member.name}</h3>
        <p className="member-card-level">{current.name}</p>
        <p className="member-card-points">{points} points</p>
      </div>
    </Link>
  );
}

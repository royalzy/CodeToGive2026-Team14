import { Link } from "react-router-dom";

import type { Badge, Member } from "../../content/types";
import { calculateLevel } from "../../content/gamification";
import { useLanguage } from "../../hooks/useLanguage";
import { localizeDeep } from "../../lib/zhConvert";

function pointsLabel(points: number, lang: "en" | "zh-Hant" | "zh-Hans") {
  return lang === "en" ? `${points} points` : localizeDeep(`${points} 分`, lang);
}

export function LevelBar({ points }: { points: number }) {
  const { lang } = useLanguage();
  const { current, next, progress } = calculateLevel(points);
  const nextLabel = next
    ? lang === "en"
      ? `Next: ${next.name}`
      : localizeDeep(`下一級：${next.name}`, lang)
    : null;

  return (
    <div className="level-bar">
      <div className="level-bar-header">
        <span className="level-name">{current.name}</span>
        {nextLabel && <span className="level-next">{nextLabel}</span>}
      </div>
      <div className="level-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div className="level-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="level-points">{pointsLabel(points, lang)}</p>
    </div>
  );
}

export function AchievementBadge({ badge, earned }: { badge: Badge; earned: boolean }) {
  const { lang } = useLanguage();
  const statusWord = earned
    ? lang === "en" ? "earned" : localizeDeep("已獲得", lang)
    : lang === "en" ? "locked" : localizeDeep("未解鎖", lang);
  return (
    <div className={`badge ${earned ? "badge-earned" : "badge-locked"}`} aria-label={`${badge.label} — ${statusWord}`}>
      <span className="badge-icon" aria-hidden="true">{earned ? "★" : "☆"}</span>
      <div>
        <strong>{badge.label}</strong>
        <p>{badge.description}</p>
      </div>
    </div>
  );
}

export function MemberCard({ member, points }: { member: Member; points: number }) {
  const { lang } = useLanguage();
  const { current } = calculateLevel(points);

  return (
    <Link className={`member-card accent-${member.accent}`} to={`/members/${member.slug}`}>
      <div className="member-card-photo">
        <img src={member.photo} alt={member.name} />
      </div>
      <div className="member-card-body">
        <h3>{member.name}</h3>
        <p className="member-card-level">{current.name}</p>
        <p className="member-card-points">{pointsLabel(points, lang)}</p>
      </div>
    </Link>
  );
}

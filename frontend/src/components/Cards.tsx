import { Link } from "react-router-dom";

import type { AllocationShare, Badge, Member, Metric, Program, VolunteerOpportunity, WishlistItem } from "../content/types";
import { calculateLevel } from "../content/gamification";

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  body?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`section-heading section-heading-${align}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {body && <p>{body}</p>}
    </div>
  );
}

export function MetricCard({ metric }: { metric: Metric }) {
  return (
    <article className={`metric-card accent-${metric.accent}`}>
      <strong>{metric.value}</strong>
      <h3>{metric.label}</h3>
      <p>{metric.detail}</p>
    </article>
  );
}

export function ProgramCard({
  program,
  compact = false,
}: {
  program: Program;
  compact?: boolean;
}) {
  return (
    <article
      className={`program-card accent-${program.accent} ${
        compact ? "program-card-compact" : ""
      }`}
    >
      <span className="program-number" aria-hidden="true">
        {program.eyebrow.slice(0, 1)}
      </span>
      <p className="eyebrow">{program.eyebrow}</p>
      <h3>{program.title}</h3>
      <p>{program.description}</p>
      {!compact && (
        <ul className="program-outcomes">
          {program.outcomes.map((o) => (
            <li key={o.label}>
              <strong>{o.label}</strong> — {o.detail}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export function PathwayCard({
  number,
  eyebrow,
  title,
  body,
  href,
  cta,
  accent,
}: {
  number: string;
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  accent: "red" | "blue" | "yellow";
}) {
  return (
    <article className={`pathway-card pathway-${accent}`}>
      <div className="pathway-topline">
        <span>{number}</span>
        <p>{eyebrow}</p>
      </div>
      <h3>{title}</h3>
      <p>{body}</p>
      <Link className="text-link" to={href}>
        {cta} <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}

export function PageHero({
  eyebrow,
  title,
  body,
  tone,
}: {
  eyebrow: string;
  title: string;
  body: string;
  tone: "red" | "blue" | "yellow";
}) {
  return (
    <section className={`page-hero page-hero-${tone}`}>
      <div className="shell page-hero-inner">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{body}</p>
      </div>
    </section>
  );
}

export function StatusPanel({
  title,
  children,
  reference,
  tone = "success",
}: {
  title: string;
  children: React.ReactNode;
  reference?: string;
  tone?: "success" | "notice";
}) {
  return (
    <div className={`status-panel status-${tone}`} role="status">
      <span className="status-mark" aria-hidden="true">
        {tone === "success" ? "✓" : "i"}
      </span>
      <div>
        <h2>{title}</h2>
        {children}
        {reference && (
          <p className="reference">
            Demo reference: <strong>{reference}</strong>
          </p>
        )}
      </div>
    </div>
  );
}

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

export function OpportunityCard({ opportunity }: { opportunity: VolunteerOpportunity }) {
  return (
    <article className={`opportunity-card accent-${opportunity.accent}`}>
      <p className="eyebrow">{opportunity.date}</p>
      <h3>{opportunity.title}</h3>
      <p>{opportunity.role}</p>
      <div className="opportunity-meta">
        <span>{opportunity.time}</span>
        <span>{opportunity.spots} spot{opportunity.spots > 1 ? "s" : ""} left</span>
      </div>
    </article>
  );
}

export function WishlistCard({ item }: { item: WishlistItem }) {
  return (
    <article className="wishlist-card">
      <h3>{item.label}</h3>
      <p>{item.description}</p>
      <div className="wishlist-footer">
        <strong>HK${item.cost.toLocaleString()}</strong>
        <span className="wishlist-program">{item.program.replace("_", " ")}</span>
      </div>
    </article>
  );
}

export function AllocationBar({ shares }: { shares: AllocationShare[] }) {
  return (
    <div className="allocation-bar">
      {shares.map((share) => (
        <div key={share.program} className="allocation-row">
          <div className="allocation-label">
            <span>{share.program.replace("_", " ")}</span>
            <strong>{share.percentage}%</strong>
          </div>
          <div className="allocation-track">
            <div
              className="allocation-fill accent-border"
              style={{ width: `${share.percentage}%` }}
            />
          </div>
          <p className="allocation-detail">{share.funds}</p>
        </div>
      ))}
    </div>
  );
}

export function PersonaCard({
  icon,
  label,
  description,
  href,
}: {
  icon: string;
  label: string;
  description: string;
  href: string;
}) {
  return (
    <Link className="persona-card" to={href}>
      <span className="persona-icon" aria-hidden="true">{icon}</span>
      <div>
        <strong>{label}</strong>
        <p>{description}</p>
      </div>
    </Link>
  );
}


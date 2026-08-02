import { Link } from "react-router-dom";

import type { AllocationShare, VolunteerOpportunity, WishlistItem } from "../../content/types";
import { useLanguage } from "../../hooks/useLanguage";
import { localizeDeep } from "../../lib/zhConvert";

export function OpportunityCard({ opportunity }: { opportunity: VolunteerOpportunity }) {
  const { lang } = useLanguage();
  const spotsLabel =
    lang === "en"
      ? `${opportunity.spots} spot${opportunity.spots > 1 ? "s" : ""} left`
      : localizeDeep(`剩餘 ${opportunity.spots} 個名額`, lang);
  return (
    <article className={`opportunity-card accent-${opportunity.accent}`}>
      <p className="eyebrow">{opportunity.date}</p>
      <h3>{opportunity.title}</h3>
      <p>{opportunity.role}</p>
      <div className="opportunity-meta">
        <span>{opportunity.time}</span>
        <span>{spotsLabel}</span>
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

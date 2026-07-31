import { Link } from "react-router-dom";

import type { Metric, Program } from "../../content/types";

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

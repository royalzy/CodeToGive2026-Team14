import { Link } from "react-router-dom";

import type { Metric, Program } from "../content/types";

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


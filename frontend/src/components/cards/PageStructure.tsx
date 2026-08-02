import { useLanguage } from "../../hooks/useLanguage";
import { localizeDeep } from "../../lib/zhConvert";

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

export function PageHero({
  eyebrow,
  title,
  body,
  tone,
}: {
  eyebrow: string;
  title: string;
  body: string;
  tone: "red" | "blue" | "yellow" | "teal" | "orange";
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
  const { lang } = useLanguage();
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
            {lang === "en" ? "Demo reference: " : localizeDeep("示例參考：", lang)}
            <strong>{reference}</strong>
          </p>
        )}
      </div>
    </div>
  );
}

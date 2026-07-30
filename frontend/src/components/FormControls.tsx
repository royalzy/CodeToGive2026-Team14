import type { ReactNode } from "react";

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className={`field ${error ? "field-error" : ""}`}>
      <span className="field-label">{label}</span>
      {children}
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && <span className="field-message">{error}</span>}
    </label>
  );
}

export function ChoiceCard({
  children,
}: {
  children: ReactNode;
}) {
  return <label className="choice-card">{children}</label>;
}


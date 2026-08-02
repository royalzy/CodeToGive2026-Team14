import type { ReactNode } from "react";
import type { CauseId } from "../../api/client";

export type CauseChoice = {
  causeId: CauseId;
  label: string;
};

const causeDescriptions: Record<CauseId, string> = {
  where_needed_most: "We direct it to the most urgent verified need.",
  sports: "Coaching, equipment, accessible venues and movement.",
  dance: "Creative training, performance and confidence-building.",
  nutrition: "Dietitian-led support and practical healthy habits.",
  family_support: "Resources, transport and care for the whole family.",
};

const causeIcons: Record<CauseId, ReactNode> = {
  where_needed_most: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 2v3.2M12 18.8V22M2 12h3.2M18.8 12H22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  dance: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2.6l2.35 5.28 5.75.55-4.35 3.85 1.32 5.62L12 15l-5.07 2.9 1.32-5.62-4.35-3.85 5.75-.55L12 2.6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  sports: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 17l5-5.5L11.5 15 21 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 5h6v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  nutrition: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21c-4.5 0-8-4.2-8-8.6C4 8.4 6.7 6 9.6 6c1 0 1.9.3 2.4.8.5-.5 1.4-.8 2.4-.8 2.9 0 5.6 2.4 5.6 6.4C20 16.8 16.5 21 12 21z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M12 6.8C12 4.5 13.4 3 15.4 2.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  family_support: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="7.5" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3.2 19.4c.5-3 2.6-4.9 5.3-4.9s4.8 1.9 5.3 4.9M13.6 19.4c.4-2.3 1.9-3.8 4-3.8s3.5 1.4 3.9 3.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export function CauseSelector({
  choices,
  value,
  onChange,
}: {
  choices: CauseChoice[];
  value: CauseId;
  onChange: (causeId: CauseId) => void;
}) {
  return (
    <fieldset className="fieldset">
      <div className="cause-grid">
        {choices.map((choice) => (
          <label
            className={`cause-card cause-card--${choice.causeId}${choice.causeId === "where_needed_most" ? " cause-card--featured" : ""}`}
            key={choice.causeId}
          >
            <input
              type="radio"
              name="donation-cause"
              aria-label={choice.label}
              value={choice.causeId}
              checked={value === choice.causeId}
              onChange={() => onChange(choice.causeId)}
            />
            <span className="cause-card-icon">{causeIcons[choice.causeId]}</span>
            <span className="cause-card-copy">
              <strong>{choice.label}</strong>
              <small>{causeDescriptions[choice.causeId]}</small>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

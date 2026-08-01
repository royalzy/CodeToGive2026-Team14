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
      <legend>Choose where it helps</legend>
      <div className="cause-grid">
        {choices.map((choice) => (
          <label className="cause-card" key={choice.causeId}>
            <input
              type="radio"
              name="donation-cause"
              aria-label={choice.label}
              value={choice.causeId}
              checked={value === choice.causeId}
              onChange={() => onChange(choice.causeId)}
            />
            <span><strong>{choice.label}</strong><small>{causeDescriptions[choice.causeId]}</small></span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

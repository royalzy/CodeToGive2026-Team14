import type { CauseId } from "../../api/client";

export type CauseChoice = {
  causeId: CauseId;
  label: string;
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
      <legend>What kind of opportunity would you like to create?</legend>
      <div className="cause-grid">
        {choices.map((choice) => (
          <label className="cause-card" key={choice.causeId}>
            <input
              type="radio"
              name="donation-cause"
              value={choice.causeId}
              checked={value === choice.causeId}
              onChange={() => onChange(choice.causeId)}
            />
            <span>{choice.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

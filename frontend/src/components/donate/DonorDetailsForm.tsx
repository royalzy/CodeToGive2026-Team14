export type DonorDetails = {
  donorName: string;
  donorEmail: string;
  anonymous: boolean;
  consentToUpdates: boolean;
};

export type DonorDetailsErrors = Partial<
  Record<"donorEmail" | "donorName", string>
>;

export function DonorDetailsForm({
  value,
  errors,
  onChange,
}: {
  value: DonorDetails;
  errors: DonorDetailsErrors;
  onChange: (details: DonorDetails) => void;
}) {
  return (
    <>
      <div className="two-column-fields">
        <label className={`field ${errors.donorName ? "field-error" : ""}`}>
          <span className="field-label">Name (optional)</span>
          <input
            autoComplete="name"
            value={value.donorName}
            onChange={(event) =>
              onChange({ ...value, donorName: event.target.value })
            }
          />
          {errors.donorName && (
            <span className="field-message">{errors.donorName}</span>
          )}
        </label>
        <label className={`field ${errors.donorEmail ? "field-error" : ""}`}>
          <span className="field-label">Email (optional)</span>
          <input
            type="email"
            autoComplete="email"
            value={value.donorEmail}
            onChange={(event) =>
              onChange({ ...value, donorEmail: event.target.value })
            }
          />
          {errors.donorEmail && (
            <span className="field-message">{errors.donorEmail}</span>
          )}
        </label>
      </div>

      <label className="consent-row">
        <input
          type="checkbox"
          checked={value.anonymous}
          onChange={(event) =>
            onChange({ ...value, anonymous: event.target.checked })
          }
        />
        <span>I would prefer this prototype intention to be anonymous.</span>
      </label>

      <label className="consent-row">
        <input
          type="checkbox"
          checked={value.consentToUpdates}
          onChange={(event) =>
            onChange({ ...value, consentToUpdates: event.target.checked })
          }
        />
        <span>
          I would like occasional Love 21 updates. Prototype only — this
          preference is not saved and no updates will be sent.
        </span>
      </label>
    </>
  );
}

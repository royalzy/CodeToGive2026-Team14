export type DonorDetails = {
  donorName: string;
  donorEmail: string;
  donorNickname: string;
  donorPassword: string;
  profileMode: "existing" | "new";
  anonymous: boolean;
  consentToUpdates: boolean;
};

export type DonorDetailsErrors = Partial<
  Record<"donorEmail" | "donorName" | "donorNickname" | "donorPassword", string>
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
  function chooseAnonymous(anonymous: boolean) {
    onChange({
      ...value,
      anonymous,
      donorName: anonymous ? "" : value.donorName,
      donorEmail: anonymous ? "" : value.donorEmail,
      donorNickname: anonymous ? "" : value.donorNickname,
      donorPassword: anonymous ? "" : value.donorPassword,
      consentToUpdates: anonymous ? false : value.consentToUpdates,
    });
  }

  return (
    <>
      <fieldset className="donor-give-mode">
        <legend className="sr-only">Choose whether to use a donor profile</legend>
        <label>
          <input type="radio" name="give-mode" checked={!value.anonymous} onChange={() => chooseAnonymous(false)} />
          <span><strong>Give with my profile</strong><small>See receipts and long-term impact in one place.</small></span>
        </label>
        <label>
          <input type="radio" name="give-mode" checked={value.anonymous} onChange={() => chooseAnonymous(true)} />
          <span><strong>Give completely anonymously</strong><small>Continue with no profile, email or public name.</small></span>
        </label>
      </fieldset>

      {value.anonymous ? (
        <div className="anonymous-confirmation" role="status">Identity fields have been cleared. You can continue without creating or signing into a donor profile.</div>
      ) : (
        <>
          <fieldset className="donor-profile-mode">
            <legend>Profile details</legend>
            <label><input type="radio" name="profile-mode" checked={value.profileMode === "existing"} onChange={() => onChange({ ...value, profileMode: "existing", donorName: "", donorNickname: "" })} /><span><strong>I have a donor profile</strong><small>Sign in to keep receipts and impact records together.</small></span></label>
            <label><input type="radio" name="profile-mode" checked={value.profileMode === "new"} onChange={() => onChange({ ...value, profileMode: "new" })} /><span><strong>Create a donor profile</strong><small>Choose a public nickname before payment.</small></span></label>
          </fieldset>

          <div className="two-column-fields">
            <label className={`field ${errors.donorEmail ? "field-error" : ""}`}>
              <span className="field-label">Email</span>
              <input type="email" autoComplete="email" value={value.donorEmail} onChange={(event) => onChange({ ...value, donorEmail: event.target.value })} />
              {errors.donorEmail && <span className="field-message">{errors.donorEmail}</span>}
            </label>
            <label className={`field ${errors.donorPassword ? "field-error" : ""}`}>
              <span className="field-label">Password</span>
              <input type="password" autoComplete={value.profileMode === "new" ? "new-password" : "current-password"} value={value.donorPassword} onChange={(event) => onChange({ ...value, donorPassword: event.target.value })} />
              {errors.donorPassword && <span className="field-message">{errors.donorPassword}</span>}
            </label>
          </div>

          {value.profileMode === "new" && (
            <div className="two-column-fields">
              <label className={`field ${errors.donorNickname ? "field-error" : ""}`}>
                <span className="field-label">Unique nickname</span>
                <input autoComplete="nickname" value={value.donorNickname} onChange={(event) => onChange({ ...value, donorNickname: event.target.value })} />
                {errors.donorNickname && <span className="field-message">{errors.donorNickname}</span>}
              </label>
              <label className={`field ${errors.donorName ? "field-error" : ""}`}>
                <span className="field-label">Name (optional)</span>
                <input autoComplete="name" value={value.donorName} onChange={(event) => onChange({ ...value, donorName: event.target.value })} />
                {errors.donorName && <span className="field-message">{errors.donorName}</span>}
              </label>
            </div>
          )}

          <label className="consent-row">
            <input type="checkbox" checked={value.consentToUpdates} onChange={(event) => onChange({ ...value, consentToUpdates: event.target.checked })} />
            <span>I would like occasional Love 21 updates. Prototype only — this preference is not saved and no updates will be sent.</span>
          </label>
        </>
      )}
    </>
  );
}

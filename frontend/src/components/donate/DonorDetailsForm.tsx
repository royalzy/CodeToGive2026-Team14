export type DonorDetails = {
  donorName: string;
  donorEmail: string;
  donorNickname: string;
  donorPassword: string;
  profileMode: "existing" | "new";
  anonymous: boolean;
  wantsAnonymousReceipt: boolean;
  anonymousReceiptEmail: string;
  consentToUpdates: boolean;
};

export type DonorDetailsErrors = Partial<
  Record<"donorEmail" | "donorName" | "donorNickname" | "donorPassword" | "anonymousReceiptEmail", string>
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
        <>
          <div className="anonymous-confirmation" role="status">Your name, email and password won't be submitted. You can continue without creating or signing into a donor profile.</div>
          <label className="consent-row">
            <input
              type="checkbox"
              checked={value.wantsAnonymousReceipt}
              onChange={(event) =>
                onChange({
                  ...value,
                  wantsAnonymousReceipt: event.target.checked,
                  anonymousReceiptEmail: event.target.checked ? value.anonymousReceiptEmail : "",
                })
              }
            />
            <span><strong>Email me a receipt anyway</strong><small>Your name still won't be shared or shown anywhere. We only use this address to send a copy of your receipt.</small></span>
          </label>
          {value.wantsAnonymousReceipt && (
            <label className={`field ${errors.anonymousReceiptEmail ? "field-error" : ""}`}>
              <span className="field-label">Email for receipt</span>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={value.anonymousReceiptEmail}
                onChange={(event) => onChange({ ...value, anonymousReceiptEmail: event.target.value })}
              />
              {errors.anonymousReceiptEmail && <span className="field-message">{errors.anonymousReceiptEmail}</span>}
            </label>
          )}
        </>
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
              <input type="email" autoComplete="email" placeholder="you@example.com" value={value.donorEmail} onChange={(event) => onChange({ ...value, donorEmail: event.target.value })} />
              {errors.donorEmail && <span className="field-message">{errors.donorEmail}</span>}
            </label>
            <label className={`field ${errors.donorPassword ? "field-error" : ""}`}>
              <span className="field-label">Password</span>
              <input type="password" autoComplete={value.profileMode === "new" ? "new-password" : "current-password"} placeholder="At least 6 characters" value={value.donorPassword} onChange={(event) => onChange({ ...value, donorPassword: event.target.value })} />
              {errors.donorPassword && <span className="field-message">{errors.donorPassword}</span>}
            </label>
          </div>

          {value.profileMode === "new" && (
            <div className="two-column-fields">
              <label className={`field ${errors.donorNickname ? "field-error" : ""}`}>
                <span className="field-label">Unique nickname</span>
                <input autoComplete="nickname" placeholder="e.g. Alex_Chan" value={value.donorNickname} onChange={(event) => onChange({ ...value, donorNickname: event.target.value })} />
                {errors.donorNickname && <span className="field-message">{errors.donorNickname}</span>}
              </label>
              <label className={`field ${errors.donorName ? "field-error" : ""}`}>
                <span className="field-label">Name (optional)</span>
                <input autoComplete="name" placeholder="e.g. Alex Chan" value={value.donorName} onChange={(event) => onChange({ ...value, donorName: event.target.value })} />
                {errors.donorName && <span className="field-message">{errors.donorName}</span>}
              </label>
            </div>
          )}

          {value.profileMode === "new" && (
            <label className="consent-row">
              <input type="checkbox" checked={value.consentToUpdates} onChange={(event) => onChange({ ...value, consentToUpdates: event.target.checked })} />
              <span>I would like occasional Love 21 updates. This preference is saved to a new donor profile, but no updates are sent by this prototype.</span>
            </label>
          )}
        </>
      )}
    </>
  );
}

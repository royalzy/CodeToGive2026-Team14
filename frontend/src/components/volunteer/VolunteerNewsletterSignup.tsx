import { type FormEvent, useState } from "react";

import { Field } from "../FormControls";
import { trackVolunteerEvent } from "../../lib/volunteerAnalytics";

export function VolunteerNewsletterSignup({
  source,
  title = "Not ready to commit yet?",
  body = "Subscribe and we'll email you when new volunteer opportunities open up — no pressure to sign up today.",
}: {
  source: string;
  title?: string;
  body?: string;
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    setSubmitted(true);
    trackVolunteerEvent("newsletter_subscribed", { source });
  }

  return (
    <div className="volunteer-newsletter-card">
      <p className="eyebrow">Stay in the loop</p>
      <h3>{title}</h3>
      <p>{body}</p>
      {submitted ? (
        <p className="volunteer-newsletter-success" role="status">
          Thanks — this is a demo, so nothing was sent. In a live service you would now
          hear about future opportunities by email.
        </p>
      ) : (
        <form className="volunteer-newsletter-form" onSubmit={handleSubmit} noValidate>
          <Field label="Email" error={error ?? undefined}>
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(error)}
            />
          </Field>
          <button className="button button-dark" type="submit">
            Subscribe for updates
          </button>
        </form>
      )}
    </div>
  );
}

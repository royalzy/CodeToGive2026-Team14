import { type FormEvent, useState } from "react";

import { Field } from "../FormControls";
import { useLanguage } from "../../hooks/useLanguage";
import { localizeDeep } from "../../lib/zhConvert";
import { trackVolunteerEvent } from "../../lib/volunteerAnalytics";

const copy = {
  en: {
    eyebrow: "Stay in the loop",
    title: "Not ready to commit yet?",
    body: "Subscribe and we'll email you when new volunteer opportunities open up — no pressure to sign up today.",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    invalidEmail: "Enter a valid email address.",
    success:
      "Thanks — this is a demo, so nothing was sent. In a live service you would now hear about future opportunities by email.",
    submit: "Subscribe for updates",
  },
  zh: {
    eyebrow: "緊貼最新消息",
    title: "暫時未準備好參與？",
    body: "訂閱後，當有新的義工機會開放時，我們會電郵通知你——今天毋須立即報名。",
    emailLabel: "電郵",
    emailPlaceholder: "you@example.com",
    invalidEmail: "請輸入有效的電郵地址。",
    success: "多謝——這是示範功能，並未實際發送。在正式服務中，你將會收到未來機會的電郵通知。",
    submit: "訂閱最新消息",
  },
} as const;

export function VolunteerNewsletterSignup({
  source,
  title,
  body,
}: {
  source: string;
  title?: string;
  body?: string;
}) {
  const { lang } = useLanguage();
  const t = localizeDeep(copy[lang === "en" ? "en" : "zh"], lang);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t.invalidEmail);
      return;
    }
    setError(null);
    setSubmitted(true);
    trackVolunteerEvent("newsletter_subscribed", { source });
  }

  return (
    <div className="volunteer-newsletter-card">
      <p className="eyebrow">{t.eyebrow}</p>
      <h3>{title ?? t.title}</h3>
      <p>{body ?? t.body}</p>
      {submitted ? (
        <p className="volunteer-newsletter-success" role="status">
          {t.success}
        </p>
      ) : (
        <form className="volunteer-newsletter-form" onSubmit={handleSubmit} noValidate>
          <Field label={t.emailLabel} error={error ?? undefined}>
            <input
              type="email"
              autoComplete="email"
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(error)}
            />
          </Field>
          <button className="button button-dark" type="submit">
            {t.submit}
          </button>
        </form>
      )}
    </div>
  );
}

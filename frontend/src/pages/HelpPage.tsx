import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import { PageHero, SectionHeading, StatusPanel } from "../components/Cards";
import { Field } from "../components/FormControls";

const bookingSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().max(20).optional(),
  preferred: z.enum(["weekday", "weekend", "evening"], {
    error: "Please choose a time.",
  }),
  message: z.string().max(500, "Keep your message under 500 characters.").optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const supportOptions = [
  {
    title: "Book a support conversation",
    body: "Parents and carers can request a time to talk through concerns, next steps and available services.",
  },
  {
    title: "Find practical help",
    body: "Explore guidance on routines, communication, transitions and family wellbeing in a welcoming space.",
  },
  {
    title: "Join the community",
    body: "Meet other families, share wins and learn from peers who understand the everyday rhythm of support.",
  },
] as const;

const steps = [
  "Tell us what kind of support feels useful right now.",
  "We will connect you with the right programme, service or conversation.",
  "You can keep building confidence at your own pace and with your own rhythm.",
] as const;

export function HelpPage() {
  const [result, setResult] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { name: "", email: "", phone: "", preferred: undefined, message: "" },
  });

  function onSubmit() {
    setSubmitError(null);
    setResult(true);
  }
  return (
    <>
      <PageHero
        eyebrow="Support for families and carers"
        title="Support for families and carers"
        body="Love 21 offers practical guidance, warm connection and a clear path to support for parents, carers and families."
        tone="red"
      />

      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow="You are not alone"
            title="Ways we can help"
            body="Support is available in plain language, with space for questions, care and steady next steps."
          />
          <div className="help-grid">
            {supportOptions.map((option) => (
              <article key={option.title} className="support-card">
                <h3>{option.title}</h3>
                <p>{option.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="shell help-layout">
          <div>
            <SectionHeading
              eyebrow="Start here"
              title="A clear first step"
              body="Every family deserves a simple place to begin, ask questions and feel welcomed."
            />
            <ol className="resource-list">
              {steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
          <aside className="support-panel">
            <p className="eyebrow">Need a gentle next step?</p>
            <h3>Explore volunteering or learning resources</h3>
            <p>
              You can discover new ways to belong, support the community and grow alongside members.
            </p>
            <div className="button-row">
              <Link className="button button-dark" to="/volunteer">
                Explore volunteering
              </Link>
              <Link className="button button-outline" to="/resources">
                Browse resources
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="section form-section">
        <div className="shell form-layout">
          <aside className="form-aside">
            <p className="eyebrow">Book a conversation</p>
            <h2>Request support</h2>
            <p>
              Tell us a little about what you need. The Love 21 team would reach
              out to schedule a time that works for you.
            </p>
            <div className="privacy-note">
              <strong>Prototype privacy</strong>
              <p>
                Your details are validated for this demo, then discarded. They
                are not saved or sent to Love 21.
              </p>
            </div>
          </aside>

          <div className="form-card">
            {result ? (
              <StatusPanel
                title="Your support request has been received."
                tone="success"
              >
                <p>
                  In a live service, the Love 21 team would contact you within
                  two working days to arrange a conversation.
                </p>
                <Link className="button button-dark" to="/resources">
                  Browse resources while you wait
                </Link>
              </StatusPanel>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="form-heading">
                  <p>Support booking</p>
                  <h2>Tell us about your needs</h2>
                </div>

                {submitError && (
                  <div className="form-alert" role="alert">
                    {submitError}
                  </div>
                )}

                <div className="two-column-fields">
                  <Field label="Your name" error={errors.name?.message}>
                    <input autoComplete="name" {...register("name")} />
                  </Field>
                  <Field label="Email" error={errors.email?.message}>
                    <input type="email" autoComplete="email" {...register("email")} />
                  </Field>
                </div>

                <Field label="Phone (optional)" error={errors.phone?.message}>
                  <input type="tel" autoComplete="tel" {...register("phone")} />
                </Field>

                <Field label="Preferred time" error={errors.preferred?.message}>
                  <select defaultValue="" {...register("preferred")}>
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="weekday">Weekdays</option>
                    <option value="evening">Evenings</option>
                    <option value="weekend">Weekends</option>
                  </select>
                </Field>

                <Field
                  label="What would you like to discuss? (optional)"
                  error={errors.message?.message}
                  hint="Please do not include sensitive personal information."
                >
                  <textarea rows={4} {...register("message")} />
                </Field>

                <button
                  className="button button-dark button-full"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending…" : "Send request"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

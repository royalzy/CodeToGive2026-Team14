import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import { PageHero, SectionHeading, StatusPanel } from "../components/Cards";
import { Field } from "../components/FormControls";
import { SupportFinder } from "../components/help/SupportFinder";
import { type SupportAnswers } from "../content/support";

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

export function HelpPage() {
  const [result, setResult] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { name: "", email: "", phone: "", preferred: undefined, message: "" },
  });

  /**
   * Carry the finder's answers into the message box so nobody has to retype
   * what they just told us. Anything already typed is left alone.
   */
  function prefillMessage(_answers: SupportAnswers, summary: string) {
    if (getValues("message")?.trim()) return;
    setValue("message", summary);
  }

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
        <div className="shell help-finder">
          <SectionHeading
            eyebrow="You are not alone"
            title="Let us find a starting point together"
            body="Three short questions, no wrong answers."
          />
          <SupportFinder onComplete={prefillMessage} />
        </div>
      </section>

      {/* The support finder links here with #support-request. */}
      <section className="section form-section" id="support-request">
        <div className="shell form-layout">
          <aside className="form-aside">
            <p className="eyebrow">Book a conversation</p>
            <h2>Request support</h2>
            <p>
              Tell us a little about what you need. The Love 21 team would reach
              out to schedule a time that works for you.
            </p>
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

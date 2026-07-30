import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import {
  submitVolunteerApplication,
  type VolunteerApplicationResult,
} from "../api/client";
import { PageHero, StatusPanel } from "../components/Cards";
import { ChoiceCard, Field } from "../components/FormControls";
import { availabilityOptions, volunteerInterests } from "../content/en";

const volunteerSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  email: z.string().email("Enter a valid email address."),
  interests: z
    .array(z.enum(["sports", "community", "family_support", "nutrition", "enrichment"]))
    .min(1, "Choose at least one area."),
  availability: z.enum(["weekday", "evening", "weekend", "flexible"], {
    error: "Choose when you are usually available.",
  }),
  message: z.string().max(500, "Keep your message under 500 characters.").optional(),
  consent: z.boolean().refine((value) => value, {
    message: "Please confirm that Love 21 may contact you.",
  }),
});

type VolunteerFormData = z.infer<typeof volunteerSchema>;

export function VolunteerPage() {
  const [result, setResult] = useState<VolunteerApplicationResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: {
      name: "",
      email: "",
      interests: [],
      message: "",
      consent: false,
    },
  });

  async function onSubmit(data: VolunteerFormData) {
    setSubmitError(null);
    try {
      setResult(await submitVolunteerApplication(data));
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We could not submit the form. Please try again.",
      );
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Volunteer with Love 21"
        title="Come curious. Leave connected."
        body="You do not need to be an expert. Start with a shared activity, listen well and discover what members can teach you."
        tone="blue"
      />

      <section className="section volunteer-orientation">
        <div className="shell">
          <p className="eyebrow">Your path in</p>
          <div className="orientation-grid">
            <article>
              <span>01</span>
              <h2>Start with interest</h2>
              <p>Tell us what activities and kinds of connection energise you.</p>
            </article>
            <article>
              <span>02</span>
              <h2>Prepare together</h2>
              <p>Love 21 would introduce the role, expectations and people involved.</p>
            </article>
            <article>
              <span>03</span>
              <h2>Share the moment</h2>
              <p>Show up, participate and build trust through a real experience.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section form-section">
        <div className="shell form-layout">
          <aside className="form-aside">
            <p className="eyebrow">Expression of interest</p>
            <h2>Find where you fit</h2>
            <p>
              This short form helps you explore a starting point. It is not a
              confirmed volunteer placement.
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
                title="Your interest is ready to take the next step."
                reference={result.reference}
              >
                <p>
                  In a live service, the Love 21 team would review your interests
                  and contact you before confirming any activity.
                </p>
                <ul className="next-steps-list">
                  {result.next_steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
                <Link className="button button-dark" to="/impact">
                  Keep exploring impact
                </Link>
              </StatusPanel>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="form-heading">
                  <p>Step 1 of your volunteer journey</p>
                  <h2>Tell us about you</h2>
                </div>

                {submitError && (
                  <div className="form-alert" role="alert">
                    {submitError}
                  </div>
                )}

                <div className="two-column-fields">
                  <Field label="Name" error={errors.name?.message}>
                    <input
                      autoComplete="name"
                      {...register("name")}
                      aria-invalid={Boolean(errors.name)}
                    />
                  </Field>
                  <Field label="Email" error={errors.email?.message}>
                    <input
                      type="email"
                      autoComplete="email"
                      {...register("email")}
                      aria-invalid={Boolean(errors.email)}
                    />
                  </Field>
                </div>

                <fieldset className="fieldset">
                  <legend>What would you like to explore?</legend>
                  <p className="field-hint">Choose one or more areas.</p>
                  <div className="choice-grid">
                    {volunteerInterests.map((interest) => (
                      <ChoiceCard key={interest.value}>
                        <input
                          type="checkbox"
                          value={interest.value}
                          {...register("interests")}
                        />
                        <span>{interest.label}</span>
                      </ChoiceCard>
                    ))}
                  </div>
                  {errors.interests && (
                    <p className="field-message">{errors.interests.message}</p>
                  )}
                </fieldset>

                <Field
                  label="When are you usually available?"
                  error={errors.availability?.message}
                >
                  <select defaultValue="" {...register("availability")}>
                    <option value="" disabled>
                      Select an option
                    </option>
                    {availabilityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="What draws you to Love 21? (optional)"
                  error={errors.message?.message}
                  hint="Please do not include sensitive personal information."
                >
                  <textarea rows={4} {...register("message")} />
                </Field>

                <label className="consent-row">
                  <input type="checkbox" {...register("consent")} />
                  <span>
                    In a live service, I would allow Love 21 to contact me about
                    volunteering.
                  </span>
                </label>
                {errors.consent && (
                  <p className="field-message">{errors.consent.message}</p>
                )}

                <button
                  className="button button-dark button-full"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting…" : "Submit demo interest"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}


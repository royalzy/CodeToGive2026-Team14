import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";

import {
  submitVolunteerApplication,
  type VolunteerApplication,
} from "../api/client";
import { track, trackFormStarted } from "../analytics/umami";
import { PageHero, StatusPanel } from "../components/Cards";
import { ChoiceCard, Field } from "../components/FormControls";
import {
  getVolunteerRole,
  getVolunteerSession,
  type VolunteerFirstStep,
} from "../content/volunteer";
import { trackVolunteerEvent } from "../lib/volunteerAnalytics";
import type { VolunteerConfirmationState } from "../lib/volunteerConfirmation";

const applicationSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  email: z.string().email("Enter a valid email address."),
  firstStep: z.enum(["observe", "trial", "interest_only"]),
  consent: z.boolean().refine((value) => value, {
    message: "Confirm that this is a demonstration submission.",
  }),
});

type VolunteerApplicationFormData = z.infer<typeof applicationSchema>;

export function VolunteerApplicationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const role = getVolunteerRole(searchParams.get("roleId"));
  const sessionId = searchParams.get("sessionId");
  const session = sessionId ? getVolunteerSession(sessionId) : undefined;
  const journeyPath = searchParams.get("journey") === "guided" ? "guided" : "quick";
  const requestedFirstStep = searchParams.get("firstStep");
  const defaultFirstStep: VolunteerFirstStep = session
    ? requestedFirstStep === "observe"
      ? "observe"
      : "trial"
    : requestedFirstStep === "observe" || requestedFirstStep === "trial"
      ? requestedFirstStep
      : "interest_only";
  const invalidSelection =
    !role ||
    Boolean(sessionId && !session) ||
    Boolean(session && session.roleId !== role.id);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VolunteerApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "",
      email: "",
      firstStep: defaultFirstStep,
      consent: false,
    },
  });

  useEffect(() => {
    if (role && !invalidSelection) {
      trackVolunteerEvent("volunteer_application_started", {
        journey_path: journeyPath,
        role_id: role.id,
        session_id: session?.id,
      });
    }
  }, [invalidSelection, journeyPath, role, session]);

  if (invalidSelection || !role) {
    return (
      <section className="section">
        <div className="shell narrow-shell">
          <h1 className="sr-only">Volunteer selection unavailable</h1>
          <StatusPanel title="Choose a valid role or demo session first." tone="notice">
            <p>
              Personal information is only requested after you have chosen a
              realistic first step.
            </p>
            <Link className="button button-dark" to="/volunteer/roles">
              Choose a role
            </Link>
          </StatusPanel>
        </div>
      </section>
    );
  }

  const selectedRole = role;

  async function onSubmit(data: VolunteerApplicationFormData) {
    setSubmitError(null);
    const payload: VolunteerApplication = {
      name: data.name,
      email: data.email,
      role_id: selectedRole.id,
      session_id: session?.id ?? null,
      first_step: data.firstStep,
      consent: data.consent,
    };
    try {
      const result = await submitVolunteerApplication(payload);
      trackVolunteerEvent("volunteer_application_submitted", {
        journey_path: journeyPath,
        role_id: selectedRole.id,
        session_id: session?.id,
        application_status: result.status,
      });
      track("volunteer_application", {
        role_id: selectedRole.id,
        journey_path: journeyPath,
        first_step: data.firstStep,
      });
      const state: VolunteerConfirmationState = {
        result,
        firstStep: data.firstStep,
      };
      navigate("/volunteer/confirmed", { state });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We could not submit the demo request. Please try again.",
      );
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Demo expression of interest"
        title="Share details only after choosing a first step."
        body="This prototype validates your answers and immediately discards them. Nothing is saved or sent to Love 21."
        tone="yellow"
      />
      <section className="section form-section">
        <div className="shell form-layout">
          <aside className="form-aside">
            <p className="eyebrow">Your selection</p>
            <h2>{selectedRole.title}</h2>
            {session ? (
              <div className="application-selection-card">
                <div className="demo-badge">Demo session</div>
                <strong>{session.title}</strong>
                <p>
                  {session.dateLabel}
                  <br />
                  {session.timeLabel}
                </p>
              </div>
            ) : (
              <p>No session selected. This will record a demo interest only.</p>
            )}
            <div className="privacy-note">
              <strong>Prototype privacy</strong>
              <p>
                Details are transmitted to the local demo API for validation, then
                discarded. Do not enter sensitive information.
              </p>
            </div>
          </aside>

          <div className="form-card">
            <form
              onSubmit={handleSubmit(onSubmit)}
              onFocusCapture={() => trackFormStarted("volunteer")}
              noValidate
            >
              <div className="form-heading">
                <p>Final demo step</p>
                <h2>Confirm your first step</h2>
              </div>
              {submitError && (
                <div className="form-alert" role="alert">
                  {submitError} Your entries are still here, so you can retry.
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
                <legend>How would you like to begin?</legend>
                <div className="choice-grid">
                  <ChoiceCard>
                    <input
                      type="radio"
                      value="observe"
                      {...register("firstStep")}
                      onClick={() =>
                        trackVolunteerEvent("first_step_selected", {
                          journey_path: journeyPath,
                          role_id: selectedRole.id,
                          session_id: session?.id,
                        })
                      }
                    />
                    <span>Observe first</span>
                  </ChoiceCard>
                  <ChoiceCard>
                    <input
                      type="radio"
                      value="trial"
                      {...register("firstStep")}
                      onClick={() =>
                        trackVolunteerEvent("first_step_selected", {
                          journey_path: journeyPath,
                          role_id: selectedRole.id,
                          session_id: session?.id,
                        })
                      }
                    />
                    <span>Try once</span>
                  </ChoiceCard>
                  {!session && (
                    <ChoiceCard>
                      <input
                        type="radio"
                        value="interest_only"
                        {...register("firstStep")}
                        onClick={() =>
                          trackVolunteerEvent("first_step_selected", {
                            journey_path: journeyPath,
                            role_id: selectedRole.id,
                          })
                        }
                      />
                      <span>Register interest only</span>
                    </ChoiceCard>
                  )}
                </div>
              </fieldset>

              <label className="consent-row">
                <input type="checkbox" {...register("consent")} />
                <span>
                  I understand this is a demonstration. Nothing will be saved,
                  sent to Love 21 or confirmed as a booking.
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
                {isSubmitting ? "Submitting…" : "Submit demo request"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

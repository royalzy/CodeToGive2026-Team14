import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";

import {
  submitVolunteerApplication,
  type VolunteerApplication,
} from "../api/client";
import { track, trackFormStarted } from "../analytics/umami";
import { StatusPanel } from "../components/Cards";
import { ChoiceCard, Field } from "../components/FormControls";
import {
  getVolunteerRole,
  getVolunteerSession,
  localizeVolunteerRole,
  localizeVolunteerSession,
  type VolunteerFirstStep,
} from "../content/volunteer";
import { useLanguage } from "../hooks/useLanguage";
import type { Lang } from "../content/languageContextValue";
import { localizeDeep } from "../lib/zhConvert";
import { trackVolunteerEvent } from "../lib/volunteerAnalytics";
import type { VolunteerConfirmationState } from "../lib/volunteerConfirmation";

const pageCopy = {
  en: {
    unavailableHeading: "Volunteer selection unavailable",
    unavailableTitle: "Choose a valid role or demo session first.",
    unavailableBody:
      "Personal information is only requested after you have chosen a realistic first step.",
    chooseRole: "Choose a role",
    applicationForPrefix: "Volunteer application for",
    applicationForSuffix: "",
    demoBadge: "Demo session",
    noSession: "No session selected. This will record a demo interest only.",
    privacyLabel: "Prototype privacy",
    privacyBody:
      "Details are transmitted to the local demo API for validation, then discarded. Do not enter sensitive information.",
    finalStep: "Final demo step",
    confirmStep: "Confirm your first step",
    retryHint: "Your entries are still here, so you can retry.",
    nameLabel: "Name",
    emailLabel: "Email",
    beginLegend: "How would you like to begin?",
    observeFirst: "Observe first",
    tryOnce: "Try once",
    interestOnly: "Register interest only",
    consentText:
      "I understand this is a demonstration. Nothing will be saved, sent to Love 21 or confirmed as a booking.",
    submitting: "Submitting…",
    submit: "Submit demo request",
    genericSubmitError: "We could not submit the demo request. Please try again.",
    nameRequired: "Please enter your name.",
    emailInvalid: "Enter a valid email address.",
    consentRequired: "Confirm that this is a demonstration submission.",
  },
  zh: {
    unavailableHeading: "義工報名資料暫時無法瀏覽",
    unavailableTitle: "請先選擇有效的職位或示範活動。",
    unavailableBody: "只有在你選擇一個實在的第一步後，我們才會要求你提供個人資料。",
    chooseRole: "選擇職位",
    applicationForPrefix: "",
    applicationForSuffix: "義工報名",
    demoBadge: "示範活動",
    noSession: "尚未選擇活動，這將只會記錄示範興趣。",
    privacyLabel: "原型私隱聲明",
    privacyBody: "資料只會傳送至本地示範 API 作驗證，其後即會刪除。請勿輸入敏感資料。",
    finalStep: "示範最後一步",
    confirmStep: "確認你的第一步",
    retryHint: "你輸入的資料仍然保留，可以重試提交。",
    nameLabel: "姓名",
    emailLabel: "電郵",
    beginLegend: "你希望如何開始？",
    observeFirst: "先觀察",
    tryOnce: "嘗試一次",
    interestOnly: "只登記興趣",
    consentText: "我明白這只是示範。資料不會被儲存、傳送給 Love 21，也不會確認為預約。",
    submitting: "提交中……",
    submit: "提交示範申請",
    genericSubmitError: "未能提交示範申請，請再試一次。",
    nameRequired: "請輸入你的姓名。",
    emailInvalid: "請輸入有效的電郵地址。",
    consentRequired: "請確認這是示範提交。",
  },
} as const;

function buildApplicationSchema(lang: Lang) {
  const copy = localizeDeep(pageCopy[lang === "en" ? "en" : "zh"], lang);
  return z.object({
    name: z.string().trim().min(2, copy.nameRequired).max(80),
    email: z.string().email(copy.emailInvalid),
    firstStep: z.enum(["observe", "trial", "interest_only"]),
    consent: z.boolean().refine((value) => value, {
      message: copy.consentRequired,
    }),
  });
}

type VolunteerApplicationFormData = z.infer<ReturnType<typeof buildApplicationSchema>>;

export function VolunteerApplicationPage() {
  const { lang } = useLanguage();
  const copy = localizeDeep(pageCopy[lang === "en" ? "en" : "zh"], lang);
  const applicationSchema = useMemo(() => buildApplicationSchema(lang), [lang]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const baseRole = getVolunteerRole(searchParams.get("roleId"));
  const role = baseRole ? localizeDeep(localizeVolunteerRole(baseRole, lang), lang) : undefined;
  const sessionId = searchParams.get("sessionId");
  const baseSession = sessionId ? getVolunteerSession(sessionId) : undefined;
  const session = baseSession
    ? localizeDeep(localizeVolunteerSession(baseSession, lang), lang)
    : undefined;
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
          <h1 className="sr-only">{copy.unavailableHeading}</h1>
          <StatusPanel title={copy.unavailableTitle} tone="notice">
            <p>{copy.unavailableBody}</p>
            <Link className="button button-dark" to="/volunteer/roles">
              {copy.chooseRole}
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
        error instanceof Error ? error.message : copy.genericSubmitError,
      );
    }
  }

  return (
    <>
      <section className="section form-section volunteer-application-section">
        <h1 className="sr-only">
          {[copy.applicationForPrefix, selectedRole.title, copy.applicationForSuffix]
            .filter(Boolean)
            .join(" ")}
        </h1>
        <div className="shell form-layout">
          <aside className="form-aside">
            <h2>{selectedRole.title}</h2>
            {session ? (
              <div className="application-selection-card">
                <div className="demo-badge">{copy.demoBadge}</div>
                <strong>{session.title}</strong>
                <p>
                  {session.dateLabel}
                  <br />
                  {session.timeLabel}
                </p>
              </div>
            ) : (
              <p>{copy.noSession}</p>
            )}
            <div className="privacy-note">
              <strong>{copy.privacyLabel}</strong>
              <p>{copy.privacyBody}</p>
            </div>
          </aside>

          <div className="form-card">
            <form
              onSubmit={handleSubmit(onSubmit)}
              onFocusCapture={() => trackFormStarted("volunteer")}
              noValidate
            >
              <div className="form-heading">
                <p>{copy.finalStep}</p>
                <h2>{copy.confirmStep}</h2>
              </div>
              {submitError && (
                <div className="form-alert" role="alert">
                  {submitError} {copy.retryHint}
                </div>
              )}
              <div className="two-column-fields">
                <Field label={copy.nameLabel} error={errors.name?.message}>
                  <input
                    autoComplete="name"
                    {...register("name")}
                    aria-invalid={Boolean(errors.name)}
                  />
                </Field>
                <Field label={copy.emailLabel} error={errors.email?.message}>
                  <input
                    type="email"
                    autoComplete="email"
                    {...register("email")}
                    aria-invalid={Boolean(errors.email)}
                  />
                </Field>
              </div>

              <fieldset className="fieldset">
                <legend>{copy.beginLegend}</legend>
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
                    <span>{copy.observeFirst}</span>
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
                    <span>{copy.tryOnce}</span>
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
                      <span>{copy.interestOnly}</span>
                    </ChoiceCard>
                  )}
                </div>
              </fieldset>

              <label className="consent-row">
                <input type="checkbox" {...register("consent")} />
                <span>{copy.consentText}</span>
              </label>
              {errors.consent && (
                <p className="field-message">{errors.consent.message}</p>
              )}

              <button
                className="button button-dark button-full"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? copy.submitting : copy.submit}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

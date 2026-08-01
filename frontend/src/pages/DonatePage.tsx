import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";

import {
  createDonationIntent,
  getDonationImpactOptions,
  previewDonationImpact,
  type CauseId,
  type DonationIntentResult,
  type ImpactPreview,
} from "../api/client";
import { track, trackFormStarted } from "../analytics/umami";
import {
  getAmountBucket,
  trackDonationEvent,
} from "../analytics";
import { PageHero } from "../components/Cards";
import { AmountSelector } from "../components/donate/AmountSelector";
import {
  CauseSelector,
  type CauseChoice,
} from "../components/donate/CauseSelector";
import { DonationReview } from "../components/donate/DonationReview";
import {
  DonorDetailsForm,
  type DonorDetails,
  type DonorDetailsErrors,
} from "../components/donate/DonorDetailsForm";
import { DonationSuccess } from "../components/donate/DonationSuccess";
import {
  ImpactCard,
  type PreviewStatus,
} from "../components/donate/ImpactCard";
import {
  donationPrograms,
  getDonationImpactMessage,
} from "../content/donations";

type FormStep = "donation" | "details" | "review" | "success";

const fallbackPresets = [200, 400, 600, 1000];
const fallbackChoices: CauseChoice[] = donationPrograms.map((program) => ({
  causeId: program.value,
  label: program.label,
}));

const initialDetails: DonorDetails = {
  donorName: "",
  donorEmail: "",
  anonymous: false,
  consentToUpdates: false,
};

const stepLabels: Array<{ id: FormStep; label: string }> = [
  { id: "donation", label: "Donation" },
  { id: "details", label: "Details" },
  { id: "review", label: "Review" },
  { id: "success", label: "Success" },
];

function isValidAmount(amount: number): boolean {
  return Number.isInteger(amount) && amount >= 10 && amount <= 1_000_000;
}

function validateDetails(details: DonorDetails): DonorDetailsErrors {
  const errors: DonorDetailsErrors = {};
  const name = details.donorName.trim();
  const email = details.donorEmail.trim();

  if (name.length > 100) {
    errors.donorName = "Keep the name to 100 characters or fewer.";
  }
  if (email && !z.string().email().safeParse(email).success) {
    errors.donorEmail = "Enter a valid email address.";
  } else if (details.consentToUpdates && !email) {
    errors.donorEmail =
      "Enter an email to express an updates preference in this prototype.";
  }
  return errors;
}

function isAbortError(error: unknown): boolean {
  return (
    (error instanceof DOMException && error.name === "AbortError") ||
    (error instanceof Error && error.name === "AbortError")
  );
}

export function DonatePage() {
  const [step, setStep] = useState<FormStep>("donation");
  const [causeId, setCauseId] = useState<CauseId>("where_needed_most");
  const [amountInput, setAmountInput] = useState("400");
  const [presets, setPresets] = useState<number[]>(fallbackPresets);
  const [causeChoices, setCauseChoices] =
    useState<CauseChoice[]>(fallbackChoices);
  const [optionsNotice, setOptionsNotice] = useState<string | null>(null);
  const [preview, setPreview] = useState<ImpactPreview | null>(null);
  const [previewStatus, setPreviewStatus] =
    useState<PreviewStatus>("idle");
  const [details, setDetails] = useState<DonorDetails>(initialDetails);
  const [detailsErrors, setDetailsErrors] =
    useState<DonorDetailsErrors>({});
  const [amountError, setAmountError] = useState<string | undefined>();
  const [result, setResult] = useState<DonationIntentResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestSequence = useRef(0);
  const pageViewTracked = useRef(false);
  const detailsStartedTracked = useRef(false);
  const causeTouched = useRef(false);
  const flowPanelRef = useRef<HTMLDivElement>(null);
  const hasRenderedStep = useRef(false);

  const amountHkd = Number(amountInput);
  const selectedCauseLabel =
    causeChoices.find((choice) => choice.causeId === causeId)?.label ??
    "Love 21";
  const displayedImpact = result?.impact ?? preview;
  const impactMessage = useMemo(
    () => getDonationImpactMessage(preview),
    [preview],
  );

  useEffect(() => {
    if (!pageViewTracked.current) {
      pageViewTracked.current = true;
      trackDonationEvent("donate_page_viewed");
    }
  }, []);

  useEffect(() => {
    if (hasRenderedStep.current) {
      flowPanelRef.current?.focus();
    } else {
      hasRenderedStep.current = true;
    }
  }, [step]);

  useEffect(() => {
    const controller = new AbortController();

    getDonationImpactOptions(controller.signal)
      .then((options) => {
        setPresets(options.preset_amounts_hkd);
        setCauseChoices(
          options.causes.map((cause) => ({
            causeId: cause.cause_id,
            label:
              donationPrograms.find(
                (program) => program.value === cause.cause_id,
              )?.label ?? cause.cause_id,
          })),
        );
        if (!causeTouched.current) {
          setCauseId(options.default_cause_id);
        }
        setOptionsNotice(null);
      })
      .catch((error: unknown) => {
        if (!isAbortError(error)) {
          setOptionsNotice(
            "Live choices are temporarily unavailable. Safe prototype defaults are shown.",
          );
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const sequence = ++requestSequence.current;

    if (!isValidAmount(amountHkd)) {
      setPreview(null);
      setPreviewStatus("idle");
      return;
    }

    const controller = new AbortController();
    setPreview(null);
    setPreviewStatus("loading");

    const timer = window.setTimeout(() => {
      previewDonationImpact(
        { cause_id: causeId, amount_hkd: amountHkd },
        controller.signal,
      )
        .then((nextPreview) => {
          if (requestSequence.current !== sequence) return;
          setPreview(nextPreview);
          setPreviewStatus("success");
          trackDonationEvent("impact_preview_displayed", {
            cause_id: nextPreview.cause_id,
            amount_bucket: getAmountBucket(nextPreview.amount_hkd),
            impact_mode: nextPreview.mode,
          });
        })
        .catch((error: unknown) => {
          if (isAbortError(error) || requestSequence.current !== sequence) {
            return;
          }
          setPreview(null);
          setPreviewStatus("error");
        });
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [amountHkd, causeId]);

  function selectCause(nextCauseId: CauseId) {
    causeTouched.current = true;
    setCauseId(nextCauseId);
    trackDonationEvent("donation_cause_selected", {
      cause_id: nextCauseId,
      amount_bucket: isValidAmount(amountHkd)
        ? getAmountBucket(amountHkd)
        : undefined,
    });
  }

  function selectPreset(nextAmount: number) {
    setAmountInput(String(nextAmount));
    setAmountError(undefined);
    trackDonationEvent("donation_amount_selected", {
      cause_id: causeId,
      amount_bucket: getAmountBucket(nextAmount),
    });
  }

  function confirmCustomAmount() {
    if (!isValidAmount(amountHkd)) return;
    trackDonationEvent("donation_amount_selected", {
      cause_id: causeId,
      amount_bucket: getAmountBucket(amountHkd),
    });
  }

  function continueToDetails() {
    if (!isValidAmount(amountHkd)) {
      setAmountError(
        "Enter a whole HKD amount between HK$10 and HK$1,000,000.",
      );
      return;
    }
    setAmountError(undefined);
    if (!detailsStartedTracked.current) {
      detailsStartedTracked.current = true;
      trackDonationEvent("donation_details_started", {
        cause_id: causeId,
        amount_bucket: getAmountBucket(amountHkd),
        impact_mode: preview?.mode,
      });
    }
    setStep("details");
  }

  function continueToReview() {
    const errors = validateDetails(details);
    setDetailsErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setStep("review");
  }

  async function submitDonationIntent() {
    setSubmitError(null);
    setIsSubmitting(true);
    trackDonationEvent("donation_intent_submitted", {
      cause_id: causeId,
      amount_bucket: getAmountBucket(amountHkd),
      impact_mode: preview?.mode,
    });

    try {
      const nextResult = await createDonationIntent({
        cause_id: causeId,
        amount_hkd: amountHkd,
        anonymous: details.anonymous,
        donor_name: details.donorName.trim() || null,
        donor_email: details.donorEmail.trim() || null,
        consent_to_updates: details.consentToUpdates,
      });
      setResult(nextResult);
      setStep("success");
      trackDonationEvent("donation_success_displayed", {
        cause_id: nextResult.impact.cause_id,
        amount_bucket: getAmountBucket(nextResult.impact.amount_hkd),
        impact_mode: nextResult.impact.mode,
      });
      track("donation_intent", {
        program: causeId,
        amount: amountHkd,
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We could not confirm the prototype donation. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Meaningful giving"
        title="What kind of opportunity would you like to create?"
        body="Choose a direction and see how your gift could become another chance to move, grow, connect and shine."
        tone="yellow"
      />

      <section className="section donation-experience-section">
        <div className="shell">
          <ol className="donation-steps" aria-label="Donation progress">
            {stepLabels.map((item, index) => {
              const currentIndex = stepLabels.findIndex(
                (candidate) => candidate.id === step,
              );
              return (
                <li
                  key={item.id}
                  className={
                    index === currentIndex
                      ? "current"
                      : index < currentIndex
                        ? "complete"
                        : ""
                  }
                  aria-current={index === currentIndex ? "step" : undefined}
                >
                  <span>{index + 1}</span>
                  {item.label}
                </li>
              );
            })}
          </ol>

          <div className="donation-workspace">
            <div
              className="donation-flow-card"
              ref={flowPanelRef}
              tabIndex={-1}
              onFocusCapture={() => trackFormStarted("donation")}
            >
              <div className="simulation-banner" role="note">
                Hackathon simulation — no payment is taken and no personal
                information is stored.
              </div>

              {optionsNotice && (
                <div className="form-alert form-notice" role="status">
                  {optionsNotice}
                </div>
              )}

              {step === "donation" && (
                <>
                  <div className="form-heading">
                    <p>Step 1 of 3</p>
                    <h2>Choose the possibility</h2>
                  </div>
                  <CauseSelector
                    choices={causeChoices}
                    value={causeId}
                    onChange={selectCause}
                  />
                  <AmountSelector
                    presets={presets}
                    amount={amountInput}
                    error={amountError}
                    onPreset={selectPreset}
                    onChange={(value) => {
                      setAmountInput(value);
                      setAmountError(undefined);
                    }}
                    onCustomAmountConfirmed={confirmCustomAmount}
                  />
                  <button
                    className="button button-dark button-full"
                    type="button"
                    onClick={continueToDetails}
                  >
                    Continue to your details
                  </button>
                </>
              )}

              {step === "details" && (
                <>
                  <div className="form-heading">
                    <p>Step 2 of 3</p>
                    <h2>Tell us how to thank you</h2>
                  </div>
                  <DonorDetailsForm
                    value={details}
                    errors={detailsErrors}
                    onChange={(nextDetails) => {
                      setDetails(nextDetails);
                      setDetailsErrors({});
                    }}
                  />
                  <div className="button-row">
                    <button
                      className="button button-outline"
                      type="button"
                      onClick={() => setStep("donation")}
                    >
                      Back
                    </button>
                    <button
                      className="button button-dark"
                      type="button"
                      onClick={continueToReview}
                    >
                      Review your intention
                    </button>
                  </div>
                </>
              )}

              {step === "review" && (
                <>
                  <div className="form-heading">
                    <p>Step 3 of 3</p>
                    <h2>Review your prototype donation</h2>
                  </div>
                  {submitError && (
                    <div className="form-alert" role="alert">
                      {submitError}
                    </div>
                  )}
                  <DonationReview
                    amountHkd={amountHkd}
                    causeLabel={selectedCauseLabel}
                    donorName={details.donorName}
                    anonymous={details.anonymous}
                    impactMessage={impactMessage}
                  />
                  <p className="form-footnote review-footnote">
                    This confirms a prototype intention only. No money will be
                    charged.
                  </p>
                  <div className="button-row">
                    <button
                      className="button button-outline"
                      type="button"
                      onClick={() => setStep("details")}
                      disabled={isSubmitting}
                    >
                      Back
                    </button>
                    <button
                      className="button button-dark"
                      type="button"
                      onClick={submitDonationIntent}
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Confirming…"
                        : `Confirm prototype donation of HK$${amountHkd.toLocaleString("en-HK")}`}
                    </button>
                  </div>
                </>
              )}

              {step === "success" && result && (
                <DonationSuccess
                  result={result}
                  donorName={details.donorName}
                  anonymous={details.anonymous}
                  onStayInvolved={() =>
                    trackDonationEvent("stay_involved_clicked", {
                      cause_id: result.impact.cause_id,
                      amount_bucket: getAmountBucket(
                        result.impact.amount_hkd,
                      ),
                      impact_mode: result.impact.mode,
                    })
                  }
                />
              )}
            </div>

            <aside className="donation-impact-column">
              <ImpactCard
                amountHkd={result?.impact.amount_hkd ?? amountHkd}
                impact={displayedImpact}
                status={result ? "success" : previewStatus}
              />
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

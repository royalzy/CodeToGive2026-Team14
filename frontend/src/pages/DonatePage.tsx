import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";

import {
  createDonationIntent,
  getDonationImpactOptions,
  previewDonationImpact,
  type CauseId,
  type DonationIntentResult,
  type ImpactPreview,
} from "../api/client";
import {
  getAmountBucket,
  trackDonationEvent,
} from "../analytics";
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

type FormStep = "donation" | "review" | "success";

const fallbackPresets = [200, 400, 600, 1000];
const fallbackChoices: CauseChoice[] = donationPrograms.map((program) => ({
  causeId: program.value,
  label: program.label,
}));

const initialDetails: DonorDetails = {
  donorName: "",
  donorEmail: "",
  donorNickname: "",
  donorPassword: "",
  profileMode: "existing",
  anonymous: false,
  consentToUpdates: false,
};

const stepLabels: Array<{ id: FormStep; label: string }> = [
  { id: "donation", label: "Your gift" },
  { id: "review", label: "Review" },
  { id: "success", label: "Complete" },
];

const transparencyRows = [
  {
    label: "Direct programmes & coaching",
    percentage: 62,
    detail: "1,860 coaching hours for 126 young people, plus 48 family support sessions.",
  },
  {
    label: "Employment & life-skills",
    percentage: 21,
    detail: "32 paid work placements; 24 participants moved into sustained employment.",
  },
  {
    label: "Programme staff & safeguarding",
    percentage: 12,
    detail: "Two case workers, background checks, training and participant transport support.",
  },
  {
    label: "Operations & payment fees",
    percentage: 5,
    detail: "Rent, accounting, audit and card fees. Nothing hidden inside programme costs.",
  },
] as const;

function isValidAmount(amount: number): boolean {
  return Number.isInteger(amount) && amount >= 10 && amount <= 1_000_000;
}

function validateDetails(details: DonorDetails): DonorDetailsErrors {
  const errors: DonorDetailsErrors = {};
  const name = details.donorName.trim();
  const email = details.donorEmail.trim();

  if (details.anonymous) return errors;

  if (name.length > 100) {
    errors.donorName = "Keep the name to 100 characters or fewer.";
  }
  if (!email) {
    errors.donorEmail = "Enter the email for your donor profile.";
  } else if (!z.string().email().safeParse(email).success) {
    errors.donorEmail = "Enter a valid email address.";
  }
  if (details.donorPassword.length < 6) {
    errors.donorPassword = "Use at least 6 characters for this prototype.";
  }
  if (details.profileMode === "new") {
    const nickname = details.donorNickname.trim();
    if (!nickname) {
      errors.donorNickname = "Choose a nickname for your donor profile.";
    } else if (nickname.length > 40) {
      errors.donorNickname = "Keep the nickname to 40 characters or fewer.";
    }
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
  const impactMessage = useMemo(
    () => getDonationImpactMessage(preview),
    [preview],
  );
  const donorDisplayName =
    details.donorNickname.trim() || details.donorName.trim();

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

  function continueToReview() {
    if (!isValidAmount(amountHkd)) {
      setAmountError(
        "Enter a whole HKD amount between HK$10 and HK$1,000,000.",
      );
      return;
    }
    setAmountError(undefined);
    const errors = validateDetails(details);
    setDetailsErrors(errors);
    if (Object.keys(errors).length > 0) return;
    if (!detailsStartedTracked.current) {
      detailsStartedTracked.current = true;
      trackDonationEvent("donation_details_started", {
        cause_id: causeId,
        amount_bucket: getAmountBucket(amountHkd),
        impact_mode: preview?.mode,
      });
    }
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
        donor_name: details.anonymous ? null : donorDisplayName || null,
        donor_email: details.anonymous ? null : details.donorEmail.trim() || null,
        consent_to_updates: details.anonymous ? false : details.consentToUpdates,
      });
      setResult(nextResult);
      setDetails((current) => ({ ...current, donorPassword: "" }));
      setStep("success");
      trackDonationEvent("donation_success_displayed", {
        cause_id: nextResult.impact.cause_id,
        amount_bucket: getAmountBucket(nextResult.impact.amount_hkd),
        impact_mode: nextResult.impact.mode,
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
    <div className="donate-a-page">
      <div className="donate-a-content">
        <div className="donate-a-main">
          <article className="donate-a-transparency" aria-labelledby="donation-transparency-title">
            <p className="donor-community-eyebrow">Jan–Jun 2026 · independently reviewed</p>
            <h1 id="donation-transparency-title">HK$3.28m received.<br />HK$2.91m put to work.</h1>
            <p>The remaining HK$370k is committed to programmes already scheduled for August–October.</p>
            <div className="donate-a-allocation">
              {transparencyRows.map((item) => (
                <div className="donate-a-allocation-row" key={item.label}>
                  <div><strong>{item.label}</strong><strong>{item.percentage}%</strong></div>
                  <i aria-hidden="true"><b style={{ width: `${item.percentage}%` }} /></i>
                  <p>{item.detail}</p>
                </div>
              ))}
            </div>
            <div className="donate-a-evidence"><strong>Evidence, not estimates:</strong> attendance logs, coach records and 90-day employment follow-ups support these figures. <a href="/resources">Read the impact note</a>.</div>
          </article>

          <section
            className="donation-flow-card donate-a-flow-card"
            ref={flowPanelRef}
            tabIndex={-1}
            aria-label="Donation flow"
          >
            <div className="donate-a-flow-topline">
              <p className="donor-community-eyebrow">Your donation</p>
              <ol className="donation-steps" aria-label="Donation progress">
                {stepLabels.map((item, index) => {
                  const currentIndex = stepLabels.findIndex(
                    (candidate) => candidate.id === step,
                  );
                  return (
                    <li
                      key={item.id}
                      className={index === currentIndex ? "current" : index < currentIndex ? "complete" : ""}
                      aria-current={index === currentIndex ? "step" : undefined}
                    >
                      <span>{index + 1}</span>{item.label}
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="simulation-banner" role="note">
              Hackathon simulation — no payment is taken and no personal information is stored.
            </div>

            {optionsNotice && <div className="form-alert form-notice" role="status">{optionsNotice}</div>}

            {step === "donation" && (
              <>
                <div className="form-heading">
                  <p>Step 1 of 3</p>
                  <h2 id="donation-flow-title">How would you like to give?</h2>
                </div>
                <DonorDetailsForm
                  value={details}
                  errors={detailsErrors}
                  onChange={(nextDetails) => {
                    setDetails(nextDetails);
                    setDetailsErrors({});
                  }}
                />

                <hr className="donate-a-divider" />
                <CauseSelector choices={causeChoices} value={causeId} onChange={selectCause} />
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
                <div className="donate-a-impact-preview">
                  <ImpactCard amountHkd={amountHkd} impact={preview} status={previewStatus} />
                </div>
                <button className="button button-dark button-full" type="button" onClick={continueToReview}>
                  Review & continue to secure payment
                </button>
                <p className="form-footnote">Secure payment · Receipt by email · You can change your mind before confirming</p>
              </>
            )}

            {step === "review" && (
              <>
                <div className="form-heading">
                  <p>Step 2 of 3</p>
                  <h2 id="donation-flow-title">Review your prototype donation</h2>
                </div>
                {submitError && <div className="form-alert" role="alert">{submitError}</div>}
                <DonationReview
                  amountHkd={amountHkd}
                  causeLabel={selectedCauseLabel}
                  donorName={donorDisplayName}
                  anonymous={details.anonymous}
                  impactMessage={impactMessage}
                />
                <div className="donate-a-impact-preview donate-a-impact-after">
                  <ImpactCard amountHkd={amountHkd} impact={preview} status={previewStatus} />
                </div>
                <p className="form-footnote review-footnote">This confirms a prototype intention only. No money will be charged.</p>
                <div className="button-row">
                  <button className="button button-outline" type="button" onClick={() => setStep("donation")} disabled={isSubmitting}>Back</button>
                  <button className="button button-dark" type="button" onClick={submitDonationIntent} disabled={isSubmitting}>
                    {isSubmitting ? "Confirming…" : `Confirm prototype donation of HK$${amountHkd.toLocaleString("en-HK")}`}
                  </button>
                </div>
              </>
            )}

            {step === "success" && result && (
              <DonationSuccess
                result={result}
                donorName={donorDisplayName}
                donorEmail={details.donorEmail}
                anonymous={details.anonymous}
                onStayInvolved={() => trackDonationEvent("stay_involved_clicked", {
                  cause_id: result.impact.cause_id,
                  amount_bucket: getAmountBucket(result.impact.amount_hkd),
                  impact_mode: result.impact.mode,
                })}
              />
            )}
          </section>
        </div>

        <aside className="donate-a-promise">
          <p className="donor-community-eyebrow">Our promise</p>
          <h2>Traceable from gift to outcome.</h2>
          <div><strong>Quarterly</strong><span>Updates on where your selected fund was used.</span></div>
          <div><strong>Specific</strong><span>Photos, programme records and real changes, with consent.</span></div>
          <div><strong>Human</strong><span>A person reviews every donor-wall message.</span></div>
          <div className="donate-a-promise-actions">
            <Link className="donor-community-button" to="/community">← Our community</Link>
            <Link className="donor-community-button donor-community-button-primary" to="/donor-profile">My donor profile</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

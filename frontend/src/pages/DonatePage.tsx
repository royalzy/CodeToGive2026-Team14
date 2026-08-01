import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import {
  createDonationIntent,
  type DonationIntentResult,
} from "../api/client";
import { track, trackFormStarted } from "../analytics/umami";
import {
  AllocationBar,
  PageHero,
  SectionHeading,
  StatusPanel,
  WishlistCard,
} from "../components/Cards";
import { Field } from "../components/FormControls";
import { useLanguage } from "../hooks/useLanguage";

const donationSchema = z.object({
  amount: z.number().int().positive("Enter an amount greater than HK$0.").max(1_000_000),
  program: z.enum([
    "general",
    "sports",
    "nutrition",
    "enrichment",
    "family_support",
    "community",
  ]),
  anonymous: z.boolean(),
  donor_name: z.string().max(80).optional(),
  email: z
    .string()
    .refine((value) => value === "" || z.string().email().safeParse(value).success, {
      message: "Enter a valid email address.",
    })
    .optional(),
});

type DonationFormData = z.infer<typeof donationSchema>;

const amountOptions = [250, 500, 1000] as const;

export function DonatePage() {
  const { t } = useLanguage();
  const [result, setResult] = useState<DonationIntentResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 500,
      program: "general",
      anonymous: false,
      donor_name: "",
      email: "",
    },
  });

  const selectedAmount = watch("amount");
  const selectedProgram = watch("program");
  const selectedProgramLabel =
    t.donationPrograms.find((program) => program.value === selectedProgram)?.label ??
    "Love 21";

  async function onSubmit(data: DonationFormData) {
    setSubmitError(null);
    try {
      setResult(
        await createDonationIntent({
          ...data,
          currency: "HKD",
          donor_name: data.donor_name || null,
          email: data.email || null,
        }),
      );
      track("donation_intent", { program: data.program, amount: data.amount });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We could not create the demo intention. Please try again.",
      );
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Meaningful giving"
        title="Give to a direction. Stay for the journey."
        body="Choose the part of Love 21's whole-person support that speaks to you, then keep connected to the community you are helping strengthen."
        tone="yellow"
      />

      <section className="section donation-principles">
        <div className="shell principles-grid">
          <article>
            <span aria-hidden="true">01</span>
            <h2>Choose with clarity</h2>
            <p>Select a programme or let Love 21 direct support where most useful.</p>
          </article>
          <article>
            <span aria-hidden="true">02</span>
            <h2>See the whole picture</h2>
            <p>Your preference sits within connected support for members and families.</p>
          </article>
          <article>
            <span aria-hidden="true">03</span>
            <h2>Keep showing up</h2>
            <p>Giving can be the beginning of volunteering, learning and community.</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow="What your support funds"
            title="Transparency you can see"
            body="Every dollar is directed to specific programmes that connect around members and families."
          />
          <AllocationBar shares={t.allocation} />
        </div>
      </section>

      <section className="section section-soft">
        <div className="shell">
          <SectionHeading
            eyebrow="Wishlist"
            title="Items the community needs"
            body="Choose an item to support a specific programme. Every contribution makes a real difference."
          />
          <div className="wishlist-grid">
            {t.wishlistItems.map((item) => (
              <WishlistCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="section form-section donation-form-section">
        <div className="shell form-layout">
          <aside className="form-aside donation-aside">
            <p className="eyebrow">Explore your support</p>
            <h2>Make your intention visible</h2>
            <p>
              Love 21 supports more than 680 families through programmes that
              reinforce one another.
            </p>
            <div className="simulation-badge">
              <strong>Hackathon simulation</strong>
              <p>No payment is taken and no personal information is stored.</p>
            </div>
          </aside>

          <div className="form-card">
            {result ? (
              <StatusPanel
                title="Your support intention has been explored."
                reference={result.reference}
              >
                <p>{result.acknowledgement}</p>
                <p>{result.impact_message}</p>
                <div className="simulation-confirmation">
                  Simulation complete — no money was charged.
                </div>
                <div className="button-row">
                  <Link className="button button-dark" to="/impact">
                    See the community
                  </Link>
                  <Link className="button button-outline" to="/volunteer">
                    Explore volunteering
                  </Link>
                </div>
              </StatusPanel>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                onFocusCapture={() => trackFormStarted("donation")}
                noValidate
              >
                <div className="form-heading">
                  <p>Meaningful giving prototype</p>
                  <h2>Create a demo intention</h2>
                </div>

                <div className="simulation-banner" role="note">
                  This is not a payment form. Do not enter card or banking details.
                </div>

                {submitError && (
                  <div className="form-alert" role="alert">
                    {submitError}
                  </div>
                )}

                <fieldset className="fieldset">
                  <legend>Choose an amount</legend>
                  <div className="amount-grid">
                    {amountOptions.map((amount) => (
                      <button
                        className={selectedAmount === amount ? "selected" : ""}
                        type="button"
                        key={amount}
                        onClick={() =>
                          setValue("amount", amount, { shouldValidate: true })
                        }
                        aria-pressed={selectedAmount === amount}
                      >
                        HK${amount.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <Field label="Or enter another HKD amount" error={errors.amount?.message}>
                  <div className="currency-input">
                    <span>HK$</span>
                    <input
                      type="number"
                      min="1"
                      max="1000000"
                      step="1"
                      {...register("amount", { valueAsNumber: true })}
                    />
                  </div>
                </Field>

                <Field label="Where would you like to direct support?">
                  <select {...register("program")}>
                    {t.donationPrograms.map((program) => (
                      <option key={program.value} value={program.value}>
                        {program.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="intent-preview" aria-live="polite">
                  <span>Your demo intention</span>
                  <strong>
                    HK${Number.isFinite(selectedAmount) ? selectedAmount.toLocaleString() : "—"}
                  </strong>
                  <p>Support preference: {selectedProgramLabel}</p>
                  <small>
                    This shows direction only. It does not claim a fixed service
                    outcome for a particular amount.
                  </small>
                </div>

                <div className="two-column-fields">
                  <Field label="Name (optional)" error={errors.donor_name?.message}>
                    <input autoComplete="name" {...register("donor_name")} />
                  </Field>
                  <Field label="Email (optional)" error={errors.email?.message}>
                    <input
                      type="email"
                      autoComplete="email"
                      {...register("email")}
                    />
                  </Field>
                </div>

                <label className="consent-row">
                  <input type="checkbox" {...register("anonymous")} />
                  <span>I would prefer this intention to be anonymous.</span>
                </label>

                <button
                  className="button button-dark button-full"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating…" : "Create demo intention"}
                </button>
                <p className="form-footnote">
                  By continuing, you acknowledge this is a non-payment hackathon
                  demonstration.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}


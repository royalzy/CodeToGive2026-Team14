import type { components } from "./schema";
import { z } from "zod";

export type VolunteerApplication =
  components["schemas"]["VolunteerApplicationRequest"];
export type VolunteerApplicationResult =
  components["schemas"]["VolunteerApplicationResponse"];
export type DonationIntent = components["schemas"]["DonationIntentRequest"];
export type DonationIntentResult =
  components["schemas"]["DonationIntentResponse"];
export type CauseId = components["schemas"]["CauseId"];
export type DonationImpactOptions =
  components["schemas"]["DonationImpactOptionsResponse"];
export type ImpactPreview =
  | components["schemas"]["CountedImpact"]
  | components["schemas"]["ContributionImpact"]
  | components["schemas"]["FlexibleImpact"];

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8000";

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

const API_TIMEOUT_MS = 5_000;

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const controller = new AbortController();
  let timedOut = false;

  const abortFromCaller = () => controller.abort();
  if (init.signal?.aborted) {
    controller.abort();
  } else {
    init.signal?.addEventListener("abort", abortFromCaller, { once: true });
  }

  const timeout = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, API_TIMEOUT_MS);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (error) {
    if (timedOut) {
      throw new ApiError(
        "The service took too long to respond. Please try again.",
        408,
      );
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
    init.signal?.removeEventListener("abort", abortFromCaller);
  }
}

async function postJson<TRequest, TResponse>(
  path: string,
  payload: TRequest,
  signal?: AbortSignal,
): Promise<TResponse> {
  const response = await fetchWithTimeout(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    throw new ApiError(
      response.status >= 500
        ? "The service is taking a pause. Please try again shortly."
        : "Please check the information and try again.",
      response.status,
    );
  }

  return (await response.json()) as TResponse;
}

export async function getJson<TResponse>(
  path: string,
  signal?: AbortSignal,
): Promise<TResponse> {
  const response = await fetchWithTimeout(`${API_BASE_URL}${path}`, { signal });

  if (!response.ok) {
    throw new ApiError(
      response.status >= 500
        ? "The service is taking a pause. Please try again shortly."
        : "We could not load the information. Please try again.",
      response.status,
    );
  }

  return (await response.json()) as TResponse;
}

const causeIdSchema = z.enum([
  "where_needed_most",
  "dance",
  "sports",
  "nutrition",
  "family_support",
]);

const impactBaseSchema = z.object({
  cause_id: causeIdSchema,
  amount_hkd: z.number().int().min(10).max(1_000_000),
  copy_key: z.string(),
  is_estimate: z.literal(true),
});

const impactPreviewSchema = z.discriminatedUnion("mode", [
  impactBaseSchema.extend({
    mode: z.literal("counted"),
    estimated_units: z.number().int().positive(),
    unit_key: z.string(),
  }),
  impactBaseSchema.extend({
    mode: z.literal("contribution"),
    estimated_units: z.null(),
    unit_key: z.string(),
  }),
  impactBaseSchema.extend({
    mode: z.literal("flexible"),
    estimated_units: z.null(),
    unit_key: z.null(),
  }),
]);

const donationImpactOptionsSchema = z.object({
  default_cause_id: causeIdSchema,
  preset_amounts_hkd: z.array(z.number().int().min(10).max(1_000_000)),
  causes: z.array(
    z.object({
      cause_id: causeIdSchema,
      copy_key: z.string(),
    }),
  ),
  demo_estimates: z.literal(true),
});

const donationIntentResultSchema = z.object({
  donation_intent_id: z.string(),
  status: z.literal("simulated"),
  simulation: z.literal(true),
  persistence: z.literal("stored"),
  impact: impactPreviewSchema,
});

export function submitVolunteerApplication(
  payload: VolunteerApplication,
): Promise<VolunteerApplicationResult> {
  return postJson("/api/v1/volunteer-applications", payload);
}

export function createDonationIntent(
  payload: DonationIntent,
): Promise<DonationIntentResult> {
  return postJson<DonationIntent, unknown>(
    "/api/v1/donation-intents",
    payload,
  ).then((result) => donationIntentResultSchema.parse(result));
}

export interface BookingPayload {
  member_slug: string;
  event_id: string;
  event_date: string;
}

export interface BookingResult {
  id: string;
  member_slug: string;
  event_id: string;
  event_date: string;
  status: "confirmed";
  booked_at: string;
}

export function createBooking(payload: BookingPayload): Promise<BookingResult> {
  return postJson("/api/v1/bookings", payload);
}

export function listBookings(memberSlug?: string): Promise<BookingResult[]> {
  const query = memberSlug
    ? `?member_slug=${encodeURIComponent(memberSlug)}`
    : "";
  return getJson(`/api/v1/bookings${query}`);
}

export function getDonationImpactOptions(
  signal?: AbortSignal,
): Promise<DonationImpactOptions> {
  return getJson<unknown>("/api/v1/donation-impact/options", signal).then(
    (result) => donationImpactOptionsSchema.parse(result),
  );
}

export function previewDonationImpact(
  payload: components["schemas"]["ImpactPreviewRequest"],
  signal?: AbortSignal,
): Promise<ImpactPreview> {
  return postJson<components["schemas"]["ImpactPreviewRequest"], unknown>(
    "/api/v1/donation-impact/preview",
    payload,
    signal,
  ).then((result) => impactPreviewSchema.parse(result));
}

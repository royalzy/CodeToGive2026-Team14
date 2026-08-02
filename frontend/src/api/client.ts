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

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
const API_BASE_URL = configuredApiBaseUrl
  || `${window.location.protocol}//${window.location.hostname}:8000`;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
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
    return await fetch(input, {
      credentials: "include",
      ...init,
      signal: controller.signal,
    });
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
    const problem = await extractApiProblem(response);
    throw new ApiError(
      problem.message ?? (response.status >= 500
        ? "The service is taking a pause. Please try again shortly."
        : "Please check the information and try again."),
      response.status,
      problem.code,
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
    const problem = await extractApiProblem(response);
    throw new ApiError(
      problem.message ?? (response.status >= 500
        ? "The service is taking a pause. Please try again shortly."
        : "We could not load the information. Please try again."),
      response.status,
      problem.code,
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

const donorSummarySchema = z.object({
  id: z.string(),
  email: z.string().email(),
  nickname: z.string(),
  name: z.string(),
  consent_to_updates: z.boolean(),
  created_at: z.string(),
});

const donorAuthSchema = z.object({ profile: donorSummarySchema });

const donorDonationSchema = z.object({
  donation_intent_id: z.string(),
  cause_id: causeIdSchema,
  amount_hkd: z.number().int(),
  currency: z.literal("HKD"),
  status: z.literal("simulated"),
  created_at: z.string(),
  impact: impactPreviewSchema,
});

const donorProfileSchema = z.object({
  profile: donorSummarySchema,
  lifetime_amount_hkd: z.number().int().nonnegative(),
  donation_count: z.number().int().nonnegative(),
  donations: z.array(donorDonationSchema),
});

const wallPostSchema = z.object({
  id: z.string(),
  donation_intent_id: z.string(),
  nickname: z.string(),
  message: z.string().nullable(),
  status: z.literal("pending"),
  created_at: z.string(),
});

export type DonorSummary = z.infer<typeof donorSummarySchema>;
export type DonorAuthResult = z.infer<typeof donorAuthSchema>;
export type DonorProfileResult = z.infer<typeof donorProfileSchema>;
export type DonorWallPost = z.infer<typeof wallPostSchema>;

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

export function createDonorProfile(payload: {
  email: string;
  password: string;
  nickname: string;
  name: string | null;
  consent_to_updates: boolean;
}): Promise<DonorAuthResult> {
  return postJson<typeof payload, unknown>("/api/v1/donor-profiles", payload)
    .then((result) => donorAuthSchema.parse(result));
}

export function createDonorSession(payload: {
  email: string;
  password: string;
}): Promise<DonorAuthResult> {
  return postJson<typeof payload, unknown>("/api/v1/donor-sessions", payload)
    .then((result) => donorAuthSchema.parse(result));
}

export function getMyDonorProfile(): Promise<DonorProfileResult> {
  return getJson<unknown>("/api/v1/donor-profiles/me")
    .then((result) => donorProfileSchema.parse(result));
}

export async function deleteDonorSession(): Promise<void> {
  const response = await fetchWithTimeout(
    `${API_BASE_URL}/api/v1/donor-sessions/current`,
    { method: "DELETE" },
  );
  if (!response.ok) {
    const problem = await extractApiProblem(response);
    throw new ApiError(problem.message ?? "Could not sign out.", response.status, problem.code);
  }
}

export function createDonorWallPost(
  donationIntentId: string,
  payload: { message: string | null },
): Promise<DonorWallPost> {
  return postJson<typeof payload, unknown>(
    `/api/v1/donation-intents/${encodeURIComponent(donationIntentId)}/wall-posts`,
    payload,
  ).then((result) => wallPostSchema.parse(result));
}

export function getMyDonorWallPosts(): Promise<DonorWallPost[]> {
  return getJson<unknown>("/api/v1/donor-wall/me")
    .then((result) => z.array(wallPostSchema).parse(result));
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

export type PlatformId = "instagram" | "facebook";

export interface SocialPostResult {
  platform: PlatformId;
  status: "published" | "failed";
  caption: string | null;
  permalink: string | null;
  media_url: string | null;
  error: string | null;
}

export interface SocialPostResponse {
  /** Empty for a text-only post, which Facebook supports and Instagram does not. */
  image_urls: string[];
  results: SocialPostResult[];
}

/** Instagram's caption cap. Facebook allows far more. */
export const IG_MAX_CAPTION = 2200;
export const FB_MAX_CAPTION = 63206;
/** Instagram carousels take 2-10 items; Facebook's feed limit matches. */
export const MAX_IMAGES = 10;

// Meta's publish calls routinely take 10-30s, well past API_TIMEOUT_MS.
const SOCIAL_PUBLISH_TIMEOUT_MS = 90_000;

/**
 * FastAPI returns `detail` as a plain string for raised HTTPExceptions, but as
 * an array of validation objects for 422s. Handle both so the caller never has
 * to fall back to a generic message.
 */
async function extractDetail(response: Response): Promise<string | null> {
  try {
    const payload = (await response.json()) as { detail?: unknown };
    const { detail } = payload;

    if (typeof detail === "string") return detail;

    if (Array.isArray(detail)) {
      const messages = detail
        .map((item) =>
          item && typeof item === "object" && typeof (item as { msg?: unknown }).msg === "string"
            ? (item as { msg: string }).msg
            : null,
        )
        .filter((msg): msg is string => Boolean(msg));
      return messages.length > 0 ? messages.join(" ") : null;
    }

    return null;
  } catch {
    return null;
  }
}

async function extractApiProblem(
  response: Response,
): Promise<{ message: string | null; code?: string }> {
  try {
    const payload = (await response.json()) as { detail?: unknown };
    const detail = payload.detail;
    if (typeof detail === "string") return { message: detail };
    if (Array.isArray(detail)) {
      const messages = detail.flatMap((item) =>
        item && typeof item === "object" && typeof (item as { msg?: unknown }).msg === "string"
          ? [(item as { msg: string }).msg]
          : [],
      );
      return { message: messages.length ? messages.join(" ") : null };
    }
    if (detail && typeof detail === "object") {
      const record = detail as { message?: unknown; code?: unknown };
      return {
        message: typeof record.message === "string" ? record.message : null,
        code: typeof record.code === "string" ? record.code : undefined,
      };
    }
    return { message: null };
  } catch {
    return { message: null };
  }
}

export async function publishSocialPost(input: {
  /**
   * Optional and repeatable. Empty means a text-only post (Facebook only);
   * more than one becomes an Instagram carousel / Facebook multi-photo post.
   */
  images?: File[];
  caption: string;
  /** Optional per-platform overrides; each falls back to `caption`. */
  captionInstagram?: string;
  captionFacebook?: string;
  platforms: PlatformId[];
}): Promise<SocialPostResponse> {
  const body = new FormData();
  for (const image of input.images ?? []) {
    body.append("images", image);
  }
  body.append("caption", input.caption);
  if (input.captionInstagram) body.append("caption_instagram", input.captionInstagram);
  if (input.captionFacebook) body.append("caption_facebook", input.captionFacebook);
  for (const platform of input.platforms) {
    body.append("platforms", platform);
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), SOCIAL_PUBLISH_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/v1/social-posts`, {
      method: "POST",
      body,
      signal: controller.signal,
    });
  } catch (error) {
    if (controller.signal.aborted) {
      throw new ApiError("Publishing took too long. Check the platforms before retrying.", 408);
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new ApiError(
      (await extractDetail(response)) ?? "Could not publish the post. Please try again.",
      response.status,
    );
  }

  return (await response.json()) as SocialPostResponse;
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

import type { components } from "./schema";

export type VolunteerApplication =
  components["schemas"]["VolunteerApplicationRequest"];
export type VolunteerApplicationResult =
  components["schemas"]["VolunteerApplicationResponse"];
export type DonationIntent = components["schemas"]["DonationIntentRequest"];
export type DonationIntentResult =
  components["schemas"]["DonationIntentResponse"];

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8000";

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

async function postJson<TRequest, TResponse>(
  path: string,
  payload: TRequest,
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
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

export async function getJson<TResponse>(path: string): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

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

export function submitVolunteerApplication(
  payload: VolunteerApplication,
): Promise<VolunteerApplicationResult> {
  return postJson("/api/v1/volunteer-applications", payload);
}

export function createDonationIntent(
  payload: DonationIntent,
): Promise<DonationIntentResult> {
  return postJson("/api/v1/donation-intents", payload);
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


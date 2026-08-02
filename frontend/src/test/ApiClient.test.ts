import { afterEach, describe, expect, it, vi } from "vitest";

import { getDonationImpactOptions, previewDonationImpact } from "../api/client";

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("API request timeout", () => {
  it("uses the page hostname for the local API so session cookies stay same-site", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({
        default_cause_id: "where_needed_most",
        preset_amounts_hkd: [200],
        causes: [{ cause_id: "where_needed_most", copy_key: "where_needed_most" }],
        demo_estimates: true,
      }), { status: 200, headers: { "Content-Type": "application/json" } }),
    );

    await getDonationImpactOptions();

    expect(fetchMock).toHaveBeenCalledWith(
      `${window.location.protocol}//${window.location.hostname}:8000/api/v1/donation-impact/options`,
      expect.objectContaining({ credentials: "include" }),
    );
  });

  it("turns an unresponsive preview request into a retryable error", async () => {
    vi.useFakeTimers();
    vi.spyOn(globalThis, "fetch").mockImplementation(
      (_input, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener(
            "abort",
            () =>
              reject(
                new DOMException("The operation was aborted.", "AbortError"),
              ),
            { once: true },
          );
        }),
    );

    const request = previewDonationImpact({
      cause_id: "dance",
      amount_hkd: 600,
    });
    const rejection = expect(request).rejects.toMatchObject({
      name: "ApiError",
      status: 408,
      message: "The service took too long to respond. Please try again.",
    });
    await vi.advanceTimersByTimeAsync(5_000);

    await rejection;
  });
});

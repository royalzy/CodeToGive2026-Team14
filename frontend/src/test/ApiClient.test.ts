import { afterEach, describe, expect, it, vi } from "vitest";

import { previewDonationImpact } from "../api/client";

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("API request timeout", () => {
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

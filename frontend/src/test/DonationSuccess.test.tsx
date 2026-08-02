import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DonationSuccess } from "../components/donate/DonationSuccess";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("DonationSuccess wall persistence", () => {
  it("keeps the form available after failure and retries an empty message", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ detail: "Wall unavailable" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        id: "WALL-RETRY",
        donation_intent_id: "DON-RETRY",
        nickname: "Retry Donor",
        message: null,
        status: "pending",
        created_at: "2026-08-02T02:00:00+00:00",
      }), { status: 201, headers: { "Content-Type": "application/json" } }));

    render(
      <MemoryRouter>
        <DonationSuccess
          result={{
            donation_intent_id: "DON-RETRY",
            status: "simulated",
            simulation: true,
            persistence: "stored",
            impact: {
              cause_id: "dance",
              amount_hkd: 600,
              mode: "counted",
              copy_key: "dance",
              estimated_units: 4,
              unit_key: "dance_training_session",
              is_estimate: true,
            },
          }}
          donorName="Retry Donor"
          donorEmail="retry@example.com"
          anonymous={false}
          onStayInvolved={() => undefined}
        />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "Send for review" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Wall unavailable");
    expect(screen.getByLabelText(/Message to the community/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Send for review" }));
    const joined = await screen.findByText("Retry Donor joined the family.");
    expect(joined).toBeInTheDocument();
    expect(within(joined.closest(".wall-pending-preview") as HTMLElement).queryByRole("blockquote")).not.toBeInTheDocument();
  });
});

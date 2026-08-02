import {
  cleanup,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { StrictMode } from "react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { ImpactPreview } from "../api/client";
import { DonatePage } from "../pages/DonatePage";

const optionsPayload = {
  default_cause_id: "where_needed_most",
  preset_amounts_hkd: [200, 400, 600, 1000],
  causes: [
    { cause_id: "where_needed_most", copy_key: "where_needed_most" },
    { cause_id: "dance", copy_key: "dance" },
    { cause_id: "sports", copy_key: "sports" },
    { cause_id: "nutrition", copy_key: "nutrition" },
    { cause_id: "family_support", copy_key: "family_support" },
  ],
  demo_estimates: true,
};

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function makeImpact(
  causeId: string,
  amountHkd: number,
  units?: number,
): ImpactPreview {
  if (causeId === "where_needed_most") {
    return {
      cause_id: "where_needed_most",
      amount_hkd: amountHkd,
      mode: "flexible",
      copy_key: "where_needed_most",
      estimated_units: null,
      unit_key: null,
      is_estimate: true,
    };
  }
  if (!units) {
    return {
      cause_id: causeId as "dance",
      amount_hkd: amountHkd,
      mode: "contribution",
      copy_key: causeId,
      estimated_units: null,
      unit_key: `${causeId}_unit`,
      is_estimate: true,
    };
  }
  return {
    cause_id: causeId as "dance",
    amount_hkd: amountHkd,
    mode: "counted",
    copy_key: causeId,
    estimated_units: units,
    unit_key: `${causeId}_unit`,
    is_estimate: true,
  };
}

function installApiMock({
  finalUnits,
  failOptions = false,
  failPreview = false,
}: {
  finalUnits?: number;
  failOptions?: boolean;
  failPreview?: boolean;
} = {}) {
  return vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
    const url = String(input);
    if (url.endsWith("/donor-profiles")) {
      return jsonResponse({
        profile: {
          id: "DNR-TEST",
          email: "private@example.com",
          nickname: "Alex Private",
          name: "Alex Private",
          consent_to_updates: false,
          created_at: "2026-08-02T02:00:00+00:00",
        },
      }, 201);
    }
    if (url.includes("/wall-posts")) {
      const wallPayload = JSON.parse(String(init?.body)) as { message: string | null };
      return jsonResponse({
        id: "WALL-TEST",
        donation_intent_id: "DON-FINAL123",
        nickname: "Alex Private",
        message: wallPayload.message,
        status: "pending",
        created_at: "2026-08-02T02:05:00+00:00",
      }, 201);
    }
    if (url.endsWith("/donation-impact/options")) {
      return failOptions
        ? jsonResponse({ detail: "unavailable" }, 503)
        : jsonResponse(optionsPayload);
    }

    const payload = JSON.parse(String(init?.body)) as {
      cause_id: string;
      amount_hkd: number;
    };
    if (url.endsWith("/donation-impact/preview")) {
      if (failPreview) return jsonResponse({ detail: "unavailable" }, 503);
      const units =
        payload.cause_id === "dance"
          ? Math.floor(payload.amount_hkd / 150)
          : undefined;
      return jsonResponse(
        makeImpact(payload.cause_id, payload.amount_hkd, units),
      );
    }

    return jsonResponse(
      {
        donation_intent_id: "DON-FINAL123",
        status: "simulated",
        simulation: true,
        persistence: "stored",
        impact: makeImpact(
          payload.cause_id,
          payload.amount_hkd,
          finalUnits ??
            (payload.cause_id === "dance"
              ? Math.floor(payload.amount_hkd / 150)
              : undefined),
        ),
      },
      201,
    );
  });
}

function renderDonatePage() {
  return render(
    <MemoryRouter>
      <DonatePage />
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  delete window.dataLayer;
});

describe("donor impact journey", () => {
  it("does not focus the donation flow on its StrictMode mount", async () => {
    installApiMock();
    const user = userEvent.setup();
    render(
      <StrictMode>
        <MemoryRouter>
          <DonatePage />
        </MemoryRouter>
      </StrictMode>,
    );

    const donationFlow = screen.getByRole("region", { name: "Donation flow" });
    expect(donationFlow).not.toHaveFocus();

    await user.click(screen.getByLabelText(/Give completely anonymously/i));
    await user.click(
      screen.getByRole("button", { name: "Review & continue to secure payment" }),
    );
    expect(donationFlow).toHaveFocus();
  });

  it("clears an old impact when the custom amount becomes invalid", async () => {
    installApiMock();
    const user = userEvent.setup();
    renderDonatePage();

    expect(
      await screen.findByRole("heading", {
        name: /One gift. Many possible moments/i,
      }),
    ).toBeInTheDocument();

    const amountInput = screen.getByLabelText("Custom donation amount");
    await user.clear(amountInput);
    await user.type(amountInput, "5");

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", {
          name: /One gift. Many possible moments/i,
        }),
      ).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole("heading", {
        name: "Every gift creates another possibility.",
      }),
    ).toBeInTheDocument();
  });

  it("uses contribution copy instead of showing zero units", async () => {
    installApiMock();
    const user = userEvent.setup();
    renderDonatePage();

    await user.click(screen.getByLabelText("Discover a Talent"));
    const amountInput = screen.getByLabelText("Custom donation amount");
    await user.clear(amountInput);
    await user.type(amountInput, "100");

    expect(
      await screen.findByRole("heading", {
        name: /Another chance to move, learn, and shine begins here/i,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/0 dance/i)).not.toBeInTheDocument();
  });

  it("falls back safely when options and preview services fail", async () => {
    installApiMock({ failOptions: true, failPreview: true });
    renderDonatePage();

    expect(
      await screen.findByText(/Safe prototype defaults are shown/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Discover a Talent")).toBeInTheDocument();
    expect(
      await screen.findByText(/Live estimate unavailable/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Review & continue to secure payment" }),
    ).toBeEnabled();
  });

  it("ignores a slower stale preview response", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
      const url = String(input);
      if (url.endsWith("/donation-impact/options")) {
        return jsonResponse(optionsPayload);
      }
      const payload = JSON.parse(String(init?.body)) as {
        cause_id: string;
        amount_hkd: number;
      };
      if (payload.cause_id === "dance" && payload.amount_hkd === 400) {
        await new Promise((resolve) => window.setTimeout(resolve, 550));
        return jsonResponse(makeImpact("dance", 400, 2));
      }
      if (payload.cause_id === "dance" && payload.amount_hkd === 600) {
        await new Promise((resolve) => window.setTimeout(resolve, 10));
        return jsonResponse(makeImpact("dance", 600, 4));
      }
      return jsonResponse(
        makeImpact(payload.cause_id, payload.amount_hkd),
      );
    });

    const user = userEvent.setup();
    renderDonatePage();
    await user.click(screen.getByLabelText("Discover a Talent"));
    await new Promise((resolve) => window.setTimeout(resolve, 300));
    await user.click(screen.getByRole("button", { name: "HK$600" }));

    expect(
      await screen.findByRole("heading", {
        name: /Four more chances to move, learn, and shine/i,
      }),
    ).toBeInTheDocument();
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    expect(
      screen.getByRole("heading", {
        name: /Four more chances to move, learn, and shine/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        name: /Two more chances to move, learn, and shine/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("requires credentials for a donor profile", async () => {
    installApiMock();
    const user = userEvent.setup();
    renderDonatePage();

    await user.click(
      screen.getByRole("button", { name: "Review & continue to secure payment" }),
    );

    expect(
      await screen.findByText(/Enter the email for your donor profile/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Use at least 6 characters/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "How would you like to give?" }),
    ).toBeInTheDocument();
  });

  it("hides and clears every identity field for a completely anonymous gift", async () => {
    installApiMock();
    const user = userEvent.setup();
    renderDonatePage();

    await user.click(screen.getByLabelText(/Create a donor profile/i));
    await user.type(screen.getByLabelText("Email"), "alex@example.com");
    await user.type(screen.getByLabelText("Password"), "secret1");
    await user.type(screen.getByLabelText("Unique nickname"), "Alex C");
    await user.type(screen.getByLabelText("Name (optional)"), "Alex Chan");
    await user.click(
      screen.getByLabelText(/Give completely anonymously/i),
    );

    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Unique nickname")).not.toBeInTheDocument();
    expect(screen.getByText(/Identity fields have been cleared/i)).toBeInTheDocument();

    await user.click(screen.getByLabelText(/Give with my profile/i));
    expect(screen.getByLabelText("Email")).toHaveValue("");
    expect(screen.getByLabelText("Unique nickname")).toHaveValue("");
    expect(screen.getByLabelText("Name (optional)")).toHaveValue("");

    await user.click(screen.getByLabelText(/Give completely anonymously/i));
    await user.click(screen.getByRole("button", { name: "Review & continue to secure payment" }));

    expect(screen.getByText("Completely anonymous")).toBeInTheDocument();
    expect(screen.queryByText("Alex Chan")).not.toBeInTheDocument();
  });

  it("shows the backend result on success and emits no PII to analytics", async () => {
    installApiMock({ finalUnits: 3 });
    window.dataLayer = [];
    const user = userEvent.setup();
    renderDonatePage();

    await user.click(screen.getByLabelText("Discover a Talent"));
    await user.click(screen.getByRole("button", { name: "HK$600" }));
    expect(
      await screen.findByRole("heading", {
        name: /Four more chances to move, learn, and shine/i,
      }),
    ).toBeInTheDocument();
    await user.click(screen.getByLabelText(/Create a donor profile/i));
    await user.type(screen.getByLabelText("Unique nickname"), "Alex Private");
    await user.type(screen.getByLabelText("Name (optional)"), "Alex Private");
    await user.type(
      screen.getByLabelText("Email"),
      "private@example.com",
    );
    await user.type(screen.getByLabelText("Password"), "secret1");
    await user.click(screen.getByRole("button", { name: "Review & continue to secure payment" }));
    await user.click(
      screen.getByRole("button", {
        name: "Confirm prototype donation of HK$600",
      }),
    );

    expect(
      screen.queryByRole("heading", {
        name: /Four more chances to move, learn, and shine/i,
      }),
    ).not.toBeInTheDocument();
    const analyticsPayload = JSON.stringify(window.dataLayer);
    expect(analyticsPayload).not.toContain("Alex Private");
    expect(analyticsPayload).not.toContain("private@example.com");
    expect(analyticsPayload).not.toContain("600");
    expect(window.dataLayer?.some(
      (entry) => entry.event === "donation_success_displayed",
    )).toBe(true);
    expect(await screen.findByRole("heading", { name: /What your HK\$600 gift is expected to set in motion/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /Three more chances to move, learn, and shine/i })).not.toBeInTheDocument();
    expect(screen.getByText(/planning estimate, not a promise/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "How Love 21 will verify it" })).toBeInTheDocument();
    expect(screen.getByText(/Quarter close/i)).toBeInTheDocument();

    await user.type(
      screen.getByLabelText(/Message to the community/i),
      "Thank you for keeping this work going.",
    );
    await user.click(screen.getByRole("button", { name: "Send for review" }));
    expect(screen.getByText(/Visible to you now · public after review/i)).toBeInTheDocument();
  });
});

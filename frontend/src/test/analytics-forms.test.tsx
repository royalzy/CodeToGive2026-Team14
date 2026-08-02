import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import * as umami from "../analytics/umami";
import { DonatePage } from "../pages/DonatePage";
import { VolunteerApplicationPage } from "../pages/VolunteerApplicationPage";
import { LanguageProvider } from "../components/LanguageContext";

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function renderDonate() {
  return render(
    <LanguageProvider>
      <MemoryRouter>
        <DonatePage />
      </MemoryRouter>,
    </LanguageProvider>,
  );
}

function renderVolunteerApplication() {
  return render(
    <LanguageProvider>
      <MemoryRouter
      initialEntries={[
        "/volunteer/apply?roleId=community_event_volunteer&firstStep=interest_only&journey=guided",
      ]}
    >
      <VolunteerApplicationPage />
    </MemoryRouter>,
    </LanguageProvider>,
  );
}

function enableAnalytics() {
  vi.stubEnv("VITE_UMAMI_HOST", "https://cloud.umami.is");
  vi.stubEnv("VITE_UMAMI_WEBSITE_ID", "site-123");
  const trackMock = vi.fn();
  window.umami = { track: trackMock };
  return trackMock;
}

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  delete window.umami;
  umami.__resetState();
});

describe("client-side analytics events", () => {
  it("tracks donation_intent on successful donation submit", async () => {
    const user = userEvent.setup();
    const trackMock = enableAnalytics();

    vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
      const url = String(input);
      if (url.endsWith("/donation-impact/options")) {
        return jsonResponse({
          default_cause_id: "where_needed_most",
          preset_amounts_hkd: [200, 400, 600, 1000],
          causes: [
            {
              cause_id: "where_needed_most",
              copy_key: "where_needed_most",
            },
            { cause_id: "dance", copy_key: "dance" },
            { cause_id: "sports", copy_key: "sports" },
            { cause_id: "nutrition", copy_key: "nutrition" },
            { cause_id: "family_support", copy_key: "family_support" },
          ],
          demo_estimates: true,
        });
      }

      const payload = JSON.parse(String(init?.body)) as {
        cause_id: string;
        amount_hkd: number;
      };
      const impact = {
        cause_id: payload.cause_id,
        amount_hkd: payload.amount_hkd,
        mode: "counted",
        copy_key: payload.cause_id,
        estimated_units: 4,
        unit_key: `${payload.cause_id}_unit`,
        is_estimate: true,
      };

      if (url.endsWith("/donation-impact/preview")) {
        return jsonResponse(impact);
      }

      return jsonResponse(
        {
          donation_intent_id: "DON-TEST1234",
          status: "simulated",
          simulation: true,
          persistence: "stored",
          impact,
        },
        201,
      );
    });

    renderDonate();
    await user.click(screen.getByLabelText("Discover a Talent"));
    await user.click(screen.getByRole("button", { name: "HK$600" }));
    await user.click(screen.getByRole("button", { name: "Continue to your details" }));
    await user.click(
      screen.getByLabelText(/Give completely anonymously/i),
    );
    await user.click(
      screen.getByRole("button", {
        name: "Review & continue to secure payment",
      }),
    );
    await user.click(
      screen.getByRole("button", {
        name: "Confirm prototype donation of HK$600",
      }),
    );

    await waitFor(() => {
      expect(trackMock).toHaveBeenCalledWith("donation_intent", {
        program: "dance",
        amount: 600,
        lang: "en",
      });
    });
  });

  it("tracks volunteer_application on the current application flow", async () => {
    const user = userEvent.setup();
    const trackMock = enableAnalytics();

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse(
        {
          simulation: true,
          persistence: "none",
          status: "interest_submitted",
          role_id: "community_event_volunteer",
          session_id: null,
          next_steps: ["Demo only"],
        },
        201,
      ),
    );

    renderVolunteerApplication();
    await user.type(screen.getByLabelText("Name"), "Jamie Chan");
    await user.type(screen.getByLabelText("Email"), "jamie@example.com");
    await user.click(
      screen.getByLabelText(/I understand this is a demonstration/i),
    );
    await user.click(
      screen.getByRole("button", { name: "Submit demo request" }),
    );

    await waitFor(() => {
      expect(trackMock).toHaveBeenCalledWith("volunteer_application", {
        role_id: "community_event_volunteer",
        journey_path: "guided",
        first_step: "interest_only",
        lang: "en",
      });
    });
  });
});

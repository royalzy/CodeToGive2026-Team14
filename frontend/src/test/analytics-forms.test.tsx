import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LanguageProvider } from "../components/LanguageContext";
import { DonatePage } from "../pages/DonatePage";
import { VolunteerPage } from "../pages/VolunteerPage";

function renderDonate() {
  return render(
    <MemoryRouter>
      <LanguageProvider>
        <DonatePage />
      </LanguageProvider>
    </MemoryRouter>,
  );
}

function renderVolunteer() {
  return render(
    <MemoryRouter>
      <LanguageProvider>
        <VolunteerPage />
      </LanguageProvider>
    </MemoryRouter>,
  );
}

function mockApiSuccess(payload: object) {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(JSON.stringify(payload), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    }),
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
});

describe("client-side analytics events", () => {
  it("tracks donation_intent on successful donation submit", async () => {
    const user = userEvent.setup();
    const trackMock = enableAnalytics();
    mockApiSuccess({
      reference: "DON-TEST1234",
      status: "simulated",
      simulation: true,
      impact_message: "Your preference supports community programmes.",
      acknowledgement: "Thank you for exploring support.",
      persistence: "stored",
    });

    renderDonate();
    await user.click(screen.getByRole("button", { name: "HK$1,000" }));
    await user.selectOptions(
      screen.getByLabelText("Where would you like to direct support?"),
      "community",
    );
    await user.click(
      screen.getByRole("button", { name: "Create demo intention" }),
    );

    expect(
      await screen.findByRole("heading", {
        name: /support intention has been explored/i,
      }),
    ).toBeInTheDocument();
    expect(trackMock).toHaveBeenCalledWith("donation_intent", {
      program: "community",
      amount: 1000,
    });
  });

  it("tracks volunteer_application on successful volunteer submit", async () => {
    const user = userEvent.setup();
    const trackMock = enableAnalytics();
    mockApiSuccess({
      reference: "VOL-TEST1234",
      status: "submitted",
      next_steps: ["Review", "Contact"],
      persistence: "none",
    });

    renderVolunteer();
    await user.type(screen.getByLabelText("Name"), "Jamie Chan");
    await user.type(screen.getByLabelText("Email"), "jamie@example.com");
    await user.click(screen.getByLabelText("Sports & fitness"));
    await user.selectOptions(
      screen.getByLabelText("When are you usually available?"),
      "weekend",
    );
    await user.click(
      screen.getByLabelText(/I would allow Love 21 to contact me/i),
    );
    await user.click(
      screen.getByRole("button", { name: "Submit demo interest" }),
    );

    expect(
      await screen.findByRole("heading", {
        name: /ready to take the next step/i,
      }),
    ).toBeInTheDocument();
    expect(trackMock).toHaveBeenCalledWith("volunteer_application", {
      interests: ["sports"],
      availability: "weekend",
    });
  });
});

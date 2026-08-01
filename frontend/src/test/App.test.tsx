import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { App } from "../App";
import { AuthProvider } from "../content/auth";
import { LanguageProvider } from "../components/LanguageContext";

function renderRoute(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("route backbone", () => {
  it.each([
    ["/", "See the ability."],
    ["/impact", "Not what we provide."],
    ["/volunteer", "Your first step can be a small one."],
    ["/donate", "What kind of opportunity would you like to create?"],
    ["/help", "Support for families and carers"],
    ["/resources", "Learning for belonging"],
    ["/members", "Meet the community"],
    ["/partners", "Partner with Love 21"],
    ["/admin", "Love 21 Admin"],
    ["/login", "Welcome back"],
  ])("renders %s", (route, heading) => {
    renderRoute(route);

    expect(
      screen.getByRole("heading", { name: new RegExp(heading, "i"), level: 1 }),
    ).toBeInTheDocument();
  });
});

describe("closed-loop forms", () => {
  it("supports the quick path without matching", async () => {
    const user = userEvent.setup();

    renderRoute("/volunteer");
    await user.click(screen.getByRole("link", { name: "Browse all roles" }));

    expect(
      screen.getByRole("heading", { name: "Explore without being boxed in.", level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Creative Arts Class Assistant" }),
    ).toBeInTheDocument();
  });

  it("runs the volunteer personality quiz question-by-question to a role match", async () => {
    const user = userEvent.setup();

    renderRoute("/volunteer/match");
    expect(
      screen.getByRole("heading", { name: "What type of volunteer are you?", level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText(/might not be fully accurate/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Start the quiz" }));
    expect(screen.getByText("Question 1 of 5")).toBeInTheDocument();

    for (let i = 0; i < 5; i += 1) {
      const options = screen.getAllByRole("button", { name: /./ }).filter((button) =>
        button.className.includes("volunteer-quiz-option"),
      );
      await user.click(options[3]);
    }

    expect(screen.getByText("The Behind-the-Scenes Hero")).toBeInTheDocument();

    const eventHelperHeading = screen.getByRole("heading", {
      name: "Community Event Helper",
    });
    await user.click(
      within(eventHelperHeading.closest("article")!).getByRole("link", {
        name: "Explore this role",
      }),
    );
    expect(
      screen.getByRole("heading", { name: "Community Event Helper", level: 1 }),
    ).toBeInTheDocument();
  });

  it("shows the volunteer story video without blocking the next step", () => {
    renderRoute("/volunteer/roles/dance_activity_buddy?journey=guided");

    expect(
      screen.getByLabelText(/Volunteer story for people exploring the Creative Arts Class Assistant/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Try this session" })).toBeInTheDocument();
  });

  it("submits a demo session request with pending confirmation semantics", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          simulation: true,
          persistence: "none",
          status: "pending_confirmation",
          role_id: "dance_activity_buddy",
          session_id: "saturday_dance_project",
          next_steps: ["Demo only", "Contact before confirmation"],
        }),
        { status: 201, headers: { "Content-Type": "application/json" } },
      ),
    );

    renderRoute(
      "/volunteer/apply?roleId=dance_activity_buddy&sessionId=saturday_dance_project&journey=quick",
    );
    await user.type(screen.getByLabelText("Name"), "Jamie Chan");
    await user.type(screen.getByLabelText("Email"), "jamie@example.com");
    await user.click(
      screen.getByLabelText(/I understand this is a demonstration/i),
    );
    await user.click(screen.getByRole("button", { name: "Submit demo request" }));

    expect(
      await screen.findByRole("heading", {
        name: /demo request is pending — not booked/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/no place has been reserved/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Saturday Dance Project" })).toBeInTheDocument();
  });

  it("creates a simulated donation intention from a backend impact preview", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
      const url = String(input);
      if (url.endsWith("/donation-impact/options")) {
        return new Response(
          JSON.stringify({
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
              {
                cause_id: "family_support",
                copy_key: "family_support",
              },
            ],
            demo_estimates: true,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }

      const payload = JSON.parse(String(init?.body)) as {
        cause_id: string;
        amount_hkd: number;
      };
      const impact = {
        cause_id: payload.cause_id,
        amount_hkd: payload.amount_hkd,
        mode:
          payload.cause_id === "where_needed_most" ? "flexible" : "counted",
        copy_key: payload.cause_id,
        estimated_units:
          payload.cause_id === "where_needed_most"
            ? null
            : Math.floor(payload.amount_hkd / 150),
        unit_key:
          payload.cause_id === "where_needed_most"
            ? null
            : "dance_training_session",
        is_estimate: true,
      };

      if (url.endsWith("/donation-intents")) {
        return new Response(
          JSON.stringify({
            donation_intent_id: "DON-TEST1234",
            status: "simulated",
            simulation: true,
            persistence: "stored",
            impact,
          }),
          { status: 201, headers: { "Content-Type": "application/json" } },
        );
      }

      return new Response(JSON.stringify(impact), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    });

    renderRoute("/donate");
    await user.click(screen.getByLabelText("Discover a Talent"));
    await user.click(screen.getByRole("button", { name: "HK$600" }));
    expect(
      await screen.findByRole("heading", {
        name: /Four more chances to move, learn, and shine/i,
      }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Continue to your details" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Review your intention" }),
    );
    await user.click(
      screen.getByRole("button", {
        name: "Confirm prototype donation of HK$600",
      }),
    );

    expect(
      await screen.findByRole("heading", {
        name: "Thank you.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/no money was charged/i)).toBeInTheDocument();
    expect(screen.getByText(/DON-TEST1234/)).toBeInTheDocument();
  });

  it("prevents incomplete volunteer submissions before calling the API", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.spyOn(globalThis, "fetch");

    renderRoute(
      "/volunteer/apply?roleId=community_event_volunteer&firstStep=interest_only",
    );
    await user.click(screen.getByRole("button", { name: "Submit demo request" }));

    expect(await screen.findByText("Please enter your name.")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("preserves entered details after an API error so the visitor can retry", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch")
      .mockRejectedValueOnce(new Error("Network unavailable"))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            simulation: true,
            persistence: "none",
            status: "interest_submitted",
            role_id: "community_event_volunteer",
            session_id: null,
            next_steps: ["Demo only"],
          }),
          { status: 201, headers: { "Content-Type": "application/json" } },
        ),
      );

    renderRoute(
      "/volunteer/apply?roleId=community_event_volunteer&firstStep=interest_only",
    );
    await user.type(screen.getByLabelText("Name"), "Jamie Chan");
    await user.type(screen.getByLabelText("Email"), "jamie@example.com");
    await user.click(screen.getByLabelText(/I understand this is a demonstration/i));
    await user.click(screen.getByRole("button", { name: "Submit demo request" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Network unavailable");
    expect(screen.getByLabelText("Name")).toHaveValue("Jamie Chan");
    expect(screen.getByLabelText("Email")).toHaveValue("jamie@example.com");

    await user.click(screen.getByRole("button", { name: "Submit demo request" }));
    expect(
      await screen.findByRole("heading", { name: /demo interest has been explored/i }),
    ).toBeInTheDocument();
  });

  it("shows an expired state when confirmation is opened directly", () => {
    renderRoute("/volunteer/confirmed");

    expect(
      screen.getByRole("heading", { name: "Demo result is no longer available." }),
    ).toBeInTheDocument();
  });
});

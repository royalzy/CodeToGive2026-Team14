import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
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
    ["/", "Love 21 builds fuller lives around every ability.", 1],
    ["/story", "Crystal steps forward.", 1],
    ["/supporter", "People making this possible.", 1],
    ["/volunteer", "Volunteer with Love 21", 1],
    ["/donate", "received", 1],
    ["/donor-profile", "Your impact, kept honest.", 1],
    ["/help", "Let us find a starting point together", 2],
    ["/admin", "Love 21 Admin", 1],
    ["/login", "Sarah's family", 3],
  ])("renders %s", (route, heading, level) => {
    renderRoute(route);

    expect(
      screen.getByRole("heading", { name: new RegExp(heading, "i"), level }),
    ).toBeInTheDocument();
  });

  it.each(["/resources", "/members", "/partners"])(
    "does not expose the removed route %s",
    (route) => {
      renderRoute(route);

      expect(
        screen.getByRole("heading", {
          name: "This path has not been added yet.",
          level: 1,
        }),
      ).toBeInTheDocument();
    },
  );

  it("places Supporter immediately after Donate in the toolbar", () => {
    renderRoute("/");

    const toolbar = screen.getByRole("navigation", { name: "Main navigation" });
    const labels = within(toolbar)
      .getAllByRole("link")
      .map((link) => link.textContent);

    expect(labels.slice(0, 4)).toEqual(["Story", "Volunteer", "Donate", "Supporter"]);
  });

  it("links from donation transparency to the Supporter page", () => {
    renderRoute("/donate");

    expect(
      screen.getByRole("link", { name: "Meet our supporters →" }),
    ).toHaveAttribute("href", "/supporter");
  });
});

describe("impact story", () => {
  it("tells Crystal's journey as a continuous story with a motivating next step", () => {
    renderRoute("/story");

    expect(screen.getByRole("heading", { name: "No spotlight. Just somewhere to begin." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Confidence found a rhythm." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /following the warm-up began leading it/i })).toBeInTheDocument();
    expect(screen.getByText("500+")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    const volunteerAction = screen
      .getAllByRole("link", { name: /^Volunteer/i })
      .find((link) => link.classList.contains("impact-story-closing-primary"));
    const donateAction = screen
      .getAllByRole("link", { name: /^Donate/i })
      .find((link) => link.classList.contains("impact-story-closing-secondary"));
    expect(volunteerAction).toHaveAttribute("href", "/volunteer");
    expect(donateAction).toHaveAttribute("href", "/donate");
  });
});

describe("learn more story invitation", () => {
  it("invites visitors to continue to Crystal's real story", () => {
    renderRoute("/neuro-strengths");

    expect(
      screen.getByRole("heading", { name: "See what possibility looks like in motion." }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /read crystal's story/i })).toHaveAttribute(
      "href",
      "/story",
    );
  });
});

describe("donor community experience", () => {
  it("centres participation and keeps a new wall message private while moderated", async () => {
    const wallPost = {
      id: "WALL-PRIVATE",
      donation_intent_id: "DON-PRIVATE",
      nickname: "Private Donor",
      message: "Only I can see this preview.",
      status: "pending",
      created_at: "2026-08-02T02:05:00+00:00",
    };
    // A fresh Response per call: the community page reads both the private
    // wall (`/donor-wall/me`) and the public feed (`/donor-wall/public`).
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input);
      const body = url.endsWith("/donor-wall/public") ? [] : [wallPost];
      return new Response(JSON.stringify(body), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    });
    renderRoute("/supporter");

    expect(screen.getAllByText("1,284").length).toBeGreaterThan(0);
    expect(screen.getByText("People making this possible")).toBeInTheDocument();
    expect(screen.queryByText("A community, not a leaderboard.")).not.toBeInTheDocument();
    expect(screen.queryByText(/Every circle represents a person/i)).not.toBeInTheDocument();
    expect(screen.queryByText("No amounts. No rankings. Every circle is equal.")).not.toBeInTheDocument();
    expect(screen.getByText(/I hope every child feels seen/i)).toBeInTheDocument();
    expect(await screen.findByText(/Visible only to you · awaiting review/i)).toBeInTheDocument();
    expect(screen.getByText(/Only I can see this preview/i)).toBeInTheDocument();
    expect(screen.queryByText(/Loading new supporters/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/No public messages yet/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "My donor profile" })).toHaveAttribute(
      "href",
      "/donor-profile",
    );
  });

  it("reveals the private, evidence-backed donor record after demo sign in", async () => {
    const user = userEvent.setup();
    let profileRequests = 0;
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input);
      if (url.endsWith("/donor-sessions")) {
        return new Response(JSON.stringify({ profile: {
          id: "DNR-PROFILE",
          email: "supporter@example.com",
          nickname: "阿木",
          name: "阿木",
          consent_to_updates: false,
          created_at: "2026-08-02T01:00:00+00:00",
        } }), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      if (url.endsWith("/donor-profiles/me")) {
        profileRequests += 1;
        if (profileRequests === 1) {
          return new Response(JSON.stringify({ detail: "Sign in" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify({
          profile: {
            id: "DNR-PROFILE",
            email: "supporter@example.com",
            nickname: "阿木",
            name: "阿木",
            consent_to_updates: false,
            created_at: "2026-08-02T01:00:00+00:00",
          },
          lifetime_amount_hkd: 600,
          donation_count: 1,
          donations: [{
            donation_intent_id: "DON-TODAY",
            cause_id: "dance",
            amount_hkd: 600,
            currency: "HKD",
            status: "simulated",
            created_at: "2026-08-02T02:00:00+00:00",
            impact: {
              cause_id: "dance",
              amount_hkd: 600,
              mode: "counted",
              copy_key: "dance",
              estimated_units: 4,
              unit_key: "dance_training_session",
              is_estimate: true,
            },
          }],
        }), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      throw new Error(`Unexpected request: ${url}`);
    });
    renderRoute("/donor-profile");

    await waitFor(() => expect(
      screen.getByRole("button", { name: "View my profile" }),
    ).toBeEnabled());
    await user.type(screen.getByLabelText("Email"), "supporter@example.com");
    await user.type(screen.getByLabelText("Password"), "private-demo");
    await user.click(screen.getByRole("button", { name: "View my profile" }));

    expect(screen.getByRole("heading", { name: "阿木", level: 1 })).toBeInTheDocument();
    expect(screen.getAllByText("HK$600").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "Your donation timeline" })).toBeInTheDocument();
    expect(screen.getByText(/DON-TODAY/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Expected programme work" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "What access may require" })).toBeVisible();
    expect(screen.getByText(/Next programme cycle/i)).toBeVisible();
    expect(screen.queryByText(/Only you can see this/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Message awaiting review/i)).not.toBeInTheDocument();
  });
});

describe("closed-loop forms", () => {
  it("supports the quick path without matching", async () => {
    const user = userEvent.setup();

    renderRoute("/volunteer");
    await user.click(screen.getByRole("link", { name: "Browse all roles" }));

    expect(
      screen.getByRole("heading", { name: "Creative Arts Class Assistant" }),
    ).toBeInTheDocument();
  });

  it("runs the volunteer personality quiz question-by-question to a role match", async () => {
    const user = userEvent.setup();

    renderRoute("/volunteer/match");
    expect(
      screen.getByRole("heading", { name: "Volunteer personality quiz", level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Five quick questions, one fun result.", level: 2 }),
    ).toBeInTheDocument();
    expect(screen.getByText(/might not be fully accurate/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Start the quiz" }));
    expect(screen.getByText("Question 1 of 5")).toBeInTheDocument();

    const creativeAnswers = [
      /too shy myself/i,
      /^Creative stuff/i,
      /work alongside them/i,
      /Using my creativity/i,
      /^Creative\. I think outside the box/i,
    ];

    for (const [index, answer] of creativeAnswers.entries()) {
      await user.click(screen.getByRole("button", { name: answer }));
      if (index < creativeAnswers.length - 1) {
        await screen.findByText(`Question ${index + 2} of 5`);
      }
    }

    expect(await screen.findByText("The Creative Spirit")).toBeInTheDocument();

    const creativeArtsHeading = screen.getByRole("heading", {
      name: "Creative Arts Class Assistant",
    });
    await user.click(
      within(creativeArtsHeading.closest("article")!).getByRole("link", {
        name: "Explore this role",
      }),
    );
    expect(
      screen.getByRole("heading", { name: "Creative Arts Class Assistant", level: 1 }),
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
    await user.click(screen.getByRole("button", { name: "Continue to your details" }));
    await user.click(screen.getByLabelText(/Give completely anonymously/i));
    await user.click(
      screen.getByRole("button", { name: "Review & continue to secure payment" }),
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

import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { App } from "../App";

function renderRoute(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
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
    ["/donate", "Give to a direction."],
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
    expect(screen.getByRole("heading", { name: "Dance Activity Buddy" })).toBeInTheDocument();
  });

  it("returns an explainable guided recommendation without restricting alternatives", async () => {
    const user = userEvent.setup();

    renderRoute("/volunteer/match");
    await user.click(screen.getByLabelText("Dance & movement"));
    await user.click(screen.getByLabelText("About once a month"));
    await user.click(screen.getByLabelText("Join activities directly"));
    await user.click(screen.getByRole("button", { name: "Show my starting point" }));

    expect(screen.getByText("Strong fit")).toBeInTheDocument();
    expect(screen.getByText(/connects with your interest in dance/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Two other roles worth exploring" })).toBeInTheDocument();

    const communityHeading = screen.getByRole("heading", {
      name: "Community Event Volunteer",
    });
    await user.click(
      within(communityHeading.closest("article")!).getByRole("link", {
        name: "Explore this role",
      }),
    );
    expect(
      screen.getByRole("heading", { name: "Community Event Volunteer", level: 1 }),
    ).toBeInTheDocument();
  });

  it("shows the volunteer story video without blocking the next step", () => {
    renderRoute("/volunteer/roles/dance_activity_buddy?journey=guided");

    expect(
      screen.getByLabelText(/Volunteer story for people exploring the Dance Activity Buddy/i),
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

  it("creates a simulated donation intention", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          reference: "DON-TEST1234",
          status: "simulated",
          simulation: true,
          impact_message: "Your preference supports community programmes.",
          acknowledgement: "Thank you for exploring support.",
          persistence: "none",
        }),
        { status: 201, headers: { "Content-Type": "application/json" } },
      ),
    );

    renderRoute("/donate");
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
    expect(screen.getByText(/no money was charged/i)).toBeInTheDocument();
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

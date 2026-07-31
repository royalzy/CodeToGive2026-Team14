import { cleanup, render, screen } from "@testing-library/react";
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
    ["/volunteer", "Come curious."],
    ["/donate", "What kind of opportunity would you like to create?"],
  ])("renders %s", (route, heading) => {
    renderRoute(route);

    expect(
      screen.getByRole("heading", { name: new RegExp(heading, "i"), level: 1 }),
    ).toBeInTheDocument();
  });
});

describe("closed-loop forms", () => {
  it("submits a volunteer expression of interest", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          reference: "VOL-TEST1234",
          status: "submitted",
          next_steps: ["Review", "Contact"],
          persistence: "none",
        }),
        { status: 201, headers: { "Content-Type": "application/json" } },
      ),
    );

    renderRoute("/volunteer");
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
    expect(screen.getByText(/VOL-TEST1234/)).toBeInTheDocument();
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
            persistence: "none",
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

    renderRoute("/volunteer");
    await user.click(
      screen.getByRole("button", { name: "Submit demo interest" }),
    );

    expect(await screen.findByText("Please enter your name.")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

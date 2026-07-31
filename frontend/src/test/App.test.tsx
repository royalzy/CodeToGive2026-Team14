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
    ["/donate", "Give to a direction."],
    ["/help", "Support for families and carers"],
    ["/resources", "Learning for belonging"],
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

    renderRoute("/volunteer");
    await user.click(
      screen.getByRole("button", { name: "Submit demo interest" }),
    );

    expect(await screen.findByText("Please enter your name.")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

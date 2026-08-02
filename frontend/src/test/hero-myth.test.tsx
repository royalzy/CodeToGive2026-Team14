import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { HomePage } from "../pages/HomePage";
import { LanguageProvider } from "../components/LanguageContext";

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const round = {
  id: "rw-001",
  theme: "stigma",
  kick: "One of these is actually TRUE. Can you spot it?",
  twist: "all_myths",
  statements: [
    { id: "st-001a", text: "Statement one." },
    { id: "st-001b", text: "Statement two." },
    { id: "st-001c", text: "Statement three." },
  ],
};

const reveal = {
  round_id: "rw-001",
  twist: "all_myths",
  punchline: "Gotcha — all three are myths.",
  selected_statement_id: "st-001a",
  statements: [
    {
      id: "st-001a",
      is_myth: true,
      reveal: "Reveal A.",
      source: { label: "ABC News", url: "https://example.com/a" },
    },
    {
      id: "st-001b",
      is_myth: true,
      reveal: "Reveal B.",
      source: { label: "Love 21 financials", url: "https://example.com/b" },
    },
    {
      id: "st-001c",
      is_myth: true,
      reveal: "Reveal C.",
      source: { label: "WHO", url: "https://example.com/c" },
    },
  ],
};

function renderHome() {
  return render(
    <MemoryRouter>
      <LanguageProvider>
        <HomePage />
      </LanguageProvider>
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("hero myth-check", () => {
  it("reveals the all-three-myths punchline after picking a statement", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input);
      if (url.endsWith("/quiz/rounds/hero")) {
        return jsonResponse(round);
      }
      if (url.endsWith("/quiz/rounds/answer")) {
        return jsonResponse(reveal);
      }
      return jsonResponse({}, 404);
    });

    renderHome();

    const statement = await screen.findByRole("button", {
      name: /Statement one\./,
    });
    await user.click(statement);

    expect(
      await screen.findByText("Gotcha — all three are myths."),
    ).toBeInTheDocument();
    expect(screen.getByText("Reveal A.")).toBeInTheDocument();
    expect(screen.getByText("Reveal B.")).toBeInTheDocument();
    expect(screen.getByText("Reveal C.")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "See the evidence" }),
    ).toBeInTheDocument();
  });

  it("renders nothing when the round endpoint is unavailable", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(
      new TypeError("Failed to fetch"),
    );

    renderHome();

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(
      screen.queryByText("One of these is actually TRUE. Can you spot it?"),
    ).not.toBeInTheDocument();
  });
});

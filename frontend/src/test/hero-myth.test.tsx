import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LanguageProvider } from "../components/LanguageContext";
import { HomePage } from "../pages/HomePage";

const round = {
  id: "rw-001",
  theme: "stigma",
  kick: "One of these is actually a MYTH. Can you spot it?",
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

const stats = {
  rounds: [
    {
      round_id: "rw-001",
      attempts: 42,
      languages: 3,
      statements: [
        { statement_id: "st-001a", count: 20 },
        { statement_id: "st-001b", count: 12 },
        { statement_id: "st-001c", count: 10 },
      ],
    },
  ],
};

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

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

describe("landing page myth check", () => {
  it("reveals the answer and community count after a visitor picks a statement", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input);
      if (url.includes("/quiz/rounds/hero")) {
        return jsonResponse(round);
      }
      if (url.endsWith("/quiz/rounds/answer")) {
        return jsonResponse(reveal);
      }
      if (url.endsWith("/quiz/rounds/stats")) {
        return jsonResponse(stats);
      }
      return jsonResponse({}, 404);
    });

    renderHome();
    const mythCheck = await screen.findByRole("complementary", { name: "Myth check" });

    expect(mythCheck.closest(".bg-love-cream")).not.toBeNull();
    await user.click(await screen.findByRole("button", { name: /Statement one\./ }));

    expect(await screen.findByText("Gotcha — all three are myths.")).toBeInTheDocument();
    expect(screen.getByText("Reveal A.")).toBeInTheDocument();
    expect(screen.getByText("Reveal B.")).toBeInTheDocument();
    expect(screen.getByText("Reveal C.")).toBeInTheDocument();
    expect(
      screen.getByText("42 people have already been put to the test on this round."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Learn more/ })).toHaveAttribute(
      "href",
      "/neuro-strengths",
    );
  });

  it("leaves the current landing page intact when the myth service is unavailable", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("Failed to fetch"));

    renderHome();

    expect(
      screen.getByRole("heading", {
        name: "Love 21 builds fuller lives around every ability.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "What have you heard?" }),
    ).not.toBeInTheDocument();
  });
});

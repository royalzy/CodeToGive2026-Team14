import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LanguageProvider } from "../components/LanguageContext";
import { LiveMetrics } from "../components/admin/LiveMetrics";

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const summary = {
  generated_at: "2026-08-02T00:00:00Z",
  questionnaire_submissions: 3,
  quizzes: {
    attempts: 42,
    languages: { en: 30, zh: 12 },
    rounds: [{ round_id: "rw-001", attempts: 42 }],
  },
  donations: {
    intents: 51,
    total_hkd: 30191,
    anonymous_count: 24,
    programs: [{ program: "dance", intents: 46, amount_hkd: 27600 }],
  },
  donors: { profiles: 8, wall_posts: 3 },
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("LiveMetrics admin widget", () => {
  it("renders the live backend summary numbers", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse(summary));

    render(
      <LanguageProvider>
        <LiveMetrics />
      </LanguageProvider>,
    );

    expect(await screen.findByText("42")).toBeInTheDocument();
    expect(screen.getByText("Myth-check answers")).toBeInTheDocument();
    expect(screen.getByText("2 languages · 1 round")).toBeInTheDocument();
    expect(screen.getByText("51")).toBeInTheDocument();
    expect(screen.getByText("HK$30,191 · 24 anonymous")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("3 wall messages")).toBeInTheDocument();
  });

  it("shows the fallback notice when the API is unreachable", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("offline"));

    render(
      <LanguageProvider>
        <LiveMetrics />
      </LanguageProvider>,
    );

    expect(await screen.findByText("API not reachable")).toBeInTheDocument();
  });
});
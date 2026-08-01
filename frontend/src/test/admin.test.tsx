import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

function mockReportFetch(payload: object) {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

async function renderAdminPage() {
  vi.resetModules();
  const { AdminPage } = await import("../pages/AdminPage");
  return render(<AdminPage />);
}

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  vi.resetModules();
});

const configuredReport = {
  configured: true,
  report: {
    period_days: 30,
    pageviews: 1500,
    visitors: 400,
    visits: 500,
    bounce_rate: 20,
    totaltime_seconds: 3600,
    top_pages: [
      { path: "/donate", visitors: 90 },
      { path: "/", visitors: 80 },
    ],
    top_events: [{ name: "donation_intent", count: 25 }],
  },
  error: null,
};

describe("AdminPage analytics embed", () => {
  it("shows the fallback note when the dashboard URL is not configured", async () => {
    vi.stubEnv("VITE_UMAMI_DASHBOARD_URL", "");
    mockReportFetch({ configured: false, report: null, error: "not configured" });
    await renderAdminPage();

    expect(await screen.findByText("Analytics not configured")).toBeInTheDocument();
    expect(screen.getByText("Site analytics")).toBeInTheDocument();
  });

  it("embeds the Umami dashboard iframe when configured", async () => {
    vi.stubEnv(
      "VITE_UMAMI_DASHBOARD_URL",
      "https://cloud.umami.is/share/nyrKt3D5zDUxsziQ",
    );
    mockReportFetch(configuredReport);
    await renderAdminPage();

    const frame = screen.getByTitle("Umami analytics dashboard");
    expect(frame).toHaveAttribute(
      "src",
      "https://cloud.umami.is/share/nyrKt3D5zDUxsziQ",
    );
    expect(screen.queryByText("Analytics not configured")).not.toBeInTheDocument();
  });

  it("shows core metrics from the report endpoint", async () => {
    vi.stubEnv("VITE_UMAMI_DASHBOARD_URL", "");
    mockReportFetch(configuredReport);
    await renderAdminPage();

    expect(await screen.findByText("1,500")).toBeInTheDocument();
    expect(screen.getByText("400")).toBeInTheDocument();
    expect(screen.getByText("20%")).toBeInTheDocument();
    expect(screen.getByText("/donate · 90 visitors")).toBeInTheDocument();
    expect(screen.getByText("donation_intent · 25")).toBeInTheDocument();
  });

  it("shows the unconfigured message when the report endpoint is not configured", async () => {
    vi.stubEnv("VITE_UMAMI_DASHBOARD_URL", "");
    mockReportFetch({ configured: false, report: null, error: "UMAMI_API_KEY missing" });
    await renderAdminPage();

    expect(
      await screen.findByText("Analytics reporting not configured"),
    ).toBeInTheDocument();
  });
});

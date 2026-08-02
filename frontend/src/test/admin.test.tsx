import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../hooks/useLanguage", () => ({
  useLanguage: () => ({
    lang: "en",
    setLang: vi.fn(),
    t: (key: string) => key,
  }),
}));

vi.mock("../components/LanguageContext", () => ({
  LanguageProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

async function renderAdminPage() {
  vi.resetModules();
  const { AdminPage } = await import("../pages/AdminPage");
  return render(
    <MemoryRouter>
      <AdminPage />
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("AdminPage analytics embed", () => {
  it("shows the fallback note when the dashboard URL is not configured", async () => {
    vi.stubEnv("VITE_UMAMI_DASHBOARD_URL", "");
    await renderAdminPage();

    expect(screen.getByText("Analytics not configured")).toBeInTheDocument();
    expect(screen.getByText("Site analytics")).toBeInTheDocument();
  });

  it("embeds the Umami dashboard iframe when configured", async () => {
    vi.stubEnv(
      "VITE_UMAMI_DASHBOARD_URL",
      "https://cloud.umami.is/share/nyrKt3D5zDUxsziQ",
    );
    await renderAdminPage();

    const frame = screen.getByTitle("Umami analytics dashboard");
    expect(frame).toHaveAttribute(
      "src",
      "https://cloud.umami.is/share/nyrKt3D5zDUxsziQ",
    );
    expect(screen.queryByText("Analytics not configured")).not.toBeInTheDocument();
  });
});
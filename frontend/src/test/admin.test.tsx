import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { AdminPage } from "../pages/AdminPage";

afterEach(() => {
  cleanup();
});

describe("AdminPage analytics embed", () => {
  it("shows the fallback note when the dashboard URL is not configured", () => {
    render(<AdminPage />);

    expect(
      screen.getByText("Analytics not configured"),
    ).toBeInTheDocument();
    expect(screen.getByText("Site analytics")).toBeInTheDocument();
  });
});

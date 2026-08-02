import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import { LanguageProvider } from "../components/LanguageContext";
import { HomePage } from "../pages/HomePage";

function renderHome() {
  return render(
    <MemoryRouter>
      <LanguageProvider>
        <HomePage />
      </LanguageProvider>
    </MemoryRouter>,
  );
}

afterEach(cleanup);

describe("Love 21 landing page", () => {
  it("explains the mission, barriers, support model, and depth", () => {
    renderHome();

    expect(
      screen.getByRole("heading", {
        name: "Love 21 builds fuller lives around every ability.",
        level: 1,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Potential is everywhere. Support is not." }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "One community. Five connected layers of support.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sport & Athletics" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Nutrition & Wellness" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Arts & Performance" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Community & Belonging" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Holistic Development" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Weekly. Connected. Long-term." }),
    ).toBeInTheDocument();
  });

  it("links visitors to the main next steps", () => {
    renderHome();

    expect(screen.getByRole("link", { name: "Learn More" })).toHaveAttribute(
      "href",
      "/neuro-strengths",
    );
    expect(screen.getByRole("link", { name: "Story" })).toHaveAttribute("href", "/story");
    expect(screen.getByRole("link", { name: "Volunteer" })).toHaveAttribute(
      "href",
      "/volunteer",
    );
    expect(screen.getByRole("link", { name: "Donate" })).toHaveAttribute("href", "/donate");
    expect(screen.getByRole("link", { name: "Need help?" })).toHaveAttribute("href", "/help");
  });
});

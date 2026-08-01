import { afterEach, describe, expect, it, vi } from "vitest";

import * as umami from "../analytics/umami";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  document.head.innerHTML = "";
  delete window.umami;
});

describe("umami analytics", () => {
  it("is not configured without env vars", () => {
    vi.stubEnv("VITE_UMAMI_HOST", "");
    vi.stubEnv("VITE_UMAMI_WEBSITE_ID", "");
    expect(umami.isConfigured()).toBe(false);
  });

  it("injects the tracking script once when configured", () => {
    vi.stubEnv("VITE_UMAMI_HOST", "https://analytics.example.org/");
    vi.stubEnv("VITE_UMAMI_WEBSITE_ID", "site-123");
    umami.initAnalytics();
    umami.initAnalytics();

    const scripts = [...document.querySelectorAll("script")];
    expect(scripts).toHaveLength(1);
    expect(scripts[0].src).toBe("https://analytics.example.org/script.js");
    expect(scripts[0].dataset.websiteId).toBe("site-123");
  });

  it("does not inject the script when unconfigured", () => {
    vi.stubEnv("VITE_UMAMI_HOST", "");
    vi.stubEnv("VITE_UMAMI_WEBSITE_ID", "");
    umami.initAnalytics();
    expect(document.querySelectorAll("script")).toHaveLength(0);
  });

  it("track forwards event name and props to window.umami", () => {
    vi.stubEnv("VITE_UMAMI_HOST", "https://analytics.example.org");
    vi.stubEnv("VITE_UMAMI_WEBSITE_ID", "site-123");
    const trackMock = vi.fn();
    window.umami = { track: trackMock };

    umami.track("donation_intent", { program: "sports", amount: 500 });

    expect(trackMock).toHaveBeenCalledWith("donation_intent", {
      program: "sports",
      amount: 500,
    });
  });

  it("track is a no-op when unconfigured", () => {
    vi.stubEnv("VITE_UMAMI_HOST", "");
    vi.stubEnv("VITE_UMAMI_WEBSITE_ID", "");
    window.umami = { track: vi.fn() };

    expect(() => umami.track("donation_intent")).not.toThrow();
  });

  it("track is a no-op when the script has not loaded", () => {
    vi.stubEnv("VITE_UMAMI_HOST", "https://analytics.example.org");
    vi.stubEnv("VITE_UMAMI_WEBSITE_ID", "site-123");
    expect(() => umami.track("donation_intent")).not.toThrow();
  });
});

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

async function completeDemoApplication(page: import("@playwright/test").Page) {
  await page.getByLabel("Name").fill("Jamie Chan");
  await page.getByLabel("Email").fill("jamie@example.com");
  await page.getByLabel(/I understand this is a demonstration/i).check();
  await page.getByRole("button", { name: "Submit demo request" }).click();
}

test("guided volunteer path creates a provisional first-session plan", async ({
  page,
}) => {
  await page.goto("/volunteer");
  await page.getByRole("link", { name: "Start the 60-second match" }).click();
  await page.getByLabel("Dance & movement").check();
  await page.getByLabel("About once a month").check();
  await page.getByLabel("Join activities directly").check();
  await page.getByRole("button", { name: "Show my starting point" }).click();
  await expect(page.getByText("Strong fit")).toBeVisible();
  await page.getByRole("link", { name: "Explore this role" }).first().click();
  await expect(page.locator("video")).toBeVisible();
  await expect(page.locator('video source[type="video/mp4"]')).toHaveAttribute(
    "src",
    "/video/volunteer-story.mp4",
  );
  await page.getByRole("link", { name: "Try this session" }).click();
  await completeDemoApplication(page);

  await expect(
    page.getByRole("heading", { name: /demo request is pending — not booked/i }),
  ).toBeVisible();
  await expect(page.getByText(/no place has been reserved/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Saturday Dance Project" })).toBeVisible();
});

test("quick volunteer path can skip matching and the story video", async ({ page }) => {
  await page.goto("/volunteer");
  await page.getByRole("link", { name: /View demo sessions/i }).click();
  await page.getByRole("link", { name: "Try this session" }).first().click();
  await completeDemoApplication(page);

  await expect(page.getByText(/no place has been reserved/i)).toBeVisible();
});

test("community volunteer can register interest without a session", async ({ page }) => {
  await page.goto("/volunteer/roles/community_event_volunteer");
  await page.getByRole("link", { name: "Register demo interest" }).click();
  await completeDemoApplication(page);

  await expect(
    page.getByRole("heading", { name: /demo interest has been explored/i }),
  ).toBeVisible();
  await expect(page.getByText(/No activity has been booked or confirmed/i)).toBeVisible();
});

test("visitor can complete the donation simulation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Explore giving" }).click();

  await expect(
    page.getByRole("heading", { name: /Give to a direction/i }),
  ).toBeVisible();
  await expect(page.getByText(/not a payment form/i)).toBeVisible();

  await page.getByRole("button", { name: "HK$1,000" }).click();
  await page
    .getByLabel("Where would you like to direct support?")
    .selectOption("community");
  await page.getByRole("button", { name: "Create demo intention" }).click();

  await expect(
    page.getByRole("heading", { name: /support intention has been explored/i }),
  ).toBeVisible();
  await expect(page.getByText(/no money was charged/i)).toBeVisible();
});

test("core pages have no automatically detectable accessibility violations", async ({
  page,
}) => {
  for (const route of [
    "/",
    "/impact",
    "/volunteer",
    "/volunteer/match",
    "/volunteer/roles",
    "/volunteer/roles/dance_activity_buddy",
    "/volunteer/sessions",
    "/volunteer/apply?roleId=community_event_volunteer&firstStep=interest_only",
    "/volunteer/confirmed",
    "/donate",
  ]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .exclude(".wordmark")
      .analyze();
    expect(results.violations, `Accessibility violations on ${route}`).toEqual([]);
  }
});

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

async function completeDemoApplication(page: import("@playwright/test").Page) {
  await page.getByLabel("Name").fill("Jamie Chan");
  await page.getByLabel("Email").fill("jamie@example.com");
  await page.getByLabel(/I understand this is a demonstration/i).check();
  await page.getByRole("button", { name: "Submit demo request" }).click();
}

async function openCreativeArtsRole(page: import("@playwright/test").Page) {
  const roleCard = page.getByRole("article").filter({
    has: page.getByRole("heading", { name: "Creative Arts Class Assistant" }),
  });
  await roleCard.getByRole("link", { name: "Explore this role" }).click();
}

test("guided volunteer quiz creates a provisional first-session plan", async ({
  page,
}) => {
  await page.goto("/volunteer");
  await page.getByRole("link", { name: "Find out" }).click();
  await page.getByRole("button", { name: "Start the quiz" }).click();

  for (const answer of [
    /too shy myself/i,
    /^Creative stuff/i,
    /work alongside them/i,
    /Using my creativity/i,
    /^Creative\. I think outside the box/i,
  ]) {
    await page.getByRole("button", { name: answer }).click();
  }

  await expect(
    page.getByRole("heading", { name: "The Creative Spirit" }),
  ).toBeVisible();
  await openCreativeArtsRole(page);
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

test("volunteer can browse roles without completing the quiz", async ({ page }) => {
  await page.goto("/volunteer");
  await page.getByRole("link", { name: "Browse all roles" }).click();
  await openCreativeArtsRole(page);
  await page.getByRole("link", { name: "Try this session" }).click();
  await completeDemoApplication(page);

  await expect(page.getByText(/no place has been reserved/i)).toBeVisible();
});

test("volunteer can register interest for a role without a session", async ({ page }) => {
  await page.goto("/volunteer/roles/enrichment_class_leader");
  await page.getByRole("link", { name: "Register demo interest" }).click();
  await completeDemoApplication(page);

  await expect(
    page.getByRole("heading", { name: /demo interest has been explored/i }),
  ).toBeVisible();
  await expect(page.getByText(/No activity has been booked or confirmed/i)).toBeVisible();
});

test("visitor can complete the donation simulation", async ({ page }) => {
  const unique = `${Date.now()}-${test.info().parallelIndex}`;
  await page.goto("/");
  await page.getByRole("main").getByRole("link", { name: "Donate" }).click();

  await expect(
    page.getByRole("heading", {
      name: /HK\$3.28m received/i,
    }),
  ).toBeVisible();
  await expect(page.getByText(/Hackathon simulation/i)).toBeVisible();

  await page.getByLabel("Discover a Talent").check();
  await page.getByRole("button", { name: "HK$600" }).click();
  await expect(
    page.getByRole("heading", {
      name: /Four more chances to move, learn, and shine/i,
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Continue to your details" }).click();
  await page.getByLabel(/Create a donor profile/i).check();
  await page.getByLabel("Unique nickname").fill(`Alex Chan ${unique}`);
  await page.getByLabel("Name (optional)").fill("Alex Chan");
  await page.getByLabel("Email", { exact: true }).fill(`alex-${unique}@example.com`);
  await page.getByLabel("Password").fill("private-demo");
  await page.getByRole("button", { name: "Review & continue to secure payment" }).click();
  await expect(page.getByRole("heading", { name: "Review your prototype donation" })).toBeVisible();
  await page
    .getByRole("button", {
      name: "Confirm prototype donation of HK$600",
    })
    .click();

  await expect(
    page.getByRole("heading", { name: `Thank you, Alex Chan ${unique}.` }),
  ).toBeVisible();
  await expect(page.getByText(/no money was charged/i)).toBeVisible();
  await page.getByRole("link", { name: "Visit our supporters" }).click();
  await expect(page).toHaveURL(/\/supporter$/);
});

test("donation impact journey remains usable on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/donate");

  await page.getByLabel("Discover a Talent").check();
  await page.getByLabel("Custom donation amount").fill("100");
  await expect(
    page.getByRole("heading", {
      name: /Another chance to move, learn, and shine begins here/i,
    }),
  ).toBeVisible();
  await expect(page.getByText(/Demonstration estimates/i)).toBeVisible();
  await page.getByRole("button", { name: "Continue to your details" }).click();
  await page.getByLabel(/Give completely anonymously/i).check();
  await page
    .getByRole("button", { name: "Review & continue to secure payment" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Review your prototype donation" }),
  ).toBeVisible();
});

test("core pages have no automatically detectable accessibility violations", async ({
  page,
}) => {
  for (const route of [
    "/",
    "/story",
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

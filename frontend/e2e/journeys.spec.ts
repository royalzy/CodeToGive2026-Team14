import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("visitor can move from home to a volunteer confirmation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Find your place" }).first().click();

  await expect(
    page.getByRole("heading", { name: /Come curious. Leave connected./i }),
  ).toBeVisible();

  await page.getByLabel("Name").fill("Jamie Chan");
  await page.getByLabel("Email").fill("jamie@example.com");
  await page.getByLabel("Sports & fitness").check();
  await page
    .getByLabel("When are you usually available?")
    .selectOption("weekend");
  await page
    .getByLabel(/I would allow Love 21 to contact me/i)
    .check();
  await page.getByRole("button", { name: "Submit demo interest" }).click();

  await expect(
    page.getByRole("heading", { name: /ready to take the next step/i }),
  ).toBeVisible();
  await expect(page.getByText(/VOL-/)).toBeVisible();
});

test("visitor can complete the donation simulation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Explore giving" }).click();

  await expect(
    page.getByRole("heading", {
      name: /What kind of opportunity would you like to create/i,
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
  await page
    .getByRole("button", { name: "Continue to your details" })
    .click();
  await page.getByLabel("Name (optional)").fill("Alex Chan");
  await page.getByLabel("Email (optional)").fill("alex@example.com");
  await page.getByRole("button", { name: "Review your intention" }).click();
  await expect(page.getByText("Discover a Talent")).toBeVisible();
  await page
    .getByRole("button", {
      name: "Confirm prototype donation of HK$600",
    })
    .click();

  await expect(
    page.getByRole("heading", { name: "Thank you, Alex Chan." }),
  ).toBeVisible();
  await expect(page.getByText(/no money was charged/i)).toBeVisible();
  await page.getByRole("link", { name: "Stay part of the journey" }).click();
  await expect(page).toHaveURL(/\/impact$/);
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
  await page
    .getByRole("button", { name: "Continue to your details" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Tell us how to thank you" }),
  ).toBeVisible();
});

test("core pages have no automatically detectable accessibility violations", async ({
  page,
}) => {
  for (const route of ["/", "/impact", "/volunteer", "/donate"]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .exclude(".wordmark")
      .analyze();
    expect(results.violations, `Accessibility violations on ${route}`).toEqual([]);
  }
});

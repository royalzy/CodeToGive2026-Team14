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
  for (const route of ["/", "/impact", "/volunteer", "/donate"]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .exclude(".wordmark")
      .analyze();
    expect(results.violations, `Accessibility violations on ${route}`).toEqual([]);
  }
});


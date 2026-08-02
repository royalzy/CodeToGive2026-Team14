import { expect, test } from "@playwright/test";

test("supporter quick actions stay top-right and Donate starts at the top", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/community");

  const communityActions = page.getByRole("complementary", {
    name: "Supporter quick actions",
  });
  await expect(communityActions).toBeVisible();
  const communityBox = await communityActions.boundingBox();
  expect(communityBox).not.toBeNull();
  expect(communityBox!.y).toBeLessThan(160);
  expect(1440 - communityBox!.x - communityBox!.width).toBeLessThan(32);

  await page.evaluate(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" });
  });
  await page.locator('.desktop-nav a[href="/donate"]').click();

  await expect(page).toHaveURL(/\/donate$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

  const donateActions = page.getByRole("complementary", {
    name: "Supporter quick actions",
  });
  await expect(donateActions).toBeVisible();
  await expect(donateActions.getByRole("link", { name: "Our community" })).toBeVisible();
  await expect(donateActions.getByRole("link", { name: "My donor profile" })).toBeVisible();
});

test("backend confirms the current donation flow without timing out", async ({ page }) => {
  await page.goto("/donate");
  await page.getByLabel("Discover a Talent").check();
  await page.getByRole("button", { name: "HK$600" }).click();
  await page.getByLabel(/Give completely anonymously/i).check();
  await page.getByRole("button", { name: /Review & continue/ }).click();
  await page.getByRole("button", { name: /Confirm prototype donation/ }).click();

  await expect(page.getByRole("heading", { name: "Thank you." })).toBeVisible();
  await expect(page.getByText(/service took too long/i)).toHaveCount(0);
  await expect(page.getByText(/Backend-calculated expected impact/i)).toBeVisible();
});

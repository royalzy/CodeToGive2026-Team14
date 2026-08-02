import { expect, test } from "@playwright/test";

test("supporter quick actions stay top-right and Donate starts at the top", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/supporter");

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
  await expect(donateActions.getByRole("link", { name: "Supporters" })).toBeVisible();
  await expect(donateActions.getByRole("link", { name: "My donor profile" })).toBeVisible();
});

test("backend confirms the current donation flow without timing out", async ({ page }) => {
  await page.goto("/donate");
  await page.getByLabel("Discover a Talent").check();
  await page.getByRole("button", { name: "HK$600" }).click();
  await page.getByRole("button", { name: "Continue to your details" }).click();
  await page.getByLabel(/Give completely anonymously/i).check();
  await page.getByRole("button", { name: /Review & continue/ }).click();
  await page.getByRole("button", { name: /Confirm prototype donation/ }).click();

  await expect(page.getByRole("heading", { name: "Thank you." })).toBeVisible();
  await expect(page.getByText(/service took too long/i)).toHaveCount(0);
  await expect(page.getByText(/Backend-calculated expected impact/i)).toBeVisible();
});

test("new donor donation appears in their private wall and profile", async ({ page }) => {
  const unique = `${Date.now()}-${test.info().parallelIndex}`;
  const nickname = `E2E Donor ${unique}`;
  const wallMessage = `Private preview ${unique}`;

  await page.goto("/donate");
  await page.getByLabel("Discover a Talent").check();
  await page.getByRole("button", { name: "HK$600" }).click();
  await page.getByRole("button", { name: "Continue to your details" }).click();
  await page.getByLabel(/Create a donor profile/i).check();
  await page.getByRole("textbox", { name: "Email", exact: true }).fill(`donor-${unique}@example.com`);
  await page.getByLabel("Password", { exact: true }).fill("secret1");
  await page.getByRole("textbox", { name: "Unique nickname", exact: true }).fill(nickname);
  await page.getByRole("button", { name: /Review & continue/ }).click();

  await expect(page.getByRole("heading", { name: "Review your prototype donation" })).toBeVisible();
  await page.getByRole("button", { name: /Confirm prototype donation of HK\$600/ }).click();
  await page.getByLabel(/Message to the community/i).fill(wallMessage);
  await page.getByRole("button", { name: "Send for review" }).click();
  await expect(page.getByText(/Visible to you now · public after review/i)).toBeVisible();

  await page.getByRole("link", { name: "Visit our supporters" }).click();
  await expect(page.getByText(wallMessage)).toBeVisible();
  await expect(page.getByText(/Visible only to you · awaiting review/i)).toBeVisible();

  await page.getByRole("link", { name: "My donor profile" }).first().click();
  await expect(page.getByRole("heading", { name: nickname, level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Your donation timeline" })).toBeVisible();
  await expect(page.getByText(/HK\$600 · Discover a Talent/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Expected programme work" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "How Love 21 will verify it" })).toBeVisible();
});

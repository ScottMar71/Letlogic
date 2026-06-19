import { test, expect } from "@playwright/test";

const email = process.env.PLAYWRIGHT_TEST_EMAIL?.trim();
const password = process.env.PLAYWRIGHT_TEST_PASSWORD?.trim();

test.describe("authenticated flows", () => {
  test.beforeEach(() => {
    test.skip(
      !email || !password,
      "Set PLAYWRIGHT_TEST_EMAIL and PLAYWRIGHT_TEST_PASSWORD to run auth E2E tests",
    );
  });

  test("login reaches dashboard", async ({ page }) => {
    await page.goto("/login?next=/dashboard");
    await page.getByLabel("Email").fill(email!);
    await page.getByLabel("Password").fill(password!);
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
  });

  test("authenticated user can open screening workspace", async ({ page }) => {
    await page.goto("/login?next=/screen");
    await page.getByLabel("Email").fill(email!);
    await page.getByLabel("Password").fill(password!);
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/screen/);
    await expect(
      page.getByRole("heading", { name: /screen an applicant/i }),
    ).toBeVisible();
  });

  test("settings page loads when signed in", async ({ page }) => {
    await page.goto("/login?next=/settings");
    await page.getByLabel("Email").fill(email!);
    await page.getByLabel("Password").fill(password!);
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/settings/);
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  });
});

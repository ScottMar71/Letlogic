import { test, expect } from "@playwright/test";

test.describe("marketing smoke", () => {
  test("homepage loads with primary CTAs", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /screen uk tenant applications/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /view a sample report/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /sign in to screen/i })).toBeVisible();
  });

  test("key marketing pages are reachable", async ({ page }) => {
    for (const path of ["/pricing", "/how-it-works", "/about", "/sample", "/contact"]) {
      await page.goto(path);
      await expect(page.locator("#main-content")).toBeVisible();
    }
  });

  test("sample report shows assessment output", async ({ page }) => {
    await page.goto("/sample");
    await expect(page.getByRole("heading", { name: /alex morgan/i })).toBeVisible();
    await expect(page.getByText(/recommendation|risk/i).first()).toBeVisible();
  });

  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
  });

  test("robots and sitemap are served", async ({ request, baseURL }) => {
    const robots = await request.get(`${baseURL}/robots.txt`);
    expect(robots.ok()).toBeTruthy();
    expect(await robots.text()).toContain("Sitemap");

    const sitemap = await request.get(`${baseURL}/sitemap.xml`);
    expect(sitemap.ok()).toBeTruthy();
    expect(await sitemap.text()).toContain("<urlset");
  });
});

import { test, expect } from "@playwright/test";

test("logowanie i nawigacja", async ({ page }) => {
  await page.goto("/login");

  await page.getByTestId("login-email").fill("demo@xtb.local");
  await page.getByTestId("login-password").fill("Passw0rd");
  await page.getByTestId("login-submit").click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByTestId("dashboard-title")).toBeVisible();

  await page.getByTestId("nav-order").click();
  await expect(page).toHaveURL(/\/order$/);

  await page.getByTestId("nav-logout").click();
  await expect(page.getByTestId("nav-logout")).toBeHidden();
  await page.getByTestId("nav-login").click();
  await expect(page).toHaveURL(/\/login$/);
});

test("błędne dane logowania", async ({ page }) => {
  await page.goto("/login");

  await page.getByTestId("login-email").fill("demo@xtb.local");
  await page.getByTestId("login-password").fill("Wrong123");
  await page.getByTestId("login-submit").click();

  await expect(page.getByTestId("login-error")).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});

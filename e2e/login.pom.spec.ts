import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";

test("logowanie i nawigacja", async ({ page }) => {
  const login = new LoginPage(page);
  await login.login();

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
  const login = new LoginPage(page);
  await login.login("demo@xtb.local", "Wrong123");

  await expect(login.errorLocator).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});

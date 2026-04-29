// e2e/fixtures.ts
import { test as base, expect, type Page } from "@playwright/test";
import { OrderPage } from "./pages/OrderPage";

type Fixtures = {
  authenticatedPage: Page;
  orderPage: OrderPage;
};

export const test = base.extend<Fixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Odpowiednik LoginPage
    await page.goto("/login");
    await page.getByTestId("login-email").fill("demo@xtb.local");
    await page.getByTestId("login-password").fill("Passw0rd");
    await page.getByTestId("login-submit").click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await use(page);
  },
  orderPage: async ({ authenticatedPage }, use) => {
    await use(new OrderPage(authenticatedPage));
  },
});

export { expect };

// === Użycie w teście ===
// import { test, expect } from './fixtures'
//
// test('składa zlecenie', async ({ orderPage }) => {
//   await orderPage.goto()
//   await orderPage.fill({ symbol: 'EURUSD', side: 'BUY', volume: 0.1 })
//   await orderPage.submit()
//   await orderPage.expectSuccess()
// })

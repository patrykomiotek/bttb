import { test, expect, type Page } from "@playwright/test";

const API = "http://localhost:3001";

// TODO: refactor to POM
async function login(page: Page) {
  await page.goto("/login");
  await page.getByTestId("login-email").fill("demo@xtb.local");
  await page.getByTestId("login-password").fill("Passw0rd");
  await page.getByTestId("login-submit").click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

test.beforeEach(async ({ context, request }) => {
  await request.delete(`${API}/api/orders`);
});

test.describe("Scenariusz 1 — prawdziwy E2E", () => {
  test("składa zlecenie BUY EURUSD", async ({ page, request }) => {
    await login(page);
    await page.getByTestId("nav-order").click();

    await page.getByTestId("order-symbol").fill("EURUSD");
    await page.getByTestId("order-side").selectOption("BUY");
    await page.getByTestId("order-volume").fill("0.1");
    await page.getByTestId("order-submit").click();

    const success = page.getByTestId("order-success");
    await expect(success).toBeVisible();
    await expect(success).toContainText("ORD-");

    const res = await request.get(`${API}/api/orders`);
    const orders = await res.json();
    expect(orders).toHaveLength(1);
    expect(orders[0]).toMatchObject({
      symbol: "EURUSD",
      side: "BUY",
      volume: 0.1,
    });
  });

  test("walidacja - symbol abc", async ({ page }) => {
    await login(page);
    await page.getByTestId("nav-order").click();

    await page.getByTestId("order-symbol").fill("abc");
    await page.getByTestId("order-symbol").blur();
    await expect(page.getByTestId("order-symbol-error")).toBeVisible();
    await expect(page.getByTestId("order-submit")).toBeDisabled();
  });

  test("walidacja - volume 0", async ({ page }) => {
    await login(page);
    await page.getByTestId("nav-order").click();

    await page.getByTestId("order-volume").fill("0");
    await page.getByTestId("order-volume").blur();
    await expect(page.getByTestId("order-volume-error")).toBeVisible();
  });

  test("walidacja - SL > openPrice dla BUY", async ({ page }) => {
    await login(page);
    await page.getByTestId("nav-order").click();

    await page.getByTestId("order-side").selectOption("BUY");
    await page.getByTestId("order-stoploss").fill("2.0");
    await page.getByTestId("order-stoploss").blur();
    await expect(page.getByTestId("order-stoploss-error")).toBeVisible();
  });
});

test.describe("Scenariusz 2 — mock przez page.route", () => {
  test("500 → order-submit-error", async ({ page }) => {
    await login(page);
    await page.route("**/api/orders", async (route) => {
      if (route.request().method() !== "POST") return route.continue();
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Internal Server Error" }),
      });
    });

    await page.getByTestId("nav-order").click();
    await page.getByTestId("order-volume").fill("0.1");
    await page.getByTestId("order-submit").click();

    await expect(page.getByTestId("order-submit-error")).toContainText(
      "Internal Server Error",
    );
  });

  test("opóźnienie - przycisk zablokowany podczas trwania", async ({
    page,
  }) => {
    await login(page);
    await page.route("**/api/orders", async (route) => {
      if (route.request().method() !== "POST") return route.continue();
      await new Promise((r) => setTimeout(r, 2000));
      await route.continue();
    });

    await page.getByTestId("nav-order").click();
    await page.getByTestId("order-volume").fill("0.1");
    await page.getByTestId("order-submit").click();

    await expect(page.getByTestId("order-submit")).toContainText("Wysyłam");
    await expect(page.getByTestId("order-submit")).toBeDisabled();
  });

  test("custom kod RATE_LIMITED → komunikat", async ({ page }) => {
    await login(page);
    await page.route("**/api/orders", async (route) => {
      if (route.request().method() !== "POST") return route.continue();
      await route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({
          code: "RATE_LIMITED",
          message: "Przekroczono limit zleceń",
        }),
      });
    });

    await page.getByTestId("nav-order").click();
    await page.getByTestId("order-volume").fill("0.1");
    await page.getByTestId("order-submit").click();

    await expect(page.getByTestId("order-submit-error")).toContainText(
      "Przekroczono limit zleceń",
    );
  });
});

import { test, expect, type Page } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";

const API = "http://localhost:3001";

test.beforeEach(async ({ request, context }) => {
  await request.delete(`${API}/api/orders`);
  await context.addInitScript(() => {
    (window as unknown as { __DISABLE_MSW__: boolean }).__DISABLE_MSW__ = true;
  });
});

test("cancel order po ID — przepływ mieszany UI + API", async ({
  page,
  request,
}) => {
  const loginPage = new LoginPage(page);
  await loginPage.login();

  // Złóż 2 zlecenia przez UI
  for (const vol of [0.1, 0.2]) {
    await page.getByTestId("nav-order").click();
    await page.getByTestId("order-symbol").fill("EURUSD");
    await page.getByTestId("order-volume").fill(String(vol));
    await page.getByTestId("order-submit").click();
    await expect(page.getByTestId("order-success")).toBeVisible();
  }

  // Pobierz ID 1. zlecenia przez API
  const list = await request.get(`${API}/api/orders`);
  const orders = await list.json();
  expect(orders).toHaveLength(2);
  const firstId = orders[0].id;

  // Anuluj przez API
  const del = await request.delete(`${API}/api/orders/${firstId}`);
  expect(del.status()).toBe(204);

  // Asercja
  const after = await request.get(`${API}/api/orders`);
  const remaining = await after.json();
  expect(remaining).toHaveLength(1);
  expect(remaining[0].id).not.toBe(firstId);
});

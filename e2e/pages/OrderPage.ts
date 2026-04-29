import { expect, type Page } from "@playwright/test";

export class OrderPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.getByTestId("nav-order").click();
    await expect(this.page).toHaveURL(/\/order$/);
  }

  async fill(data: {
    symbol?: string;
    side?: "BUY" | "SELL";
    volume?: number;
  }) {
    if (data.symbol)
      await this.page.getByTestId("order-symbol").fill(data.symbol);
    if (data.side)
      await this.page.getByTestId("order-side").selectOption(data.side);
    if (data.volume !== undefined) {
      await this.page.getByTestId("order-volume").fill(String(data.volume));
    }
  }

  async submit() {
    await this.page.getByTestId("order-submit").click();
  }

  async expectSuccess() {
    await expect(this.page.getByTestId("order-success")).toBeVisible();
  }

  async expectError(message: string | RegExp) {
    await expect(this.page.getByTestId("order-submit-error")).toContainText(
      message,
    );
  }
}

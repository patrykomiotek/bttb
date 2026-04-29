import { Page } from "@playwright/test";

export class LoginPage {
  constructor(private readonly page: Page) {}

  get errorLocator() {
    return this.page.getByTestId("login-error");
  }

  async goto() {
    await this.page.goto("/login");
  }

  async login(email = "demo@xtb.local", password = "Passw0rd") {
    this.goto();
    await this.page.getByTestId("login-email").fill(email);
    await this.page.getByTestId("login-password").fill(password);
    await this.page.getByTestId("login-submit").click();
  }
}

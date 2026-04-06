import { Page, Locator, expect } from "@playwright/test";
import { ENV } from "../utils/env";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly togglePasswordBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.getByRole("textbox", { name: /email/i });
    this.passwordInput = page.getByRole("textbox", { name: /password/i });

    this.loginButton = page.getByRole("group").getByRole("button", { name: /^log in$/i });

    this.errorMessage = page.locator("text=/invalid|wrong|not|too many requests|error/i");

    this.togglePasswordBtn = page.locator('[class*="PasswordInput-visibilityToggle"]');
  }

  async goto() {
    await this.page.goto(ENV.BASE_URL);

    await this.page.locator("header").getByRole("button", { name: "Log in" }).click();

    await expect(this.emailInput).toBeVisible();
  }

  async login(email: string, password: string) {
    if (email) await this.emailInput.fill(email);
    if (password) await this.passwordInput.fill(password);

    await this.loginButton.click();
  }

  async waitForLoginResponse() {
    return this.page.waitForResponse(
      (res) => res.url().includes("/auth") && res.request().method() === "POST",
      { timeout: 10000 }
    );
  }

  async waitForErrorMessage() {
    await expect(this.errorMessage.first()).toBeVisible({
      timeout: 10000,
    });
  }

  async isPasswordMasked() {
    return this.passwordInput.getAttribute("type");
  }

  async togglePassword() {
    await this.togglePasswordBtn.first().click();
  }
}

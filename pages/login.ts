import { Page, Locator, expect, Response } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly togglePasswordBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.getByRole("textbox", { name: "Email" });
    this.passwordInput = page.getByRole("textbox", { name: "Password" });

    this.loginButton = page.getByRole("group").getByRole("button", { name: "Log in" });

    this.errorMessage = page.locator("text=/invalid|wrong|not|too many requests|error/i");

    this.togglePasswordBtn = page.locator('[class*="PasswordInput-visibilityToggle"]');
  }

  async goto() {
    await this.page.goto("/");

    await this.page.locator("header").getByRole("button", { name: "Log in" }).click();

    await expect(this.emailInput).toBeVisible();
  }

  async login(email: string, password: string) {
    if (email) await this.emailInput.fill(email);
    if (password) await this.passwordInput.fill(password);

    await this.loginButton.click();
  }

  async waitForLoginResponse(): Promise<Response> {
    return this.page.waitForResponse(
      (res) => res.url().includes("/auth") && res.request().method() === "POST",
      { timeout: 10000 }
    );
  }

  async loginWithResponse(email: string, password: string) {
    const responsePromise = this.page.waitForResponse(
      (res) => res.url().includes("/auth") && res.request().method() === "POST",
      { timeout: 10000 }
    );
    await this.login(email, password);
    return await responsePromise;
  }

  async waitForErrorMessage() {
    await expect(this.errorMessage.first()).toBeVisible();
  }

  async expectErrorMessage() {
    await this.waitForErrorMessage();
    await expect(this.errorMessage.first()).toContainText(
      /invalid|wrong|not|too many requests|error/i
    );
  }

  async isPasswordMasked(): Promise<string | null> {
    return this.passwordInput.getAttribute("type");
  }

  async togglePassword() {
    await this.togglePasswordBtn.first().click();
  }

  async togglePasswordWithCheck(show: boolean) {
    const type = await this.isPasswordMasked();
    if ((show && type === "password") || (!show && type === "text")) {
      await this.togglePassword();
    }
    const expectedType = show ? "text" : "password";
    await expect(this.passwordInput).toHaveAttribute("type", expectedType);
  }
}

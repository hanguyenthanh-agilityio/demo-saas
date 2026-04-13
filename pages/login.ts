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

    this.togglePasswordBtn = page.locator(".mantine-PasswordInput-visibilityToggle");
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

  async setPasswordVisibility(show: boolean) {
    const currentType = await this.passwordInput.getAttribute("type");

    const isVisible = currentType === "text";

    if (show && !isVisible) {
      await this.togglePasswordBtn.click();
    }

    if (!show && isVisible) {
      await this.togglePasswordBtn.click();
    }

    await expect(this.passwordInput).toHaveAttribute("type", show ? "text" : "password");
  }
}

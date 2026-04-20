import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly togglePasswordBtn: Locator;

  readonly globalError: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.getByRole("textbox", { name: "Email" });
    this.passwordInput = page.getByRole("textbox", { name: "Password" });

    this.loginButton = page.getByRole("group").getByRole("button", { name: "Log in" });

    this.togglePasswordBtn = page.locator(".mantine-PasswordInput-visibilityToggle");

    this.globalError = page.getByText(
      /invalid email or password|too many requests|try again later/i
    );
  }

  async goto() {
    await this.page.goto("/");
    await this.page.locator("header").getByRole("button", { name: "Log in" }).click();

    await expect(this.emailInput).toBeVisible();
  }

  async login(email: string, password: string) {
    if (email !== undefined) await this.emailInput.fill(email);
    if (password !== undefined) await this.passwordInput.fill(password);

    await this.loginButton.click();
  }

  async loginWithResponse(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    const resPromise = this.page.waitForResponse(
      (res) => res.url().includes("/auth") && res.request().method() === "POST"
    );

    await this.login(email, password);
    return await resPromise;
  }
  // Error handling
  getFieldError(field: "email" | "password") {
    const input = this.page.getByRole("textbox", {
      name: new RegExp(field, "i"),
    });

    return input.locator("xpath=ancestor::*[contains(@class,'InputWrapper-root')]//p");
  }

  async expectErrorMessage(message?: string | RegExp, field?: "email" | "password" | "global") {
    let locator: Locator;

    if (field === "email" || field === "password") {
      locator = this.getFieldError(field);
    } else {
      locator = this.globalError;
    }

    await expect(locator.first()).toBeVisible();

    if (message) {
      await expect(locator.first()).toHaveText(
        message instanceof RegExp ? message : new RegExp(message, "i")
      );
    }
  }

  async togglePassword() {
    await this.togglePasswordBtn.click();
  }
}

import { Page, Locator, expect } from "@playwright/test";

export class AccountPage {
  readonly page: Page;

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly saveBtn: Locator;

  readonly successMsg: Locator;

  constructor(page: Page) {
    this.page = page;

    this.firstNameInput = page.getByRole("textbox", { name: /first name/i });
    this.lastNameInput = page.getByRole("textbox", { name: /last name/i });

    this.saveBtn = page.getByRole("button", { name: /save/i });

    this.successMsg = page.getByText(/success|updated/i);
  }

  async goto() {
    await this.page.goto("/ha-nguyen/tickets");
  }

  async fillFirstName(value: string) {
    await this.firstNameInput.fill(value);
  }

  async fillLastName(value: string) {
    await this.lastNameInput.fill(value);
  }

  async submit() {
    await this.saveBtn.click();
  }

  async getValues() {
    return {
      firstName: await this.firstNameInput.inputValue(),
      lastName: await this.lastNameInput.inputValue(),
    };
  }

  async getFieldError(field: "firstName" | "lastName") {
    const input = {
      firstName: this.firstNameInput,
      lastName: this.lastNameInput,
    }[field];

    const errorId = await input.getAttribute("aria-describedby");

    return this.page.locator(`#${errorId}`);
  }

  async expectFieldError(field: "firstName" | "lastName", message?: string | RegExp) {
    const error = await this.getFieldError(field);

    await expect(error).toBeVisible();

    if (message) {
      await expect(error).toContainText(
        message instanceof RegExp ? message : new RegExp(message, "i")
      );
    }
  }

  async expectMultipleErrors(count: number) {
    const errors = this.page.getByText(/must contain at least/i);
    await expect(errors).toHaveCount(count);
  }
}

import { Page, Locator, expect } from "@playwright/test";

export class AccountPage {
  readonly page: Page;

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly saveBtn: Locator;

  readonly successMsg: Locator;
  readonly errorMsgs: Locator;

  constructor(page: Page) {
    this.page = page;

    this.firstNameInput = page.getByRole("textbox", { name: /first name/i });
    this.lastNameInput = page.getByRole("textbox", { name: /last name/i });

    this.saveBtn = page.getByRole("button", { name: /save/i });

    this.successMsg = page.getByText(/success|updated/i);
    this.errorMsgs = page.getByText(/must contain at least/i);
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

  async expectErrorsVisible(count?: number) {
    await expect(this.errorMsgs.first()).toBeVisible();

    if (count !== undefined) {
      await expect(this.errorMsgs).toHaveCount(count);
    }
  }
}

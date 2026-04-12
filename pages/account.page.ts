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

    this.firstNameInput = page.getByRole("textbox", {
      name: /first name/i,
    });

    this.lastNameInput = page.getByRole("textbox", {
      name: /last name/i,
    });

    this.saveBtn = page.getByRole("button", { name: /save/i });

    this.errorMsgs = page.getByText(/must contain at least/i);

    this.successMsg = page.getByText(/success|updated/i);
  }

  async fillProfile(first?: string, last?: string) {
    if (first !== undefined) {
      await this.firstNameInput.fill(first);
    }

    if (last !== undefined) {
      await this.lastNameInput.fill(last);
    }
  }

  async clearInput(input: Locator) {
    await input.fill("");
  }

  async submit() {
    await this.saveBtn.click();
  }

  async getProfileValues() {
    return {
      firstName: await this.firstNameInput.inputValue(),
      lastName: await this.lastNameInput.inputValue(),
    };
  }

  async expectValidationError(count?: number) {
    await expect(this.errorMsgs.first()).toBeVisible();

    if (count !== undefined) {
      await expect(this.errorMsgs).toHaveCount(count);
    }
  }
}

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

  async gotoTicketPage() {
    await this.page.goto("/ha-nguyen/tickets");
  }

  async fillProfile(data: { firstName?: string; lastName?: string }) {
    const { firstName, lastName } = data;

    if (firstName !== undefined) {
      await this.firstNameInput.fill(firstName);
    }

    if (lastName !== undefined) {
      await this.lastNameInput.fill(lastName);
    }
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

  async clearInput(input: Locator) {
    await input.click();
    await input.press("Control+A");
    await input.press("Delete");
    await input.blur();
  }
}

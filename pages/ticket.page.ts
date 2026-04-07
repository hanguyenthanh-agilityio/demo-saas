import { Page, Locator } from "@playwright/test";

export class TicketPage {
  readonly newBtn: Locator;
  readonly submitBtn: Locator;
  readonly nameInput: Locator;
  readonly titleInput: Locator;
  readonly descInput: Locator;
  readonly successMsg: Locator;

  constructor(private page: Page) {
    this.newBtn = page.getByRole("link", { name: "New" });
    this.submitBtn = page.getByRole("button", { name: "Submit" });

    this.nameInput = page.getByRole("textbox", { name: /your name/i });
    this.titleInput = page.getByRole("textbox", { name: /title/i });
    this.descInput = page.getByRole("textbox", { name: /description/i });

    this.successMsg = page.getByText(/successfully created/i);
  }

  async goto() {
    await this.page.goto("/ha-nguyen/tickets");
  }

  async openCreate() {
    await this.newBtn.click();
  }

  async fillForm(data: { name: string; title: string; description: string }) {
    await this.nameInput.click();
    await this.nameInput.fill(data.name);

    await this.titleInput.click();
    await this.titleInput.fill(data.title);

    await this.descInput.click();
    await this.descInput.fill(data.description);
  }

  async submit() {
    await this.submitBtn.click();
  }

  getErrorByField(field: "name" | "title" | "description") {
    const map = {
      name: this.nameInput,
      title: this.titleInput,
      description: this.descInput,
    };

    return map[field]
      .locator("xpath=..") // parent
      .locator("text=must contain at least");
  }
}

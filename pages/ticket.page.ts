import { Page, Locator } from "@playwright/test";

export class TicketPage {
  readonly newBtn: Locator;
  readonly submitBtn: Locator;
  readonly nameInput: Locator;
  readonly titleInput: Locator;
  readonly descInput: Locator;
  readonly successMsg: Locator;

  readonly statusSelect: Locator;

  constructor(private page: Page) {
    this.newBtn = page.getByRole("link", { name: "New" });
    this.submitBtn = page.getByRole("button", { name: "Submit" });

    this.nameInput = page.getByRole("textbox", { name: /your name/i });
    this.titleInput = page.getByRole("textbox", { name: /title/i });
    this.descInput = page.getByRole("textbox", { name: /description/i });

    this.successMsg = page.getByText(/successfully created/i);

    this.statusSelect = page.getByTestId("ticket-status-select");
  }

  async goto() {
    await this.page.goto("/ha-nguyen/tickets");
    await this.page.waitForLoadState("networkidle");
  }

  async openCreate() {
    await this.newBtn.click();
  }

  async fillForm(data: { name: string; title: string; description: string }) {
    await this.nameInput.fill(data.name);
    await this.titleInput.fill(data.title);
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

    return map[field].locator("xpath=..").locator("text=must contain at least");
  }

  async filterByStatus(status: string) {
    await this.statusSelect.click();
    await this.page.getByRole("option", { name: status }).click();
    await this.page.waitForTimeout(300);
  }

  getVisibleTickets() {
    return this.page.locator("div.border-bottom_1px_solid_var(--mantine-color-gray-1)");
  }

  async getVisibleTicketStatuses() {
    const statuses = this.page.locator('div[data-testid="ticket-status"] .mantine-Badge-label');
    return statuses.allTextContents();
  }

  async getTicketTitles() {
    const titles = this.page.locator('div.mantine-Group-root p.mantine-Text-root[data-size="sm"]');
    return titles.allTextContents();
  }
}

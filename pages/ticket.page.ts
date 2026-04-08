import { Page, Locator } from "@playwright/test";

export class TicketPage {
  readonly newBtn: Locator;
  readonly submitBtn: Locator;
  readonly nameInput: Locator;
  readonly titleInput: Locator;
  readonly descInput: Locator;
  readonly successMsg: Locator;
  readonly statusSelect: Locator;

  // Table
  readonly ticketRows: Locator;
  readonly loader: Locator;

  readonly emptyState: Locator;

  constructor(private page: Page) {
    // Buttons & inputs
    this.newBtn = page.getByRole("link", { name: "New" });
    this.submitBtn = page.getByRole("button", { name: "Submit" });

    this.nameInput = page.getByRole("textbox", { name: /your name/i });
    this.titleInput = page.getByRole("textbox", { name: /title/i });
    this.descInput = page.getByRole("textbox", { name: /description/i });

    this.successMsg = page.getByText(/successfully created/i);

    this.statusSelect = page.getByTestId("ticket-status-select");

    // Table locators
    this.ticketRows = page.locator('[data-testid="ticket-row"]');
    this.loader = page.locator('[data-testid="ticket-loader"]');

    this.emptyState = page.getByText(/no tickets found/i);
  }

  // ====================
  // Navigation / Page
  // ====================
  async goto() {
    await this.page.goto("/ha-nguyen/tickets");
    await this.page.waitForLoadState("networkidle");
    await this.waitForTableLoad();
  }

  async openCreate() {
    await this.newBtn.click();
  }

  // ====================
  // Form actions
  // ====================
  async fillForm(data: { name: string; title: string; description: string }) {
    await this.nameInput.fill(data.name);
    await this.titleInput.fill(data.title);
    await this.descInput.fill(data.description);
  }

  async submit() {
    await this.submitBtn.click();
  }

  getErrorByField(field: "name" | "title" | "description") {
    const map: Record<string, Locator> = {
      name: this.nameInput,
      title: this.titleInput,
      description: this.descInput,
    };

    // expects error message as sibling
    return map[field].locator("xpath=..").locator("text=must contain at least");
  }

  // ====================
  // Table / Tickets
  // ====================
  async waitForTableLoad() {
    const loader = this.page.locator("div").filter({ hasText: /^Loading$/ });
    if ((await loader.count()) > 0) {
      await loader.waitFor({ state: "detached", timeout: 10000 });
    }
  }

  async waitForTicketsOrEmpty() {
    await this.waitForTableLoad();

    const count = await this.ticketRows.count();
    if (count > 0) {
      await this.ticketRows.first().waitFor({ state: "visible", timeout: 5000 });
    } else {
      if ((await this.emptyState.count()) > 0) {
        await this.emptyState.first().waitFor({ state: "visible", timeout: 5000 });
      }
    }
  }

  async filterByStatus(status: string) {
    await this.statusSelect.click();
    await this.page.getByRole("option", { name: status }).click();
    await this.waitForTicketsOrEmpty();
  }

  getVisibleTickets() {
    return this.ticketRows;
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

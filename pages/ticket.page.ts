import { Page, Locator, expect } from "@playwright/test";

export class TicketPage {
  readonly page: Page;

  // Buttons & Inputs
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

  // Search
  readonly searchInput: Locator;
  readonly clearSearchBtn: Locator;

  // Navigation
  readonly orgDropdown: Locator;
  readonly searchMenuItem: Locator;

  // Sort
  readonly titleHeader: Locator;

  constructor(page: Page) {
    this.page = page;

    // Buttons & inputs
    this.newBtn = page.getByRole("link", { name: "New" });
    this.submitBtn = page.getByRole("button", { name: "Submit" });

    this.nameInput = page.getByRole("textbox", { name: /your name/i });
    this.titleInput = page.getByRole("textbox", { name: /title/i });
    this.descInput = page.getByRole("textbox", { name: /description/i });

    this.successMsg = page.getByText(/successfully created/i);

    this.statusSelect = page.getByTestId("ticket-status-select");

    // Table locators
    this.ticketRows = page.locator(
      'div[style*="--stack-gap"]:has(div[data-testid="ticket-status"])'
    );
    this.loader = page.locator('[data-testid="ticket-loader"]');
    this.emptyState = page.getByText(/no tickets found/i);

    // Search
    this.searchInput = page.getByTestId("ticket-name-search");
    this.clearSearchBtn = page.locator('[data-testid="ticket-name-search"] + button');

    // Navigation
    this.orgDropdown = page.getByRole("button", { name: /ha nguyen/i });
    this.searchMenuItem = page.getByRole("menuitem", { name: /search/i });

    // Sort
    this.titleHeader = page
      .locator("div")
      .filter({ hasText: /^Title$/ })
      .first();
  }

  // ====================
  // Navigation / Page
  // ====================
  async goto() {
    await this.page.goto("/ha-nguyen/tickets");
    await this.page.waitForLoadState("networkidle");
    await this.waitForTableLoad();
  }

  async selectOrganizationOption(option: "search" | "sort") {
    const current = await this.page
      .locator('[data-testid="organization-name"]:visible')
      .first()
      .textContent();

    if (current?.toLowerCase().includes(option)) return;

    await this.page.locator('[data-testid="organization-picker"]:visible').first().click();

    const menuItem = this.page.getByRole("menuitem", {
      name: new RegExp(option, "i"),
    });

    await menuItem.click();

    await this.waitForTicketsOrEmpty();
  }

  // Sort methods
  async waitForGetTicketsSuccess() {
    await this.page.waitForResponse(
      (res) =>
        res.url().includes("tickets.getList") &&
        res.request().method() === "GET" &&
        res.status() === 200
    );
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

  async sortByTitle() {
    await expect(this.titleHeader).toBeVisible({ timeout: 5000 });
    await expect(this.titleHeader).toBeEnabled({ timeout: 5000 });

    await Promise.all([this.waitForGetTicketsSuccess(), this.titleHeader.click()]);

    await this.waitForTicketsOrEmpty();
  }

  async getTitlesAndUrl() {
    const [titles, url] = await Promise.all([this.getTicketTitles(), this.getUrl()]);

    return { titles, url };
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
      await expect(this.ticketRows.first()).toBeVisible({ timeout: 5000 });
    } else if ((await this.emptyState.count()) > 0) {
      await expect(this.emptyState.first()).toBeVisible({ timeout: 5000 });
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
    return this.ticketRows
      .locator('div[style*="width: calc(28.5rem"] p.mantine-Text-root[data-size="sm"]:visible')
      .allTextContents();
  }

  // Search
  async search(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.page.waitForResponse((res) => {
      return (
        res.url().includes("tickets.getList") &&
        res.request().method() === "GET" &&
        res.status() === 200
      );
    });
    await this.waitForTicketsOrEmpty();
  }

  async clearSearch() {
    await this.searchInput.fill("");
    await this.waitForTicketsOrEmpty();
  }

  async clickClearSearchBtn() {
    if (await this.clearSearchBtn.isVisible()) {
      await this.clearSearchBtn.click();
      await this.waitForTicketsOrEmpty();
    }
  }

  async expectAllTitlesMatch(keyword: string) {
    const matchingRows = this.ticketRows.filter({ hasText: keyword });
    const count = await matchingRows.count();

    for (let i = 0; i < count; i++) {
      await expect(matchingRows.nth(i)).toBeVisible({ timeout: 20000 });
    }
  }

  async getUrl(): Promise<string> {
    return this.page.url();
  }
}

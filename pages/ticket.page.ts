import { Page, Locator, expect } from "@playwright/test";

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

  // Search
  readonly searchInput: Locator;
  readonly clearSearchBtn: Locator;

  // Navigation
  readonly orgDropdown: Locator;
  readonly searchMenuItem: Locator;

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
  }

  // ====================
  // Navigation / Page
  // ====================
  async goto() {
    await this.page.goto("/ha-nguyen/tickets");
    await this.page.waitForLoadState("networkidle");
    await this.waitForTableLoad();
  }

  // GO To Search Page
  async goToSearchPage() {
    // Wait navigation if already on Search
    const current = await this.page
      .locator('[data-testid="organization-name"]:visible')
      .first()
      .textContent();

    if (current?.toLowerCase().includes("search")) {
      // already on Search page, can return
      return;
    }

    // Open dropdown
    const orgPicker = this.page.locator('[data-testid="organization-picker"]:visible').first();
    await orgPicker.click();

    // Wait dropdown menu to appear (Mantine tạo portal)
    const dropdownMenu = this.page.locator('div[role="menu"]:visible').first();
    await dropdownMenu.waitFor({ state: "visible", timeout: 5000 });

    // Click Search option inside visible dropdown
    await dropdownMenu.getByText("search", { exact: true }).click();

    // Wait navigation to Search page
    await this.page.waitForURL("/search/tickets");

    // Wait tickets or empty state
    await this.waitForTicketsOrEmpty();
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
    } else if ((await this.emptyState.count()) > 0) {
      await this.emptyState.first().waitFor({ state: "visible", timeout: 5000 });
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

    // if (keyword.trim() !== "") {
    await this.page.waitForResponse((res) => {
      return (
        res.url().includes("tickets.getList") &&
        res.request().method() === "GET" &&
        res.status() === 200
      );
    });
    // }

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
}

import { Page, Locator, expect } from "@playwright/test";
import { RowsPerPage } from "../types/ticket";

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

  // Pagination
  readonly nextBtn: Locator;
  readonly prevBtn: Locator;
  readonly lastBtn: Locator;
  readonly firstBtn: Locator;

  readonly goToPageInput: Locator;
  readonly rowsPerPageSelect: Locator;

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

    // Pagination
    const pagination = page.locator(".mantine-Pagination-root");

    this.firstBtn = pagination.locator("button").first();
    this.prevBtn = pagination.locator("button").nth(1);
    this.nextBtn = pagination.locator("button").nth(-2);
    this.lastBtn = pagination.locator("button").last();

    this.goToPageInput = page.getByRole("spinbutton", { name: /go to page/i });
    this.rowsPerPageSelect = page.getByRole("textbox", { name: /rows per page/i });
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

    // Wait dropdown menu to appear
    const dropdownMenu = this.page.locator('div[role="menu"]:visible').first();
    await dropdownMenu.waitFor({ state: "visible", timeout: 5000 });

    // Click Search option inside visible dropdown
    await dropdownMenu.getByText("search", { exact: true }).click();

    // Wait navigation to Search page
    await this.page.waitForURL("/search/tickets");

    // Wait tickets or empty state
    await this.waitForTicketsTableReload();
  }

  async goToSortPage() {
    if (this.page.url().includes("/sort/tickets")) return;

    const orgPicker = this.page.locator('[data-testid="organization-picker"]:visible').first();
    await orgPicker.click();

    await this.page
      .locator('div[role="menu"]:visible')
      .first()
      .waitFor({ state: "visible", timeout: 5000 });

    const sortItem = this.page.getByText(/sort/i);
    await expect(sortItem).toBeVisible({ timeout: 5000 });
    await sortItem.scrollIntoViewIfNeeded();
    await sortItem.click();

    await this.page.waitForURL(/\/sort\/tickets/);

    await this.waitForTicketListAPI();
    await this.waitForTicketsTableReload();
  }

  // Sort methods
  async waitForTicketListAPI() {
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

    await Promise.all([this.waitForTicketListAPI(), this.titleHeader.click()]);

    await this.waitForTicketsTableReload();
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

  async waitForTicketsTableReload() {
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
    await this.waitForTicketsTableReload();
  }

  async clearSearch() {
    await this.searchInput.fill("");
    await this.waitForTicketsTableReload();
  }

  async clickClearSearchBtn() {
    if (await this.clearSearchBtn.isVisible()) {
      await this.clearSearchBtn.click();
      await this.waitForTicketsTableReload();
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
  // Pagination methods
  getPageBtn(page: number) {
    return this.page.getByRole("button", { name: String(page), exact: true });
  }

  async goToPage(page: number) {
    await this.getPageBtn(page).click();
  }

  async clickNext() {
    if (await this.nextBtn.isDisabled()) return;

    await this.nextBtn.click();
  }

  async clickPrev() {
    if (await this.prevBtn.isDisabled()) return;

    await this.prevBtn.click();
  }

  async clickFirst() {
    if (await this.firstBtn.isDisabled()) return;

    await this.firstBtn.click();
  }

  async clickLast() {
    if (await this.lastBtn.isDisabled()) return;

    await this.lastBtn.click();
  }

  async changeRowsPerPage(size: RowsPerPage) {
    await this.rowsPerPageSelect.click();

    await this.page.locator(`[role="option"][value="${size}"]`).click();

    await this.waitForTicketsTableReload();
  }

  async goToPageByInput(value: string) {
    await this.goToPageInput.click();

    await this.goToPageInput.fill("");

    if (!isNaN(Number(value))) {
      await this.goToPageInput.fill(value);
    }

    await this.page.keyboard.press("Enter");
  }
}

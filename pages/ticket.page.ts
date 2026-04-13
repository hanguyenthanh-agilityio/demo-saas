import { Page, Locator, expect } from "@playwright/test";
import { RowsPerPage, TicketStatus } from "../types/ticket";

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

  // Ticket Detail Popup
  readonly ticketDetailPopup: Locator;
  readonly closePopupBtn: Locator;

  // Status inside popup
  readonly popupStatusSelect: Locator;

  //  Updated label
  readonly updatedNowLabel: Locator;
  readonly updatedLabel: Locator;

  // Comment
  readonly commentInput: Locator;
  readonly sendCommentBtn: Locator;
  readonly commentsList: Locator;

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

    // Update locators
    this.ticketDetailPopup = page.getByRole("dialog");
    this.closePopupBtn = this.ticketDetailPopup.locator("button:has(svg)");

    this.popupStatusSelect = this.ticketDetailPopup.getByTestId("ticket-status-select");
    this.updatedNowLabel = page.getByText(/updated now/i);
    this.updatedLabel = page.getByText(/updated/i);
    this.commentInput = this.ticketDetailPopup.getByPlaceholder("Add a comment...");
    this.sendCommentBtn = this.ticketDetailPopup.getByRole("button", { name: /send/i });
    this.commentsList = this.ticketDetailPopup.locator('.mantine-Paper-root:has-text("")');
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

    // Wait navigation to Search/Sort page
    await this.page.waitForURL(new RegExp(`/${option}/tickets`));

    // Wait tickets or empty state
    await this.waitForTicketsTableReload();
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

    await Promise.race([
      this.ticketRows.first().waitFor({ state: "visible", timeout: 5000 }),
      this.emptyState.first().waitFor({ state: "visible", timeout: 5000 }),
    ]);
  }

  async filterByStatus(status: TicketStatus) {
    await this.statusSelect.click();

    const option = this.page.getByRole("option", {
      name: new RegExp(status, "i"),
    });

    await expect(option).toBeVisible();
    await option.click();
  }

  getVisibleTickets() {
    return this.ticketRows;
  }

  async getVisibleTicketStatuses() {
    const statuses = this.page.locator('div[data-testid="ticket-status"] .mantine-Badge-label');
    await expect(statuses.first()).toBeVisible();
    return statuses.allTextContents();
  }

  async getTicketTitles() {
    return this.ticketRows
      .locator('div[style*="width: calc(28.5rem"] p.mantine-Text-root[data-size="sm"]:visible')
      .allTextContents();
  }

  // Ticket Detail Actions
  getTicketByTitle(title: string) {
    return this.ticketRows.filter({ hasText: title }).first();
  }

  getTicketByTitleText(title: string) {
    return this.page.getByText(title).first();
  }

  async openTicketByTitle(title: string) {
    let ticket = this.getTicketByTitle(title);

    if ((await ticket.count()) === 0) {
      ticket = this.getTicketByTitleText(title);
    }

    await expect(ticket).toBeVisible({ timeout: 10000 });

    await ticket.scrollIntoViewIfNeeded();

    await ticket.click();

    await this.page.waitForSelector('[role="dialog"]', {
      state: "visible",
      timeout: 10000,
    });

    await expect(this.ticketDetailPopup).toBeVisible();
  }

  async changeStatus(status: TicketStatus) {
    const dropdownBtn = this.popupStatusSelect;

    await expect(dropdownBtn).toBeVisible();
    await dropdownBtn.click();

    const option = this.page.getByRole("option", {
      name: new RegExp(status, "i"),
    });

    await expect(option).toBeVisible();
    await option.click();
  }

  async getComments() {
    const items = this.ticketDetailPopup.locator("textarea[readonly]");
    const count = await items.count();

    const values: string[] = [];

    for (let i = 0; i < count; i++) {
      const val = await items.nth(i).inputValue();
      if (val.trim()) values.push(val);
    }

    return values;
  }

  getCommentItem(text: string) {
    return this.ticketDetailPopup.locator("textarea[readonly]", {
      hasText: text,
    });
  }

  async addComment(text: string) {
    await this.commentInput.fill(text);

    await this.sendCommentBtn.click();
    await expect(this.commentInput).toHaveValue("");
  }

  async closePopupByIcon() {
    await expect(this.closePopupBtn).toBeVisible();
    await this.closePopupBtn.click();

    await expect(this.ticketDetailPopup).toBeHidden();
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

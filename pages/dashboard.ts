import { Page, expect } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async expectLoaded() {
    // ✅ fix đúng URL của app
    await expect(this.page).toHaveURL(/tickets/);
  }
}

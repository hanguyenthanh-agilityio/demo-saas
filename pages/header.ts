import { Page, Locator, expect } from "@playwright/test";

export class HeaderPage {
  readonly page: Page;
  readonly avatar: Locator;
  readonly menu: Locator;
  readonly manageAccountItem: Locator;
  readonly logoutItem: Locator;

  constructor(page: Page) {
    this.page = page;

    this.avatar = page.getByTestId("user-settings");
    this.menu = page.getByRole("menu");

    this.manageAccountItem = page.getByRole("menuitem", {
      name: /manage account/i,
    });

    this.logoutItem = page.getByRole("menuitem", {
      name: /sign out/i,
    });
  }

  async hoverAvatar() {
    await this.avatar.hover();
    await expect(this.menu).toBeVisible();
  }

  async moveMouseAway() {
    await this.page.mouse.move(0, 0);
    await expect(this.menu).toBeHidden();
  }

  async goToManageAccount() {
    await this.hoverAvatar();
    await this.manageAccountItem.click();
  }

  async logout() {
    await expect(this.avatar).toBeVisible({ timeout: 10000 });

    await this.avatar.click();

    await expect(this.menu).toBeVisible();

    await this.logoutItem.click();
  }
}

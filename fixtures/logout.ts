import { test as base, expect, Page } from "@playwright/test";

type Fixtures = {
  logoutPage: Page;
};

export const test = base.extend<Fixtures>({
  logoutPage: async ({ page }, use) => {
    await page.goto("/ha-nguyen/tickets");

    await expect(page.getByTestId("user-settings")).toBeVisible({
      timeout: 15000,
    });

    await use(page);
  },
});

export { expect };

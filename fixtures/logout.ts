import { test as base, expect, Page } from "@playwright/test";

type Fixtures = {
  logoutPage: Page;
};

export const test = base.extend<Fixtures>({
  logoutPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: "playwright/.auth/logout-user.json",
    });

    const page = await context.newPage();

    await page.goto("/ha-nguyen/tickets");

    console.log("Current URL:", page.url());

    await expect(page).toHaveURL(/tickets/, { timeout: 30000 });

    await expect(page.getByTestId("user-settings")).toBeVisible({
      timeout: 30000,
    });

    await use(page);

    await context.close();
  },
});

export { expect };

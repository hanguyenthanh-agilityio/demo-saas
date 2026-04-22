import { test as base, expect, Page } from "@playwright/test";
import { LoginPage } from "../pages/login";

type Fixtures = {
  logoutPage: Page;
};

export const test = base.extend<Fixtures>({
  logoutPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: "playwright/.auth/logout-user.json",
      baseURL: process.env.BASE_URL,
    });

    const page = await context.newPage();

    await page.goto("/ha-nguyen/tickets");

    if (!page.url().includes("/tickets")) {
      const login = new LoginPage(page);

      await login.goto();

      const res = await login.loginWithResponse(
        process.env.EMAIL_LOGOUT!,
        process.env.PASSWORD_LOGOUT!
      );

      if (res.status() !== 200) {
        throw new Error(`Login failed: ${res.status()}`);
      }

      await page.waitForLoadState("networkidle");
    }

    await expect(page).toHaveURL(/tickets/, { timeout: 15000 });

    await expect(page.getByTestId("user-settings")).toBeVisible({
      timeout: 15000,
    });

    await use(page);

    await context.close();
  },
});

export { expect };

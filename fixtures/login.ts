import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/login";

type Fixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: undefined,
    });

    const page = await context.newPage();

    await page.route("**/auth/refresh", (route) => route.abort());

    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await use(loginPage);

    await context.close();
  },
});

export { expect } from "@playwright/test";

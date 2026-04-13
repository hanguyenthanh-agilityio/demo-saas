import { test as base } from "@playwright/test";
import { HeaderPage } from "../pages/header.page";
import { AccountPage } from "../pages/account.page";

type Fixtures = {
  header: HeaderPage;
  accountPage: AccountPage;
};

export const test = base.extend<Fixtures>({
  header: async ({ page }, use) => {
    await use(new HeaderPage(page));
  },

  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },
});

export { expect } from "@playwright/test";

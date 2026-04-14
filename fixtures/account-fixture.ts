import { test as base } from "@playwright/test";
import { HeaderPage } from "../pages/header.page";
import { AccountPage } from "../pages/account.page";

type Fixtures = {
  header: HeaderPage;
  accountPage: AccountPage;
  resetProfile: void;
};

export const test = base.extend<Fixtures>({
  header: async ({ page }, use) => {
    await use(new HeaderPage(page));
  },

  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },

  resetProfile: [
    async ({ request }, use) => {
      await request.post("https://demo-saas.bugbug.io/api/auth/update-user", {
        data: {
          firstName: "Ha",
          lastName: "Nguyen",
        },
      });

      await use();
    },
    { auto: true },
  ],
});

export { expect } from "@playwright/test";

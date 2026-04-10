import { test as base, expect } from "@playwright/test";
import { ENV } from "../utils/env";

type Fixtures = {
  authPage: void;
};

export const test = base.extend<Fixtures>({
  authPage: async ({ page }, use) => {
    await page.goto(ENV.BASE_URL);

    await page.getByRole("textbox", { name: /email/i }).fill(ENV.EMAIL);
    await page.getByRole("textbox", { name: /password/i }).fill(ENV.PASSWORD);
    await page.getByRole("button", { name: /login/i }).click();

    await expect(page).toHaveURL(/tickets/);

    await use();
  },
});

export { expect };

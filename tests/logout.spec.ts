import { expect, test } from "../fixtures/logout-fixture";
import { HeaderPage } from "../pages/header.page";
import { ENV } from "../utils/env";

test.describe("Sign out Feature", () => {
  test.skip("TC036 - Verify user can log out successfully and is redirected to Login page", async ({
    page,
  }) => {
    const header = new HeaderPage(page);

    await test.step("Step 1: Navigate to Ticket page", async () => {
      await page.goto("/ha-nguyen/tickets");
    });

    await test.step("Step 2: Click avatar and logout", async () => {
      await header.logout();
    });

    await test.step("Step 3: Verify redirect to login page", async () => {
      await expect(page).toHaveURL(ENV.BASE_URL);
    });
  });
});

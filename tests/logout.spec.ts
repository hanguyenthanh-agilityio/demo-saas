import { test, expect } from "../fixtures/logout";
import { HeaderPage } from "../pages/header";
import { ENV } from "../utils/env";

test.describe("Sign out Feature", () => {
  test("TC036 - Verify logout", async ({ logoutPage }) => {
    const header = new HeaderPage(logoutPage);

    await test.step("Step 1: Click avatar and logout", async () => {
      await header.logout();
    });

    await test.step("Step 2: Verify redirect to login page", async () => {
      await expect(logoutPage).toHaveURL(ENV.BASE_URL);
    });
  });
});

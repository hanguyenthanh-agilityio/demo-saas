import { test, expect } from "@playwright/test";
import { HeaderPage } from "../pages/header";
import { ENV } from "../utils/env";

test.describe("Sign out Feature", () => {
  test("TC036 - Verify user can log out successfully and is redirected to Login page", async ({
    page,
  }) => {
    const header = new HeaderPage(page);

    await test.step("Step 1: Navigate to Ticket page", async () => {
      await page.goto("/ha-nguyen/tickets");
    });

    await test.step("Step 2: Click avatar and logout", async () => {
      await page.waitForLoadState("networkidle");

      const avatar = page.getByTestId("user-settings");

      await expect(avatar).toBeVisible({ timeout: 15000 });

      await header.logout();
    });

    await test.step("Step 3: Verify redirect to login page", async () => {
      await expect(page).toHaveURL(ENV.BASE_URL);
    });
  });
});

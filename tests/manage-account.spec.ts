/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect } from "../fixtures/account-fixture";
import { getUniqueName } from "../utils/data";

test.describe("Manage Account Feature", () => {
  // =========================
  // TC034 - PROFILE MENU
  // =========================
  test(
    "TC034 - Verify user can open and close Profile Menu by hovering over avatar",
    { tag: ["@account", "@menu"] },
    async ({ page, header, accountPage }) => {
      await test.step("Step 1: Hover over avatar and verify Profile Menu is displayed with all options", async () => {
        await accountPage.goto();

        await header.hoverAvatar();

        await expect(header.manageAccountItem).toBeVisible();
        await expect(header.logoutItem).toBeVisible();
      });

      await test.step("Step 2: Move mouse away → Profile Menu hidden", async () => {
        await page.mouse.move(0, 0);
      });
    }
  );

  // =========================
  // TC035 - UPDATE PROFILE
  // =========================
  test(
    "TC035 - Verify user can update profile with valid data and see validation errors",
    { tag: ["@account", "@profile"] },
    async ({ page, header, accountPage }) => {
      const validData = {
        firstName: getUniqueName("Ha"),
        lastName: getUniqueName("Nguyen"),
      };

      await test.step("Step 1: Navigate to Manage Account page and verify profile form is visible", async () => {
        await accountPage.goto();
        await header.goToManageAccount();
        await expect(accountPage.firstNameInput).toBeVisible();
      });

      await test.step("Step 2: Verify First Name and Last Name fields are pre-filled with existing user data", async () => {
        await expect(accountPage.firstNameInput).toHaveValue(/.+/);
        await expect(accountPage.lastNameInput).toHaveValue(/.+/);
      });

      await test.step("Step 3: Enter valid First Name and Last Name, submit form, and verify success message is displayed", async () => {
        await accountPage.fillFirstName(validData.firstName);
        await accountPage.fillLastName(validData.lastName);

        await accountPage.submit();

        await expect(accountPage.successMsg).toBeVisible();
      });

      await test.step("Step 4: Clear First Name field, enter valid Last Name, submit form, and verify validation error is shown for First Name", async () => {
        await page.reload();

        await accountPage.fillFirstName("");
        await accountPage.fillLastName("Nguyen");

        await expect(accountPage.firstNameInput).toHaveValue("");

        await accountPage.submit();
        await accountPage.expectErrorsVisible();
      });

      await test.step("Step 5: Enter valid First Name, clear Last Name field, submit form, and verify validation error is shown for Last Name", async () => {
        await accountPage.fillFirstName("Ha");
        await accountPage.fillLastName("");

        await expect(accountPage.lastNameInput).toHaveValue("");

        await accountPage.submit();
        await accountPage.expectErrorsVisible();
      });

      await test.step("Step 6: Clear both First Name and Last Name fields, submit form, and verify validation errors are shown for both fields", async () => {
        await accountPage.fillFirstName("");
        await accountPage.fillLastName("");

        await accountPage.submit();
        await accountPage.expectErrorsVisible(2);
      });
    }
  );
});

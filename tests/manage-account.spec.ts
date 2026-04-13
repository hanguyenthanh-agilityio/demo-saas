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
    async ({ header, accountPage }) => {
      await test.step("Step 1: Hover over avatar and verify Profile Menu is displayed with all options", async () => {
        await accountPage.gotoTicketPage();

        await header.hoverAvatar();

        await expect(header.manageAccountItem).toBeVisible();
        await expect(header.logoutItem).toBeVisible();
      });

      await test.step("Step 2: Move mouse away → Profile Menu hidden", async () => {
        await header.moveMouseAway();
      });
    }
  );

  // =========================
  // TC035 - UPDATE PROFILE
  // =========================
  test(
    "TC035 - Verify user can update profile with valid data and see validation errors for invalid inputs (empty first name, last name, both)",
    { tag: ["@account", "@profile"] },
    async ({ page, header, accountPage }) => {
      const validData = {
        firstName: getUniqueName("Ha"),
        lastName: getUniqueName("Nguyen"),
      };

      await test.step("Step 1: Navigate to Manage Account page and verify profile form is visible", async () => {
        await accountPage.gotoTicketPage();
        await header.goToManageAccount();

        await expect(accountPage.firstNameInput).toBeVisible();
      });

      await test.step("Step 2: Verify First Name and Last Name fields are pre-filled with existing user data", async () => {
        const profile = await accountPage.getProfileValues();

        expect(profile.firstName).not.toEqual("");
        expect(profile.lastName).not.toEqual("");
      });

      await test.step("Step 3: Enter valid First Name and Last Name, submit form, and verify success message is displayed", async () => {
        await accountPage.fillProfile({
          firstName: validData.firstName,
          lastName: validData.lastName,
        });

        await accountPage.submit();
        await expect(accountPage.successMsg).toBeVisible();
      });

      await test.step("Step 4: Clear First Name field, enter valid Last Name, submit form, and verify validation error is shown for First Name", async () => {
        await page.reload();

        await accountPage.fillProfile({
          firstName: "",
          lastName: "Nguyen",
        });

        await expect(accountPage.firstNameInput).toHaveValue("");

        await accountPage.submit();
        await accountPage.expectValidationError(1);
      });

      await test.step("Step 5: Enter valid First Name, clear Last Name field, submit form, and verify validation error is shown for Last Name", async () => {
        await accountPage.fillProfile({
          firstName: "Ha",
          lastName: "",
        });

        await expect(accountPage.lastNameInput).toHaveValue("");

        await accountPage.submit();
        await accountPage.expectValidationError(1);
      });

      await test.step("Step 6: Clear both First Name and Last Name fields, submit form, and verify validation errors are shown for both fields", async () => {
        await accountPage.fillProfile({
          firstName: "",
          lastName: "",
        });

        await expect(accountPage.firstNameInput).toHaveValue("");
        await expect(accountPage.lastNameInput).toHaveValue("");

        await accountPage.submit();
        await accountPage.expectValidationError(2);
      });
    }
  );
});

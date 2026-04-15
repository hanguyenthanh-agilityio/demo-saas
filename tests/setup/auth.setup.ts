import { test as setup, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login";
import { ENV } from "../../utils/env";

setup("Authenticate and save session", async ({ page }) => {
  const login = new LoginPage(page);

  await login.goto();

  // Wait API + submit login
  const res = await login.loginWithResponse(ENV.EMAIL, ENV.PASSWORD);

  // Verify login success (backend)
  expect(res.status()).toBe(200);

  // Wait redirect (frontend)
  await expect(page).toHaveURL(/tickets/, { timeout: 10000 });

  // Verify UI loaded
  const ticketsTab = page.getByRole("tab", { name: "Tickets" });
  await expect(ticketsTab).toBeVisible({ timeout: 10000 });

  // Save session
  await page.context().storageState({
    path: "playwright/.auth/user.json",
  });
});

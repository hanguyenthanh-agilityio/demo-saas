import { test as setup, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login";
import { ENV } from "../../utils/env";

setup("Authenticate and save session", async ({ page }) => {
  const login = new LoginPage(page);

  await login.goto();
  await login.login(ENV.EMAIL, ENV.PASSWORD);

  await expect(page).toHaveURL(/tickets/);

  const ticketsTab = page.getByRole("tab", { name: "Tickets" });
  await expect(ticketsTab).toBeVisible({ timeout: 10000 });

  await page.context().storageState({ path: "playwright/.auth/user.json" });
});

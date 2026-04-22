import { Page, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login";

export async function authState(page: Page, email: string, password: string, storagePath: string) {
  if (!email || !password) {
    throw new Error("Missing EMAIL or PASSWORD in ENV");
  }

  const login = new LoginPage(page);

  await page.context().clearCookies();
  await page.goto("/");

  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  await login.goto();

  const res = await login.loginWithResponse(email, password);

  if (res.status() !== 200) {
    throw new Error(`Login failed: ${res.status()}`);
  }

  await page.waitForLoadState("networkidle");

  await expect(page).toHaveURL(/tickets/, { timeout: 15000 });

  await expect(page.getByRole("tab", { name: "Tickets" })).toBeVisible();

  await page.context().storageState({
    path: storagePath,
  });
}

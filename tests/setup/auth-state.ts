// tests/setup/auth.helper.ts
import { Page, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login";

export async function authState(page: Page, email: string, password: string, storagePath: string) {
  if (!email || !password) {
    throw new Error("Missing EMAIL or PASSWORD in ENV");
  }

  const login = new LoginPage(page);

  await login.goto();

  const res = await login.loginWithResponse(email, password);
  expect(res.status()).toBe(200);

  await expect(page).toHaveURL(/tickets/, { timeout: 10000 });

  await expect(page.getByRole("tab", { name: "Tickets" })).toBeVisible();

  await page.context().storageState({
    path: storagePath,
  });
}

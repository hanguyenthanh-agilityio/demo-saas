import { test as setup } from "@playwright/test";
import { ENV } from "../../utils/env";
import { authState } from "./auth-state";

setup("Authenticate logout user", async ({ page }) => {
  await authState(page, ENV.EMAIL_LOGOUT, ENV.PASSWORD_LOGOUT, "playwright/.auth/logout-user.json");
});

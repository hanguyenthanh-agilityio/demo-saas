import { test as setup } from "@playwright/test";
import { ENV } from "../../utils/env";
import { authState } from "./auth-state";

setup("Authenticate user", async ({ page }) => {
  await authState(page, ENV.EMAIL, ENV.PASSWORD, "playwright/.auth/user.json");
});

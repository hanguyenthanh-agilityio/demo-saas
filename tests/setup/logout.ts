import { test as setup } from "@playwright/test";
import { ENV } from "../../utils/env";
import { authState } from "./auth-state";

setup("Authenticate logout user", async ({ page }) => {
  await authState(page, ENV.EMAIL_LOGOUT, ENV.PASSWORD_LOGOUT, "playwright/.auth/logout-user.json");

  console.log("EMAIL_LOGOUT:", ENV.EMAIL_LOGOUT);
  console.log("PASSWORD_LOGOUT:", ENV.PASSWORD_LOGOUT ? "OK" : "MISSING");
});

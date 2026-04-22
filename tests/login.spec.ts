/* eslint-disable @typescript-eslint/no-explicit-any */
// Fixtures
import { test, expect } from "../fixtures/login";

// Pages
import { DashboardPage } from "../pages/dashboard";

// Types
import { LoginCase } from "../types/login";

// Env
import { ENV } from "../utils/env";

test.use({
  storageState: undefined,
});

test.describe("Login Feature - SaaS", () => {
  // ======================
  // TC001 - SUCCESS
  // ======================
  test(
    "TC001 - Verify user can login successfully with valid credentials",
    { tag: ["@smoke", "@login", "@api", "@ui"] },
    async ({ page, loginPage }) => {
      const dashboard = new DashboardPage(page);

      await test.step("Ensure user is on login page", async () => {
        await expect(loginPage.emailInput).toBeVisible();
      });

      let res: any;

      await test.step("Send login request (retry-safe)", async () => {
        for (let i = 0; i < 3; i++) {
          res = await loginPage.loginWithResponse(ENV.EMAIL, ENV.PASSWORD);

          if (res.status() !== 429) break;
        }
      });

      await test.step("Verify API response", async () => {
        const status = res!.status();

        expect(status, "Login should not be rate limited").toBe(200);
      });

      await test.step("Verify user redirected to dashboard", async () => {
        await expect(page).toHaveURL(/tickets/, { timeout: 15000 });
        await dashboard.expectLoaded();
      });
    }
  );

  // ======================
  // NEGATIVE CASES
  // ======================
  const cases: LoginCase[] = [
    {
      id: "TC002",
      desc: "Verify error when email is empty",
      email: "",
      password: ENV.PASSWORD,
      type: "ui",
      field: "email",
      errorMess: "Invalid email",
    },
    {
      id: "TC003",
      desc: "Verify error when password is empty",
      email: ENV.EMAIL,
      password: "",
      type: "ui",
      field: "global",
      errorMess: /invalid email or password|too many requests/i,
    },
    {
      id: "TC004",
      desc: "Verify error with invalid email format",
      email: "abc",
      password: ENV.PASSWORD,
      type: "ui",
      field: "email",
      errorMess: "Invalid email",
    },
    {
      id: "TC005",
      desc: "Verify error when password is incorrect",
      email: ENV.EMAIL,
      password: "wrong123",
      type: "api",
      field: "global",
      errorMess: /invalid email or password|too many requests/i,
    },
  ];
  for (const c of cases) {
    test(
      `${c.id} - ${c.desc}`,
      { tag: ["@login", "@negative", c.type === "api" ? "@api" : "@ui"] },
      async ({ loginPage }) => {
        let response;

        await test.step("Submit login form", async () => {
          if (c.type === "api") {
            response = await loginPage.loginWithResponse(c.email, c.password);
          } else {
            await loginPage.login(c.email, c.password);
          }
        });

        if (c.type === "api") {
          await test.step("Verify API error response", async () => {
            expect(response!.status()).toBeGreaterThanOrEqual(400);
          });
        }

        await test.step("Verify error message displayed", async () => {
          await loginPage.expectErrorMessage(c.errorMess, c.field);
        });

        await test.step("Verify still on login page", async () => {
          await expect(loginPage.emailInput).toBeVisible();
        });
      }
    );
  }

  // ======================
  // UI TESTS
  // ======================
  test(
    "TC007 - Verify password is masked by default",
    { tag: ["@login", "@ui"] },
    async ({ loginPage }) => {
      await test.step("Fill password input", async () => {
        await loginPage.passwordInput.fill("123456");
      });

      await test.step("Verify password is masked", async () => {
        await expect(loginPage.passwordInput).toHaveAttribute("type", "password");
      });
    }
  );

  test("TC008 - Verify user can toggle password visibility", async ({ loginPage }) => {
    await test.step("Fill password input", async () => {
      await loginPage.passwordInput.fill("123456");
    });

    await test.step("Toggle to show password", async () => {
      await loginPage.togglePassword();
      await expect(loginPage.passwordInput).toHaveAttribute("type", "text");
    });

    await test.step("Toggle to hide password", async () => {
      await loginPage.togglePassword();
      await expect(loginPage.passwordInput).toHaveAttribute("type", "password");
    });
  });
});

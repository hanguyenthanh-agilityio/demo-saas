// Fixtures
import { test, expect } from "../fixtures/auth";

// Pages
import { DashboardPage } from "../pages/dashboard";

// Env
import { ENV } from "../utils/env";

test.describe("Login Feature - SaaS", () => {
  // ======================
  // TC001 - SUCCESS
  // ======================
  test(
    "TC001 - Verify user can login successfully with valid credentials",
    { tag: ["@smoke", "@login", "@api", "@ui"] },
    async ({ page, loginPage }) => {
      const dashboard = new DashboardPage(page);

      let res;

      await test.step("Send login request", async () => {
        const responsePromise = loginPage.waitForLoginResponse();
        await loginPage.login(ENV.EMAIL, ENV.PASSWORD);
        res = await responsePromise;
      });

      await test.step("Verify API response", async () => {
        expect(res!.status()).toBe(200);
      });

      await test.step("Verify user redirected to dashboard", async () => {
        await expect(page).toHaveURL(/tickets/);
        await dashboard.expectLoaded();
      });
    }
  );

  // ======================
  // NEGATIVE CASES
  // ======================
  const cases = [
    {
      id: "TC002",
      desc: "Verify error when email is empty",
      email: "",
      password: ENV.PASSWORD,
      type: "ui",
    },
    {
      id: "TC003",
      desc: "Verify error when password is empty",
      email: ENV.EMAIL,
      password: "",
      type: "ui",
    },
    {
      id: "TC004",
      desc: "Verify error with invalid email format",
      email: "abc",
      password: ENV.PASSWORD,
      type: "ui",
    },
    {
      id: "TC005",
      desc: "Verify error when password is incorrect",
      email: ENV.EMAIL,
      password: "wrong123",
      type: "api",
    },
    {
      id: "TC006",
      desc: "Verify error when email is not registered",
      email: "wrong@gmail.com",
      password: ENV.PASSWORD,
      type: "api",
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
            const promise = loginPage.waitForLoginResponse();
            await loginPage.login(c.email, c.password);
            response = await promise;
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
          await loginPage.waitForErrorMessage();

          await expect(loginPage.errorMessage.first()).toContainText(
            /invalid|wrong|not|too many requests|error/i
          );
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
      await loginPage.passwordInput.fill("123456");

      const type = await loginPage.isPasswordMasked();

      expect(type).toBe("password");
    }
  );

  test(
    "TC008 - Verify user can toggle password visibility",
    { tag: ["@login", "@ui"] },
    async ({ loginPage }) => {
      await loginPage.passwordInput.fill("123456");

      await test.step("Ensure toggle button visible", async () => {
        await expect(loginPage.togglePasswordBtn.first()).toBeVisible({
          timeout: 10000,
        });
      });

      await test.step("Toggle to show password", async () => {
        await loginPage.togglePassword();
        await expect(loginPage.passwordInput).toHaveAttribute("type", "text");
      });

      await test.step("Toggle to hide password", async () => {
        await loginPage.togglePassword();
        await expect(loginPage.passwordInput).toHaveAttribute("type", "password");
      });
    }
  );
});

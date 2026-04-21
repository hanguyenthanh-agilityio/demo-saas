import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const isCI = !!process.env.CI;

export default defineConfig({
  // ================================
  // Global Test Settings
  // ================================
  testDir: "./tests",

  // Run tests in parallel (CI will override workers below)
  fullyParallel: true,

  // Prevent accidentally committing test.only in CI
  forbidOnly: isCI,

  // Retry failed tests in CI only
  retries: isCI ? 2 : 0,

  // Limit workers in CI to avoid flaky tests
  workers: isCI ? 1 : undefined,

  // Output folder for artifacts (screenshots, videos...)
  outputDir: "test-results",

  // Reporters
  reporter: [
    ["list"], // CLI output
    ["html", { outputFolder: "playwright-report", open: "never" }], // HTML report
  ],

  // ================================
  // Shared Browser Settings
  // ================================
  use: {
    baseURL: process.env.BASE_URL,

    // Headless in CI, headed locally
    headless: isCI,

    // Debugging helpers
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",

    // Slow down locally for easier debugging
    launchOptions: {
      slowMo: isCI ? 0 : 200,
    },
  },

  // ================================
  // Projects (Test Matrix)
  // ================================
  projects: [
    // ----------------
    // Setup (Login state)
    // ----------------
    {
      name: "setup",
      testMatch: /.*auth\.ts/,
    },

    {
      name: "setup-logout",
      testMatch: /.*logout\.ts/,
    },

    // ----------------
    // LOGIN TESTS (run on all browsers)
    // ----------------
    {
      name: "login-chromium",
      testMatch: /.*login\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "login-firefox",
      testMatch: /.*login\.spec\.ts/,
      use: {
        ...devices["Desktop Firefox"],
      },
    },
    {
      name: "login-webkit",
      testMatch: /.*login\.spec\.ts/,
      use: {
        ...devices["Desktop Safari"],
      },
    },

    // ----------------
    // LOGOUT TESTS (reuse logout state)
    // ----------------
    {
      name: "logout-chromium",
      testMatch: /.*logout\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/logout-user.json",
      },
      dependencies: ["setup-logout"],
    },
    {
      name: "logout-firefox",
      testMatch: /.*logout\.spec\.ts/,
      use: {
        ...devices["Desktop Firefox"],
        storageState: "playwright/.auth/logout-user.json",
      },
      dependencies: ["setup-logout"],
    },
    {
      name: "logout-webkit",
      testMatch: /.*logout\.spec\.ts/,
      use: {
        ...devices["Desktop Safari"],
        storageState: "playwright/.auth/logout-user.json",
      },
      dependencies: ["setup-logout"],
    },

    // ----------------
    // MAIN APP TESTS (after login)
    // ----------------
    {
      name: "chromium",
      testIgnore: [/.*login\.spec\.ts/, /.*logout\.spec\.ts/],
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
    },
    {
      name: "firefox",
      testIgnore: [
        /.*login\.spec\.ts/,
        /.*logout\.spec\.ts/,
        /.*manage-account\.spec\.ts/,
        /.*ticket\.spec\.ts/,
        /.*ticket-update\.spec\.ts/,
      ],
      use: {
        ...devices["Desktop Firefox"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
    },
    {
      name: "webkit",
      testIgnore: [
        /.*login\.spec\.ts/,
        /.*logout\.spec\.ts/,
        /.*manage-account\.spec\.ts/,
        /.*ticket\.spec\.ts/,
        /.*ticket-update\.spec\.ts/,
      ],
      use: {
        ...devices["Desktop Safari"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
    },
  ],
});

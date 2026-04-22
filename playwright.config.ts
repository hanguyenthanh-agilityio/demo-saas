import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests",

  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,

  outputDir: "test-results",

  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],

  use: {
    baseURL: process.env.BASE_URL,
    headless: isCI,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    // AUTH SETUP
    {
      name: "setup-auth",
      testMatch: /.*auth\.setup\.ts/,
      workers: 1,
    },
    {
      name: "setup-logout-user",
      testMatch: /.*logout\.setup\.ts/,
    },

    // BROWSERS
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup-auth"],
    },

    {
      name: "firefox",
      testIgnore: [/.*manage-account\.spec\.ts/, /.*ticket\.spec\.ts/, /.*ticket-update\.spec\.ts/],
      use: {
        ...devices["Desktop Firefox"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup-auth"],
    },

    {
      name: "webkit",
      testIgnore: [/.*manage-account\.spec\.ts/, /.*ticket\.spec\.ts/, /.*ticket-update\.spec\.ts/],
      use: {
        ...devices["Desktop WebKit"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup-auth"],
    },
  ],
});

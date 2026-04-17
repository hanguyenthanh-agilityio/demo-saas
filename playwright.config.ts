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

  timeout: 60 * 1000,

  globalTimeout: 20 * 60 * 1000,

  expect: {
    timeout: 5000,
  },

  outputDir: "test-results",

  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],

  use: {
    baseURL: process.env.BASE_URL,

    headless: isCI,

    trace: "on-first-retry",

    screenshot: "only-on-failure",

    video: "retain-on-failure",

    launchOptions: {
      slowMo: isCI ? 0 : 200,
    },
  },

  projects: [
    {
      name: "setup",
      testMatch: /.*auth\.setup\.ts/,
    },

    {
      name: "setup-logout",
      testMatch: /.*logout\.setup\.ts/,
    },

    {
      name: "auth-chromium",
      testMatch: /.*login\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
      },
    },

    {
      name: "logout",
      testMatch: /.*logout\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/logout-user.json",
      },
      dependencies: ["setup-logout"],
    },

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
        ...devices["Desktop WebKit"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
    },
  ],
});

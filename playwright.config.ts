import { defineConfig, devices } from "@playwright/test";
import { ENV } from "./utils/env";

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
    baseURL: process.env.BASE_URL || ENV.BASE_URL,

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
      testMatch: /.*\.setup\.ts/,
    },

    {
      name: "api",
      testMatch: /.*api\.spec\.ts/,
      use: {
        browserName: "chromium",
      },
    },

    {
      name: "auth",
      testMatch: /.*login\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: undefined,
      },
      dependencies: ["setup"],
    },

    {
      name: "chromium",
      testIgnore: [/.*login\.spec\.ts/, /.*api\.spec\.ts/],
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
    },
  ],
});

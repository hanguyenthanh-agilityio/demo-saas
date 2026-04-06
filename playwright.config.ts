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

  reporter: [["html", { outputFolder: "playwright-report", open: "never" }]],

  use: {
    baseURL: ENV.BASE_URL,

    headless: isCI,

    trace: "on-first-retry",

    screenshot: "only-on-failure",

    video: "retain-on-failure",

    launchOptions: {
      slowMo: isCI ? 0 : 200,
    },
  },

  projects: [
    // setup
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },

    // API TEST
    {
      name: "api",
      testMatch: /.*api\.spec\.ts/,
      use: {
        browserName: "chromium",
      },
    },

    // LOGIN TEST
    {
      name: "auth",
      testMatch: /.*login\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: undefined,
      },
    },

    // E2E TEST
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

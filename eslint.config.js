import js from "@eslint/js";
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      playwright,
    },
    rules: {
      "playwright/no-focused-test": "error",
    },
  },
  {
    ignores: [
      "node_modules",
      "playwright-report",
      "test-results",
      ".eslintrc.cjs",
      "commitlint.config.cjs",
    ],
  },
];

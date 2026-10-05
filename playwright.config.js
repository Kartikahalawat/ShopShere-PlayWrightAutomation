// @ts-check
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // Maximum time for each test
  timeout: 30 * 1000, // 30 seconds

  // Maximum time for expect() assertions
  expect: {
    timeout: 5000, // 5 seconds
  },

  // HTML test report
  reporter: 'html',

  use: {
    browserName: 'chromium',

    // Local: headed mode
    // GitHub Actions / CI: headless mode
    headless: process.env.CI ? true : false,
  },
});

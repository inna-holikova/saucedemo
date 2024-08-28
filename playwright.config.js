// playwright.config.js
import { defineConfig, devices } from '@playwright/test';
const { baseURL } = require('./urls');

export default defineConfig({
  // Directory containing test files
  testDir: './tests',

  // Maximum time one test can run for
  timeout: 30000, // 30 seconds

  // Retry failed tests
  retries: 2,

  // Run tests in parallel
  workers: 4,

  // Reporter to use, e.g., list, dot, json, html, etc.
  reporter: [['list'], ['html', { open: 'never' }]],

  // Shared settings for all projects below
  use: {
    // Base URL for navigating the pages in tests
    baseURL,

    // Take screenshots only when a test fails
    screenshot: 'only-on-failure',

    // Capture video of tests only when they fail
    video: 'retain-on-failure',

    // Trace configuration for debugging
    trace: 'on-first-retry',
  },

  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Folder for test artifacts such as screenshots, videos, traces, etc.
  outputDir: 'test-results/',
});


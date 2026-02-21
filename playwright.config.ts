/**
 * Playwright E2E Testing Configuration
 * 
 * Features:
 * - Cross-browser testing (Chrome, Firefox, Safari)
 * - Visual Regression Testing
 * - Network interception
 * - Mobile emulation
 * - Parallel execution
 * - Auto-retry on failure
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test directory
  testDir: './e2e',
  
  // Timeout per test
  timeout: 60000,
  
  // Expect timeout
  expect: {
    timeout: 5000,
  },
  
  // Fail on first error
  failOnFlakyTests: true,
  
  // Max failures
  maxFailures: 5,
  
  // Workers for parallel execution
  workers: '50%', // Use 50% of CPU cores
  
  // Reporter
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/playwright-results.json' }],
    ['junit', { outputFile: 'test-results/playwright-junit.xml' }],
    ['list'],
  ],
  
  // Shared settings for all tests
  use: {
    // Base URL
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure
    video: 'retain-on-failure',
    
    // Trace for debugging
    trace: 'retain-on-failure',
    
    // Actionability checks
    actionTimeout: 10000,
    
    // Navigation timeout
    navigationTimeout: 30000,
    
    // Browser context
    ignoreHTTPSErrors: true,
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    
    // Locale and timezone
    locale: 'en-US',
    timezoneId: 'UTC',
    
    // Permissions
    permissions: ['geolocation', 'notifications'],
    geolocation: { longitude: 24.7136, latitude: 46.6753 }, // Riyadh
    
    // Color scheme
    colorScheme: 'dark',
  },
  
  // Projects for different browsers
  projects: [
    // Desktop browsers
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
    
    // Mobile browsers
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    
    // Tablet
    {
      name: 'iPad',
      use: { ...devices['iPad Pro'] },
    },
  ],
  
  // Web server configuration
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  
  // Output directories
  outputDir: 'test-results/output',
  snapshotDir: 'e2e/snapshots',
  
  // Preserve output on success
  preserveOutput: 'failures-only',
  
  // Update snapshots
  updateSnapshots: 'missing',
  
  // Retry configuration
  retries: process.env.CI ? 2 : 0,
  
  // Fully parallel
  fullyParallel: true,
  
  // Forbidden tags
  forbidOnly: !!process.env.CI,
  
  // Quiet mode in CI
  quiet: !!process.env.CI,
  
  // Shard for CI
  shard: process.env.CI ? undefined : undefined,
});

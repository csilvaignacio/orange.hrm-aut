import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { requireEnv } from '@utils/env';
import { STORAGE_STATE } from '@utils/auth';


dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never' }], ['junit', { outputFile: 'test-results/junit.xml' }]]
    : [['list'], ['html', { open: 'on-failure' }]],
  use: {
    baseURL: requireEnv('BASE_URL'),
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/  },
    {
      name: 'chromium',
      testDir: './tests',
      use: { ...devices['Desktop Chrome'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
    // {
    //   name: 'firefox',
    //   testDir: './tests/e2e',
    //   use: { ...devices['Desktop Firefox'], storageState: STORAGE_STATE },
    //   dependencies: ['setup'],
    // },
    // {
    //   name: 'webkit',
    //   testDir: './tests/e2e',
    //   use: { ...devices['Desktop Safari'], storageState: STORAGE_STATE },
    //   dependencies: ['setup'],
    // },
    // { name: 'api', testDir: './tests/api' },
    // { name: 'db', testDir: './tests/db' },
  ],
});
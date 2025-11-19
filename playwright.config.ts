import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // 순차 실행 (sessionStorage 충돌 방지)
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // 한 번에 하나씩 실행
  reporter: 'html',
  timeout: 180000, // 3분 타임아웃
  use: {
    baseURL: 'http://localhost:3007',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 30000, // 액션 타임아웃 30초
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3007',
    reuseExistingServer: true,
    timeout: 120000,
  },
});

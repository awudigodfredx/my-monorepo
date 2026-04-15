import { defineConfig, devices } from "@playwright/test";

/**
 * Run both servers before tests:
 *   - frontend (Vite dev) on port 5173
 *   - backend (Express) on port 3001
 *
 * Set ANALYTICS_TRACKING_ENABLED=true and VITE_ANALYTICS_TRACKING_ENABLED=true
 * so events actually reach the backend during E2E runs.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false, // analytics state is shared — run serially
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",

  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: [
    {
      command: "ANALYTICS_TRACKING_ENABLED=true node apps/backend/src/index.js",
      port: 3001,
      reuseExistingServer: !process.env.CI,
    },
    {
      command:
        "VITE_ANALYTICS_TRACKING_ENABLED=true npx --prefix apps/frontend vite",
      port: 5173,
      reuseExistingServer: !process.env.CI,
    },
  ],
});

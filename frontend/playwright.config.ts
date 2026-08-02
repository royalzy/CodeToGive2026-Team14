import { defineConfig, devices } from "@playwright/test";

const e2eDatabasePath = `/tmp/love21-playwright-${process.pid}.db`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:5183",
    trace: "on-first-retry",
  },
  webServer: [
    {
      command:
        `LOVE21_DB_PATH=${e2eDatabasePath} ALLOWED_ORIGINS=http://127.0.0.1:5183 ../backend/.venv/bin/python -m uvicorn app.main:app --app-dir ../backend --host 127.0.0.1 --port 8010`,
      url: "http://127.0.0.1:8010/api/health",
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command:
        "VITE_API_BASE_URL=http://127.0.0.1:8010 pnpm exec vite --host 127.0.0.1 --port 5183",
      url: "http://127.0.0.1:5183",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});

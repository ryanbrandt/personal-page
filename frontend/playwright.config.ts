import { defineConfig } from "@playwright/test";

const BASE_URL = "http://localhost:4173";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
  },
  // Snapshot names include the project name, so keep it "chromium".
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  webServer: {
    // Always build and serve fresh so upgrades are never compared against a
    // stale preview server.
    command: "yarn build && yarn preview --port 4173 --strictPort",
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});

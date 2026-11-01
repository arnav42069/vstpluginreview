import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/e2e",
  use: {
    baseURL: "http://127.0.0.1:3100",
    launchOptions: {
      executablePath:
        process.env.CHROMIUM_PATH === "bundled"
          ? undefined
          : process.env.CHROMIUM_PATH || "/usr/bin/chromium",
      args: ["--no-sandbox"],
    },
  },
  webServer: [
    {
      command: "EDITORIAL_PREVIEW=true PORT=3100 node .output/server/index.mjs",
      port: 3100,
      reuseExistingServer: !process.env.CI,
    },
    {
      command:
        "SITE_ENV=production EDITORIAL_PREVIEW=true PORT=3101 node .output/server/index.mjs",
      port: 3101,
      reuseExistingServer: !process.env.CI,
    },
  ],
});

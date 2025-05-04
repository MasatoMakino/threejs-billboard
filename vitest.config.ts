import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: "webdriverio",
      headless: false,
      instances: [
        {
          browser: "chrome",
        },
      ],
    },
    coverage: {
      provider: "istanbul",
      reporter: ["text", "lcov"],
      include: ["src/**/*.ts"],
    },
  },
});

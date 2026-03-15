const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  timeout: 30000,
  globalTimeout: 120000,
  use: {
    headless: true,
    baseURL: 'http://localhost:8080',
  },
  webServer: {
    command: 'npx serve public -p 8080',
    port: 8080,
    timeout: 30000,
    reuseExistingServer: false,
  },
});

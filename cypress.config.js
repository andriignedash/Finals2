const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {},
    watchForFileChanges: false,
    viewportWidth: 1920,
    viewportHeight: 1080
  },
});

const { defineConfig } = require("cypress");

module.exports = defineConfig({
  retries: {
    runMode: 2,
    openMode: 2,
  },
  e2e: {
    baseUrl: "https://www.flipkart.com",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

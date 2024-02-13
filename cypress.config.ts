import {defineConfig} from 'cypress';

export default defineConfig({
  experimentalWebKitSupport: true,
  chromeWebSecurity: false,
  defaultCommandTimeout: 30000,
  fileServerFolder: 'cypress/public',
  e2e: {
    watchForFileChanges: false,
    setupNodeEvents(on, config) {
      require('cypress-terminal-report/src/installLogsPrinter')(on);
    }
  }
});
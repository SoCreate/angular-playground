module.exports = {
  preset: 'jest-puppeteer',
  setupFilesAfterEnv: ['./setup-tests.js'],
  testPathIgnorePatterns: [],
  haste: {
    providesModuleNodeModules: ['angular-playground']
  }
};

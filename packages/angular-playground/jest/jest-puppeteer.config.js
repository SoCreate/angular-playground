module.exports = {
  preset: 'jest-puppeteer',
  setupFilesAfterEnv: ['./setup-tests.js'],
  testRegex: 'test\\.js$',
  testPathIgnorePatterns: [],
  haste: {
    providesModuleNodeModules: ['angular-playground']
  }
};

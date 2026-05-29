export default {
  testEnvironment: "node",
  transform: {},
  moduleFileExtensions: ["js", "json"],
  testMatch: ["**/tests/system/**/*.test.js"],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetModules: true,
  testTimeout: 60000,
  maxWorkers: 1,
};

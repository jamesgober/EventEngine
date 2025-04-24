// jest.config.js
export default {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    transform: {},
    moduleNameMapper: {
      "^(\\.{1,2}/.*)\\.js$": "$1"
    }
  };
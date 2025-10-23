module.exports = {
  "testEnvironment": "node",
  "setupFiles": [
    "<rootDir>/testSetup.js"
  ],
  "moduleFileExtensions": [
    "js",
    "ts"
  ],
  "transform": {
    "^.+\\.ts$": "ts-jest"
  },
  "testPathIgnorePatterns": [
    "/node_modules/",
    "/dist/"
  ],
  "coverageDirectory": "coverage",
  "preset": "ts-jest"
};
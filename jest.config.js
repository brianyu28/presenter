module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.ts$": ["ts-jest", { diagnostics: { ignoreCodes: ["TS151001"] } }],
  },
  collectCoverageFrom: ["src/**/*.{js,ts}"],
  coverageReporters: ["text"],
};

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[jt]s$": ["ts-jest", { diagnostics: { ignoreCodes: ["TS151001"] } }],
  },
  transformIgnorePatterns: ["/node_modules/(?!(d3-ease)/)"],
  collectCoverageFrom: ["src/**/*.{js,ts}"],
  coverageReporters: ["text"],
};

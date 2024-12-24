module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.ts$": ["ts-jest", { diagnostics: { ignoreCodes: ["TS151001"] } }],
    // Required to transform Anime.js file
    "^.+\\.es.js": ["ts-jest"],
  },
  // Required to trasnform Anime.js file, which is an ES module
  transformIgnorePatterns: ["/node_modules/(?!(animejs)/)"],
  collectCoverageFrom: ["src/**/*.{js,ts}"],
  coverageReporters: ["text"],
};

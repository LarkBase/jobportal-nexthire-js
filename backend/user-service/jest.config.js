module.exports = {
    testEnvironment: "node", // ✅ Ensures Jest runs in a Node.js environment
    coverageDirectory: "coverage",
    collectCoverage: true,
    collectCoverageFrom: [
      "src/**/*.js",
      "!server.js", // Ignore main server entry
      "!src/config/*.js", // Ignore config files
    ],
    coverageThreshold: {
      global: {
        branches: 70,
        functions: 90,
        lines: 85,
        statements: 90,
      },
    },
  };
  
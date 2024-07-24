const nextJest = require("next/jest");

const createJestConfig = nextJest({
    dir: "./",
});

const customJestConfig = {
    moduleDirectories: ["node_modules", "<rootDir>/"],
    testEnvironment: "jest-environment-jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts", "<rootDir>/jest.setup.env.js"],
    collectCoverage: true,
    coverageProvider: "v8",
    collectCoverageFrom: [
        "<rootDir>/src/**/*.{ts,tsx}",
        "!<rootDir>/src/**/*.stories.{ts,tsx}",
        "!<rootDir>/src/**/models.ts",
        "!<rootDir>/src/shared/models/**/*.ts",
        "!<rootDir>/src/shared/validation/*.ts",
        "!<rootDir>/src/testingInfrustructure/**/*.{ts,tsx}",
        "!<rootDir>/src/api/**/*.{ts,tsx}",
        "!**/node_modules/**",
        "!<rootDir>/.next/**",
        "!<rootDir>/**/*.d.ts",
        "!<rootDir>/*.config.js",
        "!<rootDir>/coverage/**",
        "!<rootDir>/e2e/**",
    ],
    testPathIgnorePatterns: ["/node_modules/", "/e2e/"],
    resolver: "<rootDir>/.jest/resolver.js",
};

module.exports = async () => ({
    ...(await createJestConfig(customJestConfig)()),
    transformIgnorePatterns: [
        // The regex below is just a guess, you might tweak it
        "/node_modules/(?!@react-dnd|react-dnd|dnd-core|react-dnd-html5-backend)",
    ]
});

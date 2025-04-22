module.exports = {
    collectCoverage: true,
    testRegex: '.*\\.spec\\.ts$',
    preset: 'ts-jest',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: [
        '!**/tests/**',
        '**/src/**/*.{js,ts}',
        '!**.test.js',
        '!**/node_modules/**',
    ],
    // The directory where Jest should output its coverage files
    coverageDirectory: 'coverage',
    // The test environment that will be used for testing
    testEnvironment: 'node',
};

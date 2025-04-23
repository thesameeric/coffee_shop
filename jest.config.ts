module.exports = {
    collectCoverage: true,
    testRegex: '.*\\.spec\\.ts$',
    preset: 'ts-jest',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: [
        'src/**/*.{js,ts}',
        '!src/**/*.test.{js,ts}',
        '!src/**/*.spec.{js,ts}',
    ],
    // The directory where Jest should output its coverage files
    coverageDirectory: 'coverage',
    // The test environment that will be used for testing
    testEnvironment: 'node',
};

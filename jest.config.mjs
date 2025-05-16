export default {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/tests/unit-tests/setupTests.ts'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^tone$': '<rootDir>/__mocks__/tone.ts',
    },
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            useESM: true,
        }],
    },
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'mjs', 'json'],
    testMatch: [
        '**/tests/unit-tests/**/*.test.+(ts|tsx)',
    ],
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/frontend/index.tsx',
    ],
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 50,
            lines: 50,
            statements: 50,
        },
    },
}
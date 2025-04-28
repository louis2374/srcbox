module.exports = {
    globalSetup: './testing/setup.ts',
    globalTeardown: './testing/exit.ts',
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js']
};
module.exports = {
    globalSetup: './testing/setup.ts',
    globalTeardown: './testing/exit.ts',
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js'],
    reporters: [
        "default",
        ["jest-html-reporters", {
            "publicPath": "./html-report",
            "filename": "report.html",
            "expand": true
        }]
    ]

};
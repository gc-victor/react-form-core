module.exports = {
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.json'
        },
    },
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/']
};
module.exports = {
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.json'
        },
    },
    preset: 'ts-jest',
    testPathIgnorePatterns: ['/node_modules/']
};

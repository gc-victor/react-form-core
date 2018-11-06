// @see: https://storybook.js.org/configurations/typescript-config/
module.exports = (baseConfig, env, config) => {
    config.module.rules.push({
        test: /\.(ts|tsx)$/,
        loader: require.resolve('awesome-typescript-loader'),
    });
    config.resolve.extensions.push('.ts', '.tsx');

    return config;
};

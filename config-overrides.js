const webpack = require('webpack')
module.exports = function override(config, env) {
    if (!config.plugins) {
        config.plugins = [];
    }

    config.plugins.push(
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    );

    config.module.rules.push({
        test: /\.worker\.js$/,
        use: { loader: "worker-loader" }
    })

    return config;
}
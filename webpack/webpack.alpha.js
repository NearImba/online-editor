const merge = require('webpack-merge');
const path = require('path');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const baseConfig = require('./webpack.base');
const appName = require('../package.json').name;
const appVersion = require('../package.json').version;

module.exports = merge(baseConfig, {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, `../dist/${appVersion}`),
        filename: '[name].[chunkhash].js',
        publicPath: `/${appName}/${appVersion}/`,
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            name: 'common',
        },
        namedModules: false,
        namedChunks: false,
        nodeEnv: 'production',
        flagIncludedChunks: true,
        occurrenceOrder: true,
        sideEffects: true,
        usedExports: true,
        concatenateModules: true,
        noEmitOnErrors: true,
        checkWasmTypes: true,
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
            }),
            new OptimizeCSSAssetsPlugin({}),
        ],
    },
});

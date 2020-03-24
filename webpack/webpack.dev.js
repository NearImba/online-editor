const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const appName = require('../package.json').name;

module.exports = merge(baseConfig, {
    mode: 'development',
    devtool: 'cheap-source-map',
    watch: true,
    watchOptions: {
        ignored: /node_modules/,
    },
    devServer: {
        publicPath: `/${appName}/`,
        port: 9000,
        index: 'index.html',
        host: '0.0.0.0',
        historyApiFallback: {
            index: `/index.html`,
        },
        proxy: {
            /* 代理在这 */
        },
    },
});

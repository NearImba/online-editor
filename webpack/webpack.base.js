const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require('autoprefixer');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const appName = require('../package.json').name;

module.exports = {
    entry: {
        stable: './app/index.js',
        improve: './app/index2.js',
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js',
        publicPath: `/${appName}/`,
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react'],
                    plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties', '@babel/plugin-syntax-dynamic-import'],
                },
            },
        }, {
            test: /\.worker\.js$/,
            use: { loader: 'worker-loader' },
          }, {
            test: /\.(css|less)$/,
            use: [{
                loader: MiniCssExtractPlugin.loader,
            }, {
                loader: 'css-loader',
                options: {
                    minimize: true,
                },
            }, {
                loader: 'postcss-loader',
                options: {
                    plugins: [
                        autoprefixer({
                            browsers: ['last 15 versions'],
                        }),
                    ],
                },
            }, {
                loader: 'less-loader',
            }],
        }, {
            test: /\.(png|jpg|gif|ttf)$/i,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 5120,
                    },
                },
            ],
        }],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './app/index.html',
            filename: 'index.html',
            minify: {
                minifyCSS: true,
                minifyJS: true,
            },
            chunks: ['common', 'stable'],
        }),
        new HtmlWebpackPlugin({
            template: './app/index.html',
            filename: 'index2.html',
            minify: {
                minifyCSS: true,
                minifyJS: true,
            },
            chunks: ['common', 'improve'],
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[chunkhash].css",
        }),
        new MonacoWebpackPlugin({
            publicPath: `/${appName}/`,
        }),
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss', '.css'], // 可以省略的后缀名
    },
};

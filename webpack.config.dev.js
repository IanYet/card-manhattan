const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './index.js',
    mode: 'development',
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'build'),
        publicPath: '.',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.module\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName:
                                    '[hash:base64:8]_[name]_[local]',
                            },
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /(?<!\.module)\.css$/,
                use: ['style-loader', 'css-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpg|gif|svg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'assets/[name].[ext]',
                        },
                    },
                ],
            },
        ],
    },
    devtool: 'source-map',
    performance: {
        hints: false,
    },
    optimization: {
        runtimeChunk: {
            name: 'runtime',
        },
        splitChunks: {
            minSize: 0,
            cacheGroups: {
                vendor: {
                    priority: 10,
                    name: 'lib',
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    reuseExistingChunk: true,
                },
            },
        },
    },
    resolve: {
        extensions: ['*', '.js', '.jsx'],
        alias: {
            threeJSM: 'three/examples/jsm'
        },
    },
    devServer: {
        contentBase: path.join(__dirname, 'public/'),
        port: 3000,
        publicPath: 'http://localhost:3000/',
        stats: 'errors-only',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: 'webpack slim',
            template: __dirname + '/public/index.html',
            favicon: __dirname + '/public/favicon.ico',
        }),
    ],
}

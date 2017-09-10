var webpack = require('webpack');
var webpackBaseConfig = require('./webpack.config');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function(version) {
    webpackBaseConfig.output.filename = 'dist/public/js/bundle_' + version + '.min.js';
    webpackBaseConfig.devtool = false;
    webpackBaseConfig.plugins = [
        new ExtractTextPlugin({
            filename: 'dist/public/css/bundle_' + version + '.min.css',
            disable: false,
            allChunks: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            comments: false,
            compress: {
                warnings: false,
                drop_console: true
            },
        })
    ];

    return webpackBaseConfig;
};
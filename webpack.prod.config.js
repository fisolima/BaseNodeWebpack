var webpack = require('webpack');
var webpackBaseConfig = require('./webpack.config');

module.exports = function(version) {
    webpackBaseConfig.output.filename = 'dist/public/js/bundle_' + version + '.min.js';
    webpackBaseConfig.devtool = false;
    webpackBaseConfig.plugins = [
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
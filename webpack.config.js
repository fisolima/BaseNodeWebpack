var path = require('path');

module.exports = {
    module: {
        loaders: [
            {
                test: /\.(es6|js)$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader'
            },
            {
                test: /\.(ttf|otf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?|(jpg|gif)$/,
                loader: 'url-loader'
            }
        ],
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.es6']
    },
    entry: './src/client/startup.es6',
    output: {
        filename: 'dist/public/js/bundle.js'
    }
}
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    module: {
        loaders: [
            {
                test: /\.(es6|js)$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
            {
                test: /\.(jpg|gif|png)$/,
                loader: "file-loader",
                options: {
                    name: 'dist/public/img/[name].[ext]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                loader: "file-loader",
                options: {
                    name: 'dist/public/font/[name].[ext]'
                }
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader'})
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
    },
    plugins: [
        new ExtractTextPlugin(
            {
                filename: "dist/public/css/bundle.css",
                disable: false,
                allChunks: true
            })
    ]
}
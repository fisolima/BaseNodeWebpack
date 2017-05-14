module.exports = {
    module: {
        loaders: [
            {
                test: /\.es6$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            }
        ],
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.es6']
    },
    entry: './src/client/startup.es6',
    output: {
        filename: './dist/public/bundle.js'
    }
}
const webpack = require("webpack");
const path = require("path");

let config = {
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    mode: "development",
    output: {
        path: path.resolve(__dirname, "./public"),
        filename: "./bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
}

module.exports = config;
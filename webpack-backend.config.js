const path = require('path');
const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
    mode: 'production',
    node: {
        __filename: false,
        __dirname: false
    },
    target: "node",
    entry: {
        app: ["./src/main.ts"]
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts']
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "bloglite.server.js"
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    mangle: false, // Note `mangle.properties` is `false` by default.
                },
            }),
        ]
    },
    externals: [nodeExternals()]
};
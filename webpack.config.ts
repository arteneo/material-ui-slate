import path from "path";
import webpack from "webpack";
const nodeExternals = require("webpack-node-externals");
const TerserPlugin = require("terser-webpack-plugin");

const config: webpack.Configuration = {
    entry: "./src/index.tsx",
    devtool: "inline-source-map",
    target: "node",
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                loader: require.resolve("ts-loader"),
                options: {
                    compiler: "ttypescript",
                },
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            "@arteneo/material-ui-slate": path.resolve(__dirname, "src"),
        },
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.js",
        libraryTarget: "umd",
    },
};

export default config;

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
    return {
        entry: {
            main: "./src/main.js",
        },
        output: {
            filename: "js/main.js",
            path: path.resolve(__dirname, "build/static/"),
            publicPath: "/static/",
            clean: true,
        },
        devServer: {
            port: 9000,
        },
        devtool: argv.mode === "development" ? "inline-source-map" : false,
        plugins: [
            new MiniCssExtractPlugin({
                filename: "css/main.css",
            }),
            new HtmlWebpackPlugin({
                filename: "../index.html",
                template: "./public/index.html",
                // scriptLoading: "blocking",
                inject: false,
                minify: argv.mode === "development" ? false : {
                    collapseWhitespace: true,
                    minifyJS: true,
                    minifyCSS: true,
                }
            }),
            new CopyPlugin({
                patterns: [
                    {
                        from: "./public",
                        to: "../",
                        filter: (resourcePath) => {
                            return !(
                                path.basename(resourcePath) === "index.html"
                            );
                        },
                        noErrorOnMissing: true
                    },
                ],
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.(sa|sc|c)ss$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "sass-loader",
                    ],
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                "@babel/preset-env",
                            ],
                        },
                    },
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    use: [
                        {
                            loader: "file-loader",
                        },
                    ],
                },
            ],
        },
    };
};

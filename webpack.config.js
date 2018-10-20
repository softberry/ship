const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackMd5Hash = require("webpack-md5-hash");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: { main: path.resolve("./src/index.ts"), styles: path.resolve("./embedded/styles.css") },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin("dist", {}),
    new MiniCssExtractPlugin({
      filename: "style.[contenthash].css"
    }),
    new HtmlWebpackPlugin({
      chunks: ["main", "styles"],
      inject: true,
      hash: true,
      template: "./embedded/template.html",
      filename: "index.html"
    }),
    new WebpackMd5Hash()
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".scss", ".js", ".vue", ".html"]
  }
};

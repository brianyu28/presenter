const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: "./src/index.ts",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    static: "./dist",
    open: {
      app: {
        name: "Google Chrome",
      },
    },
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(svg|c)$/i,
        type: "asset/source",
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "public", to: "." }],
    }),
  ],
};

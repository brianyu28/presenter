const path = require("path");

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: "./src/index.ts",
  output: {
    filename: "presenter.js",
    path: path.resolve(__dirname, "dist"),
    library: "Presenter",
    libraryTarget: "umd",
    globalObject: "this",
  },
  watchOptions: {
    ignored: [
      "**/node_modules",
      path.resolve(__dirname, "dist"),
      path.resolve(__dirname, "examples"),
    ],
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
    ],
  },
};

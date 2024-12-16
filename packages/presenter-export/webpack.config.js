const path = require("path");

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: "./src/index.ts",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    library: "PresenterExport",
    libraryTarget: "umd",
    globalObject: "this",
  },
  watchOptions: {
    ignored: [path.resolve(__dirname, "dist")],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: [
          /node_modules/,
          /server/,
          path.resolve(__dirname, "./src/templates/"),
        ],
      },
    ],
  },
};

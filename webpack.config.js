const path = require("path");

const mode = process.env.NODE_ENV || "development";
const isDevelopment = mode === "development";

module.exports = {
  mode,
  devtool: isDevelopment ? "eval-source-map" : false,
  entry: {
    presenter: {
      import: "./src/index.ts",
      filename: "presenter.js",
      library: {
        name: "Presenter",
        type: "umd",
      },
    },
  },
  output: {
    // filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
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
        exclude: [/node_modules/, /packages/, /dist/],
      },
    ],
  },
};

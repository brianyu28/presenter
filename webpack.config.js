const path = require("path");

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    presenter: {
      import: "./src/index.ts",
      filename: "presenter.js",
      library: {
        name: "Presenter",
        type: "umd",
      },
    },
    export: {
      import: "./src/export/index.ts",
      filename: "presenter-export.js",
      library: {
        name: "PresenterExport",
        type: "umd",
      },
    },
    morph: {
      import: "./src/morph/index.ts",
      filename: "presenter-morph.js",
      library: {
        name: "PresenterMorph",
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

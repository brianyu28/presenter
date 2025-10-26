const path = require("path");

const mode = process.env.NODE_ENV || "development";
const isDevelopment = mode === "development";

const config = {
  mode,
  devtool: isDevelopment ? "eval-source-map" : false,
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

module.exports = [
  // Shared export
  {
    ...config,
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
  },

  // Node export
  {
    ...config,
    target: "node",
    entry: {
      export: {
        import: "./src/export/index.ts",
        filename: "export.js",
        library: {
          name: "PresenterExport",
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
    externals: {
      "skia-canvas": "commonjs skia-canvas",
      sharp: "commonjs sharp",
    },
  },
];

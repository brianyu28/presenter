const path = require("path");
const webpack = require("webpack");

module.exports = {
  target: "node", // Target Node.js module rather than browser
  mode: process.env.NODE_ENV || "development",
  entry: "./src/index.ts",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: [/node_modules/, path.resolve(__dirname, "./src/templates/")],
      },
      {
        // Allow ?source to be appended to resources to import as raw source text
        test: /\.(txt|js|ts|json|html|template)$/,
        resourceQuery: /source/,
        type: "asset/source",
      },
    ],
  },
  plugins: [new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true })],
};

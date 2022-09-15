const path = require('path');

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: "./client/src/main.tsx",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, 'static/dist')
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      // { test: /\.tsx?$/, loader: "ts-loader" }
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", {"runtime": "automatic"}],
              "@babel/preset-typescript",
            ],
          },
        },
      }
    ]
  }
};
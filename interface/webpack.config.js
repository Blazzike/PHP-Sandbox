const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "production",
  entry: [
    "./src/sass/bundle.scss",
    "./src/sass/bundle-light.scss",
    "./src/js/site.jsx"
  ],

  optimization: {
    minimizer: [new TerserPlugin()]
  },

  plugins: [
    new CopyWebpackPlugin([{
      from: "./src/index.html",
      to: "index.html"
    }]),

    new CopyWebpackPlugin([{
      from: "./src/libraries/",
      to: "libraries"
    }]),

    new MonacoWebpackPlugin()
  ],
  
  output: {
    path: path.resolve("../"),
    filename: "bundle.js",
    chunkFilename: '[chunkhash].js'
  },

  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      resolve: {
        extensions: [".js", ".jsx"],
      },
      use: "babel-loader"
    }, {
      test: /\.s?css$/,
      use: [{
          loader: "file-loader",
          options: {
            name: "css/[name].css",
          }
        }, {
          loader: "extract-loader"
        }, {
          loader: "css-loader"
        }, {
          loader: "sass-loader"
        }
      ]
    }]
  }
};
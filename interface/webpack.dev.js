const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const merge = require('webpack-merge');
const production = require('./webpack.config.js');
const proxy = require("http-proxy-middleware");

module.exports = merge(production, {
  mode: "development",
  plugins: [
    new BrowserSyncPlugin({
      server: {
        baseDir: ["../"],
        middleware: proxy('/php', {
          target: "https://php-sandbox.ml/",
          changeOrigin: true
        })
      }
    })
  ]
});
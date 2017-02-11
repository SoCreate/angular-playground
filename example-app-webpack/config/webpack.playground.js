var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');
var path = require('path');

module.exports = webpackMerge(commonConfig, {
  entry: {
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'app': './src/main.playground.ts'
  },
  resolve: {
    alias: {
      sandboxes$: helpers.root('src', 'sandboxes.ts')
    }
  },
  devtool: 'cheap-module-eval-source-map',

  output: {
    path: helpers.root('dist-playground'),
    publicPath: 'http://localhost:8081/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  plugins: [
    new ExtractTextPlugin('[name].css')
  ],

  devServer: {
    historyApiFallback: true,
    stats: 'minimal'
  }
});

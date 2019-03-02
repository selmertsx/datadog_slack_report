const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  plugins: [ new HardSourceWebpackPlugin() ]
});

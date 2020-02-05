/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const glob = require('glob');
const common = require('./webpack.common.js');

const PATHS = {
  src: path.join(__dirname, 'src'),
};

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true,
    }),
    require('cssnano')({ preset: 'default' }),
    new Visualizer({
      filename: '../statistics.html',
    }),
    new PurgecssPlugin({
      whitelistPatternsChildren: [/^btn-/i, /^Toastify/i, /^esri/i, /^fade/i, /^slow/, /^owl/i, /^mfp/i],
      paths: () => glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    }),
  ],
});

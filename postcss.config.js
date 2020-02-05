/* eslint-disable import/no-extraneous-dependencies */

const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    cssnano({
      preset: 'default',
    }),
    autoprefixer,
  ],
};

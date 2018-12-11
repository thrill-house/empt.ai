const _ = require('lodash');
const tailwindcss = require('tailwindcss');
const path = require('path');
const tailwindConfig = path.join(__dirname, 'tailwind.config.js');

module.exports = {
  plugins: [tailwindcss(tailwindConfig), require('autoprefixer')],
};

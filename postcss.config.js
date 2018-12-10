const _ = require('lodash');
const tailwindcss = require('tailwindcss');
const fs = require('fs');
const path = require('path');
const tailwindConfig = path.join(__dirname, 'tailwind.config.js');

module.exports = {
  plugins: [
    function() {
      let vars = ['colors', 'backgrounds', 'opacity'],
        tailwind = require(tailwindConfig),
        outputPath = path.join(__dirname, 'src/scss/_$variables.scss'),
        current = fs.readFileSync(outputPath).toString(),
        content = '',
        sassify = function(variable) {
          let lines = [`$${variable}: (`];
          let valueLines = [];

          _.each(tailwind[variable], function(value, key) {
            valueLines.push(`  ${key}: ${value}`);
          });
          lines.push(_.join(valueLines, ',\n'));
          lines.push(');\n');

          return _.join(lines, '\n');
        };

      _.each(vars, function(value) {
        content += sassify(value);
      });

      if (content !== current) {
        fs.writeFile(outputPath, content);
      }
    },
    tailwindcss(tailwindConfig),
    require('autoprefixer'),
  ],
};
